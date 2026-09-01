import BrandModal from '@/common/atoms/BrandModal'
import Loading from '@/common/atoms/Loading'
import { Title } from '@/common/atoms/Title'
import { useAuth } from '@/user/hooks/useAuth'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { Crisp } from 'crisp-sdk-web'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { ChevronRightIcon, UploadIcon } from 'src/icons'
import { track } from 'src/analytics'
import { nhost } from 'src/nhost'
import { trpc } from 'src/trpc'

enum ImportProviders {
  Holaspirit = 'Holaspirit',
  GlassFrog = 'GlassFrog',
  Maptio = 'Maptio',
  Peerdom = 'Peerdom',
  Excel = 'Excel',
  CSV = 'CSV',
}

const supportedProviders: ImportProviders[] = [ImportProviders.Holaspirit]

enum ImportSteps {
  Provider,
  Upload,
  Loading,
  Success,
  Error,
  Unknown,
}

// Send feature request
function handleSendSupport(text: string, fileName?: string, fileUrl?: string) {
  Crisp.message.sendText(text)
  if (fileName && fileUrl) {
    Crisp.message.sendFile({
      name: fileName,
      url: fileUrl,
      type: 'text/application',
    })
  }
}

export default function ImportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(ImportSteps.Provider)

  const handleBack = () => {
    if (step === ImportSteps.Provider) {
      navigate(-1)
    } else {
      setStep(ImportSteps.Provider)
    }
  }

  // New org if after creation
  const [newOrgId, setNewOrgId] = useState<string | undefined>()

  // Provider selection
  const [showOtherProvider, setShowOtherProvider] = useState(false)
  const [provider, setProvider] = useState('')

  const handleSelectProvider = (p: ImportProviders) => {
    setProvider(p)
    setStep(ImportSteps.Upload)
  }

  const handleSubmitProvider = () => {
    setStep(ImportSteps.Upload)
  }

  // Upload
  const [terms, setTerms] = useState(false)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    setStep(ImportSteps.Loading)

    // Upload file
    try {
      const { body } = await nhost.storage.uploadFiles({
        'file[]': [file],
        'metadata[]': [{ name: `users/${user?.id}/org-to-import` }],
      })

      // Save picture url to member
      const fileId = body.processedFiles[0].id
      const fileUrl = `${nhost.storage.baseURL}/files/${fileId}`

      if (!supportedProviders.includes(provider as ImportProviders)) {
        // Provider not supported: send feature request
        handleSendSupport(
          `Feature request: ${provider} import`,
          file.name,
          fileUrl
        )
        setStep(ImportSteps.Unknown)
        return
      }

      // Import org with nhost function
      try {
        const orgId = await trpc.org.importOrg.mutate({ provider, fileId })
        track('org_imported', { provider })
        setNewOrgId(orgId)
        setStep(ImportSteps.Success)
      } catch (error: any) {
        track('org_import_failed', { provider, reason: error?.message })
        handleSendSupport(
          `Error importing org (${provider}): ${error.message}`,
          file.name,
          fileUrl
        )
        setStep(ImportSteps.Error)
      }
    } catch (error: any) {
      handleSendSupport(`Error importing org (${provider}): ${error.message}`)
      setStep(ImportSteps.Error)
    }
  }

  return (
    <BrandModal size="2xl" isOpen onClose={handleBack}>
      <Title>{t('ImportPage.title')}</Title>

      {step === ImportSteps.Provider && (
        <>
          <Heading as="h1" size="md" mb={7}>
            {t('ImportPage.provider.heading')}
          </Heading>

          <Text>{t('ImportPage.provider.text')}</Text>

          <Wrap spacing={3} mt={3}>
            {Object.values(ImportProviders).map((provider) => (
              <Button
                key={provider}
                colorScheme="blue"
                px={7}
                onClick={() => handleSelectProvider(provider)}
              >
                {provider}
              </Button>
            ))}

            <Button
              colorScheme="blue"
              variant="outline"
              px={7}
              onClick={() => setShowOtherProvider((show) => !show)}
            >
              {t('ImportPage.provider.other')}
            </Button>
          </Wrap>

          {showOtherProvider && (
            <>
              <FormControl mt={10}>
                <FormLabel>{t('ImportPage.provider.otherName')}</FormLabel>
                <Input
                  autoFocus
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                />
              </FormControl>

              <Box textAlign="right">
                <Button
                  colorScheme="blue"
                  mt={3}
                  onClick={handleSubmitProvider}
                >
                  {t('ImportPage.provider.otherSubmit')}
                </Button>
              </Box>
            </>
          )}
        </>
      )}

      {step === ImportSteps.Upload && (
        <form>
          <Heading as="h1" size="md" mb={7}>
            {t('ImportPage.upload.heading', { provider })}
          </Heading>

          {provider === ImportProviders.Holaspirit && (
            <Text
              dangerouslySetInnerHTML={{
                __html: t('ImportPage.upload.text-Holaspirit'),
              }}
              mb={5}
              sx={{ a: { textDecoration: 'underline' } }}
            />
          )}

          <Checkbox
            required
            fontWeight="bold"
            isChecked={terms}
            onChange={() => setTerms((t) => !t)}
          >
            {t('ImportPage.upload.terms')}
          </Checkbox>

          <input
            ref={fileRef}
            onChange={handleFileChange}
            type="file"
            accept="*.xlsx"
            style={{ display: 'none' }}
          />

          <Button
            colorScheme="green"
            leftIcon={<UploadIcon />}
            mt={5}
            isDisabled={!terms}
            onClick={() => fileRef?.current?.click()}
          >
            {t('ImportPage.upload.button')}
          </Button>
        </form>
      )}

      {step === ImportSteps.Success && (
        <>
          <Heading as="h1" size="md" mb={7}>
            {t('ImportPage.success.heading')}
          </Heading>

          <Text>{t('ImportPage.success.text')}</Text>

          <Button
            colorScheme="blue"
            mt={5}
            rightIcon={<ChevronRightIcon size="1em" />}
            onClick={() => navigate(`/orgs/${newOrgId}`)}
          >
            {t('ImportPage.success.button')}
          </Button>
        </>
      )}

      {step === ImportSteps.Loading && (
        <>
          <Heading as="h1" size="md" mb={7} display="flex">
            {t('ImportPage.loading.heading')}
            <Loading active size="md" ml={5} />
          </Heading>

          <Text>{t('ImportPage.loading.text')}</Text>
        </>
      )}

      {step === ImportSteps.Error && (
        <>
          <Heading as="h1" size="md" mb={7}>
            {t('ImportPage.error.heading')}
          </Heading>

          <Text>{t('ImportPage.error.text')}</Text>
        </>
      )}

      {step === ImportSteps.Unknown && (
        <>
          <Heading as="h1" size="md" mb={7}>
            {t('ImportPage.unknown.heading')}
          </Heading>

          <Text>{t('ImportPage.unknown.text')}</Text>
        </>
      )}
    </BrandModal>
  )
}
