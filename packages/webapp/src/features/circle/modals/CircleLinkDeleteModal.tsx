import { GraphContext } from '@/graph/contexts/GraphContext'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
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
} from '@chakra-ui/react'
import React, { useContext, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  parentId: string
  circleId: string
  onDelete?(): void
}

export default function CircleLinkDeleteModal({
  parentId,
  circleId,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const { removeCircleLink } = useOrgEditActions()
  const { orgData } = useOrgContext()
  const parentCircle = orgData?.getCircle(parentId)
  const invitedCircle = orgData?.getCircle(circleId)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const graphContext = useContext(GraphContext)

  const handleDelete = async () => {
    if (!parentCircle || !invitedCircle) return
    await removeCircleLink(parentId, circleId)
    onDelete?.()
    alertProps.onClose()

    // Focus circle in graph
    graphContext?.graph?.focusNodeIdAfterData(parentId, true)
  }

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t('CircleLinkDeleteModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              <Trans
                i18nKey="CircleLinkDeleteModal.info"
                values={{
                  role: orgData?.getRole(parentCircle?.roleId)?.name,
                  invitedRole: orgData?.getRole(invitedCircle?.roleId)?.name,
                }}
                components={{ b: <strong /> }}
              />
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              {t('common.delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
