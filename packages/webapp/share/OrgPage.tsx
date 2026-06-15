import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import { CircleMemberContext } from '@/circle/contexts/CircleMemberContext'
import BrandLogo from '@/common/atoms/BrandLogo'
import Loading from '@/common/atoms/Loading'
import { useElementSize } from '@/common/hooks/useElementSize'
import useOverflowHidden from '@/common/hooks/useOverflowHidden'
import useQueryParams from '@/common/hooks/useQueryParams'
import Page404 from '@/common/pages/Page404'
import CirclesGraph from '@/graph/CirclesGraph'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import { CirclesGraphViews, GraphEvents } from '@/graph/types'
import ReadonlyOrgProvider from '@/org/contexts/ReadonlyOrgProvider'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { Box } from '@chakra-ui/react'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import settings from 'src/settings'
import { trpc } from 'src/trpc'
import CircleCard from './CircleCard'
import MemberCard from './MemberCard'
import ModalPanel from './ModalPanel'

type Params = {
  orgId: string
  view: CirclesGraphViews
  zoom: string
}

export default function OrgPage() {
  useOverflowHidden()

  const queryParams = useQueryParams<Params>()

  const [data, setData] = useState<
    Awaited<ReturnType<typeof trpc.org.getPublicData.query>> | undefined
  >(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (!queryParams.orgId) return
    trpc.org.getPublicData
      .query({ orgId: queryParams.orgId })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [queryParams.orgId])

  if (error) {
    // Don't display error for user, only in console
    console.error(error)
  }

  // Graph view
  const view =
    queryParams.view && CirclesGraphViews[queryParams.view]
      ? queryParams.view
      : CirclesGraphViews.AllCircles

  // Build read-only org data from the public payload (in-memory, never edited).
  const orgData = useMemo<OrgData | undefined>(() => {
    const orgId = queryParams.orgId ?? ''
    if (!data) return undefined

    const members = data.members.map((m) => ({
      ...m,
      archived: false,
      description: '',
    }))
    const circles = data.circles.map((c) => ({
      id: c.id,
      orgId,
      roleId: c.roleId,
      parentId: c.parentId,
      archived: false,
    }))
    const circleMembers = data.circles.flatMap((c) =>
      c.members.map((m) => ({
        id: m.id,
        orgId,
        circleId: c.id,
        memberId: m.memberId,
        createdAt: '',
        archived: false,
      }))
    )
    const circleLinks = data.circles.flatMap((c) =>
      c.invitedCircleLinks.map((l) => ({
        id: l.id,
        orgId,
        parentId: c.id,
        circleId: l.invitedCircle.id,
        createdAt: '',
        archived: false,
      }))
    )

    return new OrgData(circles, circleMembers, circleLinks, data.roles, members)
  }, [data, queryParams.orgId])

  // Selected circle & member
  const { circleId, memberId, parentId, goTo } =
    useContext(CircleMemberContext)!

  const events: GraphEvents = useMemo(
    () => ({
      onCircleClick: goTo,
      onMemberClick: goTo,
      onClickOutside: () => goTo(),
    }),
    []
  )

  // Content size
  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)

  return (
    <ReadonlyOrgProvider orgData={orgData} orgId={queryParams.orgId}>
      <GraphProvider>
        <Box
          ref={boxRef}
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="100vh"
          overflow="hidden"
        >
          <Box position="absolute" zIndex={1} top={5} left={5}>
            <a href={settings.websiteUrl} target="_blank" rel="noreferrer">
              <BrandLogo size="sm" />
            </a>
          </Box>

          {loading ? (
            <Loading center active />
          ) : (
            !data?.circles[0] && <Page404 to={settings.websiteUrl} />
          )}

          {orgData && boxSize && (
            <CirclesGraph
              view={view}
              org={orgData}
              events={events}
              width={boxSize.width}
              height={boxSize.height}
              selectedCircleId={parentId ? `${parentId}_${circleId}` : circleId}
              panzoomDisabled={queryParams.zoom === undefined}
            />
          )}

          {memberId ? (
            <ModalPanel isOpen onClose={goTo}>
              <MemberCard id={memberId} selectedCircleId={circleId} />
            </ModalPanel>
          ) : (
            circleId && (
              <ModalPanel isOpen onClose={goTo}>
                <CircleProvider circleId={circleId}>
                  <CircleCard id={circleId} />
                </CircleProvider>
              </ModalPanel>
            )
          )}
        </Box>
      </GraphProvider>
    </ReadonlyOrgProvider>
  )
}
