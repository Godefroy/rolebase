import { Box, BoxProps, Circle } from '@chakra-ui/react'
import { Icon } from 'iconsax-react'
import React from 'react'

export interface SidebarIconProps extends BoxProps {
  icon?: Icon
  // Custom icon (avatar, org icon), in place of icon
  iconNode?: React.ReactNode
  isActive?: boolean
  alert?: boolean
}

export default function SidebarIcon({
  icon: IconComponent,
  iconNode,
  isActive,
  alert,
  ...boxProps
}: SidebarIconProps) {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="20px"
      h="20px"
      flexShrink={0}
      color={isActive ? 'brand' : undefined}
      {...boxProps}
    >
      {IconComponent ? (
        <IconComponent size={20} variant={isActive ? 'Bold' : 'Linear'} />
      ) : (
        iconNode
      )}

      {alert && (
        <Circle
          size="8px"
          position="absolute"
          top="-2px"
          right="-2px"
          bg="red.400"
          boxShadow="0 0 0 2px var(--chakra-colors-menulight)"
          _dark={{
            bg: 'red.500',
            boxShadow: '0 0 0 2px var(--chakra-colors-menudark)',
          }}
        />
      )}
    </Box>
  )
}
