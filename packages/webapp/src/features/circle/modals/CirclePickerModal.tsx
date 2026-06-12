import { useElementSize } from '@/common/hooks/useElementSize'
import useWindowSize from '@/common/hooks/useWindowSize'
import CirclesGraph from '@/graph/CirclesGraph'
import { CirclesGraphViews, GraphEvents } from '@/graph/types'
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  UseModalProps,
} from '@chakra-ui/react'
import { useStoreState } from '@store/hooks'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CircleAndParentsLinks from '../components/CircleAndParentsLinks'
import useCircle from '../hooks/useCircle'

interface Props extends UseModalProps {
  onSelect(circleId: string): void
}

export default function CirclePickerModal({ onSelect, ...modalProps }: Props) {
  const { t } = useTranslation()
  const circles = useStoreState((state) => state.org.circles)

  const [circleId, setCircleId] = useState<string | undefined>()
  const circle = useCircle(circleId)

  const events: GraphEvents = {
    onCircleClick: (circleId) => {
      setCircleId(circleId)
    },
    onClickOutside: () => {
      setCircleId(undefined)
    },
  }

  // Content size
  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)
  const windowSize = useWindowSize()
  const width = boxSize?.width || 300
  const height = Math.min(width, windowSize.height - 50)

  return (
    <Modal size="4xl" blockScrollOnMount={false} isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent border="3px solid">
        <ModalBody ref={boxRef} p={0} position="relative">
          {circles && boxSize && (
            <CirclesGraph
              view={CirclesGraphViews.SimpleCircles}
              circles={circles}
              events={events}
              width={width}
              height={height}
              selectedCircleId={circleId}
            />
          )}

          {circle && (
            <Flex
              position="absolute"
              pointerEvents="none"
              left={4}
              right={4}
              bottom={4}
              justifyContent="center"
            >
              <Flex
                pointerEvents="auto"
                px={6}
                py={3}
                minW="350px"
                maxW="100%"
                justifyContent="space-between"
                alignItems="center"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                _dark={{ bg: 'gray.700' }}
              >
                <CircleAndParentsLinks circle={circle} mr={8} />
                <Button
                  variant="solid"
                  colorScheme="blue"
                  size="md"
                  onClick={() => onSelect(circle.id)}
                >
                  {t('CirclePickerModal.selectBtn')}
                </Button>
              </Flex>
            </Flex>
          )}
        </ModalBody>

        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
