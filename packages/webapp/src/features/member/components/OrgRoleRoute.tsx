import Page404 from '@/common/pages/Page404'
import { useOrgContext } from '@/org/contexts/OrgContext'
import React from 'react'
import { Outlet } from 'react-router'
import useOrgAdmin from '../hooks/useOrgAdmin'
import useOrgOwner from '../hooks/useOrgOwner'

interface Props {
  role: 'admin' | 'owner'
}

// Renders nested routes only for admins/owners of the current org, 404 otherwise
export default function OrgRoleRoute({ role }: Props) {
  const { orgData } = useOrgContext()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()

  // Wait for org data before deciding
  if (!orgData) return null

  const isAllowed = role === 'owner' ? isOwner : isAdmin
  return isAllowed ? <Outlet /> : <Page404 />
}
