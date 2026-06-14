// Generate a uuid v4, valid as a Hasura `uuid` primary key.
// Used to create entities client-side (e.g. in-memory proposal drafts) before
// they are persisted, so their ids are stable and reusable in logs/references.
export function generateId(): string {
  return globalThis.crypto.randomUUID()
}
