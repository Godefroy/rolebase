import {
  AVATAR_HEADING_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import ModalCloseStaticButton from '@/common/atoms/ModalCloseStaticButton'
import { Title } from '@/common/atoms/Title'
import { useAuth } from '@/user/hooks/useAuth'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useGetMemberQuery } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import useCurrentMember from '../hooks/useCurrentMember'
import useOrgAdmin from '../hooks/useOrgAdmin'
import { MemberEditableField } from './MemberEditableField'
import MemberNameEditable from './MemberNameEditable'
import MemberOrgRoleSelect from './MemberOrgRoleSelect'
import MemberPictureEdit from './MemberPictureEdit'
import MemberRoles from './MemberRoles'
import ActionsMenu from '@/common/atoms/ActionsMenu'
import MemberDeleteModal from '../modals/MemberDeleteModal'

interface Props {
  id: string
  changeTitle?: boolean
  headerIcons?: React.ReactNode
  // Override the close handler (otherwise closes the nearest modal). Needed
  // when MemberContent is rendered outside a modal, e.g. the website demo.
  onClose?: () => void
}

export default function MemberContent({
  id,
  changeTitle,
  headerIcons,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { orgData, isDraft, editable, hasBackend, ready } = useOrgContext()
  const orgMember = orgData?.getMember(id)
  // Archived members aren't in the org data; fetch by id (ignoring archived) so
  // the panel can still be shown with a restore option (backend only).
  const { data: fetched } = useGetMemberQuery({
    skip: !id || !!orgMember || !hasBackend || !ready,
    variables: { id },
  })
  const member = orgMember ?? fetched?.member_by_pk ?? undefined
  const isAdmin = useOrgAdmin()
  const currentMember = useCurrentMember()
  // Members can't archive themselves.
  const isSelf = !!currentMember && currentMember.id === id
  // Members are readonly in a proposal draft (a proposal changes the org chart,
  // not member profiles) and in read-only orgs.
  const canEdit =
    editable &&
    !isDraft &&
    (isAdmin || (user ? member?.userId === user.id : false))
  // Avatar upload and org-role management need a real backend, so they are only
  // available on the org page, not in an in-memory draft/demo.
  const canEditProfile = canEdit && !!hasBackend
  const avatarSrc =
    getResizedImageUrl(member?.picture, AVATAR_HEADING_WIDTH) || undefined
  const deleteModal = useDisclosure()

  // Restore an archived member (backend only, admins).
  const canRestore = isAdmin && !!hasBackend && !isDraft
  const { restoreMember } = useOrgEditActions()
  const [restoring, setRestoring] = useState(false)
  const handleRestore = async () => {
    setRestoring(true)
    try {
      await restoreMember(id)
    } finally {
      setRestoring(false)
    }
  }

  if (!member) {
    return (
      <>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('MemberContent.notFound')}</AlertTitle>
        </Alert>
        <ModalCloseStaticButton />
      </>
    )
  }

  return (
    <>
      {changeTitle && <Title>{member.name}</Title>}

      <Box pt={3} pb={10} position="relative">
        <Box position="absolute" top={2} right={2}>
          {headerIcons}
          {isAdmin && editable && !isDraft && !isSelf && (
            <ActionsMenu onDelete={deleteModal.onOpen} />
          )}
          <ModalCloseStaticButton onClose={onClose} />
        </Box>

        <Flex flexDirection="column" alignItems="center">
          {canEditProfile ? (
            <MemberPictureEdit
              id={id}
              name={member.name}
              src={avatarSrc}
              size="2xl"
              key={member.id /* force re-render when member changes */}
            />
          ) : (
            <Avatar
              name={member.name}
              src={avatarSrc}
              size="2xl"
              key={member.id /* force re-render when member changes */}
            />
          )}

          <MemberNameEditable member={member} isDisabled={!canEdit} mt={2} />

          {member.archived ? (
            <Alert status="warning" borderRadius="md" maxW="sm" mt={3}>
              <AlertIcon />
              <Box flex="1">{t('MemberContent.archived')}</Box>
              {canRestore && (
                <Button
                  size="sm"
                  colorScheme="orange"
                  isLoading={restoring}
                  onClick={handleRestore}
                  ml={2}
                >
                  {t('MemberContent.restore')}
                </Button>
              )}
            </Alert>
          ) : (
            canEditProfile && (
              <MemberOrgRoleSelect member={member} size="sm" mt={2} />
            )
          )}
        </Flex>
      </Box>

      <Box p={6}>
        <VStack spacing={5} align="stretch">
          <MemberEditableField
            label={t('MemberContent.description')}
            placeholder={t('MemberContent.descriptionPlaceholder', {
              name: member.name,
            })}
            member={member}
            field="description"
            editable={canEdit}
            hideTitle
            mt={0}
            mb={10}
          />

          <Flex alignItems="center" justifyContent="space-between">
            <Heading as="h3" size="sm">
              {t('MemberContent.memberRolesHeading')}
            </Heading>
          </Flex>

          <MemberRoles member={member} />
        </VStack>
      </Box>

      {deleteModal.isOpen && (
        <MemberDeleteModal
          id={id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      )}
    </>
  )
}
