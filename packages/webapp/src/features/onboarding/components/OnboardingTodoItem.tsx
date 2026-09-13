import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router'
import { CheckIcon } from 'src/icons'

interface Props {
  done: boolean
  label: string
  // Where the action happens: a page, or a handler opening a modal
  to?: string
  onClick?(): void
}

// One line of the onboarding todo. Done lines stay visible, checked, so the
// progress shows what was already achieved.
export default function OnboardingTodoItem({
  done,
  label,
  to,
  onClick,
}: Props) {
  return (
    <Flex
      as={to ? RouterLink : 'button'}
      {...(to ? { to } : { type: 'button', onClick })}
      align="center"
      gap={2.5}
      w="100%"
      px={2}
      py={1.5}
      borderRadius="md"
      textAlign="left"
      fontSize="sm"
      _hover={{ bg: 'blackAlpha.50' }}
      _dark={{ _hover: { bg: 'whiteAlpha.100' } }}
      _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
    >
      <Flex
        flexShrink={0}
        align="center"
        justify="center"
        w="18px"
        h="18px"
        borderRadius="full"
        borderWidth={done ? 0 : '1.5px'}
        borderColor="gray.300"
        bg={done ? 'green.500' : 'transparent'}
        color="white"
        _dark={{ borderColor: 'whiteAlpha.400' }}
        aria-hidden
      >
        {done && <CheckIcon size={12} />}
      </Flex>
      <Text
        as={done ? 's' : 'span'}
        color={done ? 'gray.500' : undefined}
        _dark={{ color: done ? 'gray.400' : undefined }}
      >
        {label}
      </Text>
    </Flex>
  )
}
