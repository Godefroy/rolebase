import {
  Button,
  forwardRef,
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'

export interface IconTextButtonProps extends IconButtonProps {
  // Boolean, or per breakpoint (e.g. { base: false, md: true })
  showText?:
    boolean | Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', boolean>>
  tooltipPlacement?: PlacementWithLogical | undefined
}

export default forwardRef(function IconTextButton(
  {
    showText,
    tooltipPlacement,
    icon,
    'aria-label': label,
    ...props
  }: IconTextButtonProps,
  ref
) {
  const isTextShown = useBreakpointValue(
    typeof showText === 'object' ? showText : { base: !!showText },
    { ssr: false }
  )

  return isTextShown ? (
    <Button ref={ref} leftIcon={icon} {...props}>
      {label}
    </Button>
  ) : (
    <Tooltip label={label} placement={tooltipPlacement || 'top'} hasArrow>
      <IconButton ref={ref} aria-label={label} icon={icon} {...props} />
    </Tooltip>
  )
})
