import React from 'react'
import useAdminSelection from '../hooks/useAdminSelection'
import AdminDrawer from './AdminDrawer'
import AdminUserPanel from './AdminUserPanel'

export default function AdminUserDrawer() {
  const { userId, close } = useAdminSelection()

  return (
    <AdminDrawer isOpen={!!userId} onClose={close}>
      {userId && <AdminUserPanel userId={userId} />}
    </AdminDrawer>
  )
}
