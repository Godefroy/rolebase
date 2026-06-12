import {
  AVATAR_HEADING_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import MemberRoles from '@/member/components/MemberRoles'
import useMember from '@/member/hooks/useMember'
import {
  Avatar,
  Flex,
  Heading,
  ModalCloseButton,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  id: string
  selectedCircleId?: string
}

export default function MemberCard({ id, selectedCircleId }: Props) {
  const { t } = useTranslation()
  const member = useMember(id)

  if (!member) return null

  return (
    <>
      <ModalCloseButton />

      <Flex flexDirection="column" alignItems="center" mt={5} mb={8}>
        <Avatar
          name={member.name}
          src={
            getResizedImageUrl(member.picture, AVATAR_HEADING_WIDTH) ||
            undefined
          }
          size="2xl"
        />

        <Heading as="h2" size="md" textAlign="center" mt={2}>
          {member.name}
        </Heading>
      </Flex>

      <VStack m={5} mb={2} spacing={5} align="stretch">
        <Heading as="h3" size="sm">
          {t('MemberContent.memberRolesHeading')}
        </Heading>

        <MemberRoles member={member} />
      </VStack>
    </>
  )
}
