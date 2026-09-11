import { useBreakpointValue } from '@chakra-ui/react'

// True on desktop (lg+), where a panel is displayed as a fixed side panel
// instead of flowing below the content.
// `ssr: false` matches the media query on the very first render, otherwise a
// freshly mounted panel renders full width for one frame before switching.
export default function useIsSidePanel() {
  return useBreakpointValue({ base: false, lg: true }, { ssr: false }) ?? false
}
