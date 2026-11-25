import { SystemStyleObject } from '@chakra-ui/react'

// Shared look of sidebar links, in rows and icons only

export const sidebarItemHoverStyle: SystemStyleObject = {
  bg: 'whiteAlpha.700',
  _dark: { bg: 'whiteAlpha.50' },
}

// Current page: raised white pill. The border and shadow are drawn on a
// pseudo-element: the focus reset removes the box-shadow of a focused element.
export const sidebarItemActiveStyle: SystemStyleObject = {
  bg: 'white',
  isolation: 'isolate',
  _before: {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: 'inherit',
    boxShadow:
      '0 1px 2px rgba(60, 40, 20, 0.08), 0 0 0 1px rgba(60, 40, 20, 0.04)',
  },
  _dark: {
    bg: 'whiteAlpha.100',
    _before: { display: 'none' },
  },
}
