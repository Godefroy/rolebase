import CircleByIdButton from '@/circle/components/CircleByIdButton'
import ListItemLayout from '@/common/atoms/ListItemLayout'
import useItemCardProps from '@/common/hooks/useItemCardProps'
import { getListItemTitleProps } from '@/common/utils/listItemTitleProps'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import MemberByIdAvatar from '@/member/components/MemberByIdAvatar'
import useOrgMember from '@/member/hooks/useOrgMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Avatar,
  Button,
  forwardRef,
  HStack,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Task_Status_Enum, TaskFragment } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as ReachLink, useLocation } from 'react-router'
import { PrivacyIcon } from 'src/icons'
import useUpdateTaskStatus from '../hooks/useUpdateTaskStatus'
import TaskModal from '../modals/TaskModal'
import TaskStatusCheckbox from './TaskStatusCheckbox'
import TaskDueDate from './TaskDueDate'
import TaskItemActions from './TaskItemActions'

interface Props extends LinkBoxProps {
  task: TaskFragment
  noModal?: boolean
  openButton?: boolean
  showCircle?: boolean
  showMember?: boolean
  showDueDate?: boolean
  isDragging?: boolean
  // Drag and drop enabled (manual order)
  draggable?: boolean
}

const TaskItem = forwardRef<Props, 'div'>(
  (
    {
      task,
      noModal,
      openButton,
      showCircle,
      showMember,
      showDueDate,
      isDragging,
      draggable,
      children,
      ...linkBoxProps
    },
    ref
  ) => {
    const { t } = useTranslation()
    const isMember = useOrgMember()
    const updateTaskStatus = useUpdateTaskStatus()

    const handleChangeStatus = (status: Task_Status_Enum) => {
      updateTaskStatus(task, status)
    }

    const path = usePathInOrg(`tasks/${task.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)

    // Block the browser's native drag of the link (drag and drop handles override it)
    const handleDragStart = (event: React.DragEvent) => event.preventDefault()

    // Is active?
    const location = useLocation()
    const isActive = location.pathname === path

    // Rich rows (with metadata) show the title on up to 2 lines
    // and the metadata below it on mobile
    const isStacked = !!(showCircle || showMember || showDueDate)
    const titleProps = getListItemTitleProps(isStacked)

    const cardProps = useItemCardProps({ draggable, isDragging })

    return (
      <>
        <LinkBox
          ref={ref}
          onDragStart={handleDragStart}
          {...(isStacked
            ? { ...cardProps, mb: 2 }
            : {
                p: 1,
                boxShadow: isDragging ? 'lg' : 'none',
                bg: isDragging ? 'gray.50' : undefined,
                _dark: { bg: isDragging ? 'gray.700' : undefined },
                _hover: openButton ? undefined : { bg: 'bgItemHover' },
              })}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redondant with link
            undefined
          }
          className={isActive ? 'active' : undefined}
        >
          <ListItemLayout
            stacked={isStacked}
            icon={
              <TaskStatusCheckbox
                value={task.status}
                readOnly={!isMember}
                onChange={handleChangeStatus}
              />
            }
            title={
              openButton ? (
                <Text {...titleProps}>{task.title}</Text>
              ) : (
                <LinkOverlay
                  as={ReachLink}
                  to={path}
                  {...titleProps}
                  onClick={noModal ? undefined : handleOpen}
                >
                  {task.title}
                </LinkOverlay>
              )
            }
            corner={
              (task?.private || isStacked) && (
                <HStack spacing={1.5}>
                  {task?.private && <PrivacyIcon size={16} />}
                  {isStacked && <TaskItemActions task={task} />}
                </HStack>
              )
            }
            metaStart={
              showDueDate &&
              task.dueDate && (
                <TaskDueDate dueDate={task.dueDate} status={task.status} />
              )
            }
            meta={
              <>
                {showCircle && (
                  <CircleByIdButton id={task.circleId} size="xs" />
                )}

                {showMember &&
                  (task.memberId ? (
                    <MemberByIdAvatar id={task.memberId} size="xs" />
                  ) : (
                    <Avatar name="?" size="xs" />
                  ))}

                {children}

                {openButton && (
                  <Button size="sm" variant="outline" onClick={onOpen}>
                    {t('TaskItem.open')}
                  </Button>
                )}
              </>
            }
          />
        </LinkBox>

        {isOpen && <TaskModal id={task.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

TaskItem.displayName = 'TaskItem'

export default TaskItem
