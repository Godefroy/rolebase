import { Flex } from '@chakra-ui/react'
import React from 'react'

interface Props {
  total: number
  current: number // zero-based index of the current step
}

// Segmented progress indicator for the onboarding wizard.
export default function OnboardingProgress({ total, current }: Props) {
  return (
    <Flex gap={1.5} mb={8} aria-hidden>
      {Array.from({ length: total }).map((_, index) => (
        <Flex
          key={index}
          flex={1}
          h="3px"
          borderRadius="full"
          bg={index <= current ? 'yellow.400' : 'blackAlpha.200'}
          _dark={{ bg: index <= current ? 'yellow.400' : 'whiteAlpha.200' }}
          transition="background-color 0.2s"
        />
      ))}
    </Flex>
  )
}
