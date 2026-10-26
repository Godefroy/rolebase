import { Flex, LinkBox, LinkOverlay, Tag, Text } from '@chakra-ui/react'
import { AccountDeletionMembersSubscription } from '@gql'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as ReactRouterLink } from 'react-router'

interface Props {
  member: AccountDeletionMembersSubscription['member'][number]
}

// Org blocking the account deletion, with the user's role in it
export default function AccountDeletionOrgItem({ member }: Props) {
  const { t } = useTranslation()

  return (
    <LinkBox
      as={Flex}
      alignItems="center"
      gap={2}
      borderWidth="1px"
      borderRadius="md"
      px={3}
      py={2}
      _hover={{ bg: 'gray.50', _dark: { bg: 'whiteAlpha.100' } }}
    >
      <LinkOverlay
        as={ReactRouterLink}
        to={`${getOrgPath(member.org)}/`}
        flex={1}
        minW={0}
      >
        <Text fontSize="sm" noOfLines={1}>
          {member.org.name}
        </Text>
      </LinkOverlay>
      {member.role && (
        <Tag size="sm" variant="subtle">
          {t(`MemberOrgRoleSelect.roles.${member.role}.title`)}
        </Tag>
      )}
    </LinkBox>
  )
}
