import { EditableField } from '@/common/atoms/EditableField'
import { BoxProps } from '@chakra-ui/react'
import { MemberFragment, useUpdateMemberMutation } from '@gql'
import React from 'react'

interface Props extends BoxProps {
  label: string
  placeholder?: string
  member: MemberFragment
  field: keyof MemberFragment
  editable: boolean
  hideTitle?: boolean
}

export function MemberEditableField({
  label,
  placeholder,
  member,
  field,
  editable,
  hideTitle,
  ...boxProps
}: Props) {
  const [updateMember] = useUpdateMemberMutation()

  // Value
  const rawValue = member[field]
  const value = typeof rawValue === 'string' ? rawValue : ''

  const handleSave = async (newValue: string) => {
    // Update role data
    await updateMember({
      variables: {
        id: member.id,
        values: {
          [field]: newValue,
        },
      },
    })
  }

  return (
    <EditableField
      key={member.id}
      label={label}
      placeholder={placeholder}
      editable={editable}
      hideTitle={hideTitle}
      value={value}
      onSave={handleSave}
      {...boxProps}
    />
  )
}
