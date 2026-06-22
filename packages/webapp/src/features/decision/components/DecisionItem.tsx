import CircleByIdButton from '@/circle/components/CircleByIdButton'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Button,
  forwardRef,
  HStack,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { DecisionFragment } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as ReachLink } from 'react-router'
import { DecisionIcon, PrivacyIcon } from 'src/icons'
import DecisionModal from '../modals/DecisionModal'

interface Props extends LinkBoxProps {
  decision: DecisionFragment
  openButton?: boolean
  showCircle?: boolean
  showIcon?: boolean
}

const DecisionItem = forwardRef<Props, 'div'>(
  (
    { decision, openButton, showCircle, showIcon, children, ...linkBoxProps },
    ref
  ) => {
    const { t } = useTranslation()
    const path = usePathInOrg(`decisions/${decision.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)

    return (
      <>
        <LinkBox
          ref={ref}
          p={1}
          _hover={openButton ? undefined : { bg: 'bgItemHover' }}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redondant with link
            undefined
          }
        >
          <HStack align="center">
            {showIcon && <DecisionIcon />}

            {openButton ? (
              <Text
                flex={1}
                w="0"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {decision.title}
              </Text>
            ) : (
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
            )}

            {decision?.private && <PrivacyIcon size={18} />}

            {showCircle && (
              <CircleByIdButton id={decision.circleId} size="xs" />
            )}

            {children}

            {openButton && (
              <Button size="sm" variant="outline" onClick={onOpen}>
                {t('DecisionItem.open')}
              </Button>
            )}
          </HStack>
        </LinkBox>

        {isOpen && <DecisionModal id={decision.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

DecisionItem.displayName = 'DecisionItem'

export default DecisionItem
