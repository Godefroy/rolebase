import { Flex, MenuItem, MenuList, Portal } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import { taskStatusList } from '@rolebase/shared/model/task'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon } from 'src/icons'
import TaskStatusIcon from './TaskStatusIcon'

interface Props {
  value: Task_Status_Enum
  onChange(status: Task_Status_Enum): void
}

// Status choices, each with its colored icon, the current one checked
export default function TaskStatusMenuList({ value, onChange }: Props) {
  const { t } = useTranslation()

  return (
    // Portal: cards create their own stacking context
    <Portal>
      <MenuList zIndex={2000}>
        {taskStatusList.map((status) => (
          <MenuItem
            key={status}
            role="menuitemradio"
            aria-checked={status === value}
            icon={<TaskStatusIcon status={status} />}
            onClick={() => onChange(status)}
          >
            <Flex as="span" align="center" justify="space-between" gap={4}>
              {t(`common.taskStatus.${status}`)}
              {status === value && <CheckIcon size={16} />}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Portal>
  )
}
