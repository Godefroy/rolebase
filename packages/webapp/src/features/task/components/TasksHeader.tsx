import CircleAndMemberFilters from '@/circle/components/CircleAndMemberFilters'
import IconTextButton from '@/common/atoms/IconTextButton'
import useOrgMember from '@/member/hooks/useOrgMember'
import PageHeader from '@/common/atoms/PageHeader'
import { ButtonGroup, FlexProps, HStack } from '@chakra-ui/react'
import { TasksViewTypes } from '@rolebase/shared/model/task'
import React, { ReactNode, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, KanbanIcon, TasksListIcon } from 'src/icons'
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
              display={{ base: 'none', md: 'inline-flex' }}
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
            showText={{ base: false, xl: true }}
            size="md"
            colorScheme="blue"
            icon={<CreateIcon size={20} />}
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
              showText={{ base: false, sm: true, md: false, xl: true }}
              icon={<KanbanIcon size={18} />}
              fontWeight={view === TasksViewTypes.Kanban ? 'bold' : 'normal'}
              isActive={view === TasksViewTypes.Kanban}
              onClick={() => onViewChange(TasksViewTypes.Kanban)}
            />
            <IconTextButton
              aria-label={t('TasksHeader.list')}
              showText={{ base: false, sm: true, md: false, xl: true }}
              icon={<TasksListIcon size={18} />}
              fontWeight={view === TasksViewTypes.List ? 'bold' : 'normal'}
              isActive={view === TasksViewTypes.List}
              onClick={() => onViewChange(TasksViewTypes.List)}
            />
          </ButtonGroup>
        )}

        {/* On mobile, sort sits on the title row to keep filters on one line */}
        {sort && onSortChange && (
          <TasksSortMenu
            value={sort}
            onChange={onSortChange}
            size="sm"
            variant="outline"
            fontWeight="normal"
            display={{ base: 'inline-flex', md: 'none' }}
          />
        )}
      </HStack>
    </PageHeader>
  )
}
