import ActionsMenu from '@/common/atoms/ActionsMenu'
import MemberAvatar from '@/member/components/MemberAvatar'
import MemberLink from '@/member/components/MemberLink'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgMember from '@/member/hooks/useOrgMember'
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  ThreadActivityFragment,
  useCreateThreadActivityReactionMutation,
  useDeleteThreadActivityReactionMutation,
} from '@gql'
import { ThreadActivityChangeStatusFragment } from '@rolebase/shared/model/thread_activity'
import { useStoreState } from '@store/hooks'
import { format } from 'date-fns'
import React, { ReactNode, useContext, useMemo } from 'react'
import { Link as ReachLink } from 'react-router'
import { ThreadContext } from '../contexts/ThreadContext'
import ActivityDeleteModal from '../modals/ActivityDeleteModal'
import ThreadActivityAnchor from './ThreadActivityAnchor'
import EmojiPicker from './reactions/EmojiPicker'
import ReactionMenuButton from './reactions/ReactionMenuButton'
import ReactionsList from './reactions/ReactionsList'

interface Props {
  activity: ThreadActivityFragment | ThreadActivityChangeStatusFragment
  onEdit?(): void
  allowDelete?: boolean
  children: ReactNode
}

export default function ThreadActivityLayout({
  activity,
  onEdit,
  allowDelete,
  children,
}: Props) {
  const { path, handleMarkUnread } = useContext(ThreadContext)!

  // Retrieve author member
  const members = useStoreState((state) => state.org.members)
  const member = useMemo(
    () => members?.find((m) => m.userId === activity.userId),
    [activity.userId, members]
  )

  // Can delete?
  const currentMember = useCurrentMember()
  const isAdmin = useOrgAdmin()
  const isUserOwner = currentMember?.userId === activity.userId
  const isMember = useOrgMember()
  const canDelete = allowDelete && (isAdmin || isUserOwner)

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  // Reactions
  const [createReaction] = useCreateThreadActivityReactionMutation()
  const [deleteReaction] = useDeleteThreadActivityReactionMutation()

  const onAddReaction = (shortcode: string) => {
    if (!currentMember) return
    const existing = activity.reactions.find(
      (r) => r.shortcode === shortcode && r.userId === currentMember.userId
    )
    if (existing) return
    createReaction({
      variables: {
        values: {
          activityId: activity.id,
          shortcode,
        },
      },
    })
  }

  const onRemoveReaction = (reactionId: string) => {
    deleteReaction({
      variables: {
        id: reactionId,
      },
    })
  }

  return (
    <Flex
      data-activity
      p={3}
      pl={6}
      _hover={{ bg: 'rgba(0, 0, 0, 0.02)' }}
      _dark={{ _hover: { bg: 'whiteAlpha.50' } }}
      role="group"
    >
      <ThreadActivityAnchor activityId={activity.id} />

      {member ? (
        <MemberAvatar member={member} noTooltip size="md" mr={3} />
      ) : (
        <Avatar name="?" size="md" mr={3} />
      )}

      <Box flex="1">
        <HStack
          spacing={1}
          borderWidth="1px"
          borderRadius="xl"
          boxShadow="sm"
          p={1}
          mt={-8}
          float="right"
          opacity={0}
          bg="white"
          _groupHover={{ opacity: 1 }}
          _dark={{
            bg: 'gray.800',
          }}
        >
          {isMember && (
            <EmojiPicker placement="left-start" onSelect={onAddReaction}>
              <ReactionMenuButton />
            </EmojiPicker>
          )}

          <ActionsMenu
            variant="ghost"
            onEdit={onEdit}
            onDelete={canDelete ? onDeleteOpen : undefined}
            onMarkUnread={() => handleMarkUnread(activity.id)}
          />
        </HStack>

        <Text>
          {member && <MemberLink id={member.id} name={member.name} />}
          <Link
            as={ReachLink}
            to={`${path}#activity-${activity.id}`}
            fontSize="sm"
            fontWeight="normal"
            ml={2}
            color="gray.400"
          >
            {format(new Date(activity.createdAt), 'HH:mm')}
          </Link>
        </Text>

        {children}

        {activity.reactions?.length > 0 && (
          <ReactionsList
            reactions={activity.reactions}
            isReadonly={!isMember}
            onAdd={onAddReaction}
            onRemove={onRemoveReaction}
          />
        )}
      </Box>

      {isDeleteOpen && (
        <ActivityDeleteModal
          isOpen
          activity={activity}
          onClose={onDeleteClose}
        />
      )}
    </Flex>
  )
}
