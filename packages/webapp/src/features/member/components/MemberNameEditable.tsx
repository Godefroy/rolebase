import { useHoverItemStyle } from '@/common/hooks/useHoverItemStyle'
import {
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  StyleProps,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { useOrgEditActions } from '@/org/contexts/OrgContext'
import { MemberFragment } from '@gql'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends StyleProps {
  member: MemberFragment
  isDisabled?: boolean
}

export default function MemberNameEditable({
  member,
  isDisabled,
  ...styleProps
}: Props) {
  const { t } = useTranslation()
  const { updateMember } = useOrgEditActions()
  const toast = useToast()
  const hoverStyle = useHoverItemStyle()

  const [value, setValue] = useState(member.name)

  useEffect(() => {
    setValue(member.name)
  }, [member.name])

  const handleSave = async () => {
    if (value === member.name) return

    await updateMember(member, { name: value })

    // Show success toast
    toast({
      title: t('MemberNameEditable.toastSuccess'),
      status: 'success',
      duration: 2000,
    })
  }

  if (isDisabled) {
    return (
      <Heading
        as="h2"
        size="md"
        textAlign="center"
        lineHeight="base"
        py={1}
        {...styleProps}
      >
        {member.name}
      </Heading>
    )
  }

  return (
    <Editable
      value={value}
      onChange={setValue}
      onBlur={handleSave}
      w="full"
      px={6}
      display="flex"
      justifyContent="center"
      {...styleProps}
    >
      <Tooltip label={t('MemberNameEditable.tooltip')} hasArrow>
        <EditablePreview
          as="h2"
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          cursor="pointer"
          _hover={hoverStyle}
          px={2}
          py={1}
          borderRadius="md"
        />
      </Tooltip>
      <EditableInput
        as="input"
        type="text"
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
      />
    </Editable>
  )
}
