import CircleByIdButton from '@/circle/components/CircleByIdButton'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import MemberByIdAvatar from '@/member/components/MemberByIdAvatar'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Box,
  Center,
  Circle,
  forwardRef,
  HStack,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  TypographyProps,
  useDisclosure,
} from '@chakra-ui/react'
import { ThreadFragment } from '@gql'
import React from 'react'
import { Link as ReachLink, useLocation } from 'react-router'
import { PinnedIcon, PrivacyIcon } from 'src/icons'
import useThreadStatus from '../hooks/useThreadStatus'
import ThreadModal from '../modals/ThreadModal'
import ThreadStatusIcon from './ThreadStatusIcon'

interface Props extends LinkBoxProps {
  thread: ThreadFragment
  noModal?: boolean
  unread?: boolean
  showIcon?: boolean
  showCircle?: boolean
  showMember?: boolean
  isDragging?: boolean
  labelProps?: TypographyProps
}

const ThreadItem = forwardRef<Props, 'div'>(
  (
    {
      thread,
      noModal,
      unread,
      showIcon,
      showCircle,
      showMember,
      isDragging,
      labelProps,
      children,
      ...linkBoxProps
    },
    ref
  ) => {
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

    return (
      <>
        <LinkBox
          ref={ref}
          p={1}
          boxShadow={isDragging ? 'lg' : 'none'}
          bg={isDragging ? 'gray.50' : undefined}
          _dark={{ bg: isDragging ? 'gray.700' : undefined }}
          _hover={{ bg: 'bgItemHover' }}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redundant with link
            undefined
          }
          className={isActive ? 'active' : undefined}
        >
          <HStack align="center">
            {showIcon && (
              <Center zIndex="2" position="relative">
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
              </Center>
            )}

            <LinkOverlay
              as={ReachLink}
              to={path}
              flex={1}
              w="0"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontWeight={unread ? 'bold' : undefined}
              {...labelProps}
              onClick={noModal ? undefined : handleOpen}
            >
              {thread.title}
            </LinkOverlay>

            {thread?.pinned && (
              <Box color="yellow.500">
                <PinnedIcon size={16} />
              </Box>
            )}

            {thread?.private && <PrivacyIcon size={18} />}

            {showMember && threadInitiator && (
              <MemberByIdAvatar
                id={threadInitiator.id}
                circleId={thread.circleId}
                w={6}
                h={6}
                size="xs"
              />
            )}

            {showCircle && <CircleByIdButton id={thread.circleId} size="xs" />}

            {children}
          </HStack>
        </LinkBox>

        {isOpen && <ThreadModal id={thread.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

ThreadItem.displayName = 'ThreadItem'

export default ThreadItem
