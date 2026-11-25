import PageCloseButton from '@/common/atoms/PageCloseButton'
import useOverflowHidden from '@/common/hooks/useOverflowHidden'
import Page404 from '@/common/pages/Page404'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import ThreadContent from '../components/ThreadContent'

type Params = {
  threadId: string
}

// Thread detail, next to the threads list (desktop) or in its place (mobile)
export default function ThreadPage() {
  useOverflowHidden()
  const { threadId } = useParams<Params>()
  const navigate = useNavigate()
  const location = useLocation()
  const threadsPath = usePathInOrg('threads')

  // Back to the list, keeping its filters
  const handleClose = () => navigate(`${threadsPath}${location.search}`)

  if (!threadId) return <Page404 />

  return (
    <ThreadContent
      id={threadId}
      changeTitle
      headerIcons={<PageCloseButton onClick={handleClose} />}
    />
  )
}
