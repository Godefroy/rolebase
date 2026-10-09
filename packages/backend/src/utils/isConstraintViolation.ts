// Whether a Hasura request failed on a unique or foreign key constraint, as
// opposed to a network or server failure
export function isConstraintViolation(error: unknown): boolean {
  const errors = (error as any)?.body?.errors
  return (
    Array.isArray(errors) &&
    errors.some((e) => e?.extensions?.code === 'constraint-violation')
  )
}
