import { tasksColumnsMinWidth } from './TasksPage'
import useHasRoomForColumns from '@/layout/hooks/useHasRoomForColumns'
import PageCloseButton from '@/common/atoms/PageCloseButton'
import Page404 from '@/common/pages/Page404'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { Container } from '@chakra-ui/react'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import TaskContent from '../components/TaskContent'

type Params = {
  taskId: string
}

// Task detail, next to the tasks (desktop) or in their place (mobile)
export default function TaskPage() {
  const { taskId } = useParams<Params>()
  const navigate = useNavigate()
  const location = useLocation()
  const tasksPath = usePathInOrg('tasks')
  const hasColumns = useHasRoomForColumns(tasksColumnsMinWidth)

  // Back to the tasks, keeping their filters
  const handleClose = () => navigate(`${tasksPath}${location.search}`)

  if (!taskId) return <Page404 />

  return (
    <Container maxW="xl" px={6} py={hasColumns ? 5 : 10}>
      <TaskContent
        id={taskId}
        changeTitle
        headerIcons={<PageCloseButton onClick={handleClose} />}
        onClose={handleClose}
      />
    </Container>
  )
}
