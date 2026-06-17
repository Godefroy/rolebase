import CircleByIdButton from '@/circle/components/CircleByIdButton'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  forwardRef,
  HStack,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { DecisionFragment } from '@gql'
import React from 'react'
import { Link as ReachLink } from 'react-router'
import { DecisionIcon, PrivacyIcon } from 'src/icons'
import DecisionModal from '../modals/DecisionModal'

interface Props extends LinkBoxProps {
  decision: DecisionFragment
  showCircle?: boolean
  showIcon?: boolean
}

const DecisionItem = forwardRef<Props, 'div'>(
  ({ decision, showCircle, showIcon, children, ...linkBoxProps }, ref) => {
    const path = usePathInOrg(`decisions/${decision.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)

    return (
      <>
        <LinkBox
          ref={ref}
          p={1}
          _hover={{ bg: 'bgItemHover' }}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redondant with link
            undefined
          }
        >
          <HStack align="center">
            {showIcon && <DecisionIcon />}

            <LinkOverlay
              as={ReachLink}
              to={path}
              flex={1}
              w="0"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={handleOpen}
            >
              {decision.title}
            </LinkOverlay>

            {decision?.private && <PrivacyIcon size={18} />}

            {showCircle && (
              <CircleByIdButton id={decision.circleId} size="xs" />
            )}

            {children}
          </HStack>
        </LinkBox>

        {isOpen && <DecisionModal id={decision.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

DecisionItem.displayName = 'DecisionItem'

export default DecisionItem
