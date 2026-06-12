import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import {
  Avatar,
  Button,
  ButtonProps,
  forwardRef,
  useButtonGroup,
} from '@chakra-ui/react'
import { MemberSummaryFragment } from '@gql'
import { textEllipsis } from '@utils/textEllipsis'
import React from 'react'

interface Props extends ButtonProps {
  member: Pick<MemberSummaryFragment, 'name' | 'picture'>
  maxNameLength?: number
}

export default forwardRef(function MemberButton(
  { member, maxNameLength = 30, ...buttonProps }: Props,
  ref
) {
  const buttonGroup = useButtonGroup()
  const buttonSize = buttonProps.size || buttonGroup?.size
  const avatarSize = buttonSize === 'sm' ? 'xs' : 'sm'

  return (
    <Button ref={ref} {...buttonProps}>
      <Avatar
        name={member.name}
        src={getResizedImageUrl(member.picture, AVATAR_SM_WIDTH) || undefined}
        size={avatarSize}
        ml="-10px"
        mr={2}
      />
      {textEllipsis(member.name, maxNameLength)}
    </Button>
  )
})
