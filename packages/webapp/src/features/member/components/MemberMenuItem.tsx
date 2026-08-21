import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Avatar, MenuItem, MenuItemProps, Stack, Text } from '@chakra-ui/react'
import { MemberSummaryFragment } from '@gql'
import { textEllipsis } from '@utils/textEllipsis'
import React, { useMemo } from 'react'

interface Props extends MenuItemProps {
  member: MemberSummaryFragment
  circlesIds?: string[]
  description?: string
}

export default function MemberMenuItem({
  member,
  circlesIds,
  description,
  ...menuItemProps
}: Props) {
  const { orgData } = useOrgContext()
  const circles = orgData?.circles

  const circlesNames = useMemo(
    () =>
      circles && circlesIds
        ? (circles
            .filter((c) => circlesIds.includes(c.id))
            .map((c) => orgData?.getRole(c.roleId)?.name)
            .filter(Boolean) as string[])
        : [],
    [circles, circlesIds, orgData]
  )

  // Roles and description share a single subtitle line, so a member holding a
  // right through both reads as one entry.
  const subtitle = useMemo(
    () =>
      [
        circlesNames.length !== 0
          ? textEllipsis(circlesNames.join(', '), 40)
          : undefined,
        description,
      ]
        .filter(Boolean)
        .join(', '),
    [circlesNames, description]
  )

  return (
    <MenuItem {...menuItemProps}>
      <Avatar
        name={member.name}
        src={getResizedImageUrl(member.picture, AVATAR_SM_WIDTH) || undefined}
        size="sm"
        mr={2}
      />
      <Stack spacing={0}>
        <Text fontSize="sm">{member.name}</Text>
        {subtitle && (
          <Text fontSize="xs" color="gray.500">
            {subtitle}
          </Text>
        )}
      </Stack>
    </MenuItem>
  )
}
