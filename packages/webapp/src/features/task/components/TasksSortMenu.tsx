import {
  Button,
  ButtonProps,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react'
import { TasksSortTypes } from '@rolebase/shared/model/task'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, SortIcon } from 'src/icons'

interface Props extends Omit<ButtonProps, 'value' | 'onChange'> {
  value: TasksSortTypes
  onChange: (value: TasksSortTypes) => void
}

const tasksSortList = Object.values(TasksSortTypes)

export default function TasksSortMenu({ value, onChange, ...boxProps }: Props) {
  const { t } = useTranslation()

  const handleChange = useCallback(
    (sort: string | string[]) => {
      if (typeof sort !== 'string') return
      onChange(sort as TasksSortTypes)
    },
    [onChange]
  )

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<SortIcon size="1em" />}
        rightIcon={<ChevronDownIcon size="1em" />}
        {...boxProps}
      >
        {t(`TasksSortMenu.${value}`)}
      </MenuButton>
      <MenuList zIndex={2000}>
        <MenuOptionGroup type="radio" value={value} onChange={handleChange}>
          {tasksSortList.map((sort) => (
            <MenuItemOption key={sort} value={sort}>
              {t(`TasksSortMenu.${sort}`)}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
