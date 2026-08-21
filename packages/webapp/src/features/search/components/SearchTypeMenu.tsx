import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonProps,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchFilterType } from '../searchTypes'
import { searchIcons } from './SearchResultIcon'
import SearchTypeMenuItem from './SearchTypeMenuItem'

interface Props<T extends SearchFilterType>
  extends Omit<ButtonProps, 'value' | 'onChange'> {
  types: readonly T[]
  value?: NoInfer<T>
  placeholder?: string
  onChange(type: NoInfer<T> | undefined): void
}

export default function SearchTypeMenu<T extends SearchFilterType>({
  types,
  value,
  placeholder,
  onChange,
  ...buttonProps
}: Props<T>) {
  const { t } = useTranslation()
  const type = value as SearchFilterType | undefined
  const Icon = type && searchIcons[type]
  const allText = t('common.searchTypes.All')

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={Icon ? <Icon size={20} /> : undefined}
        rightIcon={<ChevronDownIcon />}
        {...buttonProps}
      >
        {type ? t(`common.searchTypes.${type}`) : placeholder || allText}
      </MenuButton>

      <MenuList>
        <SearchTypeMenuItem
          label={allText}
          onClick={() => onChange(undefined)}
        />

        {types.map((menuType) => (
          <SearchTypeMenuItem
            key={menuType}
            type={menuType}
            onClick={() => onChange(menuType)}
          />
        ))}
      </MenuList>
    </Menu>
  )
}
