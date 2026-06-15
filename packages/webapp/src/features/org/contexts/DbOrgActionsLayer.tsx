import React, { ReactNode, useMemo } from 'react'
import useDbOrgEditActions from '../hooks/useDbOrgEditActions'
import { OrgContext, useOrgContext } from './OrgContext'

interface Props {
  children: ReactNode
}

// Re-provides the OrgContext with the database-backed actions merged in.
// Rendered as a child of DbOrgProvider so the action hooks (which read org data
// from the context) resolve against the data already provided above.
export default function DbOrgActionsLayer({ children }: Props) {
  const base = useOrgContext()
  const actions = useDbOrgEditActions()
  const value = useMemo(() => ({ ...base, actions }), [base, actions])
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}
