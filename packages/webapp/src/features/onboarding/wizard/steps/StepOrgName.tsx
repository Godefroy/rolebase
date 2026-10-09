import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from '@chakra-ui/react'
import OrgIconMenu from '@/org/components/OrgIconMenu'
import { getEmailDomainIconUrl } from '@rolebase/shared/helpers/getEmailDomainIconUrl'
import React, { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/user/hooks/useAuth'
import settings from 'src/settings'
import useCheckOrgSlug from '../hooks/useCheckOrgSlug'
import { OnboardingValues } from '../hooks/useOnboardingForm'

export default function StepOrgName() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const formMethods = useFormContext<OnboardingValues>()
  const {
    register,
    clearErrors,
    watch,
    setValue,
    formState: { errors },
  } = formMethods
  const iconFile = watch('iconFile')
  const domainIcon = watch('domainIcon')
  const checkSlug = useCheckOrgSlug(formMethods)

  // The org name can be prefilled: check its slug right away, and replace a
  // prefilled slug that is taken by a free variant
  useEffect(() => {
    const { isDirty } = formMethods.getFieldState('orgName')
    checkSlug(!isDirty && !formMethods.getFieldState('slug').isDirty)
  }, [])

  const handleBlur = () => {
    checkSlug()
  }

  // The org doesn't exist yet: show the uploaded image from memory, else the
  // email domain's icon from Google's service
  const iconFileUrl = useMemo(
    () => (iconFile ? URL.createObjectURL(iconFile) : undefined),
    [iconFile]
  )
  useEffect(
    () => () => {
      if (iconFileUrl) URL.revokeObjectURL(iconFileUrl)
    },
    [iconFileUrl]
  )
  const iconSrc =
    iconFileUrl || (domainIcon ? getEmailDomainIconUrl(user?.email) : undefined)

  const handleUploadIcon = (file: File) => setValue('iconFile', file)

  const handleRemoveIcon = () => {
    setValue('iconFile', null)
    setValue('domainIcon', false)
  }

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.orgName.heading')}
      </Heading>

      <HStack spacing={4}>
        <OrgIconMenu
          src={iconSrc}
          onUpload={handleUploadIcon}
          onRemove={handleRemoveIcon}
        />
        <FormControl isInvalid={!!errors.orgName}>
          <FormLabel>{t('OrgCreateModal.create.name')}</FormLabel>
          <Input
            {...register('orgName', { onBlur: handleBlur })}
            autoComplete="off"
          />
        </FormControl>
      </HStack>

      <FormControl isInvalid={!!errors.slug}>
        <FormLabel>{t('OrgCreateModal.create.slug')}</FormLabel>
        <InputGroup>
          <InputLeftAddon _dark={{ borderColor: 'whiteAlpha.400' }}>
            {settings.url}/
          </InputLeftAddon>
          <Input
            {...register('slug', {
              onChange: () => clearErrors('slug'),
              onBlur: handleBlur,
            })}
            maxLength={30}
          />
        </InputGroup>
        {errors.slug && (
          <FormErrorMessage>{errors.slug.message}</FormErrorMessage>
        )}
      </FormControl>

      {/* People whose team already uses Rolebase often sign up before being
          invited: the invitation replaces this wizard as soon as it is sent */}
      <Text fontSize="sm" color="gray.500">
        {t('Onboarding.orgName.joinTeam', { email: user?.email ?? '' })}
      </Text>
    </VStack>
  )
}
