import { UserMetadata } from '@rolebase/shared/model/user'
import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'

// Replaces the whole metadata object: merge with the current value beforehand
export async function updateUserMetadata(
  userId: string,
  metadata: UserMetadata
) {
  await adminRequest(UPDATE_USER_METADATA, { userId, metadata })
}

const UPDATE_USER_METADATA = gql(`
  mutation updateUserMetadata($userId: uuid!, $metadata: jsonb!) {
    updateUser(pk_columns: { id: $userId }, _set: { metadata: $metadata }) {
      id
    }
  }
`)
