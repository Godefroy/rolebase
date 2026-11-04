let queue: Promise<unknown> = Promise.resolve()

// Run memory-heavy tasks (org exports) one at a time, so that they don't add up
// and exceed the container memory limit
export function runExclusive<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task)
  queue = result.catch(() => undefined)
  return result
}
