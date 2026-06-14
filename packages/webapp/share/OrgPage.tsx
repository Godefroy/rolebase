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
import { OrgEditProvider } from '@/org/contexts/OrgEditContext'
import useDbOrgEditActions from '@/org/hooks/useDbOrgEditActions'
import { Box } from '@chakra-ui/react'
import { useStoreActions, useStoreState } from '@store/hooks'
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

  // Fetch public data of organization
  const actions = useStoreActions((actions) => ({
    setCurrentId: actions.org.setCurrentId,
    setSubscriptionResult: actions.org.setSubscriptionResult,
  }))

  useEffect(() => {
    if (!queryParams.orgId || !data?.circles[0]) return

    actions.setCurrentId(queryParams.orgId)

    actions.setSubscriptionResult({
      // Enrich data with empty values to match interfaces
      result: data
        ? {
            id: queryParams.orgId,
            archived: false,
            createdAt: new Date().toISOString(),
            name: 'Org',
            defaultGraphView: view,
            shareMembers: true,
            shareOrg: true,
            protectGovernance: false,
            circles: data.circles.map((c) => ({
              ...c,
              archived: false,
              members: c.members.map((m) => ({
                ...m,
                archived: false,
              })),
            })),
            roles: data.roles,
            members: data.members.map((m) => ({
              ...m,
              archived: false,
              description: '',
            })),
          }
        : undefined,
      loading: false,
      error,
    })
  }, [queryParams.orgId, data])

  // Graph view
  const view =
    queryParams.view && CirclesGraphViews[queryParams.view]
      ? queryParams.view
      : CirclesGraphViews.AllCircles

  // Selected circle & member
  const { circleId, memberId, parentId, goTo } =
    useContext(CircleMemberContext)!

  // Data
  const circles = useStoreState((state) => state.org.circles)
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
  const dbEditActions = useDbOrgEditActions()

  return (
    <OrgEditProvider value={dbEditActions}>
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

        {circles && boxSize && (
          <CirclesGraph
            view={view}
            circles={circles}
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
    </OrgEditProvider>
  )
}
