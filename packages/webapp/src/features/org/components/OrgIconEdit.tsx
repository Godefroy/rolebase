import { getResizedImageUrl } from '@rolebase/shared/helpers/getResizedImageUrl'
import { useToast } from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useUploadOrgIcon from '../hooks/useUploadOrgIcon'
import OrgIconMenu from './OrgIconMenu'

const iconSize = 72

interface Props {
  id: string
  icon?: string | null
}

// Icon of an existing org, saved as soon as it is changed
export default function OrgIconEdit({ id, icon }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [updateOrg] = useUpdateOrgMutation()
  const uploadOrgIcon = useUploadOrgIcon()
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    setLoading(true)
    try {
      await uploadOrgIcon(id, file)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : '',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
    setLoading(false)
  }

  const handleRemove = () => {
    updateOrg({ variables: { id, values: { icon: null, iconFileId: null } } })
  }

  return (
    <OrgIconMenu
      src={icon ? getResizedImageUrl(icon, iconSize * 2) : undefined}
      size={iconSize}
      loading={loading}
      onUpload={handleUpload}
      onRemove={handleRemove}
    />
  )
}
