import CircleButton from '@/circle/components/CircleButton'
import ActionsMenu from '@/common/atoms/actionsMenu/ActionsMenu'
import TitleLink from '@/common/atoms/TitleLink'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
  Tag,
  Tooltip,
  Wrap,
} from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { MeetingIcon, PrivacyIcon } from 'src/icons'
import { MeetingContext } from '../contexts/MeetingContext'
import useMeetingActions from '../hooks/useMeetingActions'
import MeetingSessionMenuItems from './MeetingSessionMenuItems'
import MeetingDate from './MeetingDate'

interface Props {
  headerIcons?: React.ReactNode
}

export default function MeetingHeader({ headerIcons }: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()

  const { meeting, circle, participants, isStarted, path } =
    useContext(MeetingContext)!

  // Actions menu, shared with the meeting cards
  const actions = useMeetingActions(meeting, {
    sessionItems: <MeetingSessionMenuItems />,
  })
  const handleEdit = useNormalClickHandler(actions.openEdit)

  return (
    <Box w="100%" ml={3}>
      <Flex w="100%">
        <Wrap spacing={2} flex={1} align="center">
          <HStack spacing={2}>
            <Center mr={1}>
              <MeetingIcon />
            </Center>
            <Heading as="h1" size="md">
              <TitleLink href={path} onClick={handleEdit}>
                {t('MeetingHeader.heading', {
                  title: meeting?.title || '…',
                })}
              </TitleLink>
            </Heading>
          </HStack>

          <Spacer />

          <HStack spacing={2}>
            {meeting?.private && (
              <Tooltip
                label={t('MeetingHeader.private', {
                  role: orgData?.getRole(circle?.roleId)?.name,
                })}
                hasArrow
              >
                <PrivacyIcon size={20} />
              </Tooltip>
            )}

            {circle && <CircleButton circle={circle} />}

            <Box>
              <ParticipantsNumber participants={participants} />
            </Box>
          </HStack>
        </Wrap>

        <Flex mr={headerIcons ? -2 : 0}>
          {actions.hasItems && (
            <ActionsMenu ml={2}>{actions.items}</ActionsMenu>
          )}

          {headerIcons}
        </Flex>
      </Flex>

      {meeting && (
        <Wrap spacing={5} align="center" fontSize="sm" ml={10}>
          <Link href={path} fontWeight="normal" onClick={handleEdit}>
            <MeetingDate meeting={meeting} />
          </Link>

          {meeting?.ended ? (
            <Tag ml={1}>{t('MeetingHeader.ended')}</Tag>
          ) : (
            isStarted && (
              <Tag colorScheme="green" ml={1}>
                {t('MeetingHeader.started')}
              </Tag>
            )
          )}
        </Wrap>
      )}

      {actions.modals}
    </Box>
  )
}
