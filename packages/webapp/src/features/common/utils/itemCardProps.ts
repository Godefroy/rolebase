import { ChakraProps, SystemStyleObject } from '@chakra-ui/react'

interface ItemCardProps extends ChakraProps {
  _hover: SystemStyleObject
  _dark: SystemStyleObject
  sx: SystemStyleObject
}

// Warm shadows, tinted with the theme's beige hue
const restShadow = '0 1px 2px hsla(31, 30%, 25%, 0.06)'
const hoverShadow = '0 6px 16px hsla(31, 30%, 25%, 0.12)'
// Static cards: faint warm outline, no shadow or lift (a beige tint would
// blend into the beige background)
const staticHoverRing = `${restShadow}, 0 0 0 1px hsla(31, 30%, 25%, 0.14)`

interface Options {
  // Draggable cards (manual order) get a lifted hover with a shadow,
  // static cards a faint outline
  draggable?: boolean
  isDragging?: boolean
  // Card sits on a colored surface (kanban column), darker in dark mode
  onColor?: boolean
}

// White card without border, meant to sit on the beige background
// (same language as the sidebar cards). Shared by task, thread, meeting and decision items.
export function getItemCardProps({
  draggable,
  isDragging,
  onColor,
}: Options = {}): ItemCardProps {
  const darkBg = onColor ? 'blackAlpha.400' : 'whiteAlpha.100'
  const darkHoverBg = onColor ? 'blackAlpha.500' : 'whiteAlpha.200'
  return {
    position: 'relative',
    px: 3.5,
    py: 3,
    bg: 'white',
    // Transparent border keeps the size stable when the selected ring shows
    borderWidth: '1px',
    borderColor: 'transparent',
    borderRadius: 'xl',
    boxShadow: isDragging ? 'lg' : restShadow,
    cursor: 'pointer',
    transition: draggable
      ? 'box-shadow 150ms ease-out, transform 150ms ease-out'
      : 'box-shadow 120ms ease-out',
    _hover: draggable
      ? {
          boxShadow: isDragging ? 'lg' : hoverShadow,
          transform: isDragging ? 'none' : 'translateY(-1px)',
        }
      : { boxShadow: staticHoverRing },
    _dark: {
      bg: darkBg,
      boxShadow: isDragging ? 'dark-lg' : 'none',
      _hover: { bg: darkHoverBg, boxShadow: isDragging ? 'dark-lg' : 'none' },
    },
    sx: {
      '&.active': {
        borderColor: 'brand',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand)',
      },
      '&:has(a:focus-visible)': {
        boxShadow: 'outline',
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': { transform: 'none' },
      },
    },
  }
}
