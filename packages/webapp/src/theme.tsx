import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { Task_Status_Enum, Thread_Status_Enum } from '@gql'
import 'focus-visible/dist/focus-visible'
import './fonts/Basier-Circle-medium-webfont/stylesheet.css'
import './fonts/Basier-Circle-regular-webfont/stylesheet.css'
import './fonts/Basier-Circle-semibold-webfont/stylesheet.css'
import './theme.css'

export const bgForBlurLight =
  'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.1))'
export const bgForBlurDark =
  'linear-gradient(135deg, rgba(59, 59, 81, 0.9), rgba(59, 59, 81, 0.1))'

// https://chakra-ui.com/docs/theming/theme
// https://chakra-ui.com/docs/theming/customize-theme
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src

const inputField = {
  bg: 'whiteAlpha.500',
  _dark: {
    bg: 'blackAlpha.100',
  },
  _focusVisible: {
    borderColor: 'outline',
    boxShadow: `0 0 0 1px var(--chakra-colors-outline)`,
  },
}

const Input = {
  variants: {
    outline: {
      field: inputField,
      addon: {
        bg: 'transparent',
      },
    },
  },
}

export const taskStatusColors: Record<Task_Status_Enum, string> = {
  [Task_Status_Enum.Open]: 'gray',
  [Task_Status_Enum.InProgress]: 'blue',
  [Task_Status_Enum.InReview]: 'yellow',
  [Task_Status_Enum.Blocked]: 'red',
  [Task_Status_Enum.Done]: 'green',
}

export const threadStatusColors: Record<Thread_Status_Enum, string> = {
  [Thread_Status_Enum.Active]: 'blue',
  [Thread_Status_Enum.Blocked]: 'red',
  [Thread_Status_Enum.Closed]: 'green',
  [Thread_Status_Enum.Preparation]: 'gray',
}

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    black: '#111111',
    outline: 'hsl(35 97% 50%)',
    brand: 'hsla(262, 89%, 68%, 1)',
    menulight: 'hsl(31.3, 32.4%, 96.5%)',
    menudark: 'hsl(31.3, 13.8%, 14.2%)',
    gray: {
      50: 'hsl(31.3, 44.2%, 97.9%)',
      100: 'hsl(31.3, 19%, 91%)',
      200: 'hsl(31.3, 15.4%, 86.1%)',
      300: 'hsl(31.3, 15.7%, 73.9%)',
      400: 'hsl(31.3, 16.6%, 59.6%)',
      500: 'hsl(31.3, 15%, 48.4%)', // Readable gray on light and dark background
      550: 'hsl(31.3, 17.5%, 39.4%)',
      600: 'hsl(31.3, 17%, 32.2%)',
      700: 'hsl(31.3, 15.8%, 18%)',
      800: 'hsl(31.3, 13.8%, 14.2%)',
      900: 'hsl(31.3, 12.7%, 9%)',
    },
  },
  styles: {
    // Scoped under `.rolebase-webapp` (set on the <body> of the webapp and
    // share apps, and on the demo island wrapper on the marketing site) so that
    // mounting Chakra in a Tailwind-styled page does not restyle the rest of it.
    global: (props: any) => ({
      '.rolebase-webapp': {
        // Base typography/colors the CSS reset normally puts on <body>. Set
        // here too because the reset is scoped to `.rolebase-webapp` (a div on
        // the marketing site, not a body), so it no longer styles a body.
        fontFamily: 'body',
        fontSize: '15px',
        color: 'chakra-body-text',
        bg:
          // Set background to transparent with "transparent" param in query string
          // Useful for iframe integration (org chart share)
          /(\?|&)transparent(&|$)/.test(window.location.search)
            ? 'transparent'
            : mode('white', 'gray.900')(props),
      },
      '.rolebase-webapp *::placeholder': {
        color: 'gray.500',
      },
      '.rolebase-webapp, .rolebase-webapp *, .rolebase-webapp *::before, .rolebase-webapp *::after':
        {
          borderColor: mode('gray.200', 'whiteAlpha.400')(props),
        },
    }),
  },
  fonts: {
    body: 'basier_circle, sans-serif',
    heading: 'basier_circle, sans-serif',
    circles: 'basier_circle, sans-serif',
  },
  shadows: {
    outline: `0 0 0 3px hsl(35 97% 50%)`,
  },
  components: {
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'md',
        },
      },
    },
    Card: {
      variants: {
        // Cards displayed in thread activities (proposal, poll, meeting note, ...)
        activity: {
          container: {
            maxW: '850px',
            borderWidth: '1px',
            boxShadow: 'none',
            borderColor: 'gray.200',
            bg: 'gray.50',
            _dark: {
              bg: 'whiteAlpha.50',
              borderColor: 'whiteAlpha.400',
            },
          },
        },
      },
    },
    Link: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
    Input,
    NumberInput: Input,
    Select: Input,
    Textarea: {
      variants: {
        outline: inputField,
      },
    },
    Kbd: {
      baseStyle: {
        fontSize: '1em',
        fontFamily: 'inherit',
        fontWeight: 'normal',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
    },
    Modal: {
      baseStyle: {
        header: {
          fontFamily: 'heading',
        },
        dialog: {
          _dark: {
            bg: 'gray.900',
          },
        },
      },
    },
    Popover: {
      baseStyle: {
        popper: {
          zIndex: 3000,
        },
      },
    },
  },
})

export default theme
