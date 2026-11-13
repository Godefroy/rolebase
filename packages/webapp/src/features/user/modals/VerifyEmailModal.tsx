import BottomFixedModal from '@/common/atoms/BottomFixedModal'
import { useAuth } from '../hooks/useAuth'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Wrap,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { EditIcon } from 'src/icons'
import { nhost } from 'src/nhost'
import ChangeEmailModal from './ChangeEmailModal'

// The link sent at signup is still expected during this delay. Past it, the
// address was never verified or was marked unverified after a bounce.
const RECENT_ACCOUNT_MS = 60 * 60 * 1000

export default function VerifyEmailModal() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const toast = useToast()
  const changeEmailModal = useDisclosure()

  const [closed, setClosed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const isRecent = user
    ? Date.now() - new Date(user.createdAt).getTime() < RECENT_ACCOUNT_MS
    : false
  const linkExpected = isRecent || sent

  const handleSendEmail = async () => {
    if (!user?.email) return
    setSending(true)
    try {
      await nhost.auth.sendVerificationEmail({ email: user.email })
      track('auth_verification_resent')
      setSent(true)
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setSending(false)
    }
  }

  // Show modal only if the user email is not verified, hidden behind the email
  // change modal it would cover
  const showModal = user
    ? !user.emailVerified && !closed && !changeEmailModal.isOpen
    : false

  return (
    <>
      <BottomFixedModal isOpen={showModal} width={600}>
        <Flex justifyContent="space-between" alignItems="baseline">
          <Heading as="h2" fontSize="lg" mb={3}>
            {t('VerifyEmailModal.heading')}
          </Heading>
          <Spacer />
          <CloseButton onClick={() => setClosed(true)} />
        </Flex>

        <Text>
          {t(
            linkExpected
              ? 'VerifyEmailModal.sentTo'
              : 'VerifyEmailModal.notVerified'
          )}
        </Text>
        <HStack spacing={1} mb={2}>
          <Text fontWeight="semibold" wordBreak="break-all">
            {user?.email}
          </Text>
          <Tooltip label={t('VerifyEmailModal.editEmail')} hasArrow>
            <IconButton
              aria-label={t('VerifyEmailModal.editEmail')}
              icon={<EditIcon size={16} />}
              size="sm"
              variant="ghost"
              onClick={changeEmailModal.onOpen}
            />
          </Tooltip>
        </HStack>
        {linkExpected && <Text mb={3}>{t('VerifyEmailModal.text')}</Text>}

        {sent ? (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{t('VerifyEmailModal.sent')}</AlertDescription>
          </Alert>
        ) : (
          <Wrap>
            <Button
              variant="solid"
              isLoading={sending}
              onClick={handleSendEmail}
            >
              {t(
                isRecent ? 'VerifyEmailModal.resend' : 'VerifyEmailModal.send'
              )}
            </Button>
          </Wrap>
        )}
      </BottomFixedModal>

      {changeEmailModal.isOpen && (
        <ChangeEmailModal
          isOpen
          onClose={changeEmailModal.onClose}
          // The link to verify is now the one sent to the new address
          onSuccess={() => setClosed(true)}
        />
      )}
    </>
  )
}
