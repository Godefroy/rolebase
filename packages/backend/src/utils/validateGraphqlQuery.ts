import {
  FragmentDefinitionNode,
  Kind,
  parse,
  SelectionSetNode,
} from 'graphql'

// Limits of the queries forwarded to Hasura by the public GraphQL endpoint
// and the MCP graphql tool. Hasura CE applies no cost limit, and some
// relationships are recursive (circle.parent / circle.children), so nesting
// them makes the result grow exponentially.
export const graphqlLimits = {
  maxLength: 50_000,
  maxTokens: 10_000,
  // Field levels, e.g. org { circles { id } } has a depth of 3
  maxDepth: 10,
  // Fields after fragment expansion, aliases included
  maxFields: 1000,
  // Times the same field can appear on one path, e.g. children { parent {
  // children { ... } } } repeats children
  maxRepeatsOnPath: 3,
}

export class GraphqlQueryLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GraphqlQueryLimitError'
  }
}

// Throw if a query exceeds the limits. Introspection fields (__schema,
// __type) are not counted: they don't hit the database.
export function validateGraphqlQuery(query: unknown) {
  if (typeof query !== 'string') {
    throw new GraphqlQueryLimitError('Query must be a string')
  }
  if (query.length > graphqlLimits.maxLength) {
    throw new GraphqlQueryLimitError(
      `Query is too long (max ${graphqlLimits.maxLength} characters)`
    )
  }

  // Throws a GraphQLError on syntax errors and when maxTokens is exceeded
  const document = parse(query, { maxTokens: graphqlLimits.maxTokens })

  const fragments = new Map<string, FragmentDefinitionNode>()
  for (const definition of document.definitions) {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      fragments.set(definition.name.value, definition)
    }
  }

  let fieldsCount = 0

  function visit(
    selectionSet: SelectionSetNode,
    depth: number,
    path: string[],
    fragmentsPath: string[]
  ) {
    for (const selection of selectionSet.selections) {
      if (selection.kind === Kind.FIELD) {
        const name = selection.name.value
        if (name.startsWith('__')) continue

        fieldsCount++
        if (fieldsCount > graphqlLimits.maxFields) {
          throw new GraphqlQueryLimitError(
            `Query has too many fields (max ${graphqlLimits.maxFields})`
          )
        }
        if (depth > graphqlLimits.maxDepth) {
          throw new GraphqlQueryLimitError(
            `Query is too deep (max depth ${graphqlLimits.maxDepth})`
          )
        }
        if (!selection.selectionSet) continue

        const repeats = path.filter((n) => n === name).length + 1
        if (repeats > graphqlLimits.maxRepeatsOnPath) {
          throw new GraphqlQueryLimitError(
            `Field "${name}" is nested too many times (max ${graphqlLimits.maxRepeatsOnPath})`
          )
        }
        visit(selection.selectionSet, depth + 1, [...path, name], fragmentsPath)
      } else if (selection.kind === Kind.INLINE_FRAGMENT) {
        visit(selection.selectionSet, depth, path, fragmentsPath)
      } else {
        const name = selection.name.value
        const fragment = fragments.get(name)
        if (!fragment) {
          throw new GraphqlQueryLimitError(`Unknown fragment "${name}"`)
        }
        if (fragmentsPath.includes(name)) {
          throw new GraphqlQueryLimitError(`Fragment "${name}" is recursive`)
        }
        visit(fragment.selectionSet, depth, path, [...fragmentsPath, name])
      }
    }
  }

  for (const definition of document.definitions) {
    if (definition.kind === Kind.OPERATION_DEFINITION) {
      visit(definition.selectionSet, 1, [], [])
    }
  }
}
