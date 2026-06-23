import BrandModal from '@/common/atoms/BrandModal'
import TextError from '@/common/atoms/TextError'
import OnboardingProgress from '@/onboarding/components/OnboardingProgress'
import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from 'src/icons'
import useOnboardingForm, { OnboardingStep } from './hooks/useOnboardingForm'
import StepObjective from './steps/StepObjective'
import StepOrgName from './steps/StepOrgName'
import StepRole from './steps/StepRole'
import StepSource from './steps/StepSource'
import StepUsername from './steps/StepUsername'

const stepComponents: Record<OnboardingStep, () => JSX.Element> = {
  username: StepUsername,
  role: StepRole,
  objective: StepObjective,
  source: StepSource,
  orgName: StepOrgName,
}

// Full onboarding for non-invited new users. The organizational model and
// seeding happen afterwards, in OrgSetupModal, once inside the new org.
export default function OnboardingWizardModal() {
  const { t } = useTranslation()
  const { formMethods, steps, isStepValid, submit, loading, error } =
    useOnboardingForm()

  const [index, setIndex] = useState(0)
  // Clamp defensively so a step list that changes never points past its end
  const safeIndex = Math.min(index, steps.length - 1)
  const step = steps[safeIndex]
  const isFirst = safeIndex === 0
  const isLast = safeIndex === steps.length - 1
  const StepComponent = stepComponents[step]

  const handleNext = async () => {
    if (step === 'orgName') {
      // Validate the org name/slug via the resolver before submitting
      const valid = await formMethods.trigger(['orgName', 'slug'])
      if (!valid) return
    }
    if (isLast) {
      submit()
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    <BrandModal
      size="xl"
      bodyProps={{ mx: 10 }}
      backButton={false}
      isOpen
      autoFocus={false}
      closeOnEsc={false}
      onClose={() => undefined}
    >
      <FormProvider {...formMethods}>
        {steps.length > 1 && (
          <OnboardingProgress total={steps.length} current={safeIndex} />
        )}

        <StepComponent />

        {error && (
          <Box mt={5}>
            <TextError error={error} />
          </Box>
        )}

        <Flex mt={8} align="center">
          {!isFirst && (
            <Button
              variant="ghost"
              leftIcon={<ChevronLeftIcon size="1em" />}
              onClick={() => setIndex((i) => i - 1)}
              isDisabled={loading}
            >
              {t('common.back')}
            </Button>
          )}
          <Spacer />
          <Button
            colorScheme="blue"
            rightIcon={!isLast ? <ChevronRightIcon size="1em" /> : undefined}
            onClick={handleNext}
            isLoading={loading}
            isDisabled={!isStepValid(step)}
          >
            {isLast ? t('Onboarding.finish') : t('common.next')}
          </Button>
        </Flex>
      </FormProvider>
    </BrandModal>
  )
}
