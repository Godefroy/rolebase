import { EditableField } from '@/common/atoms/EditableField'
import { useOrgEditActions } from '@/org/contexts/OrgContext'
import { BoxProps } from '@chakra-ui/react'
import { MemberFragment } from '@gql'
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
  const { updateMember } = useOrgEditActions()

  // Value
  const rawValue = member[field]
  const value = typeof rawValue === 'string' ? rawValue : ''

  const handleSave = async (newValue: string) => {
    await updateMember(member, { [field]: newValue })
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
