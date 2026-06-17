import { gql } from '../../../../gql'
import { adminRequest } from '../../../../utils/adminRequest'
import { nhost } from '../../../../utils/nhost'

export async function saveFile(
  name: string,
  buffer: Uint8Array
): Promise<{ fileId: string; url: string }> {
  // Check if file already exists
  const { files } = await adminRequest(
    gql(`
      query GetFileByName($name: String!) {
        files(where: { name: { _eq: $name } }) {
          id
        }
      }
    `),
    { name }
  )
  if (files[0]) {
    const fileId = files[0].id
    console.log(`Retrieved file ${fileId}: ${name}`)
    return {
      fileId,
      url: `${nhost.storage.baseURL}/files/${fileId}`,
    }
  }

  // Upload file to Nhost Storage
  const { body } = await nhost.storage.uploadFiles({
    'file[]': [new Blob([new Uint8Array(buffer)])],
    'metadata[]': [{ name }],
  })
  const fileId = body.processedFiles[0].id
  const url = `${nhost.storage.baseURL}/files/${fileId}`

  console.log(`Imported file ${fileId}: ${name}`)
  return { fileId, url }
}
