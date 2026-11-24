import CircleByIdButton from '@/circle/components/CircleByIdButton'
import ListItemLayout from '@/common/atoms/ListItemLayout'
import useItemCardProps from '@/common/hooks/useItemCardProps'
import { getListItemTitleProps } from '@/common/utils/listItemTitleProps'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import MemberByIdAvatar from '@/member/components/MemberByIdAvatar'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Box,
  Button,
  Circle,
  HStack,
  forwardRef,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  Text,
  TypographyProps,
  useDisclosure,
} from '@chakra-ui/react'
import { ThreadFragment } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as ReachLink, useLocation } from 'react-router'
import { PinnedIcon, PrivacyIcon } from 'src/icons'
import useThreadStatus from '../hooks/useThreadStatus'
import ThreadModal from '../modals/ThreadModal'
import ThreadItemActions from './ThreadItemActions'
import ThreadStatusIcon from './ThreadStatusIcon'

interface Props extends LinkBoxProps {
  thread: ThreadFragment
  noModal?: boolean
  openButton?: boolean
  unread?: boolean
  showIcon?: boolean
  showCircle?: boolean
  showMember?: boolean
  isDragging?: boolean
  // Drag and drop enabled (manual order)
  draggable?: boolean
  labelProps?: TypographyProps
}

const ThreadItem = forwardRef<Props, 'div'>(
  (
    {
      thread,
      noModal,
      openButton,
      unread,
      showIcon,
      showCircle,
      showMember,
      isDragging,
      draggable,
      labelProps,
      children,
      ...linkBoxProps
    },
    ref
  ) => {
    const { t } = useTranslation()
    const path = usePathInOrg(`threads/${thread.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)
    const isMember = useOrgMember()
    const { orgData } = useOrgContext()

    // Get thread initiator
    const threadInitiator = orgData?.getMember(thread.initiatorMemberId)

    // Thread status
    const { threadStatus, setStatus } = useThreadStatus(thread)

    // Is active?
    const location = useLocation()
    const isActive = location.pathname === path

    // Rich rows (with metadata) show the title on up to 2 lines
    // and the metadata below it on mobile
    const isStacked = !!(showCircle || showMember)
    const titleProps = getListItemTitleProps(isStacked)

    // Block the browser's native drag of the link (drag and drop handles override it)
    const handleDragStart = (event: React.DragEvent) => event.preventDefault()

    const cardProps = useItemCardProps({ draggable, isDragging })

    return (
      <>
        <LinkBox
          ref={ref}
          onDragStart={draggable ? handleDragStart : undefined}
          {...(isStacked
            ? { ...cardProps, mb: 2 }
            : {
                p: 1,
                boxShadow: isDragging ? 'lg' : 'none',
                bg: isDragging ? 'gray.50' : undefined,
                _dark: { bg: isDragging ? 'gray.700' : undefined },
                _hover: openButton ? undefined : { bg: 'bgItemHover' },
              })}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redundant with link
            undefined
          }
          className={isActive ? 'active' : undefined}
        >
          <ListItemLayout
            stacked={isStacked}
            icon={
              showIcon && (
                <>
                  <ThreadStatusIcon
                    value={threadStatus}
                    readOnly={!isMember}
                    onChange={setStatus}
                  />
                  {unread && (
                    <Circle
                      size="8px"
                      position="absolute"
                      top="-1px"
                      right="-1px"
                      bg="red.400"
                      _dark={{ bg: 'red.600' }}
                    />
                  )}
                </>
              )
            }
            title={
              openButton ? (
                <Text
                  {...titleProps}
                  fontWeight={unread ? 'bold' : titleProps.fontWeight}
                  {...labelProps}
                >
                  {thread.title}
                </Text>
              ) : (
                <LinkOverlay
                  as={ReachLink}
                  to={path}
                  {...titleProps}
                  fontWeight={unread ? 'bold' : titleProps.fontWeight}
                  {...labelProps}
                  onClick={noModal ? undefined : handleOpen}
                >
                  {thread.title}
                </LinkOverlay>
              )
            }
            corner={
              (thread?.pinned || thread?.private || isStacked) && (
                <HStack spacing={1.5}>
                  {thread?.pinned && (
                    <Box color="yellow.500">
                      <PinnedIcon size={16} />
                    </Box>
                  )}
                  {thread?.private && <PrivacyIcon size={16} />}
                  {isStacked && <ThreadItemActions thread={thread} />}
                </HStack>
              )
            }
            meta={
              <>
                {showMember && threadInitiator && (
                  <MemberByIdAvatar
                    id={threadInitiator.id}
                    circleId={thread.circleId}
                    w={6}
                    h={6}
                    size="xs"
                  />
                )}

                {showCircle && (
                  <CircleByIdButton id={thread.circleId} size="xs" />
                )}

                {children}

                {openButton && (
                  <Button size="sm" variant="outline" onClick={onOpen}>
                    {t('ThreadItem.open')}
                  </Button>
                )}
              </>
            }
          />
        </LinkBox>

        {isOpen && <ThreadModal id={thread.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

ThreadItem.displayName = 'ThreadItem'

export default ThreadItem
