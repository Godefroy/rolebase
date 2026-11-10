import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Decorator } from '@storybook/react-vite'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'src/i18n'
import theme from 'src/theme'

export const decorators: Decorator[] = [
  (Story) => (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Story />
      </ChakraProvider>
    </I18nextProvider>
  ),
]
