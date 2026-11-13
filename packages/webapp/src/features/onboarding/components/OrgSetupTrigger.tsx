import { useOrgContext } from '@/org/contexts/OrgContext'
import React, { useEffect, useState } from 'react'
import { isOrgFresh } from '../isOrgFresh'
import OrgSetupModal from '../modals/OrgSetupModal'

// Opens the org-setup step while its steps are still to do (see isOrgFresh),
// at every visit: the setup is mandatory. Derived from the already-subscribed
// org data, so it needs no extra query and survives reloads. Once opened it
// stays open until the user finishes (the members step stores the model, which
// would otherwise flip the condition mid-flow).
export default function OrgSetupTrigger() {
  const { org, orgData } = useOrgContext()
  const isFresh = isOrgFresh(org, orgData)

  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (isFresh) setOpen(true)
  }, [isFresh])

  if (!open) return null

  return <OrgSetupModal onClose={() => setOpen(false)} />
}
