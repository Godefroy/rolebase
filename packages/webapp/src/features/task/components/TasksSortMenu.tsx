import IconTextButton from '@/common/atoms/IconTextButton'
import {
  Box,
  ButtonProps,
  Circle,
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
        as={IconTextButton}
        showText={{ base: false, sm: true }}
        icon={
          <Box position="relative">
            <SortIcon size="1em" />
            {value !== TasksSortTypes.Manual && (
              // Shows an active sort when the label is hidden
              <Circle
                display={{ base: 'block', sm: 'none' }}
                size="7px"
                position="absolute"
                top="-3px"
                right="-4px"
                bg="blue.500"
                _dark={{ bg: 'blue.300' }}
              />
            )}
          </Box>
        }
        rightIcon={<ChevronDownIcon size="1em" />}
        aria-label={t(`TasksSortMenu.${value}`)}
        {...boxProps}
      />
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
