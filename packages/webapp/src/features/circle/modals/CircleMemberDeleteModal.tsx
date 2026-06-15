import { GraphContext } from '@/graph/contexts/GraphContext'
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
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  circleId: string
  memberId: string
  onDelete?(): void
}

export default function CircleMemberDeleteModal({
  circleId,
  memberId,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const { removeCircleMember } = useOrgEditActions()
  const { orgData } = useOrgContext()
  const circle = orgData?.getCircle(circleId)
  const member = orgData?.getMember(memberId)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const graphContext = useContext(GraphContext)

  const handleDelete = async () => {
    if (!circle || !member) return
    await removeCircleMember(circleId, memberId)
    onDelete?.()
    alertProps.onClose()

    // Focus circle in graph
    graphContext?.graph?.focusNodeIdAfterData(circleId, true)
  }

  return (
    <AlertDialog {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t('CircleMemberDeleteModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              <Trans
                i18nKey="CircleMemberDeleteModal.info"
                values={{ role: orgData?.getRole(circle?.roleId)?.name, member: member?.name }}
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
