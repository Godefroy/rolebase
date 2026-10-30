import { Box, Flex, FlexProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends FlexProps {
  total: number
  current: number // zero-based index of the current step
  // Furthest step reached, when the person can go back: the steps up to it
  // are clickable, those after the current one shown lighter
  reached?: number
  onStepSelect?(index: number): void
}

// Segmented progress indicator for the onboarding wizard and tours.
export default function OnboardingProgress({
  total,
  current,
  reached = current,
  onStepSelect,
  ...flexProps
}: Props) {
  const { t } = useTranslation()

  return (
    <Flex gap={1.5} mb={8} aria-hidden={!onStepSelect} {...flexProps}>
      {Array.from({ length: total }).map((_, index) => {
        const color =
          index <= current
            ? 'yellow.400'
            : index <= reached
              ? 'yellow.200'
              : undefined
        const bar = (
          <Box
            h="3px"
            borderRadius="full"
            bg={color ?? 'blackAlpha.200'}
            _dark={{ bg: color ?? 'whiteAlpha.200' }}
            transition="background-color 0.2s"
          />
        )
        if (!onStepSelect || index > reached) {
          return (
            <Box key={index} flex={1} py={onStepSelect ? 2 : undefined}>
              {bar}
            </Box>
          )
        }
        // A taller hit area than the bar itself
        return (
          <Box
            key={index}
            as="button"
            type="button"
            flex={1}
            py={2}
            cursor="pointer"
            aria-label={t('OnboardingProgress.step', {
              current: index + 1,
              total,
            })}
            aria-current={index === current ? 'step' : undefined}
            _hover={{ opacity: 0.7 }}
            _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
            onClick={() => onStepSelect(index)}
          >
            {bar}
          </Box>
        )
      })}
    </Flex>
  )
}
