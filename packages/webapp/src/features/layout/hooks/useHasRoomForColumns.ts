import useWindowSize from '@/common/hooks/useWindowSize'
import { useContext } from 'react'
import { SidebarContext } from '../contexts/SidebarContext'

// True when the page content, next to the sidebar, is at least minWidth wide:
// enough room to show a list and a detail side by side
export default function useHasRoomForColumns(minWidth: number) {
  const windowSize = useWindowSize()
  const sidebarContext = useContext(SidebarContext)
  if (!sidebarContext || sidebarContext.isMobile) return false
  return windowSize.width - sidebarContext.width >= minWidth
}
