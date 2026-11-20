import BrandModal from '@/common/atoms/BrandModal'
import { Center, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { track } from 'src/analytics'
import OnboardingCreateFlow from './components/OnboardingCreateFlow'
import OnboardingJoinStep from './components/OnboardingJoinStep'
import useColleagueOrgs from './hooks/useColleagueOrgs'

// Onboarding of non-invited new users. When colleagues (same company email
// domain) already use Rolebase, it first offers to request access to their
// org, or to create a new one.
export default function OnboardingWizardModal() {
  const { orgs, loading, refresh } = useColleagueOrgs()
  const [create, setCreate] = useState(false)
  const hasColleagueOrgs = orgs.length > 0

  const handleCreate = () => {
    track('onboarding_join_skipped')
    setCreate(true)
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
      {loading ? (
        <Center py={10}>
          <Spinner />
        </Center>
      ) : hasColleagueOrgs && !create ? (
        <OnboardingJoinStep
          orgs={orgs}
          onRequested={refresh}
          onCreate={handleCreate}
        />
      ) : (
        <OnboardingCreateFlow prefillFromDomain={!hasColleagueOrgs} />
      )}
    </BrandModal>
  )
}
