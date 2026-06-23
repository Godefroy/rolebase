import { useOrgContext } from '@/org/contexts/OrgContext'
import React, { useEffect, useState } from 'react'
import { isOrgFresh } from '../isOrgFresh'
import OrgSetupModal from '../modals/OrgSetupModal'

// Opens the org-setup step for a freshly created org: one that still has only
// its root circle and no base role yet (i.e. it hasn't been seeded). Derived
// from the already-subscribed org data, so it needs no extra query and survives
// reloads. Once opened it stays open until the user finishes (seeding adds base
// roles, which would otherwise flip the condition mid-flow).
export default function OrgSetupTrigger() {
  const { orgData } = useOrgContext()
  const isFresh = isOrgFresh(orgData)

  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (isFresh) setOpen(true)
  }, [isFresh])

  if (!open) return null

  return <OrgSetupModal onClose={() => setOpen(false)} />
}
