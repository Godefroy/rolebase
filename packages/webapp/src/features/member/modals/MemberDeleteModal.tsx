import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  id: string
  onDelete?(): void
}

export default function MemberDeleteModal({
  id,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const { archiveMember } = useOrgEditActions()
  const member = orgData?.getMember(id)
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDelete = async () => {
    if (!member) return

    try {
      await archiveMember(id)
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.response?.data || error?.message || undefined,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      alertProps.onClose()
      return
    }

    toast({
      title: t('MemberDeleteModal.toast', { name: member.name }),
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
    onDelete?.()
    alertProps.onClose()
  }

  if (!member) return null

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t('MemberDeleteModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              <Trans
                i18nKey="MemberDeleteModal.info"
                values={{ name: member.name }}
                components={{ b: <strong /> }}
              />
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="orange" onClick={handleDelete} ml={3}>
              {t('common.archive')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
