import CircleAndMemberFilters from '@/circle/components/CircleAndMemberFilters'
import IconTextButton from '@/common/atoms/IconTextButton'
import useOrgMember from '@/member/hooks/useOrgMember'
import { BoxProps, Button, ButtonGroup, Flex, Spacer } from '@chakra-ui/react'
import { TasksViewTypes } from '@rolebase/shared/model/task'
import React, { ReactNode, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, KanbanIcon, TasksListIcon } from 'src/icons'
import { TasksModuleContext } from '../contexts/TasksModuleContext'
import TasksFilterStatus from './TasksFilterStatus'
import TasksSortMenu from './TasksSortMenu'

interface Props extends Omit<BoxProps, 'title'> {
  title?: ReactNode
  showCreateBtn?: boolean
}

export default function TasksHeader({
  title,
  showCreateBtn,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()

  const {
    view,
    circleId,
    memberId,
    status,
    onViewChange,
    onCircleChange,
    onMemberChange,
    onStatusChange,
    sort,
    onSortChange,
    openCreateTask,
  } = useContext(TasksModuleContext)

  // Reset status filter when switching to kanban view
  useEffect(() => {
    if (view === TasksViewTypes.Kanban && status !== undefined) {
      onStatusChange?.(undefined)
    }
  }, [view, onStatusChange])

  return (
    <Flex w="100%" alignItems="center" flexWrap="wrap" {...boxProps}>
      {title}

      {onViewChange && (
        <ButtonGroup isAttached variant="outline" size="sm" my={2}>
          <IconTextButton
            aria-label={t('TasksHeader.kanban')}
            showText
            icon={<KanbanIcon size={18} />}
            fontWeight={view === TasksViewTypes.Kanban ? 'bold' : 'normal'}
            onClick={() => onViewChange(TasksViewTypes.Kanban)}
          />
          <IconTextButton
            aria-label={t('TasksHeader.list')}
            showText
            icon={<TasksListIcon size={18} />}
            fontWeight={view === TasksViewTypes.List ? 'bold' : 'normal'}
            onClick={() => onViewChange(TasksViewTypes.List)}
          />
        </ButtonGroup>
      )}

      <CircleAndMemberFilters
        circleId={circleId}
        memberId={memberId}
        ml={5}
        my={2}
        onCircleChange={onCircleChange}
        onMemberChange={onMemberChange}
      >
        {onStatusChange && view === TasksViewTypes.List && (
          <TasksFilterStatus value={status} onChange={onStatusChange} />
        )}
        {sort && onSortChange && (
          <TasksSortMenu value={sort} onChange={onSortChange} />
        )}
      </CircleAndMemberFilters>

      <Spacer />

      {showCreateBtn && openCreateTask && isMember && (
        <Button
          size="md"
          colorScheme="blue"
          my={1}
          leftIcon={<CreateIcon size={20} />}
          onClick={() => openCreateTask()}
        >
          {t('TasksPage.create')}
        </Button>
      )}
    </Flex>
  )
}
