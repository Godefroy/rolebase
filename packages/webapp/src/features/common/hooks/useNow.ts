import { useEffect, useState } from 'react'

// Current date, refreshed at the given interval
export default function useNow(intervalMs = 60000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(interval)
  }, [intervalMs])

  return now
}
