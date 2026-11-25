import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { SidebarContext } from '../contexts/SidebarContext'

export interface SidebarLinkProps {
  to: string
  // Path prefix of the section, when it differs from the link (default: to)
  activePath?: string
  children: (isExact: boolean, isStart: boolean) => React.ReactNode
}

export default function SidebarLink({
  to,
  activePath,
  children,
}: SidebarLinkProps) {
  const location = useLocation()
  const sidebarContext = useContext(SidebarContext)

  const toPathname = to.match(/^[^?]*/)![0]
  const isExact = location.pathname === toPathname
  const isStart = location.pathname.startsWith(activePath ?? toPathname)

  return (
    <Link to={to} tabIndex={-1} onClick={sidebarContext?.expand.onClose}>
      {children(isExact, isStart)}
    </Link>
  )
}
