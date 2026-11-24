import {
  Box,
  Button,
  TabProps,
  Tooltip,
  forwardRef,
  useDisclosure,
  useMultiStyleConfig,
  useTab,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Icon } from 'iconsax-react'
import React, { useEffect } from 'react'

interface Props extends TabProps {
  children: string
  icon?: Icon
  minimize?: boolean
}

export default forwardRef<Props, 'button'>(function Tab(
  { children, icon: Icon, minimize, ...props },
  ref
) {
  // Tab style
  const tabProps = useTab({ ...props, ref })
  const isSelected = !!tabProps['aria-selected']
  const styles = useMultiStyleConfig('Tabs', tabProps)

  // Show / hide text
  const { onOpen, onClose, isOpen } = useDisclosure({
    defaultIsOpen: !minimize,
  })
  useEffect(() => {
    if (!minimize) return
    if (isSelected) {
      onOpen()
    } else {
      onClose()
    }
  }, [isSelected])

  return (
    <Tooltip label={children} placement="top" hasArrow isDisabled={isSelected}>
      <Button
        leftIcon={Icon && <Icon variant={isSelected ? 'Bold' : 'Linear'} />}
        display="flex"
        py={2}
        px={3}
        alignItems="center"
        iconSpacing={2}
        color="inherit"
        fontWeight="semibold"
        border={0}
        // Cancel the margin of the line variant, made for its border
        mb={0}
        borderRadius="full"
        _hover={{ bg: 'whiteAlpha.600' }}
        _selected={{
          bg: 'white',
        }}
        _dark={{
          color: 'whiteAlpha.800',
          _hover: {
            bg: 'whiteAlpha.50',
          },
          _selected: {
            color: 'white',
            bg: 'gray.900',
          },
        }}
        __css={styles.tab}
        {...tabProps}
      >
        <motion.div
          initial={false}
          animate={{
            width: isOpen ? 'fit-content' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          style={{ overflow: 'hidden' }}
        >
          <Box whiteSpace="nowrap" textAlign="left" pr={1}>
            {children}
          </Box>
        </motion.div>
      </Button>
    </Tooltip>
  )
})
