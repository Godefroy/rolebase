import { Participant } from '@rolebase/shared/model/member'
import React, { useMemo } from 'react'
import { getColor } from '../../helpers/colors'
import {
  AVATAR_GRAPH_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { NodeData } from '../../types'
import { useGraphRenderContext } from '../GraphRenderContext'
import { nodeSize } from '../styles'

interface Props {
  node: NodeData
}

// Sizes relative to the node box (nodeSize represents the circle diameter)
const boxRadius = nodeSize / 2
// Avatar radius = 0.4 * circle radius
const avatarSize = nodeSize * 0.4
// Padding between avatars = 0.03 * circle radius
const avatarPadding = nodeSize * 0.015

export default function CircleLeadersElement({ node }: Props) {
  const { colorMode } = useGraphRenderContext()

  // Get participants leaders
  const leaders = useMemo(
    () =>
      node.data.participants
        ?.reduce((acc, p) => {
          if (p.leader && !acc.find((p2) => p2.member.id === p.member.id)) {
            acc.push(p)
          }
          return acc
        }, [] as Participant[])
        .reverse(),
    [node.data.participants]
  )

  if (!leaders || leaders.length === 0) return null

  const depth = node.depth + 1
  const hue = node.data.colorHue
  const bgColor = getColor(colorMode, 94, 16, depth, hue)

  // Spread avatars horizontally, kept inside the circle
  const xRange = Math.min(
    2 * (boxRadius - avatarPadding - avatarSize / 2),
    (leaders.length - 1) * (avatarSize + avatarPadding)
  )

  return (
    <div
      style={{
        position: 'relative',
        width: `${xRange + avatarSize}px`,
        height: `${avatarSize}px`,
      }}
    >
      {leaders.map((leader, i) => {
        const reverseI = leaders.length - 1 - i
        const x =
          leaders.length === 1 ? 0 : (reverseI / (leaders.length - 1)) * xRange

        return (
          <div
            key={leader.member.id}
            className="circle-leader"
            style={{
              left: `${x}px`,
              width: `${avatarSize}px`,
              height: `${avatarSize}px`,
              backgroundColor: bgColor,
            }}
          >
            {leader.member.picture ? (
              // <img> (not a background-image) so the platform decodes it
              // asynchronously and can evict it when off-screen, bounding
              // image memory on mobile. Resized: full-resolution photos
              // decode to hundreds of MB.
              <img
                className="circle-leader-image"
                src={getResizedImageUrl(
                  leader.member.picture,
                  AVATAR_GRAPH_WIDTH
                )}
                alt=""
                decoding="async"
                draggable={false}
              />
            ) : (
              <span
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  // Same on-screen size as the SVG implementation (6 graph units)
                  fontSize: `${(6 * boxRadius) / node.r}px`,
                }}
              >
                {leader.member.name[0].toUpperCase()}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
