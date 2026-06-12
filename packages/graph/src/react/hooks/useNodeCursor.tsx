import { useCallback, useEffect, useRef, useState } from 'react'
import { Graph } from '../../core/Graph'

export function useNodeCursor(graph?: Graph) {
  const [cursor, setCursor] = useState('pointer')
  const cursorRef = useRef('pointer')

  const updateCursor = useCallback(
    (event: KeyboardEvent) => {
      if (!graph) return
      const {
        onCircleClick,
        onCircleMove,
        onCircleCopy,
        onMemberClick,
        onMemberMove,
        onMemberAdd,
      } = graph.params.events
      const canClick = !!(onCircleClick && onMemberClick)
      const canMove = !!(onCircleMove && onMemberMove)
      const canCopy = !!(onCircleCopy && onMemberAdd)

      const shift = event.shiftKey
      const ctrl = event.ctrlKey || event.metaKey
      let cursor = cursorRef.current

      if (canCopy && ctrl && shift) {
        cursor = 'copy'
      } else if (canMove && ctrl) {
        cursor = 'grab'
      } else if (canClick) {
        cursor = 'pointer'
      } else {
        cursor = 'default'
      }
      if (cursorRef.current !== cursor) {
        cursorRef.current = cursor
        setCursor(cursor)
      }
    },
    [graph]
  )

  useEffect(() => {
    document.addEventListener('keydown', updateCursor)
    document.addEventListener('keyup', updateCursor)
    return () => {
      document.removeEventListener('keydown', updateCursor)
      document.removeEventListener('keyup', updateCursor)
    }
  }, [updateCursor])

  return cursor
}
