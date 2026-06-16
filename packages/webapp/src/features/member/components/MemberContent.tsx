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
  Flex,
  Heading,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useOrgContext } from '@/org/contexts/OrgContext'
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
  const { orgData, isDraft, editable, hasBackend } = useOrgContext()
  const member = orgData?.getMember(id)
  const isAdmin = useOrgAdmin()
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
          {isAdmin && editable && !isDraft && (
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

          {canEditProfile && (
            <MemberOrgRoleSelect member={member} size="sm" mt={2} />
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
