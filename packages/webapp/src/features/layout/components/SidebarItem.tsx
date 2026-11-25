import { Box, Button, ButtonProps, forwardRef } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon } from 'src/icons'
import {
  sidebarItemActiveStyle,
  sidebarItemHoverStyle,
} from '../utils/sidebarItemStyles'
import SidebarIcon, { SidebarIconProps } from './SidebarIcon'
import SidebarTopIcon from './SidebarTopIcon'

export interface SidebarItemProps
  extends ButtonProps, Pick<SidebarIconProps, 'icon' | 'iconNode' | 'alert'> {
  isPathExact?: boolean
  isPathStart?: boolean
  // Icon only (collapsed sidebar, mobile top bar)
  compact?: boolean
  onAdd?: () => void
}

export default forwardRef(function SidebarItem(
  {
    icon,
    iconNode,
    isPathExact,
    isPathStart,
    alert,
    compact,
    children,
    onAdd,
    ...buttonProps
  }: SidebarItemProps,
  ref
) {
  const { t } = useTranslation()

  const handleAddClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      event.preventDefault()
      onAdd?.()
    },
    [onAdd]
  )

  const handleAddKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.stopPropagation()
        event.preventDefault()
        onAdd?.()
      }
    },
    [onAdd]
  )

  if (compact) {
    return (
      <SidebarTopIcon
        ref={ref}
        icon={icon}
        iconNode={iconNode}
        isActive={isPathStart}
        alert={alert}
        {...buttonProps}
      >
        {typeof children === 'string' ? children : ''}
      </SidebarTopIcon>
    )
  }

  return (
    <Button
      ref={ref}
      role="group"
      variant="unstyled"
      w="100%"
      h="auto"
      py={2.5}
      px={3}
      display="flex"
      alignItems="center"
      gap={3}
      justifyContent="start"
      textAlign="left"
      borderRadius="xl"
      color="gray.700"
      _hover={isPathStart ? undefined : sidebarItemHoverStyle}
      _dark={{ color: 'whiteAlpha.800' }}
      fontWeight={isPathStart ? 'semibold' : 'medium'}
      sx={isPathStart ? sidebarItemActiveStyle : undefined}
      {...buttonProps}
    >
      <SidebarIcon
        icon={icon}
        iconNode={iconNode}
        isActive={isPathStart}
        alert={alert}
        color={isPathStart ? 'brand' : 'gray.600'}
        _dark={{ color: isPathStart ? 'brand' : 'whiteAlpha.700' }}
      />

      <Box
        as="span"
        flex={1}
        minW={0}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {children}
      </Box>

      {onAdd && (
        <Box
          as="span"
          role="button"
          tabIndex={0}
          aria-label={t('common.add')}
          onClick={handleAddClick}
          onKeyDown={handleAddKeyDown}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          p={0.5}
          ml={-1}
          mr={-1}
          color="gray.500"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          _focusVisible={{ opacity: 1 }}
          _hover={{
            color: 'gray.700',
            bg: 'blackAlpha.100',
            _dark: { color: 'white', bg: 'whiteAlpha.200' },
          }}
        >
          <AddIcon size={18} />
        </Box>
      )}
    </Button>
  )
})

// Rows of a list below a sidebar link
export const sidebarSubItemProps = {
  borderRadius: 'md',
  _hover: sidebarItemHoverStyle,
  sx: {
    '&.active, &.active:hover': sidebarItemActiveStyle,
  },
}
