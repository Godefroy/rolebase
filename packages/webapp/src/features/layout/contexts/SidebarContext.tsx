import { useDisclosure, useMediaQuery } from '@chakra-ui/react'
import { UserLocalStorageKeys } from '@utils/localStorage'
import debounce from 'lodash.debounce'
import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

// Width of sidebar
const sidebarMinWidth = 250
const sidebarMaxWidth = 600
export const defaultSidebarWidth = 336

// Width of the collapsed sidebar (icons only)
export const collapsedSidebarWidth = 64

// Duration of the collapse and expand transition
export const sidebarTransitionMs = 200

export const getSidebarWidth = () => {
  const retrievedSidebarWidth = localStorage.getItem(
    UserLocalStorageKeys.SidebarWidth
  )
  return retrievedSidebarWidth
    ? parseInt(retrievedSidebarWidth, 0)
    : defaultSidebarWidth
}

// Top bar height on mobile
export const defaultSidebarHeight = 50

interface SidebarContextValue {
  isMobile: boolean
  // Mobile: menu opened below the top bar
  expand: ReturnType<typeof useDisclosure>
  // Desktop: sidebar collapsed to icons
  collapsed: boolean
  toggleCollapse(): void
  // Collapse or expand transition in progress
  animating: boolean
  // Icons only: collapsed sidebar (desktop) or top bar (mobile)
  compact: boolean
  // Width of the sidebar itself, animated
  sidebarWidth: number
  // Width of the expanded sidebar (resizable)
  expandedWidth: number
  // Space taken on the left of the page
  width: number
  height: number
  setWidth(width: number): void
  setHeight(height: number): void
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
)

interface SidebarProviderProps {
  children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const expand = useDisclosure()
  const [width, setWidth] = useState<number>(getSidebarWidth)
  const [height, setHeight] = useState<number>(0)

  // Collapsed state, remembered in this browser
  const collapse = useDisclosure({
    defaultIsOpen:
      localStorage.getItem(UserLocalStorageKeys.SidebarCollapsed) === '1',
    onOpen: () =>
      localStorage.setItem(UserLocalStorageKeys.SidebarCollapsed, '1'),
    onClose: () =>
      localStorage.removeItem(UserLocalStorageKeys.SidebarCollapsed),
  })

  // Collapse and expand transition in progress: the page margin follows the
  // narrow sidebar, and the content switches to icons once it's collapsed
  const [animating, setAnimating] = useState(false)
  const animationTimeout = useRef<ReturnType<typeof setTimeout>>()
  const toggleCollapse = useCallback(() => {
    collapse.onToggle()
    setAnimating(true)
    clearTimeout(animationTimeout.current)
    animationTimeout.current = setTimeout(
      () => setAnimating(false),
      sidebarTransitionMs
    )
  }, [collapse.onToggle])

  const saveWidth = debounce((width: number) => {
    localStorage.setItem(UserLocalStorageKeys.SidebarWidth, `${width}`)
  }, 500)

  const handleSetWidth = useCallback((width: number) => {
    if (width > 0) {
      width = Math.max(sidebarMinWidth, Math.min(sidebarMaxWidth, width))
      saveWidth(width)
    }
    setWidth(width)
  }, [])

  // Show different layout for small screens
  // Options are then hidden by default
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const value = useMemo(
    () => ({
      isMobile,
      expand,
      collapsed: collapse.isOpen,
      toggleCollapse,
      animating,
      compact: isMobile ? !expand.isOpen : collapse.isOpen && !animating,
      sidebarWidth: isMobile
        ? 0
        : collapse.isOpen
          ? collapsedSidebarWidth
          : width,
      expandedWidth: width,
      width: isMobile
        ? 0
        : collapse.isOpen || animating
          ? collapsedSidebarWidth
          : width,
      height: isMobile ? defaultSidebarHeight : 0,
      setWidth: handleSetWidth,
      setHeight,
    }),
    [expand.isOpen, collapse.isOpen, animating, isMobile, width, height]
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}
