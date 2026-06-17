import CircleByIdButton from '@/circle/components/CircleByIdButton'
import useDateLocale from '@/common/hooks/useDateLocale'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
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
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as ReachLink, useLocation } from 'react-router'
import { MeetingIcon, PrivacyIcon } from 'src/icons'
import MeetingModal from '../modals/MeetingModal'

interface Props extends LinkBoxProps {
  meeting: MeetingSummaryFragment
  noModal?: boolean
  showCircle?: boolean
  showIcon?: boolean
  showDate?: boolean
  showTime?: boolean
}

const MeetingItem = forwardRef<Props, 'div'>(
  (
    {
      meeting,
      noModal,
      showCircle,
      showIcon,
      showDate,
      showTime,
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

    // Is active?
    const location = useLocation()
    const isActive = location.pathname === path

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
          className={isActive ? 'active' : undefined}
        >
          <HStack align="center">
            {showIcon && <MeetingIcon />}

            {showDate && (
              <Text pr={1} color="gray.500" _dark={{ color: 'gray.400' }}>
                {capitalizeFirstLetter(
                  format(startDate, 'eeee P', { locale: dateLocale })
                )}
              </Text>
            )}

            {showTime && (
              <Text pr={1} color="gray.500" _dark={{ color: 'gray.400' }}>
                {format(startDate, 'p', { locale: dateLocale })}
              </Text>
            )}

            <LinkOverlay
              as={ReachLink}
              to={path}
              flex={1}
              w="0"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={noModal ? undefined : handleOpen}
            >
              {t('MeetingItem.title', { title: meeting.title })}
            </LinkOverlay>

            {meeting?.private && <PrivacyIcon size={18} />}

            {showCircle && <CircleByIdButton id={meeting.circleId} size="xs" />}

            {children}
          </HStack>
        </LinkBox>

        {isOpen && <MeetingModal id={meeting.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

MeetingItem.displayName = 'MeetingItem'

export default MeetingItem
