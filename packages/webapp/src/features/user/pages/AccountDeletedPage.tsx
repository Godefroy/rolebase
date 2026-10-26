import BrandModal from '@/common/atoms/BrandModal'
import { Title } from '@/common/atoms/Title'
import { Button, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiCheck } from 'react-icons/fi'
import { Link as ReactRouterLink } from 'react-router'
import settings from 'src/settings'

// Shown once the user deleted their own account (and was signed out)
export default function AccountDeletedPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title>{t('AccountDeletedPage.heading')}</Title>

      <BrandModal size="md" backButton={false} isOpen onClose={() => {}}>
        <VStack spacing={5} textAlign="center">
          <Flex
            align="center"
            justify="center"
            boxSize={12}
            borderRadius="full"
            bg="green.100"
            color="green.600"
            _dark={{ bg: 'green.900', color: 'green.200' }}
          >
            <Icon as={FiCheck} boxSize={6} />
          </Flex>
          <Heading as="h1" size="md">
            {t('AccountDeletedPage.heading')}
          </Heading>
          <Text color="gray.500">{t('AccountDeletedPage.info')}</Text>
          <Flex gap={3} wrap="wrap" justify="center">
            <Button as="a" href={settings.websiteUrl} colorScheme="blue">
              {t('AccountDeletedPage.website')}
            </Button>
            <Button as={ReactRouterLink} to="/signup" variant="ghost">
              {t('AccountDeletedPage.signup')}
            </Button>
          </Flex>
        </VStack>
      </BrandModal>
    </>
  )
}
