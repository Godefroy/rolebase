import { EditableField } from '@/common/atoms/EditableField'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Card, CardBody, CardProps } from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function DashboardHomeNote(cardProps: CardProps) {
  const { t } = useTranslation()
  const { orgId, org } = useOrgContext()
  const isAdmin = useOrgAdmin()
  const [updateOrg] = useUpdateOrgMutation()

  const value = org?.homeNote || ''

  const handleSave = (homeNote: string) => {
    if (!orgId) return
    updateOrg({ variables: { id: orgId, values: { homeNote } } })
  }

  // Hide when empty for non-admins
  if (!isAdmin && !value) return null

  return (
    <Card boxShadow="none" {...cardProps}>
      <CardBody>
        <EditableField
          label={t('DashboardHomeNote.title')}
          placeholder={t('DashboardHomeNote.placeholder')}
          editable={isAdmin}
          value={value}
          onSave={handleSave}
          hideTitle
          my={0}
        />
      </CardBody>
    </Card>
  )
}
