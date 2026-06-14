import { useToast } from '@chakra-ui/react'
import { TaskFragment, Task_Status_Enum, useUpdateTaskMutation } from '@gql'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function useUpdateTaskStatus() {
  const { t } = useTranslation()
  const toast = useToast()
  const [updateTask] = useUpdateTaskMutation()

  // Toggle done status of a task
  return useCallback(
    async (task: TaskFragment, status: Task_Status_Enum) => {
      // Update task
      await updateTask({ variables: { id: task.id, values: { status } } })

      // Toast
      toast({
        status: 'success',
        duration: 2000,
        title: t('useUpdateTaskStatus.toast', {
          status: t(`common.taskStatus.${status}`),
        }),
      })
    },
    [t]
  )
}
