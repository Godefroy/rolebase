// Shared styling of the buttons overlaid on the org chart (view selector,
// settings, shortcuts). Kept apart from the components that use it so a single
// overlay button can be imported without pulling in the whole options bar.
export const graphButtonsProps = {
  variant: 'outline',
  size: 'sm',
  fontWeight: 'normal',
  border: 0,
  bg: 'white',
  _hover: {
    bg: 'gray.100',
  },
  _active: {
    bg: 'gray.200',
  },
  _dark: {
    bg: 'gray.700',
    _hover: {
      bg: 'gray.600',
    },
    _active: {
      bg: 'gray.550',
    },
  },
}
