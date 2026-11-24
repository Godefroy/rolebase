import { Task_Status_Enum } from '../gql'

// Ordered list of task statuses
export const taskStatusList = [
  Task_Status_Enum.Open,
  Task_Status_Enum.InProgress,
  Task_Status_Enum.InReview,
  Task_Status_Enum.Blocked,
  Task_Status_Enum.Done,
]

export enum TasksViewTypes {
  Kanban = 'Kanban',
  List = 'List',
}

export enum TasksSortTypes {
  Manual = 'Manual',
  DueDate = 'DueDate',
  CreatedAt = 'CreatedAt',
  Title = 'Title',
}
