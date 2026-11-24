import CircleByIdButton from '@/circle/components/CircleByIdButton'
import ListItemLayout from '@/common/atoms/ListItemLayout'
import useDateLocale from '@/common/hooks/useDateLocale'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { getItemCardProps } from '@/common/utils/itemCardProps'
import { getListItemTitleProps } from '@/common/utils/listItemTitleProps'
import MemberByIdAvatar from '@/member/components/MemberByIdAvatar'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Button,
  forwardRef,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { DecisionFragment } from '@gql'
import { format } from 'date-fns'
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
  // Card layout, for lists in a main content area
  card?: boolean
}

const DecisionItem = forwardRef<Props, 'div'>(
  (
    {
      decision,
      openButton,
      showCircle,
      showIcon,
      card,
      children,
      ...linkBoxProps
    },
    ref
  ) => {
    const { t } = useTranslation()
    const path = usePathInOrg(`decisions/${decision.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)
    const dateLocale = useDateLocale()
    const titleProps = getListItemTitleProps(!!card)

    return (
      <>
        <LinkBox
          ref={ref}
          {...(card
            ? { ...getItemCardProps(), mb: 2 }
            : {
                p: 1,
                _hover: openButton ? undefined : { bg: 'bgItemHover' },
              })}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redondant with link
            undefined
          }
        >
          <ListItemLayout
            stacked={card}
            icon={showIcon && <DecisionIcon />}
            corner={decision?.private && <PrivacyIcon size={16} />}
            title={
              openButton ? (
                <Text {...titleProps}>{decision.title}</Text>
              ) : (
                <LinkOverlay
                  as={ReachLink}
                  to={path}
                  {...titleProps}
                  onClick={handleOpen}
                >
                  {decision.title}
                </LinkOverlay>
              )
            }
            metaStart={
              card && (
                <Text as="span" whiteSpace="nowrap">
                  {format(new Date(decision.createdAt), 'PPP', {
                    locale: dateLocale,
                  })}
                </Text>
              )
            }
            meta={
              (showCircle ||
                (card && decision.memberId) ||
                children ||
                openButton) && (
                <>
                  {showCircle && (
                    <CircleByIdButton id={decision.circleId} size="xs" />
                  )}
                  {card && decision.memberId && (
                    <MemberByIdAvatar id={decision.memberId} size="xs" />
                  )}
                  {children}
                  {openButton && (
                    <Button size="sm" variant="outline" onClick={onOpen}>
                      {t('DecisionItem.open')}
                    </Button>
                  )}
                </>
              )
            }
          />
        </LinkBox>

        {isOpen && <DecisionModal id={decision.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

DecisionItem.displayName = 'DecisionItem'

export default DecisionItem
