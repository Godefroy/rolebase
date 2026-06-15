import IconTextButton from '@/common/atoms/IconTextButton'
import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import useCallbackState from '@/common/hooks/useCallbackState'
import useCopyUrl from '@/common/hooks/useCopyUrl'
import { getMeetingsIcalUrl } from '@/meeting/api/ical'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as ReachLink } from 'react-router'
import { CopyIcon } from 'src/icons'
import { trpc } from 'src/trpc'

export default function MeetingExportModal(modalProps: UseModalProps) {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { orgId } = useOrgContext()
  const member = useCurrentMember()

  // Get token
  const {
    call: update,
    value: token,
    loading,
    error,
  } = useCallbackState(async () => {
    if (!orgId) return
    return trpc.meeting.getMeetingsToken.query({ orgId })
  })

  useEffect(() => {
    update()
  }, [orgId])

  // Get URL
  const url = useMemo(() => {
    if (!orgId || !member || !token) return
    return getMeetingsIcalUrl(orgId, token, language, member.id)
  }, [orgId, token, language, member])

  // Copy URL
  const copyUrl = useCopyUrl(url)

  return (
    <Modal size="xl" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('MeetingExportModal.heading')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={10}>
          <VStack spacing={5} align="stretch">
            <Loading size="sm" active={loading} />
            <TextErrors errors={[error]} />

            {url && (
              <FormControl>
                <FormLabel>{t('MeetingExportModal.url')}</FormLabel>
                <InputGroup>
                  <Input
                    autoFocus
                    value={url}
                    readOnly
                    flex={1}
                    pr="4.7rem"
                    onFocus={(e) => e.target.select()}
                  />
                  <InputRightElement>
                    <IconTextButton
                      aria-label={t('common.copy')}
                      icon={<CopyIcon size={20} />}
                      onClick={copyUrl}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            )}

            <Alert status="info">
              <AlertIcon />
              <AlertDescription>
                <Trans
                  i18nKey="MeetingExportModal.help"
                  components={{
                    apps: (
                      <Link
                        as={ReachLink}
                        to="/apps"
                        textDecoration="underline"
                      />
                    ),
                  }}
                />
              </AlertDescription>
            </Alert>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
