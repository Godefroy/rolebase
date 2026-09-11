import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { usePathInOrg } from '../hooks/usePathInOrg'

interface Props {
  to: string
  // Query string to use instead of the current one
  search?: string
}

// Redirects to a path in the current org, keeping the query string
export default function NavigateInOrg({ to, search }: Props) {
  const path = usePathInOrg(to)
  const location = useLocation()

  return (
    <Navigate
      to={{ pathname: path, search: search ?? location.search }}
      replace
    />
  )
}
