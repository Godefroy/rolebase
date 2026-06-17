import CircleButton from '@/circle/components/CircleButton'
import ActionsMenu from '@/common/atoms/ActionsMenu'
import TitleLink from '@/common/atoms/TitleLink'
import Loading from '@/common/atoms/Loading'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import Page404 from '@/common/pages/Page404'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Tag,
  Tooltip,
  useDisclosure,
  Wrap,
} from '@chakra-ui/react'
import { useUpdateThreadMutation } from '@gql'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PinIcon, PinnedIcon, PrivacyIcon } from 'src/icons'
import settings from 'src/settings'
import { ThreadContext } from '../contexts/ThreadContext'
import useThreadState from '../hooks/useThreadState'
import useThreadStatus from '../hooks/useThreadStatus'
import ThreadEditModal from '../modals/ThreadEditModal'
import ThreadActivities from './ThreadActivities'
import ThreadActivityCreate from './ThreadActivityCreate'
import ThreadStatusIcon from './ThreadStatusIcon'
import { ThreadStatusMenu } from './ThreadStatusMenu'

interface Props extends BoxProps {
  id: string
  changeTitle?: boolean
  headerIcons?: React.ReactNode
}

export default function ThreadContent({
  id,
  changeTitle,
  headerIcons,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const [updateThread] = useUpdateThreadMutation()

  // Load thread and activities
  const threadState = useThreadState(id)

  const {
    thread,
    path,
    loading,
    error,
    circle,
    participants,
    canEdit,
    canParticipate,
  } = threadState

  // Create modal
  const editModal = useDisclosure()

  const { threadStatus, setStatus } = useThreadStatus(thread)

  // Archive / unarchive
  const handleArchive = useCallback(
    () => updateThread({ variables: { id, values: { archived: true } } }),
    [id]
  )
  const handleUnarchive = useCallback(
    () => updateThread({ variables: { id, values: { archived: false } } }),
    [id]
  )

  // Pin / unpin for everyone
  const handleTogglePin = useCallback(
    () =>
      updateThread({
        variables: { id, values: { pinned: !thread?.pinned } },
      }),
    [id, thread?.pinned]
  )

  if (error) {
    console.error(error)
    return <Page404 />
  }

  const title = thread?.title || '…'

  return (
    <ThreadContext.Provider value={threadState}>
      {changeTitle && <Title>{title}</Title>}

      <ScrollableLayout
        {...boxProps}
        header={
          <>
            <Wrap spacing={4} flex={1} ml={3} align="center">
              <HStack spacing={2} align="center">
                <ThreadStatusIcon
                  value={threadStatus}
                  readOnly={!canEdit}
                  onChange={setStatus}
                />

                <Heading as="h1" size="md">
                  {canEdit ? (
                    <TitleLink href="#" onClick={editModal.onOpen}>
                      {title}
                    </TitleLink>
                  ) : (
                    title
                  )}
                </Heading>
              </HStack>

              <Spacer />

              <HStack spacing={2}>
                {canEdit ? (
                  <Tooltip
                    label={t(
                      thread?.pinned
                        ? 'ThreadContent.unpin'
                        : 'ThreadContent.pin'
                    )}
                    hasArrow
                  >
                    <IconButton
                      aria-label={t(
                        thread?.pinned
                          ? 'ThreadContent.unpin'
                          : 'ThreadContent.pin'
                      )}
                      size="sm"
                      variant="ghost"
                      color={thread?.pinned ? 'yellow.500' : undefined}
                      icon={
                        thread?.pinned ? (
                          <PinnedIcon size={20} />
                        ) : (
                          <PinIcon size={20} />
                        )
                      }
                      onClick={handleTogglePin}
                    />
                  </Tooltip>
                ) : (
                  thread?.pinned && (
                    <Tooltip label={t('ThreadContent.pinned')} hasArrow>
                      <Box color="yellow.500">
                        <PinnedIcon size={20} />
                      </Box>
                    </Tooltip>
                  )
                )}

                {thread?.private && (
                  <Tooltip
                    label={t('ThreadContent.private', {
                      role: orgData?.getRole(circle?.roleId)?.name,
                    })}
                    hasArrow
                  >
                    <PrivacyIcon size={20} />
                  </Tooltip>
                )}

                <Box>
                  {canEdit && threadStatus && !thread?.archived && (
                    <ThreadStatusMenu
                      value={threadStatus}
                      onChange={setStatus}
                    />
                  )}
                </Box>

                {thread?.archived && <Tag>{t('common.archived')}</Tag>}

                {circle && <CircleButton circle={circle} />}

                <Box>
                  <ParticipantsNumber participants={participants} />
                </Box>
              </HStack>
            </Wrap>

            <Flex mr={headerIcons ? -2 : 0}>
              {canEdit && (
                <ActionsMenu
                  copyLinkUrl={`${settings.url}${path}`}
                  onEdit={editModal.onOpen}
                  onDelete={!thread?.archived ? handleArchive : undefined}
                  onUnarchive={thread?.archived ? handleUnarchive : undefined}
                  ml={2}
                />
              )}
              {headerIcons}
            </Flex>
          </>
        }
        footer={
          thread && canParticipate ? (
            <ThreadActivityCreate thread={thread} w="100%" p={5} />
          ) : undefined
        }
      >
        {loading && <Loading active center />}
        <ThreadActivities />
      </ScrollableLayout>

      {editModal.isOpen && (
        <ThreadEditModal isOpen thread={thread} onClose={editModal.onClose} />
      )}
    </ThreadContext.Provider>
  )
}
