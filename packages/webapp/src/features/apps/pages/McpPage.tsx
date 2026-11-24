import { Title } from '@/common/atoms/Title'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Heading, Icon, Link, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import McpApiKeySelect from '../components/McpApiKeySelect'
import McpClientTabs from '../components/McpClientTabs'
import McpClientProvider from '../contexts/McpClientProvider'

export default function McpPage() {
  const { t, i18n } = useTranslation()

  return (
    <>
      <Title>{t('Settings.mcp')}</Title>

      <VStack spacing={6} align="stretch" maxW="3xl">
        <Heading as="h1" size="lg">
          {t('Settings.mcp')}
        </Heading>

        <Text>{t('McpPage.description')}</Text>

        <Link
          href={`/${i18n.language}/docs/mcp`}
          isExternal
          color="blue.500"
          display="inline-flex"
          alignItems="center"
          w="fit-content"
        >
          {t('McpPage.viewDocs')} <Icon as={ExternalLinkIcon} ml={1} />
        </Link>

        <McpClientProvider>
          <McpApiKeySelect />
          <McpClientTabs />
        </McpClientProvider>
      </VStack>
    </>
  )
}
