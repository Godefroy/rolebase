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
const outlineColor = 'hsla(31, 30%, 25%, 0.14)'
const staticHoverRing = `${restShadow}, 0 0 0 1px ${outlineColor}`

export interface ItemCardOptions {
  // Draggable cards (manual order) get a lifted hover with a shadow,
  // static cards a faint outline
  draggable?: boolean
  isDragging?: boolean
  // Card sits on a colored surface (kanban column), darker in dark mode
  onColor?: boolean
  // Visible border in addition to the shadow (meeting page)
  bordered?: boolean
}

// White card without border, meant to sit on the beige background
// (same language as the sidebar cards). Shared by task, thread, meeting and decision items.
export function getItemCardProps({
  draggable,
  isDragging,
  onColor,
  bordered,
}: ItemCardOptions = {}): ItemCardProps {
  const darkBg = onColor ? 'blackAlpha.400' : 'whiteAlpha.100'
  const darkHoverBg = onColor ? 'blackAlpha.500' : 'whiteAlpha.200'
  return {
    position: 'relative',
    px: 3.5,
    py: 3,
    bg: 'white',
    // Transparent border keeps the size stable when the selected ring shows
    borderWidth: '1px',
    borderColor: bordered ? outlineColor : 'transparent',
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
      borderColor: bordered ? 'whiteAlpha.200' : 'transparent',
      boxShadow: isDragging ? 'dark-lg' : 'none',
      _hover: { bg: darkHoverBg, boxShadow: isDragging ? 'dark-lg' : 'none' },
    },
    sx: {
      // Card "..." menu: takes no space until shown, on hover and focus
      // (focusing the card's link reveals it for keyboard users),
      // always shown on touch and small screens
      // The corner slot also collapses (with its gap) when the menu is its only content
      '& .item-actions-menu, & .item-corner:not(:has(svg:not(.item-actions-menu svg)))':
        { display: 'none' },
      [`&:hover .item-actions-menu, &:focus-within .item-actions-menu, &:has([aria-expanded=true]) .item-actions-menu,
        &:hover .item-corner:not(:has(svg:not(.item-actions-menu svg))), &:focus-within .item-corner:not(:has(svg:not(.item-actions-menu svg))), &:has([aria-expanded=true]) .item-corner:not(:has(svg:not(.item-actions-menu svg)))`]:
        { display: 'flex' },
      '@media (hover: none), (max-width: 47.99em)': {
        '& .item-actions-menu, & .item-corner:not(:has(svg:not(.item-actions-menu svg)))':
          { display: 'flex' },
      },
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
