import BottomFixedModal from '@/common/atoms/BottomFixedModal'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import useUserMetadata from '@/user/hooks/useUserMetadata'
import { Button, CloseButton, Heading, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useOnboardingActive from '../hooks/useOnboardingActive'

const BOOK_DEMO_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3HO94pvxEZhJHdFj9De9aQVxQysIRmZLG3ZohdET30avcVhkhCe3yrKRNLwjW8SCtr_qLaAwWe'

export default function BookDemoModal() {
  const { t, i18n } = useTranslation()
  const { metadata, setMetadata } = useUserMetadata()
  const isOwner = useOrgOwner()
  const onboardingActive = useOnboardingActive()
  const [closed, setClosed] = useState(false)

  const handleClose = () => {
    setClosed(true)
    setMetadata('bookDemoInfo', true)
  }

  const handleBookDemo = () => {
    const url = new URL(BOOK_DEMO_URL)
    url.searchParams.set('hl', i18n.language)
    window.open(url.toString(), '_blank')
    handleClose()
  }

  // Never show on top of another onboarding flow (wizard / org setup)
  const showModal =
    isOwner && !metadata?.bookDemoInfo && !closed && !onboardingActive

  return (
    <BottomFixedModal
      isOpen={showModal}
      bg="purple.600"
      _dark={{ bg: 'purple.800' }}
      color="white"
    >
      <CloseButton
        position="absolute"
        top={2}
        right={2}
        onClick={handleClose}
        aria-label={t('common.close')}
        tabIndex={0}
        _hover={{ bg: 'purple.700', _dark: { bg: 'purple.600' } }}
      />

      <Heading as="h2" fontSize="lg" mb={3}>
        {t('BookDemoModal.title')}
      </Heading>
      <Text mb={4}>{t('BookDemoModal.message')}</Text>
      <Button
        bg="white"
        color="gray.800"
        _hover={{ bg: 'gray.100' }}
        onClick={handleBookDemo}
        aria-label={t('BookDemoModal.button')}
        tabIndex={0}
      >
        {t('BookDemoModal.button')}
      </Button>
    </BottomFixedModal>
  )
}
