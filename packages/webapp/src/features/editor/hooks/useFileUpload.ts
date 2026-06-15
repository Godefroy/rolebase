import { uploadFile } from '@/common/api/uploads'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useCallback } from 'react'

export default function useFileUpload() {
  const { orgId } = useOrgContext()

  const handleUpload = useCallback(
    async (file: File) => {
      if (!orgId) return ''
      return uploadFile(orgId, file)
    },
    [orgId]
  )

  return { handleUpload }
}
