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
import useMember from '../hooks/useMember'
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
}

export default function MemberContent({ id, changeTitle, headerIcons }: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const member = useMember(id)
  const isAdmin = useOrgAdmin()
  const canEdit = isAdmin || (user ? member?.userId === user.id : false)
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
          {isAdmin && <ActionsMenu onDelete={deleteModal.onOpen} />}
          <ModalCloseStaticButton />
        </Box>

        <Flex flexDirection="column" alignItems="center">
          {canEdit ? (
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

          {canEdit && <MemberOrgRoleSelect member={member} size="sm" mt={2} />}
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
