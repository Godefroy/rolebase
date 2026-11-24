import CircleByIdButton from '@/circle/components/CircleByIdButton'
import ListItemLayout from '@/common/atoms/ListItemLayout'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import useItemCardProps from '@/common/hooks/useItemCardProps'
import { getListItemTitleProps } from '@/common/utils/listItemTitleProps'
import MemberByIdAvatar from '@/member/components/MemberByIdAvatar'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Avatar,
  forwardRef,
  HStack,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { TaskFragment } from '@gql'
import React from 'react'
import { Link as ReachLink } from 'react-router'
import { PrivacyIcon } from 'src/icons'
import TaskModal from '../modals/TaskModal'
import TaskDueDate from './TaskDueDate'
import TaskItemActions from './TaskItemActions'

interface Props extends LinkBoxProps {
  task: TaskFragment
  showCircle?: boolean
  showMember?: boolean
  isDragging?: boolean
  // Drag and drop enabled (manual order)
  draggable?: boolean
}

const TaskCard = forwardRef<Props, 'div'>(
  (
    {
      task,
      showCircle,
      showMember,
      isDragging,
      draggable,
      children,
      ...linkBoxProps
    },
    ref
  ) => {
    const path = usePathInOrg(`tasks/${task.id}`)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleOpen = useNormalClickHandler(onOpen)

    // Block the browser's native drag of the link (drag and drop handles override it)
    const handleDragStart = (event: React.DragEvent) => event.preventDefault()

    const cardProps = useItemCardProps({ draggable, isDragging, onColor: true })

    return (
      <>
        <LinkBox
          ref={ref}
          onDragStart={handleDragStart}
          {...cardProps}
          {...linkBoxProps}
          tabIndex={
            // Remove tabIndex because it's redondant with link
            undefined
          }
        >
          <ListItemLayout
            stacked
            title={
              <LinkOverlay
                as={ReachLink}
                to={path}
                {...getListItemTitleProps(true)}
                noOfLines={3}
                onClick={handleOpen}
              >
                {task.title}
              </LinkOverlay>
            }
            corner={
              <HStack spacing={1.5}>
                {task?.private && <PrivacyIcon size={16} />}
                <TaskItemActions task={task} />
              </HStack>
            }
            metaStart={
              task.dueDate && (
                <TaskDueDate dueDate={task.dueDate} status={task.status} />
              )
            }
            meta={
              showCircle || showMember || children ? (
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
                </>
              ) : undefined
            }
          />
        </LinkBox>

        {isOpen && <TaskModal id={task.id} isOpen onClose={onClose} />}
      </>
    )
  }
)

TaskCard.displayName = 'TaskCard'

export default TaskCard
