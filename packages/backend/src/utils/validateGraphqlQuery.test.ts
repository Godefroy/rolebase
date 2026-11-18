import { getIntrospectionQuery } from 'graphql'
import { describe, expect, it } from 'vitest'
import { graphqlLimits, validateGraphqlQuery } from './validateGraphqlQuery'

const nest = (field: string, levels: number, leaf = 'id'): string =>
  levels === 0 ? leaf : `${field} { ${nest(field, levels - 1, leaf)} }`

describe('validateGraphqlQuery', () => {
  it('accepts usual queries', () => {
    expect(() =>
      validateGraphqlQuery(`
        query GetOrg($id: uuid!) {
          org_by_pk(id: $id) {
            id
            name
            circles(where: { archived: { _eq: false } }) {
              ...CircleFields
              role { name purpose }
              members { member { id name user { displayName } } }
            }
          }
        }
        fragment CircleFields on circle { id parentId }
      `)
    ).not.toThrow()
    expect(() =>
      validateGraphqlQuery('{ circle { parent { parent { parent { id } } } } }')
    ).not.toThrow()
  })

  it('accepts introspection queries', () => {
    expect(() => validateGraphqlQuery(getIntrospectionQuery())).not.toThrow()
  })

  it('rejects alternating recursive relationships', () => {
    expect(() =>
      validateGraphqlQuery(
        '{ circle { children { parent { children { parent { children { parent { children { id } } } } } } } } }'
      )
    ).toThrow('nested too many times')
  })

  it('rejects deep queries', () => {
    const fields = Array.from({ length: graphqlLimits.maxDepth }, (_, i) => `f${i}`)
    const query = fields.reduceRight((inner, f) => `${f} { ${inner} }`, 'id')
    expect(() => validateGraphqlQuery(`{ ${query} }`)).toThrow('too deep')
  })

  it('rejects queries with too many fields', () => {
    const aliases = Array.from(
      { length: graphqlLimits.maxFields + 1 },
      (_, i) => `a${i}: circle { id }`
    ).join(' ')
    expect(() => validateGraphqlQuery(`{ ${aliases} }`)).toThrow()
  })

  it('rejects fragment amplification', () => {
    const query = `
      { circle { ...F3 } }
      fragment F3 on circle { a: circle { ...F2 } b: circle { ...F2 } c: circle { ...F2 } d: circle { ...F2 } e: circle { ...F2 } f: circle { ...F2 } g: circle { ...F2 } h: circle { ...F2 } i: circle { ...F2 } j: circle { ...F2 } }
      fragment F2 on circle { a: x { ...F1 } b: x { ...F1 } c: x { ...F1 } d: x { ...F1 } e: x { ...F1 } f: x { ...F1 } g: x { ...F1 } h: x { ...F1 } i: x { ...F1 } j: x { ...F1 } }
      fragment F1 on circle { a b c d e f g h i j }
    `
    expect(() => validateGraphqlQuery(query)).toThrow('too many fields')
  })

  it('rejects recursive fragments, long queries and non strings', () => {
    expect(() =>
      validateGraphqlQuery('{ circle { ...A } } fragment A on circle { children { ...A } }')
    ).toThrow()
    expect(() => validateGraphqlQuery(`{ ${'a '.repeat(30_000)} }`)).toThrow()
    expect(() => validateGraphqlQuery({ query: '{ a }' })).toThrow()
    expect(() => validateGraphqlQuery(`{ ${nest('x', 3)} }`)).not.toThrow()
  })
})
