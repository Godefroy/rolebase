import OnboardingChoiceGroup from '@/onboarding/components/OnboardingChoiceGroup'
import { FormControl, Heading, Input, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OTHER_VALUE, SOURCE_OPTIONS } from '../onboardingOptions'
import { OnboardingValues } from '../hooks/useOnboardingForm'

export default function StepSource() {
  const { t } = useTranslation()
  const { register, watch, setValue } = useFormContext<OnboardingValues>()
  const value = watch('sourceChoice')

  const options = useMemo(
    () =>
      SOURCE_OPTIONS.map((option) => ({
        value: option,
        label: t(`Onboarding.options.source.${option}`),
      })),
    [t]
  )

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.source.heading')}
      </Heading>

      <OnboardingChoiceGroup
        ariaLabel={t('Onboarding.source.heading')}
        options={options}
        value={value}
        onChange={(v) => setValue('sourceChoice', v)}
      />

      {value === OTHER_VALUE && (
        <FormControl>
          <Input
            {...register('sourceOther')}
            autoComplete="off"
            placeholder={t('Onboarding.otherPlaceholder')}
          />
        </FormControl>
      )}
    </VStack>
  )
}
