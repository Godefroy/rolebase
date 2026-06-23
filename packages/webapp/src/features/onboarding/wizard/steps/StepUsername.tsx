import { FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OnboardingValues } from '../hooks/useOnboardingForm'

export default function StepUsername() {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingValues>()

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.username.heading')}
      </Heading>

      <FormControl isInvalid={!!errors.name}>
        <FormLabel>{t('Onboarding.username.name')}</FormLabel>
        <Input {...register('name')} autoComplete="name" required />
      </FormControl>
    </VStack>
  )
}
