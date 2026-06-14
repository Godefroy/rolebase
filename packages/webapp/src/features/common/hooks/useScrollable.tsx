import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export enum ScrollPosition {
  None, // Not enough content to scroll
  Top,
  Bottom,
  Middle,
}

export type Scrollable = ReturnType<typeof useScrollable>

// Provided by ScrollableLayout so its children can drive the scroll
export const ScrollableContext = createContext<Scrollable | undefined>(undefined)

export default function useScrollable() {
  // Scroll state
  const [isScrollable, setIsScrollable] = useState(false)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(
    ScrollPosition.Top
  )

  // Ref to keep following functions deps empty
  const scrollPositionRef = useRef(scrollPosition)

  const setPosition = (position: ScrollPosition) => {
    setScrollPosition(position)
    scrollPositionRef.current = position
  }

  // Elements should be there at first render for their refs to be available
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll: React.UIEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
      if (scrollTop === 0) {
        setPosition(ScrollPosition.Top)
      } else if (scrollTop + clientHeight + 1 < scrollHeight) {
        if (scrollPositionRef.current !== ScrollPosition.Middle) {
          setPosition(ScrollPosition.Middle)
        }
      } else {
        setPosition(ScrollPosition.Bottom)
      }
    },
    []
  )

  // Keep pinning to the bottom for a short window after a scrollToBottom call,
  // so content that finishes rendering right after (markdown, links, async
  // cards) doesn't leave a gap. A smooth scroll aims at the height captured at
  // call time; without this window, later growth (and the intermediate Middle
  // positions the animation reports) would stop the ResizeObserver from re-pinning.
  const forceBottomRef = useRef(false)
  const forceBottomTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Scroll all the way to the bottom.
  const scrollToBottom = useCallback((smooth = false) => {
    const container = containerRef.current
    if (!container) return
    setPosition(ScrollPosition.Bottom)
    forceBottomRef.current = true
    if (forceBottomTimeoutRef.current) clearTimeout(forceBottomTimeoutRef.current)
    forceBottomTimeoutRef.current = setTimeout(() => {
      forceBottomRef.current = false
    }, 700)
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }, [])

  // Scroll to bottom when content size changes and scroll position in set to bottom
  useEffect(() => {
    const content = contentRef?.current
    const container = containerRef?.current
    if (!content || !container) {
      console.error('useScrollable: content or container ref is null')
      return
    }

    const onResize = () =>
      // Wait for layout to be done
      setTimeout(() => {
        // Keep scroll position at bottom
        const scrollable = container.scrollHeight !== container.clientHeight
        setIsScrollable(scrollable)
        const atBottom =
          scrollPositionRef.current === ScrollPosition.Bottom ||
          forceBottomRef.current
        if (scrollable && atBottom) {
          container.scrollTop = container.scrollHeight - container.clientHeight
          // Re-assert Bottom: a smooth animation may have reported Middle
          if (forceBottomRef.current) setPosition(ScrollPosition.Bottom)
        }
      }, 0)

    // Observe content size to detect scrollHeight change
    const observer = new ResizeObserver(onResize)
    observer.observe(content)
    return () => {
      observer.disconnect()
      if (forceBottomTimeoutRef.current) {
        clearTimeout(forceBottomTimeoutRef.current)
      }
    }
  }, [])

  return {
    containerRef,
    contentRef,
    isScrollable,
    scrollPosition,
    handleScroll,
    scrollToBottom,
  }
}
