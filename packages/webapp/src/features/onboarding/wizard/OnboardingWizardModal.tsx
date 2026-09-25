import BrandModal from '@/common/atoms/BrandModal'
import TextError from '@/common/atoms/TextError'
import OnboardingProgress from '@/onboarding/components/OnboardingProgress'
import useUserMetadata from '@/user/hooks/useUserMetadata'
import { Box, Button, Flex, Spacer } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { track, trackOnce } from 'src/analytics'
import { ChevronLeftIcon, ChevronRightIcon } from 'src/icons'
import useOnboardingForm, { OnboardingStep } from './hooks/useOnboardingForm'
import StepObjective from './steps/StepObjective'
import StepOrgName from './steps/StepOrgName'
import StepRole from './steps/StepRole'
import StepSource from './steps/StepSource'

const stepComponents: Record<OnboardingStep, () => JSX.Element> = {
  orgName: StepOrgName,
  role: StepRole,
  objective: StepObjective,
  source: StepSource,
}

// One event name per step, so each is usable as an Umami funnel step (funnels
// match names, never properties). `onboarding_org_created` is sent once the
// org actually exists.
const stepEvents: Record<OnboardingStep, string> = {
  orgName: 'onboarding_org_name_done',
  role: 'onboarding_role_done',
  objective: 'onboarding_objective_done',
  source: 'onboarding_source_done',
}

// Full onboarding for non-invited new users. The organizational model and
// seeding happen afterwards, in OrgSetupModal, once inside the new org.
export default function OnboardingWizardModal() {
  const { t } = useTranslation()
  const { metadata, setMetadata } = useUserMetadata()
  const { formMethods, steps, isStepValid, submit, loading, error, conflict } =
    useOnboardingForm()

  // Sent once per person, not on every mount of the modal (reloads remount
  // it, sometimes before the metadata is saved: trackOnce covers that). The
  // wizard skips steps whose answer is already known, so the step list is the
  // only honest denominator for the funnel.
  useEffect(() => {
    if (metadata?.onboardingStartedAt) return
    trackOnce('onboarding_started', {
      steps: steps.join(','),
      stepsCount: steps.length,
    })
    setMetadata('onboardingStartedAt', new Date().toISOString())
  }, [])

  const [index, setIndex] = useState(0)
  // Clamp defensively so a step list that changes never points past its end
  const safeIndex = Math.min(index, steps.length - 1)
  const step = steps[safeIndex]
  const isFirst = safeIndex === 0
  const isLast = safeIndex === steps.length - 1
  const StepComponent = stepComponents[step]

  // The modal has no close control: leaving means closing the tab. Report
  // the step it happened on.
  const stepRef = useRef(step)
  stepRef.current = step
  useEffect(() => {
    const handlePageHide = () =>
      trackOnce('onboarding_abandoned', { step: stepRef.current })
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [])

  // A taken slug is only known on submit, at the last step: go back to it
  useEffect(() => {
    if (conflict) setIndex(steps.indexOf('orgName'))
  }, [conflict])

  const handleNext = async () => {
    if (step === 'orgName') {
      // Validate the org name/slug via the resolver before moving on
      const valid = await formMethods.trigger(['orgName', 'slug'])
      if (!valid) return
    }

    // Predefined choices only: the free-text "other" answers stay out of
    // analytics.
    const values = formMethods.getValues()
    track(stepEvents[step], {
      choice: step === 'role' ? values.roleChoice : undefined,
      choices:
        step === 'objective' ? values.objectiveChoices.join(',') : undefined,
      source: step === 'source' ? values.sourceChoice : undefined,
    })

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
