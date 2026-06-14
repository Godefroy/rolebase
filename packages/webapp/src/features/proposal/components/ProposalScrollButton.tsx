import { Button, Flex } from '@chakra-ui/react'
import { Thread_Activity_Type_Enum } from '@gql'
import { ThreadActivityDataProposal } from '@rolebase/shared/model/proposal'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ThreadContext } from '@/thread/contexts/ThreadContext'
import { ChevronUpIcon } from 'src/icons'
import { scrollAndHighlightActivity } from '@/thread/utils/scrollAndHighlightActivity'

// Floating button that scrolls to the last in-progress proposal when it is not
// visible on screen.
export default function ProposalScrollButton() {
  const { t } = useTranslation()
  const { activities } = useContext(ThreadContext)!

  // Last in-progress proposal
  const proposal = useMemo(() => {
    if (!activities) return undefined
    return [...activities]
      .reverse()
      .find(
        (a) =>
          a.type === Thread_Activity_Type_Enum.Proposal &&
          (a.data as ThreadActivityDataProposal).status === 'inProgress'
      )
  }, [activities])

  // Show the button only when the proposal is off-screen ABOVE the viewport
  // (scrolled past it). Hidden when it is visible or still below.
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setShowButton(false)
    if (!proposal) return
    const el = document.getElementById(`activity-${proposal.id}`)
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rootTop = entry.rootBounds?.top ?? 0
        const isAbove =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= rootTop
        setShowButton(isAbove)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [proposal?.id])

  if (!proposal || !showButton) return null

  // Sticky inside the messages column: it stays at the top of the scroll area
  // and centers on the column width (no JS, no viewport math).
  return (
    <Flex
      position="sticky"
      top={2}
      zIndex={20}
      justify="center"
      pointerEvents="none"
    >
      <Button
        pointerEvents="auto"
        colorScheme="blue"
        shadow="lg"
        borderRadius="full"
        size="sm"
        leftIcon={<ChevronUpIcon size={18} />}
        onClick={() => scrollAndHighlightActivity(proposal.id)}
      >
        {t('ProposalScrollButton.label')}
      </Button>
    </Flex>
  )
}
