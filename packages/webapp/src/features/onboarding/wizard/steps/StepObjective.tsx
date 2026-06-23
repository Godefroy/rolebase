import OnboardingMultiChoiceGroup from '@/onboarding/components/OnboardingMultiChoiceGroup'
import { FormControl, Heading, Input, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OBJECTIVE_OPTIONS, OTHER_VALUE } from '../onboardingOptions'
import { OnboardingValues } from '../hooks/useOnboardingForm'

export default function StepObjective() {
  const { t } = useTranslation()
  const { register, watch, setValue } = useFormContext<OnboardingValues>()
  const value = watch('objectiveChoices')

  const options = useMemo(
    () =>
      OBJECTIVE_OPTIONS.map((option) => ({
        value: option,
        label: t(`Onboarding.options.objective.${option}`),
      })),
    [t]
  )

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.objective.heading')}
      </Heading>

      <OnboardingMultiChoiceGroup
        ariaLabel={t('Onboarding.objective.heading')}
        options={options}
        value={value}
        onChange={(v) => setValue('objectiveChoices', v)}
      />

      {value.includes(OTHER_VALUE) && (
        <FormControl>
          <Input
            {...register('objectiveOther')}
            autoComplete="off"
            placeholder={t('Onboarding.otherPlaceholder')}
          />
        </FormControl>
      )}
    </VStack>
  )
}
