import { useUpdateOrgMutation } from '@gql'
import { nhost } from 'src/nhost'

// Upload an image file as the org icon and save it on the org
export default function useUploadOrgIcon() {
  const [updateOrg] = useUpdateOrgMutation()

  return async (orgId: string, file: Blob) => {
    const { body } = await nhost.storage.uploadFiles({
      'file[]': [file],
      'metadata[]': [{ name: `orgs/${orgId}/icon` }],
    })
    const fileId = body.processedFiles[0].id
    const iconUrl = `${nhost.storage.baseURL}/files/${fileId}`
    await updateOrg({
      variables: { id: orgId, values: { icon: iconUrl, iconFileId: fileId } },
    })
  }
}
