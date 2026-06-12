import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { Avatar, MenuItem, MenuItemProps, Stack, Text } from '@chakra-ui/react'
import { MemberSummaryFragment } from '@gql'
import { useStoreState } from '@store/hooks'
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
  const circles = useStoreState((state) => state.org.circles)

  const circlesNames = useMemo(
    () =>
      circles && circlesIds
        ? (circles
            .filter((c) => circlesIds.includes(c.id))
            .map((c) => c.role.name)
            .filter(Boolean) as string[])
        : [],
    [circles, circlesIds]
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
        {circlesNames.length !== 0 && (
          <Text fontSize="xs" color="gray.500">
            {textEllipsis(circlesNames.join(', '), 40)}
          </Text>
        )}
        {description && (
          <Text fontSize="xs" color="gray.500">
            {description}
          </Text>
        )}
      </Stack>
    </MenuItem>
  )
}
