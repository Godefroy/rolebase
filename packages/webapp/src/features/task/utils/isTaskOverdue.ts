import { Task_Status_Enum } from '@gql'

export function isTaskOverdue(
  task: { dueDate?: string | null; status: Task_Status_Enum },
  now = new Date()
): boolean {
  return (
    !!task.dueDate &&
    task.status !== Task_Status_Enum.Done &&
    new Date(task.dueDate) < now
  )
}
