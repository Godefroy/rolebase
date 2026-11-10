import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { mergeConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        tsconfigPaths: true,
        alias: [
          {
            // Prevent yjs from being imported twice (from its CommonJS and ECMAScript version), by forcing an alias on it
            // More info: https://github.com/yjs/yjs/issues/438
            find: 'yjs',
            replacement: path.resolve(
              dirname,
              '../../../node_modules/yjs/dist/yjs.mjs'
            ),
          },
        ],
      },
    })
  },
}

export default config
