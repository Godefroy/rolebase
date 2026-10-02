import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
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
    formState: { errors },
  } = formMethods
  const checkSlug = useCheckOrgSlug(formMethods)

  // The org name can be prefilled: check its slug right away
  useEffect(() => {
    checkSlug()
  }, [])

  const handleBlur = () => {
    checkSlug()
  }

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('Onboarding.orgName.heading')}
      </Heading>

      <FormControl isInvalid={!!errors.orgName}>
        <FormLabel>{t('OrgCreateModal.create.name')}</FormLabel>
        <Input
          {...register('orgName', { onBlur: handleBlur })}
          autoComplete="off"
        />
      </FormControl>

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
