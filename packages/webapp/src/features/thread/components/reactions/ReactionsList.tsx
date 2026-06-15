import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { HStack } from '@chakra-ui/react'
import { ThreadActivityReactionFragment } from '@gql'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import EmojiPicker, { findEmoji } from './EmojiPicker'
import ReactionAddButton from './ReactionAddButton'
import ReactionButton from './ReactionButton'

interface Props {
  reactions: ThreadActivityReactionFragment[]
  isReadonly?: boolean
  onAdd: (shortcode: string) => void
  onRemove: (reactionId: string) => void
}

interface ReactionsAggregate {
  shortcode: string
  emoji: string
  count: number
  usernames: string[]
  // Reaction ID for the current user if there is one
  idForUser?: string
}

export default function ReactionsList({
  reactions,
  isReadonly,
  onAdd,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const currentMember = useCurrentMember()
  const members = useOrgContext().orgData?.members

  // Aggregate reactions by emoji
  const reactionsAgg = useMemo(
    () =>
      reactions.reduce((acc, r) => {
        const member = members?.find((m) => m.userId === r.userId)
        if (!member) return acc

        const existing = acc.find((e) => e.shortcode === r.shortcode)
        const isUser = r.userId === currentMember?.userId

        if (existing) {
          existing.count++
          if (isUser) {
            existing.idForUser = r.id
          } else {
            existing.usernames.push(member.name)
          }
        } else {
          const emoji = findEmoji(r.shortcode)
          if (!emoji || !emoji.skins[0]) return acc
          acc.push({
            shortcode: r.shortcode,
            emoji: emoji.skins[0].native,
            count: 1,
            usernames: isUser ? [] : [member.name],
            idForUser: isUser ? r.id : undefined,
          })
        }
        return acc
      }, [] as ReactionsAggregate[]),
    [reactions, currentMember, members]
  )

  return (
    <HStack spacing={1} mt={1} flexWrap="wrap">
      {reactionsAgg.map(({ shortcode, emoji, count, usernames, idForUser }) => {
        return (
          <ReactionButton
            key={shortcode}
            leftIcon={<>{emoji}</>}
            isActive={!!idForUser}
            isDisabled={isReadonly}
            tooltip={(idForUser
              ? [t('common.you'), ...usernames]
              : usernames
            ).join(', ')}
            onClick={() => (idForUser ? onRemove(idForUser) : onAdd(shortcode))}
          >
            {count}
          </ReactionButton>
        )
      })}

      {!isReadonly && (
        <EmojiPicker placement="right-start" onSelect={onAdd}>
          <ReactionAddButton />
        </EmojiPicker>
      )}
    </HStack>
  )
}
