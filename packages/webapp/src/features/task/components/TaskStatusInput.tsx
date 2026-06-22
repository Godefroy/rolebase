import {
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Tag,
  TagProps,
} from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import { taskStatusList } from '@rolebase/shared/model/task'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { taskStatusColors } from 'src/theme'

interface Props extends Omit<TagProps, 'onChange'> {
  value: Task_Status_Enum
  readOnly?: boolean
  onChange(status: Task_Status_Enum): void
}

export default function TaskStatusInput({
  value,
  readOnly,
  onChange,
  ...tagProps
}: Props) {
  const { t } = useTranslation()

  return (
    <Menu isLazy>
      <MenuButton
        as={Tag}
        tabIndex={0}
        colorScheme={taskStatusColors[value]}
        fontSize={tagProps.size === 'lg' ? 'sm' : 'xs'}
        height="fit-content"
        cursor="pointer"
        disabled={readOnly}
        _hover={{
          opacity: 0.8,
        }}
        {...tagProps}
      >
        {t(`common.taskStatus.${value}`)}
      </MenuButton>

      <MenuList zIndex={2000}>
        <MenuOptionGroup type="radio" value={value}>
          {taskStatusList.map((status) => (
            <MenuItemOption
              key={status}
              value={status}
              onClick={() => onChange(status)}
            >
              {t(`common.taskStatus.${status}`)}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
