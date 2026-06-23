import BrandModal from '@/common/atoms/BrandModal'
import TextError from '@/common/atoms/TextError'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Text,
  useMediaQuery,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { nameSchema, slugSchema } from '@rolebase/shared/schemas'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import slugify from 'slugify'
import { ChevronRightIcon } from 'src/icons'
import settings from 'src/settings'
import { trpc } from 'src/trpc'
import * as yup from 'yup'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'

interface Values {
  name: string
  slug: string
}

const resolver = yupResolver(
  yup.object().shape({
    name: nameSchema.required(),
    slug: slugSchema.required(),
  })
)

export default function OrgCreateModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [isSmallScreen] = useMediaQuery('(max-width: 900px)')

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver,
  })

  // Update slug value when name changes
  const name = watch('name')
  useEffect(() => {
    if (name) {
      setValue('slug', slugify(name, { strict: true }).toLowerCase())
    }
  }, [name])

  const onSubmit = handleSubmit(async ({ name, slug }) => {
    setLoading(true)
    setError(undefined)
    try {
      // Create org
      const orgId = await trpc.org.createOrg.mutate({ name, slug })

      // Close the modal (it may live in a persistent layout, e.g. OrgSwitch,
      // so navigating doesn't necessarily unmount it) and go straight into the
      // new org by slug. The org-setup step then opens inside the fresh org.
      setLoading(false)
      modalProps.onClose()
      navigate(`${getOrgPath({ id: orgId, slug })}/roles`)
    } catch (e: any) {
      setLoading(false)
      const message =
        e.message === 'Conflict'
          ? t('OrgSlugModal.already-exists')
          : e.message || e.toString()
      setError(new Error(message))
    }
  })

  return (
    <BrandModal size="6xl" bodyProps={{ mx: 10 }} {...modalProps}>
      <SimpleGrid columns={isSmallScreen ? 1 : 2} spacing="50px">
        <Box>
          <Heading as="h1" size="md" mb={7}>
            {t('OrgCreateModal.join.heading')}
          </Heading>
          {t('OrgCreateModal.join.text')}
        </Box>

        <form onSubmit={onSubmit}>
          <Heading as="h1" size="md" mb={7}>
            {t('OrgCreateModal.create.heading')}
          </Heading>

          <VStack spacing={7}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('OrgCreateModal.create.name')}</FormLabel>
              <Input {...register('name')} autoFocus autoComplete="off" />
            </FormControl>

            <FormControl isInvalid={!!errors.slug}>
              <FormLabel>{t('OrgCreateModal.create.slug')}</FormLabel>
              <InputGroup>
                <InputLeftAddon _dark={{ borderColor: 'whiteAlpha.400' }}>
                  {settings.url}/
                </InputLeftAddon>
                <Input {...register('slug')} maxLength={30} />
              </InputGroup>

              {errors.slug && (
                <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
              )}
            </FormControl>

            {error && <TextError error={error} />}

            <Button
              rightIcon={<ChevronRightIcon size="1em" />}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              ml={3}
            >
              {t('common.create')}
            </Button>
          </VStack>
        </form>

        <Box>
          <Heading as="h1" size="md" mb={7}>
            {t('OrgCreateModal.import.heading')}
          </Heading>
          <Text>{t('OrgCreateModal.import.text')}</Text>

          <Button
            colorScheme="blue"
            mt={7}
            onClick={() => {
              modalProps.onClose()
              navigate('/import')
            }}
          >
            {t('OrgCreateModal.import.button')}
          </Button>
        </Box>

        <OnboardingVideo type={OnboardingVideoType.CreateOrg} />
      </SimpleGrid>
    </BrandModal>
  )
}
