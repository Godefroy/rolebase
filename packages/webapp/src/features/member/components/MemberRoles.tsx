import { CircleMemberContext } from '@/circle/contexts/CircleMemberContext'
import CircleMemberDeleteModal from '@/circle/modals/CircleMemberDeleteModal'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BoxProps,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { MemberFragment } from '@gql'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useCurrentMember from '../hooks/useCurrentMember'
import useOrgOwner from '../hooks/useOrgOwner'
import MemberRoleItem from './MemberRoleItem'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'

interface Props extends BoxProps {
  member: MemberFragment
  hideActions?: boolean
}

export default function MemberRoles({
  member,
  hideActions,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const circles = orgData?.circles
  const circleMemberContext = useContext(CircleMemberContext)
  const currentMember = useCurrentMember()
  const isCurrentMember = currentMember?.id === member.id
  const isOwner = useOrgOwner()

  const deleteModal = useDisclosure()
  const [deleteCircleId, setDeleteCircleId] = useState<string | undefined>()

  // Get all circles and roles of member
  const memberCircles = useMemo(() => {
    if (!orgData || !circles) return []
    return circles
      .filter((circle) =>
        orgData.membersOf(circle.id).some((m) => m.member.id === member.id)
      )
      .sort((a, b) => {
        const roleA = orgData.getRole(a.roleId)
        const roleB = orgData.getRole(b.roleId)
        // Put leaders at the top
        if (roleA?.parentLink && !roleB?.parentLink) {
          return -1
        }
        if (!roleA?.parentLink && roleB?.parentLink) {
          return 1
        }
        // Sort by name
        return (roleA?.name ?? '').localeCompare(roleB?.name ?? '')
      })
  }, [member.id, circles, orgData])

  // Change URL path when a circle is selected in the accordion
  const handleFocusCircle = useCallback(
    (circleId: string) => {
      circleMemberContext?.goTo(circleId, member.id)
    },
    [circleMemberContext, member.id]
  )

  const handleDelete = useCallback(
    (circleId: string) => {
      setDeleteCircleId(circleId)
      deleteModal.onOpen()
    },
    [deleteModal]
  )

  return (
    <VStack spacing={2} align="stretch" {...boxProps}>
      {memberCircles.length === 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            {isCurrentMember ? (
              <>
                <Text>{t('MemberRoles.emptyCurrentMember.noRole')}</Text>
                {isOwner && (
                  <Text>{t('MemberRoles.emptyCurrentMember.canEdit')}</Text>
                )}
              </>
            ) : (
              <>
                <Text>
                  {t('MemberRoles.empty.noRole', { name: member.name })}
                </Text>
                {isOwner && <Text>{t('MemberRoles.empty.canEdit')}</Text>}
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {memberCircles.map((circle) => (
        <CircleProvider key={circle.id} circleId={circle.id}>
          <MemberRoleItem
            key={circle.id}
            memberId={member.id}
            circle={circle}
            hideActions={hideActions}
            onFocus={() => handleFocusCircle(circle.id)}
            onDelete={() => handleDelete(circle.id)}
          />
        </CircleProvider>
      ))}

      {deleteModal.isOpen && deleteCircleId && (
        <CircleMemberDeleteModal
          circleId={deleteCircleId}
          memberId={member.id}
          isOpen
          onClose={deleteModal.onClose}
        />
      )}
    </VStack>
  )
}
