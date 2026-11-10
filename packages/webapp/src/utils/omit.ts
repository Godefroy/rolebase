// Keys are not restricted to keyof T so that runtime-only fields
// returned by Apollo (e.g. __typename) can be removed too.
export function omit<T, K extends PropertyKey>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result: any = { ...obj }
  keys.forEach((key) => delete result[key])
  return result
}
