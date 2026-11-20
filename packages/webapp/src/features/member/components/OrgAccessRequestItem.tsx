import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'
import { OrgAccessRequest } from '../hooks/useOrgAccessRequests'

interface Props {
  request: OrgAccessRequest
  onDecided(): Promise<unknown>
}

export default function OrgAccessRequestItem({ request, onDecided }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [loading, setLoading] = useState<'accept' | 'refuse'>()

  const handleDecide = async (accept: boolean) => {
    setLoading(accept ? 'accept' : 'refuse')
    try {
      await trpc.member.decideOrgAccessRequest.mutate({
        requestId: request.id,
        accept,
      })
      toast({
        title: t(
          accept
            ? 'OrgAccessRequests.toastAccepted'
            : 'OrgAccessRequests.toastRefused',
          { name: request.name }
        ),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      await onDecided()
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description:
          error?.message === 'Reached user limit'
            ? t('OrgAccessRequests.seatsLimit')
            : error?.message || undefined,
        status: 'error',
      })
    }
    setLoading(undefined)
  }

  return (
    <Flex
      align="center"
      gap={3}
      px={3}
      py={2}
      borderWidth="1px"
      borderRadius="md"
      flexWrap="wrap"
    >
      <Avatar size="sm" name={request.name} src={request.avatarUrl} />
      <Box flex={1} minW="150px">
        <Text fontWeight="semibold">{request.name}</Text>
        <Text fontSize="sm" color="gray.500">
          {request.email}
        </Text>
      </Box>
      <HStack>
        <Button
          size="sm"
          variant="ghost"
          isLoading={loading === 'refuse'}
          isDisabled={!!loading}
          onClick={() => handleDecide(false)}
        >
          {t('OrgAccessRequests.refuse')}
        </Button>
        <Button
          size="sm"
          colorScheme="blue"
          isLoading={loading === 'accept'}
          isDisabled={!!loading}
          onClick={() => handleDecide(true)}
        >
          {t('OrgAccessRequests.accept')}
        </Button>
      </HStack>
    </Flex>
  )
}
