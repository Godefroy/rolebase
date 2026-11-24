import { Link, ListItem, OrderedList, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { McpClient } from '../mcpClients'
import McpCodeSnippet from './McpCodeSnippet'

interface Props {
  client: McpClient
}

export default function McpClientPanel({ client }: Props) {
  const { t, i18n } = useTranslation()
  const steps: string[] = client.hasSteps
    ? t(`McpPage.clients.${client.id}.steps`, { returnObjects: true })
    : []

  return (
    <VStack spacing={5} align="stretch">
      {steps.length > 0 && (
        <OrderedList spacing={1}>
          {steps.map((step, index) => (
            <ListItem key={index}>
              {/* Step already translated, parsed for its tags */}
              <Trans
                defaults={step}
                components={{
                  b: <Text as="strong" />,
                  code: <Text as="code" fontFamily="mono" fontSize="sm" />,
                  a: (
                    <Link href={client.stepsLink} isExternal color="blue.500" />
                  ),
                }}
              />
            </ListItem>
          ))}
        </OrderedList>
      )}

      {client.snippets.map((snippet) => (
        <McpCodeSnippet key={snippet.labelKey} snippet={snippet} />
      ))}

      {client.noteKey && (
        <Text fontSize="sm" color="gray.500">
          {t(client.noteKey)}
        </Text>
      )}

      {client.isDevTool && (
        <Link
          href={`/${i18n.language}/developers/mcp`}
          isExternal
          color="blue.500"
          fontSize="sm"
          w="fit-content"
        >
          {t('McpPage.devDocs')}
        </Link>
      )}
    </VStack>
  )
}
