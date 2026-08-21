import { MenuItem } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchFilterType } from '../searchTypes'
import { searchIcons } from './SearchResultIcon'

interface Props {
  type?: SearchFilterType
  label?: string
  onClick(): void
}

export default function SearchTypeMenuItem({ type, label, onClick }: Props) {
  const { t } = useTranslation()
  const Icon = type && searchIcons[type]

  return (
    <MenuItem icon={Icon ? <Icon size={20} /> : undefined} onClick={onClick}>
      {label || (type && t(`common.searchTypes.${type}`))}
    </MenuItem>
  )
}
