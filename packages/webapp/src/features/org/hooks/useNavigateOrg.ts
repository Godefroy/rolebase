import { useOrgContext } from '@/org/contexts/OrgContext'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export function useNavigateOrg() {
  const navigate = useNavigate()
  const { org } = useOrgContext()
  return useCallback(
    (path = '') => {
      if (!org) return
      navigate(`${getOrgPath(org)}/${path}`)
    },
    [org, navigate]
  )
}
