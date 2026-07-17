import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  AlertIcon,
  Button,
  ListItem,
  Text,
  UnorderedList,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { RoleSummaryFragment, useGetRoleQuery } from '@gql'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import useSeparateFromBaseRole from '../hooks/useSeparateFromBaseRole'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  circleId: string
  role: RoleSummaryFragment
}

export default function SeparateBaseRoleModal({
  circleId,
  role,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const separateFromBaseRole = useSeparateFromBaseRole()
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Load the full base role so its whole content can be copied.
  const { data, loading, error } = useGetRoleQuery({
    variables: { id: role.id },
  })
  const baseRole = data?.role_by_pk

  const handleConfirm = async () => {
    if (!baseRole) return
    await separateFromBaseRole(circleId, baseRole)
    toast({
      title: t('SeparateBaseRoleModal.toast', { name: role.name }),
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
            {t('SeparateBaseRoleModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            {loading ? (
              <Loading active size="md" />
            ) : (
              <VStack spacing={4} align="start">
                <TextErrors errors={[error]} />

                <Text>
                  <Trans
                    i18nKey="SeparateBaseRoleModal.info"
                    values={{ name: role.name }}
                    components={{ b: <strong /> }}
                  />
                </Text>

                <UnorderedList ml={6}>
                  <ListItem>{t('SeparateBaseRoleModal.consequence1')}</ListItem>
                  <ListItem>{t('SeparateBaseRoleModal.consequence2')}</ListItem>
                  <ListItem>{t('SeparateBaseRoleModal.consequence3')}</ListItem>
                </UnorderedList>

                <Alert status="warning">
                  <AlertIcon />
                  <AlertDescription>
                    {t('SeparateBaseRoleModal.irreversible')}
                  </AlertDescription>
                </Alert>
              </VStack>
            )}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              colorScheme="orange"
              isDisabled={loading || !!error || !baseRole}
              onClick={handleConfirm}
              ml={3}
            >
              {t('SeparateBaseRoleModal.confirmButton')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
