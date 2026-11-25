import {
  Button,
  forwardRef,
  HStack,
  IconButton,
  IconButtonProps,
  PlacementWithLogical,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'

export interface IconTextButtonProps extends IconButtonProps {
  // Boolean, per breakpoint (e.g. { base: false, md: true }),
  // or "wide": text shown when the surrounding PageHeader is wide enough
  showText?:
    | boolean
    | 'wide'
    | Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', boolean>>
  tooltipPlacement?: PlacementWithLogical | undefined
  // Shown after the text, or after the icon when the text is hidden
  rightIcon?: React.ReactElement
}

export default forwardRef(function IconTextButton(
  {
    showText,
    tooltipPlacement,
    icon,
    rightIcon,
    'aria-label': label,
    ...props
  }: IconTextButtonProps,
  ref
) {
  const isTextShown = useBreakpointValue(
    typeof showText === 'object' ? showText : { base: !!showText },
    { ssr: false }
  )

  // Text hidden by PageHeader's styles when it is narrow
  if (showText === 'wide') {
    return (
      <Button
        ref={ref}
        leftIcon={icon}
        rightIcon={rightIcon}
        aria-label={label}
        {...props}
        // Merged: a MenuButton passes its own class
        className={['icon-text-button-wide', props.className]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="icon-text-button-label">{label}</span>
      </Button>
    )
  }

  return isTextShown ? (
    <Button ref={ref} leftIcon={icon} rightIcon={rightIcon} {...props}>
      {label}
    </Button>
  ) : (
    <Tooltip label={label} placement={tooltipPlacement || 'top'} hasArrow>
      <IconButton
        ref={ref}
        aria-label={label}
        icon={
          rightIcon ? (
            <HStack spacing={1}>
              {icon}
              {rightIcon}
            </HStack>
          ) : (
            icon
          )
        }
        // With a right icon (menu chevron), keep room around both icons
        px={rightIcon ? 2 : undefined}
        {...props}
      />
    </Tooltip>
  )
})
