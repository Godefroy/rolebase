import { CodegenConfig } from '@graphql-codegen/cli'
import {
  fragmentsPath,
  getAddPlugin,
  getConfig,
  schemaOverridesPath,
} from './codegenUtils'

const config: CodegenConfig = {
  overwrite: true,
  watch: true,
  schema: [
    {
      'https://local.hasura.nhost.run/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'nhost-admin-secret',
        },
      },
    },
    schemaOverridesPath,
  ],
  documents: [fragmentsPath, '**/*.ts', '!graphql/**/*', '!node_modules/**/*'],
  generates: {
    'graphql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
      plugins: [getAddPlugin()],
    },
  },
  config: getConfig(),
}

export default config
