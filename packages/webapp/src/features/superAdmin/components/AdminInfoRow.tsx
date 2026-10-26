import { Box, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  label: string
  children: React.ReactNode
}

export default function AdminInfoRow({ label, children }: Props) {
  return (
    <>
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>
      <Box fontSize="sm" minW={0} wordBreak="break-word">
        {children ?? '-'}
      </Box>
    </>
  )
}
