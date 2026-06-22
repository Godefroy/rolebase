import { Title } from '@/common/atoms/Title'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Heading, Icon, Link, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import APICard from '../components/APICard'

export default function ApiPage() {
  const { t, i18n } = useTranslation()

  return (
    <>
      <Title>{t('Settings.api')}</Title>

      <VStack spacing={6} align="stretch" maxW="3xl">
        <Heading as="h1" size="lg">
          {t('Settings.api')}
        </Heading>

        <Text>{t('APICard.description')}</Text>

        <Link
          href={`/${i18n.language}/developers/custom-integrations`}
          isExternal
          color="blue.500"
          display="inline-flex"
          alignItems="center"
          w="fit-content"
        >
          {t('APICard.viewDocs')} <Icon as={ExternalLinkIcon} ml={1} />
        </Link>

        <APICard />
      </VStack>
    </>
  )
}
