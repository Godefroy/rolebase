import { Button, ButtonProps, forwardRef, Tooltip } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { SidebarContext } from '../contexts/SidebarContext'
import {
  sidebarItemActiveStyle,
  sidebarItemHoverStyle,
} from '../utils/sidebarItemStyles'
import SidebarIcon, { SidebarIconProps } from './SidebarIcon'

export interface SidebarTopIconProps
  extends ButtonProps, Pick<SidebarIconProps, 'icon' | 'iconNode' | 'alert'> {
  isActive?: boolean
  children: string
}

// Icon-only sidebar link: collapsed sidebar (desktop) and top bar (mobile)
export default forwardRef(function SidebarTopIcon(
  {
    icon,
    iconNode,
    isActive,
    alert,
    children,
    ...buttonProps
  }: SidebarTopIconProps,
  ref
) {
  const sidebarContext = useContext(SidebarContext)

  return (
    <Tooltip
      label={children}
      placement="right"
      openDelay={300}
      isDisabled={sidebarContext?.isMobile}
    >
      <Button
        ref={ref}
        aria-label={children}
        variant="unstyled"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        w="44px"
        minW="44px"
        h="40px"
        borderRadius="xl"
        color="gray.600"
        _hover={isActive ? undefined : sidebarItemHoverStyle}
        _dark={{ color: 'whiteAlpha.800' }}
        sx={isActive ? sidebarItemActiveStyle : undefined}
        {...buttonProps}
      >
        <SidebarIcon
          icon={icon}
          iconNode={iconNode}
          isActive={isActive}
          alert={alert}
        />
      </Button>
    </Tooltip>
  )
})
