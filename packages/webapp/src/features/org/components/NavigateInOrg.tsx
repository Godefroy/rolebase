import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { usePathInOrg } from '../hooks/usePathInOrg'

interface Props {
  to: string
}

// Redirects to a path in the current org, keeping the query string
export default function NavigateInOrg({ to }: Props) {
  const path = usePathInOrg(to)
  const { search } = useLocation()

  return <Navigate to={{ pathname: path, search }} replace />
}
