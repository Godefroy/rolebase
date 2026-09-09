import useGraphViewParam, {
  GraphViewParams,
  setGraphViewParams,
} from '@/graph/hooks/useGraphViewParam'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { useDisclosure } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CircleMemberModal from '../modals/CircleMemberModal'
import {
  CircleMemberContext,
  CircleMemberContextValue,
} from './CircleMemberContext'

interface State {
  circleId?: string
  memberId?: string
  parentId?: string
}

export function getCircleMemberUrlSearch(
  circleId?: string,
  memberId?: string,
  parentId?: string,
  // Graph view to keep across the navigation (see useGraphViewParam)
  graphView?: GraphViewParams
) {
  const params = new URLSearchParams()
  if (circleId) params.set('circleId', circleId)
  if (memberId) params.set('memberId', memberId)
  if (parentId) params.set('parentId', parentId)
  setGraphViewParams(params, graphView)
  const search = params.toString()
  return search ? `?${search}` : ''
}

interface Props {
  children: React.ReactNode
}

export function CircleMemberProvider({ children }: Props) {
  const navigateOrg = useNavigateOrg()
  const graphView = useGraphViewParam()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState] = useState<State>({})
  const [canFocus, setCanFocus] = useState(false)

  const value: CircleMemberContextValue = useMemo(
    () => ({
      circleId: state.circleId,
      memberId: state.memberId,
      parentId: state.parentId,
      canFocus,
      goTo(circleId?: string, memberId?: string, parentId?: string) {
        setState({ circleId, memberId, parentId })
      },
    }),
    [state, canFocus]
  )

  // Navigate to page/modal after state change
  useEffect(() => {
    if (!state.circleId && !state.memberId) return

    if (!canFocus) {
      // Open modal
      onOpen()
      return
    }

    // Navigate to circle member page
    navigateOrg(
      `roles${getCircleMemberUrlSearch(
        state.circleId,
        state.memberId,
        state.parentId,
        graphView
      )}`
    )
    // Reset state
    setState({})
  }, [state])

  // Change canFocus when location changes or modal opens/closes
  const computeCanFocus = () => {
    const isGraphPage = /\/(roles|news)$/.test(window.location.pathname)
    const hasModal = !!document.getElementsByClassName(
      'chakra-modal__content'
    )[0]
    return isGraphPage && !hasModal
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCanFocus(computeCanFocus())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleModalClose = useCallback(() => {
    onClose()
    setState({})
  }, [])

  return (
    <CircleMemberContext.Provider value={value}>
      {children}

      {isOpen && (
        <CircleMemberModal
          circleId={state.circleId}
          memberId={state.memberId}
          isOpen
          onClose={handleModalClose}
        />
      )}
    </CircleMemberContext.Provider>
  )
}
