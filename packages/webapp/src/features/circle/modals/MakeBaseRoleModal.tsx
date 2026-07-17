import { useOrgEditActions } from '@/org/contexts/OrgContext'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
  ListItem,
  Text,
  UnorderedList,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { RoleFragment, RoleSummaryFragment } from '@gql'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  role: RoleSummaryFragment
}

export default function MakeBaseRoleModal({ role, ...alertProps }: Props) {
  const { t } = useTranslation()
  const { updateRole } = useOrgEditActions()
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = async () => {
    await updateRole(role as RoleFragment, { base: true })
    toast({
      title: t('MakeBaseRoleModal.toast', { name: role.name }),
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
    alertProps.onClose()
  }

  return (
    <AlertDialog size="xl" {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t('MakeBaseRoleModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack spacing={4} align="start">
              <Text>
                <Trans
                  i18nKey="MakeBaseRoleModal.info"
                  values={{ name: role.name }}
                  components={{ b: <strong /> }}
                />
              </Text>

              <UnorderedList ml={6}>
                <ListItem>{t('MakeBaseRoleModal.consequence1')}</ListItem>
                <ListItem>{t('MakeBaseRoleModal.consequence2')}</ListItem>
                <ListItem>{t('MakeBaseRoleModal.consequence3')}</ListItem>
              </UnorderedList>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="blue" onClick={handleConfirm} ml={3}>
              {t('MakeBaseRoleModal.confirmButton')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
