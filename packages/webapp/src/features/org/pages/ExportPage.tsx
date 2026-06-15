import { Title } from '@/common/atoms/Title'
import useOrg from '@/org/hooks/useOrg'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExportIcon } from 'src/icons'
import { trpc } from 'src/trpc'

const optionalEntities = ['decisions', 'tasks', 'threads', 'meetings'] as const

type ExportFormat = 'xlsx' | 'json'

export default function ExportPage() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const org = useOrg(orgId)
  const toast = useToast()

  const [format, setFormat] = useState<ExportFormat>('xlsx')
  const [entities, setEntities] = useState<string[]>([...optionalEntities])
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!orgId) return
    setLoading(true)

    try {
      const result = await trpc.org.exportOrg.mutate({
        orgId,
        format,
        entities,
      })

      // Download file
      let blob: Blob
      if (format === 'xlsx') {
        // Data is base64 encoded
        const binary = atob(result.data)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        blob = new Blob([bytes], { type: result.contentType })
      } else {
        blob = new Blob([result.data], { type: result.contentType })
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: t('ExportPage.toastSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch {
      toast({
        title: t('ExportPage.toastError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!org || !orgId) return null

  return (
    <>
      <Title>{t('ExportPage.heading')}</Title>

      <VStack spacing={8} align="start" maxW="xl">
        <Heading as="h1" size="lg">
          {t('ExportPage.heading')}
        </Heading>

        <Text>{t('ExportPage.description')}</Text>

        <FormControl>
          <FormLabel fontWeight="bold">{t('ExportPage.format')}</FormLabel>
          <RadioGroup
            value={format}
            onChange={(v) => setFormat(v as ExportFormat)}
          >
            <Stack spacing={3}>
              <Radio value="xlsx">XLSX (Excel)</Radio>
              <Radio value="json">JSON</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">{t('ExportPage.entities')}</FormLabel>
          <Stack spacing={2}>
            <Checkbox isChecked isDisabled>
              {t('ExportPage.entity.members')}
            </Checkbox>
            <Checkbox isChecked isDisabled>
              {t('ExportPage.entity.orgChart')}
            </Checkbox>
            <CheckboxGroup
              value={entities}
              onChange={(v) => setEntities(v as string[])}
            >
              {optionalEntities.map((entity) => (
                <Checkbox key={entity} value={entity}>
                  {t(`ExportPage.entity.${entity}`)}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </Stack>
        </FormControl>

        <Button
          colorScheme="blue"
          leftIcon={<ExportIcon size={20} />}
          onClick={handleExport}
          isLoading={loading}
        >
          {t('ExportPage.button')}
        </Button>
      </VStack>
    </>
  )
}
