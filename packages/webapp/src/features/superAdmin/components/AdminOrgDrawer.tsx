import React from 'react'
import useAdminSelection from '../hooks/useAdminSelection'
import AdminDrawer from './AdminDrawer'
import AdminOrgPanel from './AdminOrgPanel'

export default function AdminOrgDrawer() {
  const { orgId, close } = useAdminSelection()

  return (
    <AdminDrawer isOpen={!!orgId} onClose={close}>
      {orgId && <AdminOrgPanel orgId={orgId} />}
    </AdminDrawer>
  )
}
