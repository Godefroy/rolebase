import { Box, Button, Card, CardBody, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'
import { FiTrash2 } from 'react-icons/fi'

interface Props {
  title: string
  description: string
  buttonLabel: string
  buttonIcon?: IconType
  isDisabled?: boolean
  onClick(): void
  children?: React.ReactNode
}

// Settings card leading to a deletion or a departure
export default function DeletionCard({
  title,
  description,
  buttonLabel,
  buttonIcon: ButtonIcon = FiTrash2,
  isDisabled,
  onClick,
  children,
}: Props) {
  return (
    <Card
      variant="outline"
      borderColor="red.200"
      _dark={{ borderColor: 'red.800' }}
    >
      <CardBody>
        <Flex align="center" gap={4} wrap="wrap">
          <Box flex={1} minW="200px">
            <Text fontWeight="semibold">{title}</Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              {description}
            </Text>
          </Box>
          <Button
            colorScheme="red"
            variant="outline"
            leftIcon={<ButtonIcon />}
            isDisabled={isDisabled}
            onClick={onClick}
          >
            {buttonLabel}
          </Button>
        </Flex>
        {children && <Box mt={4}>{children}</Box>}
      </CardBody>
    </Card>
  )
}
