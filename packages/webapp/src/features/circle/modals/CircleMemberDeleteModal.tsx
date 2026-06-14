import { GraphContext } from '@/graph/contexts/GraphContext'
import useMember from '@/member/hooks/useMember'
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
import { useOrgEditActions } from '@/org/contexts/OrgEditContext'
import useCircle from '../hooks/useCircle'

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
  const circle = useCircle(circleId)
  const member = useMember(memberId)
  const { removeCircleMember } = useOrgEditActions()
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
                values={{ role: circle?.role.name, member: member?.name }}
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
