import CircleAndMemberFilters from '@/circle/components/CircleAndMemberFilters'
import IconTextButton from '@/common/atoms/IconTextButton'
import useOrgMember from '@/member/hooks/useOrgMember'
import PageHeader, { pageHeaderButtonSize } from '@/common/atoms/PageHeader'
import { ButtonGroup, FlexProps, HStack } from '@chakra-ui/react'
import { TasksViewTypes } from '@rolebase/shared/model/task'
import React, { ReactNode, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon, KanbanIcon, TasksListIcon } from 'src/icons'
import { TasksModuleContext } from '../contexts/TasksModuleContext'
import TasksFilterStatus from './TasksFilterStatus'
import TasksSortMenu from './TasksSortMenu'

interface Props extends Omit<FlexProps, 'title'> {
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
    <PageHeader
      title={title}
      filters={
        <CircleAndMemberFilters
          circleId={circleId}
          memberId={memberId}
          my={2}
          onCircleChange={onCircleChange}
          onMemberChange={onMemberChange}
        >
          {onStatusChange && view === TasksViewTypes.List && (
            <TasksFilterStatus value={status} onChange={onStatusChange} />
          )}
          {sort && onSortChange && (
            <TasksSortMenu
              value={sort}
              onChange={onSortChange}
              className="page-header-inline-only"
            />
          )}
        </CircleAndMemberFilters>
      }
      actions={
        showCreateBtn &&
        openCreateTask &&
        isMember && (
          <IconTextButton
            aria-label={t('TasksPage.create')}
            showText="wide"
            size={pageHeaderButtonSize}
            colorScheme="blue"
            icon={<AddIcon size={20} />}
            onClick={() => openCreateTask()}
          />
        )
      }
      {...boxProps}
    >
      <HStack spacing={2}>
        {onViewChange && (
          <ButtonGroup isAttached variant="outline" size="sm" my={2}>
            <IconTextButton
              aria-label={t('TasksHeader.kanban')}
              showText="wide"
              icon={<KanbanIcon size={18} />}
              fontWeight={view === TasksViewTypes.Kanban ? 'bold' : 'normal'}
              isActive={view === TasksViewTypes.Kanban}
              onClick={() => onViewChange(TasksViewTypes.Kanban)}
            />
            <IconTextButton
              aria-label={t('TasksHeader.list')}
              showText="wide"
              icon={<TasksListIcon size={18} />}
              fontWeight={view === TasksViewTypes.List ? 'bold' : 'normal'}
              isActive={view === TasksViewTypes.List}
              onClick={() => onViewChange(TasksViewTypes.List)}
            />
          </ButtonGroup>
        )}

        {/* With stacked filters, sort sits on the title row to keep filters on one line */}
        {sort && onSortChange && (
          <TasksSortMenu
            value={sort}
            onChange={onSortChange}
            size="sm"
            variant="outline"
            fontWeight="normal"
            className="page-header-stacked-only"
          />
        )}
      </HStack>
    </PageHeader>
  )
}
