import * as yup from 'yup'
import { RoleAiFragment, gql } from '../../gql'
import { guardAuth } from '../../guards/guardAuth'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { createRateLimiter } from '../../utils/rateLimit'
import { getOpenai } from './openai'

// Languages a draft can be written in, with the name given to the model
const languages: Record<string, string> = {
  en: 'English',
  fr: 'French',
}
const defaultLang = 'en'
const maxNameLength = 100

// Model calls per user (cached drafts are not counted)
const rateLimit = createRateLimiter({ max: 20, windowMs: 60 * 60 * 1000 })

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
      name: yup.string().trim().min(1).max(maxNameLength).required(),
      // Language code, possibly with a region (e.g. fr-FR)
      lang: yup
        .string()
        .required()
        .matches(/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})?$/),
    })
  )
  .query(async (opts): Promise<RoleAiFragment> => {
    const userId = guardAuth(opts.ctx)
    const { name } = opts.input

    // Unsupported languages fall back to the default one
    const baseLang = opts.input.lang.split('-')[0].toLowerCase()
    const lang = Object.hasOwn(languages, baseLang) ? baseLang : defaultLang

    const existingRole = (await adminRequest(GET_ROLE_AI, { name, lang }))
      .role_ai[0]
    if (existingRole) {
      return existingRole
    }

    rateLimit(userId)

    const response = await getOpenai().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert in management, holacracy and sociocracy.
          Answer in this language only: ${languages[lang]}`,
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
      response.choices[0]?.message?.function_call?.arguments || ''
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
