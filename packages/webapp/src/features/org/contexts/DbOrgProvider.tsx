import {
  Governance_Mode_Enum,
  OrgDataFragment,
  useOrgBySlugSubscription,
  useOrgSubscription,
} from '@gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { omit } from '@utils/omit'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'
import DbOrgActionsLayer from './DbOrgActionsLayer'
import {
  noopOrgEditActions,
  OrgContext,
  OrgContextValue,
} from './OrgContext'

interface Props {
  orgId?: string
  slug?: string
  children: ReactNode
}

// Database-backed org data: subscribes to the org (by id or slug), indexes it
// into the single OrgData object, and replaces the former global org store.
// Actions are injected by the nested DbOrgActionsLayer.
export default function DbOrgProvider({ orgId, slug, children }: Props) {
  const {
    data: dataId,
    error: errorId,
    loading: loadingId,
  } = useOrgSubscription({ skip: !orgId, variables: { id: orgId! } })
  const {
    data: dataSlug,
    error: errorSlug,
    loading: loadingSlug,
  } = useOrgBySlugSubscription({ skip: !slug, variables: { slug: slug! } })

  const result = dataId?.org_by_pk ?? dataSlug?.org[0]
  const error = errorId ?? errorSlug
  const loading = loadingId || loadingSlug
  const resolvedOrgId = orgId ?? result?.id

  const orgData = useMemo<OrgData | undefined>(
    () =>
      result
        ? new OrgData(
            result.circles,
            result.circleMembers,
            result.circleLinks,
            result.roles,
            result.members
          )
        : undefined,
    [result]
  )

  const org = useMemo(
    () =>
      result
        ? omit(
            result,
            'members',
            'roles',
            'circles',
            'circleMembers',
            'circleLinks',
            'org_subscription'
          )
        : undefined,
    [result]
  )

  const subscription = result?.org_subscription ?? undefined
  const governanceMode = org?.governanceMode ?? Governance_Mode_Enum.Free

  // Stable getters read the latest data via refs (safe inside async callbacks)
  const dataRef = useRef<OrgData | undefined>(undefined)
  dataRef.current = orgData
  const resultRef = useRef<OrgDataFragment | undefined>(undefined)
  resultRef.current = result ?? undefined

  const getOrgData = useCallback(() => dataRef.current, [])
  const getOrgResult = useCallback(() => resultRef.current, [])

  const value = useMemo<OrgContextValue>(
    () => ({
      orgData,
      roleOverlays: undefined,
      orgId: resolvedOrgId,
      org,
      subscription,
      governanceMode,
      editable: true,
      isDraft: false,
      loading,
      error,
      ready: !!orgData,
      getOrgData,
      getOrgResult,
      actions: noopOrgEditActions,
    }),
    [
      orgData,
      resolvedOrgId,
      org,
      subscription,
      governanceMode,
      loading,
      error,
      getOrgData,
      getOrgResult,
    ]
  )

  return (
    <OrgContext.Provider value={value}>
      <DbOrgActionsLayer>{children}</DbOrgActionsLayer>
    </OrgContext.Provider>
  )
}
