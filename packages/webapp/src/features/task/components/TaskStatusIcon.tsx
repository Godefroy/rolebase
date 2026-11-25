import { Box, Center, CenterProps } from '@chakra-ui/react'
import { Task_Status_Enum } from '@gql'
import React from 'react'
import { CheckIcon } from 'src/icons'
import { taskStatusColors } from 'src/theme'

interface Props extends CenterProps {
  status: Task_Status_Enum
}

// Round status icon in the status color: empty (open), dot, or checked (done)
export default function TaskStatusIcon({ status, ...centerProps }: Props) {
  const color = taskStatusColors[status]
  const isDone = status === Task_Status_Enum.Done
  const isOpen = status === Task_Status_Enum.Open

  return (
    <Center
      w="18px"
      h="18px"
      flexShrink={0}
      borderRadius="full"
      borderWidth="2px"
      borderColor={isOpen ? 'gray.300' : `${color}.400`}
      bg={isDone ? `${color}.400` : undefined}
      color="white"
      _dark={{ borderColor: isOpen ? 'gray.500' : `${color}.300` }}
      {...centerProps}
    >
      {isDone ? (
        <CheckIcon size={11} strokeWidth={4} />
      ) : (
        !isOpen && (
          <Box w="8px" h="8px" borderRadius="full" bg={`${color}.400`} />
        )
      )}
    </Center>
  )
}
