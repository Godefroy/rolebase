import { Menu, MenuButton, Tag, TagProps } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { taskStatusColors } from 'src/theme'
import TaskStatusMenuList from './TaskStatusMenuList'

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

      <TaskStatusMenuList value={value} onChange={onChange} />
    </Menu>
  )
}
