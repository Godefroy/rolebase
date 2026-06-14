import { EditableField } from '@/common/atoms/EditableField'
import { useOrgEditActions } from '@/org/contexts/OrgEditContext'
import { Alert, AlertDescription, AlertIcon, BoxProps } from '@chakra-ui/react'
import { RoleFragment } from '@gql'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleContext } from '../contexts/CIrcleContext'

interface Props extends Omit<BoxProps, 'role'> {
  label: string
  placeholder?: string
  role: RoleFragment
  field: keyof RoleFragment
  initValue?: string
}

export function RoleEditableField({
  label,
  placeholder,
  role,
  field,
  initValue,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const { updateRole } = useOrgEditActions()

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const { canEditRole } = circleContext

  // Value
  const rawValue = role[field]
  const value = typeof rawValue === 'string' ? rawValue : ''

  const handleSave = async (newValue: string) => {
    await updateRole(role, { [field]: newValue })
  }

  return (
    <EditableField
      key={role.id}
      label={label}
      placeholder={placeholder}
      editable={canEditRole}
      value={value}
      initValue={initValue}
      info={
        role.base ? (
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              {t('RoleEditableField.baseRoleInfo', { role: role.name })}
            </AlertDescription>
          </Alert>
        ) : undefined
      }
      onSave={handleSave}
      {...boxProps}
    />
  )
}
