import {
  AVATAR_GRAPH_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { Participant } from '@rolebase/shared/model/member'
import React, { useMemo } from 'react'
import settings from '../../settings'
import { NodeData } from '../../types'

interface Props {
  node: NodeData
}

const { leaderRadius, leaderGap, cardWidth, cardPadding } = settings.tree
const avatarSize = leaderRadius * 2

// Leaders of a card that shows participants instead of members
// (folded hierarchical view). Sizes are in layout units: a card is rendered at
// its layout size, so they stay proportional at any zoom scale.
export default function CardLeadersElement({ node }: Props) {
  const leaders = useMemo(
    () =>
      node.data.participants?.reduce((acc, participant) => {
        if (
          participant.leader &&
          !acc.find((other) => other.member.id === participant.member.id)
        ) {
          acc.push(participant)
        }
        return acc
      }, [] as Participant[]),
    [node.data.participants]
  )

  if (!leaders || leaders.length === 0) return null

  // Overlap the avatars when the row would overflow the card
  const maxWidth = cardWidth - 2 * cardPadding
  const step = Math.min(
    avatarSize + leaderGap,
    leaders.length > 1
      ? (maxWidth - avatarSize) / (leaders.length - 1)
      : avatarSize + leaderGap
  )
  const rowWidth = avatarSize + (leaders.length - 1) * step

  return (
    <div
      className="card-leaders"
      style={{ width: `${rowWidth}px`, height: `${avatarSize}px` }}
    >
      {leaders.map((leader, index) => (
        <div
          key={leader.member.id}
          className="card-leader"
          style={{
            left: `${index * step}px`,
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
            zIndex: leaders.length - index,
          }}
        >
          {leader.member.picture ? (
            // <img> (not a background-image) so the platform decodes it
            // asynchronously and can evict it when off-screen, bounding image
            // memory on mobile
            <img
              className="card-leader-image"
              src={getResizedImageUrl(
                leader.member.picture,
                AVATAR_GRAPH_WIDTH
              )}
              alt=""
              decoding="async"
              draggable={false}
            />
          ) : (
            <span className="card-leader-initial">
              {leader.member.name[0].toUpperCase()}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
