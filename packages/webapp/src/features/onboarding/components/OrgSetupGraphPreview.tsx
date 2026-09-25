import { useElementSize } from '@/common/hooks/useElementSize'
import CirclesGraph from '@/graph/CirclesGraph'
import { CirclesGraphViews, GraphEvents } from '@/graph/types'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, useColorMode } from '@chakra-ui/react'
import { CircleFragment, CircleMemberFragment, RoleSummaryFragment } from '@gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import React, { useMemo, useRef } from 'react'
import { RoleDraft } from '../modals/orgSetupTypes'

interface Props {
  roles: RoleDraft[]
}

// The preview is illustrative: clicks do nothing
const events: GraphEvents = {
  onCircleClick: () => {},
  onMemberClick: () => {},
}

// Live org chart of the roles being defined, built in memory from the drafts
// on top of the real root circle and members. Nothing is written before the
// setup is finished.
export default function OrgSetupGraphPreview({ roles }: Props) {
  const { colorMode } = useColorMode()
  const { orgData } = useOrgContext()
  const boxRef = useRef<HTMLDivElement>(null)
  const size = useElementSize(boxRef)

  const previewData = useMemo(() => {
    const rootCircle = orgData?.circles.find((c) => !c.parentId)
    if (!orgData || !rootCircle) return undefined

    // The leader base role shows as such: a single-member role linked to its
    // parent, in the color the seeding gives it
    const draftRoles: RoleSummaryFragment[] = roles.map((role) => ({
      id: `draft-role-${role.id}`,
      base: !!role.isLeaderBaseRole,
      name: role.name,
      singleMember: !!role.isLeaderBaseRole,
      parentLink: !!role.isLeaderBaseRole,
      colorHue: role.isLeaderBaseRole ? 0 : null,
    }))
    const draftCircles: CircleFragment[] = roles.map((role) => ({
      id: `draft-circle-${role.id}`,
      orgId: rootCircle.orgId,
      roleId: `draft-role-${role.id}`,
      parentId: rootCircle.id,
      archivedAt: null,
    }))
    const draftCircleMembers: CircleMemberFragment[] = roles.flatMap((role) =>
      [role.responsibleId, ...role.participantIds]
        .filter((memberId): memberId is string => !!memberId)
        .map((memberId) => ({
          id: `draft-member-${role.id}-${memberId}`,
          orgId: rootCircle.orgId,
          circleId: `draft-circle-${role.id}`,
          memberId,
          createdAt: '',
          archivedAt: null,
        }))
    )

    return new OrgData({
      circles: [rootCircle, ...draftCircles],
      circleMembers: draftCircleMembers,
      circleLinks: [],
      roles: [...orgData.roles, ...draftRoles],
      members: [...orgData.members],
      governanceMode: orgData.governanceMode,
    })
  }, [orgData, roles])

  // The frame has a fixed height and the graph sits in an absolute, borderless
  // box: its size never feeds back into the layout it is measured from (a
  // measured box with a border grew by 2px on every resize).
  return (
    <Box
      position="relative"
      h="460px"
      borderRadius="lg"
      borderWidth="1px"
      overflow="hidden"
      aria-hidden
    >
      <Box
        ref={boxRef}
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
      >
        {previewData && size && (
          <CirclesGraph
            key={colorMode}
            view={CirclesGraphViews.Circles}
            org={previewData}
            events={events}
            width={size.width}
            height={size.height}
            showAllNodes
          />
        )}
      </Box>
    </Box>
  )
}
