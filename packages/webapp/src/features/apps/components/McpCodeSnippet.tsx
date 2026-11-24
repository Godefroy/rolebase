import {
  Box,
  IconButton,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from 'src/icons'
import useMcpClient from '../hooks/useMcpClient'
import { McpSnippet } from '../mcpClients'

interface Props {
  snippet: McpSnippet
}

export default function McpCodeSnippet({ snippet }: Props) {
  const { t } = useTranslation()
  const { serverUrl, selectedApiKey } = useMcpClient()

  const placeholder = t('McpPage.keyPlaceholder')
  const apiKey = selectedApiKey?.value ?? placeholder
  // The key is copied in full but stays hidden on screen
  const maskedKey = selectedApiKey
    ? `${selectedApiKey.value.slice(0, 4)}••••••••`
    : placeholder

  const code = snippet.getCode(serverUrl, apiKey)
  const displayedCode = snippet.getCode(serverUrl, maskedKey)
  const toast = useToast()
  const { onCopy, hasCopied, setValue } = useClipboard(code)

  useEffect(() => {
    setValue(code)
  }, [code])

  useEffect(() => {
    if (!hasCopied) return
    toast({ title: t('McpPage.copied'), status: 'info', duration: 1500 })
  }, [hasCopied])

  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" mb={1}>
        {t(snippet.labelKey)}
      </Text>
      <Box position="relative">
        <Box
          as="pre"
          fontFamily="mono"
          fontSize="xs"
          whiteSpace="pre-wrap"
          wordBreak="break-all"
          bg="gray.50"
          _dark={{ bg: 'whiteAlpha.100' }}
          borderRadius="md"
          p={3}
          pr={12}
        >
          {displayedCode}
        </Box>
        <Tooltip label={t('common.copy')} placement="bottom" hasArrow>
          <IconButton
            aria-label={t('common.copy')}
            icon={<CopyIcon size={18} />}
            size="sm"
            variant="ghost"
            position="absolute"
            top={1}
            right={1}
            onClick={onCopy}
          />
        </Tooltip>
      </Box>
      {snippet.keyInUrl && (
        <Text fontSize="xs" color="orange.500" mt={1}>
          {t('McpPage.keyInUrlWarning')}
        </Text>
      )}
    </Box>
  )
}
