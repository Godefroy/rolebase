import { useEffect, useState } from 'react'

// Legacy Lexical JSON values start with '{', markdown values don't
export function isLegacyValue(value?: string): boolean {
  return !!value && value[0] === '{'
}

// Convert a legacy Lexical JSON value to markdown,
// lazy-loading the legacy editor package
export async function convertLegacyValue(value: string): Promise<string> {
  if (!isLegacyValue(value)) return value
  const { exportToMarkdown } = await import('@rolebase/editor-legacy')
  return exportToMarkdown(value)
}

// Returns the value as markdown, converting legacy Lexical JSON
// on the fly. Returns undefined while a conversion is pending.
export function useEditorValue(value: string): string | undefined {
  const [converted, setConverted] = useState<string | undefined>(() =>
    isLegacyValue(value) ? undefined : value
  )

  useEffect(() => {
    if (!isLegacyValue(value)) {
      setConverted(value)
      return
    }
    let cancelled = false
    convertLegacyValue(value).then((markdown) => {
      if (!cancelled) setConverted(markdown)
    })
    return () => {
      cancelled = true
    }
  }, [value])

  return converted
}
