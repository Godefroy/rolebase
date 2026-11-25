import { Center, Menu, MenuButton, Tooltip } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { taskStatusColors } from 'src/theme'
import TaskStatusIcon from './TaskStatusIcon'
import TaskStatusMenuList from './TaskStatusMenuList'

interface Props {
  value: Task_Status_Enum
  readOnly?: boolean
  onChange?(status: Task_Status_Enum): void
}

// Task status as a round checkbox in the status color, opening the status menu
export default function TaskStatusCheckbox({
  value,
  readOnly,
  onChange,
}: Props) {
  const { t } = useTranslation()
  const label = t(`common.taskStatus.${value}`)

  if (readOnly || !onChange) {
    return (
      <Tooltip label={label} openDelay={300}>
        <Center aria-label={label} w={6} h={6}>
          <TaskStatusIcon status={value} />
        </Center>
      </Tooltip>
    )
  }

  return (
    <Menu isLazy>
      <Tooltip label={label} openDelay={300}>
        <MenuButton
          aria-label={label}
          w={6}
          h={6}
          borderRadius="full"
          _hover={{
            bg: `${taskStatusColors[value]}.50`,
            _dark: { bg: 'whiteAlpha.100' },
          }}
          sx={{ '& > span': { display: 'flex', justifyContent: 'center' } }}
        >
          <TaskStatusIcon status={value} />
        </MenuButton>
      </Tooltip>

      <TaskStatusMenuList value={value} onChange={onChange} />
    </Menu>
  )
}
