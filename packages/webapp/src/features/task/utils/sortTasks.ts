import { TaskFragment } from '@gql'
import { TasksSortTypes } from '@rolebase/shared/model/task'

const getTime = (date: string) => new Date(date).getTime()

const compareFunctions: Record<
  Exclude<TasksSortTypes, TasksSortTypes.Manual>,
  (a: TaskFragment, b: TaskFragment) => number
> = {
  // Nearest due date first, tasks without due date last
  [TasksSortTypes.DueDate]: (a, b) => {
    if (!a.dueDate || !b.dueDate) {
      return Number(!a.dueDate) - Number(!b.dueDate)
    }
    return getTime(a.dueDate) - getTime(b.dueDate)
  },
  // Newest first
  [TasksSortTypes.CreatedAt]: (a, b) =>
    getTime(b.createdAt) - getTime(a.createdAt),
  // Alphabetical
  [TasksSortTypes.Title]: (a, b) =>
    a.title.localeCompare(b.title, undefined, {
      sensitivity: 'base',
      numeric: true,
    }),
}

// Sort tasks for display, keeping the given order for equal items
export function sortTasks(
  tasks: TaskFragment[],
  sort: TasksSortTypes
): TaskFragment[] {
  if (sort === TasksSortTypes.Manual) return tasks
  return [...tasks].sort(compareFunctions[sort])
}
