import MemberPictureEdit from '@/member/components/MemberPictureEdit'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import {
  AVATAR_HEADING_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function OrgSetupStepAvatars() {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const members = orgData?.members ?? []

  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading as="h1" size="md">
          {t('OrgSetupModal.avatars.heading')}
        </Heading>
        <Text mt={1} fontSize="sm" color="gray.500">
          {t('OrgSetupModal.avatars.help')}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 3, md: 4 }} spacing={5}>
        {members.map((member) => (
          <VStack key={member.id} spacing={2}>
            <MemberPictureEdit
              id={member.id}
              name={member.name}
              src={
                getResizedImageUrl(member.picture, AVATAR_HEADING_WIDTH) ||
                undefined
              }
              size="xl"
            />
            <Text fontSize="sm" noOfLines={1} textAlign="center">
              {member.name}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </VStack>
  )
}
