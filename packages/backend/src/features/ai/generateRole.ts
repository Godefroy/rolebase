import { nameSchema } from '@rolebase/shared/schemas'
import { Configuration, OpenAIApi } from 'openai'
import * as yup from 'yup'
import { RoleAiFragment, gql } from '../../gql'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'

const configuration = new Configuration({
  apiKey: settings.openai.apiKey,
})
const openai = new OpenAIApi(configuration)

const schema = {
  type: 'object',
  required: [
    'purpose',
    'domain',
    'accountabilities',
    'checklist',
    'indicators',
    'notes',
  ],
  properties: {
    purpose: {
      type: 'string',
      description:
        'Purpose that the role pursues with an ideal. It starts with a verb. In markdown',
    },
    domain: {
      type: 'string',
      description: "Domain of the role. It's what only it can do. In markdown",
    },
    accountabilities: {
      type: 'string',
      description:
        "Accountabilities of the role. It's what it must do. In markdown",
    },
    checklist: {
      type: 'array',
      description: 'Recurring actions that the role must check and do.',
      items: {
        type: 'string',
      },
    },
    indicators: {
      type: 'array',
      description:
        'Metrics of the role to watch and report, they reveal the degree to which things are getting done',
      items: {
        type: 'string',
      },
    },
    notes: {
      type: 'string',
      description: 'Useful notes about the role. In markdown',
    },
  },
}

// Prefix to add to each line when a generated property is an array
const defaultPrefix = '* '
const prefixes: Partial<RoleAiFragment> = {
  checklist: '- [ ] ',
}

export default authedProcedure
  .input(
    yup.object().shape({
      name: nameSchema.required(),
      lang: yup.string().required(),
    })
  )
  .query(async (opts): Promise<RoleAiFragment> => {
    const { name, lang } = opts.input

    const existingRole = (await adminRequest(GET_ROLE_AI, { name, lang }))
      .role_ai[0]
    if (existingRole) {
      return existingRole
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert in management, holacracy and sociocracy.
          Answer in this language only: ${lang}`,
        },
        {
          role: 'user',
          content: `Describe the role named "${name}".`,
        },
      ],
      functions: [{ name: 'suggestRole', parameters: schema }],
      function_call: { name: 'suggestRole' },
      temperature: 0,
    })

    const roleProperties = JSON.parse(
      response.data.choices[0]?.message?.function_call?.arguments || ''
    )

    // Flatten arrays
    for (const field in roleProperties) {
      const value = roleProperties[field]
      if (Array.isArray(value)) {
        const prefix = prefixes[field as keyof typeof prefixes] || defaultPrefix
        roleProperties[field] = `${prefix}${value.join(`\n${prefix}`)}`
      }
    }

    const role = (
      await adminRequest(INSERT_ROLE_AI, {
        role: {
          name,
          lang,
          ...roleProperties,
        },
      })
    )?.insert_role_ai_one

    if (!role) {
      throw new Error('Error while inserting role')
    }

    return role
  })

const GET_ROLE_AI = gql(`
  query getRoleAI($name: String!, $lang: String!) {
    role_ai(where: { name: { _eq: $name }, lang: { _eq: $lang } }, limit: 1) {
      ...RoleAI
    }
  }`)

const INSERT_ROLE_AI = gql(`
  mutation insertRoleAI($role: role_ai_insert_input!) {
    insert_role_ai_one(object: $role) {
      ...RoleAI
    }
  }`)
