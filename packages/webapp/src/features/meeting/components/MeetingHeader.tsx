import CircleButton from '@/circle/components/CircleButton'
import TitleLink from '@/common/atoms/TitleLink'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import useOrgMember from '@/member/hooks/useOrgMember'
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
  useDisclosure,
  Wrap,
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MeetingIcon, PrivacyIcon } from 'src/icons'
import { MeetingContext } from '../contexts/MeetingContext'
import MeetingEditModal from '../modals/MeetingEditModal'
import MeetingActionsMenu from './MeetingActionsMenu'
import MeetingDate from './MeetingDate'

interface Props {
  headerIcons?: React.ReactNode
}

export default function MeetingHeader({ headerIcons }: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()
  const { orgData } = useOrgContext()

  const { meeting, circle, participants, isStarted, path } =
    useContext(MeetingContext)!

  // Meeting edition modal
  const [duplicateInModal, setDuplicateInModal] = useState(false)

  const editModal = useDisclosure()

  const handleEdit = useNormalClickHandler(() => {
    if (!isMember) return
    setDuplicateInModal(false)
    editModal.onOpen()
  })

  const handleDuplicate = () => {
    if (!isMember) return
    setDuplicateInModal(true)
    editModal.onOpen()
  }

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
          <MeetingActionsMenu
            ml={2}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
          />

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

      {editModal.isOpen && (
        <MeetingEditModal
          meeting={meeting}
          duplicate={duplicateInModal}
          isOpen
          onClose={editModal.onClose}
        />
      )}
    </Box>
  )
}
