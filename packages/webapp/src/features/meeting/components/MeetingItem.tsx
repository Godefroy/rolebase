import CircleByIdButton from '@/circle/components/CircleByIdButton'
import ListItemLayout from '@/common/atoms/ListItemLayout'
import useDateLocale from '@/common/hooks/useDateLocale'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { getItemCardProps } from '@/common/utils/itemCardProps'
import { getListItemTitleProps } from '@/common/utils/listItemTitleProps'
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
import { MeetingSummaryFragment } from '@gql'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { format, isSameDay } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as ReachLink, useLocation } from 'react-router'
import { MeetingIcon, PrivacyIcon } from 'src/icons'
import MeetingModal from '../modals/MeetingModal'
import MeetingItemActions from './MeetingItemActions'

interface Props extends LinkBoxProps {
  meeting: MeetingSummaryFragment
  noModal?: boolean
  openButton?: boolean
  showCircle?: boolean
  showIcon?: boolean
  showDate?: boolean
  showTime?: boolean
  // Card layout, for lists in a main content area
  card?: boolean
}

const MeetingItem = forwardRef<Props, 'div'>(
  (
    {
      meeting,
      noModal,
      openButton,
      showCircle,
      showIcon,
      showDate,
      showTime,
      card,
      children,
      ...linkBoxProps
    },
    ref
  ) => {
    const { t } = useTranslation()
    const path = usePathInOrg(`meetings/${meeting.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)
    const dateLocale = useDateLocale()
    const startDate = new Date(meeting.startDate)
    const endDate = new Date(meeting.endDate)

    // Is active?
    const location = useLocation()
    const isActive = location.pathname === path

    const title = t('MeetingItem.title', { title: meeting.title })

    // Date and time range, with both dates when the meeting spans several days
    const formatDay = (date: Date) =>
      capitalizeFirstLetter(format(date, 'eeee P', { locale: dateLocale }))
    const formatTime = (date: Date) => format(date, 'p', { locale: dateLocale })
    const endLabel = isSameDay(startDate, endDate)
      ? formatTime(endDate)
      : `${formatDay(endDate)} ${formatTime(endDate)}`
    const dateLabel = [
      showDate && formatDay(startDate),
      showTime && `${formatTime(startDate)} – ${endLabel}`,
    ]
      .filter(Boolean)
      .join(' · ')
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
          className={isActive ? 'active' : undefined}
        >
          <ListItemLayout
            stacked={card}
            icon={showIcon && <MeetingIcon />}
            corner={
              (meeting?.private || card) && (
                <HStack spacing={1.5}>
                  {meeting?.private && <PrivacyIcon size={16} />}
                  {card && <MeetingItemActions meetingId={meeting.id} />}
                </HStack>
              )
            }
            title={
              openButton ? (
                <Text {...titleProps}>{title}</Text>
              ) : (
                <LinkOverlay
                  as={ReachLink}
                  to={path}
                  {...titleProps}
                  onClick={noModal ? undefined : handleOpen}
                >
                  {title}
                </LinkOverlay>
              )
            }
            metaStart={
              (showDate || showTime) && (
                <Text
                  as="span"
                  whiteSpace="nowrap"
                  color="gray.500"
                  _dark={{ color: 'gray.400' }}
                  fontSize={card ? 'xs' : undefined}
                >
                  {dateLabel}
                </Text>
              )
            }
            meta={
              (showCircle || children || openButton) && (
                <>
                  {showCircle && (
                    <CircleByIdButton id={meeting.circleId} size="xs" />
                  )}
                  {children}
                  {openButton && (
                    <Button size="sm" variant="outline" onClick={onOpen}>
                      {t('MeetingItem.open')}
                    </Button>
                  )}
                </>
              )
            }
          />
        </LinkBox>

        {isOpen && <MeetingModal id={meeting.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

MeetingItem.displayName = 'MeetingItem'

export default MeetingItem
