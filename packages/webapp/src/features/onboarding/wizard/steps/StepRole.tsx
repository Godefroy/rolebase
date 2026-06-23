import OnboardingChoiceGroup from '@/onboarding/components/OnboardingChoiceGroup'
import { FormControl, Heading, Input, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OTHER_VALUE, ROLE_OPTIONS } from '../onboardingOptions'
import { OnboardingValues } from '../hooks/useOnboardingForm'

export default function StepRole() {
  const { t } = useTranslation()
  const { register, watch, setValue } = useFormContext<OnboardingValues>()
  const value = watch('roleChoice')

  const options = useMemo(
    () =>
      ROLE_OPTIONS.map((option) => ({
        value: option,
        label: t(`Onboarding.options.role.${option}`),
      })),
    [t]
  )

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.role.heading')}
      </Heading>

      <OnboardingChoiceGroup
        ariaLabel={t('Onboarding.role.heading')}
        options={options}
        value={value}
        onChange={(v) => setValue('roleChoice', v)}
      />

      {value === OTHER_VALUE && (
        <FormControl>
          <Input
            {...register('roleOther')}
            autoComplete="off"
            placeholder={t('Onboarding.otherPlaceholder')}
          />
        </FormControl>
      )}
    </VStack>
  )
}
