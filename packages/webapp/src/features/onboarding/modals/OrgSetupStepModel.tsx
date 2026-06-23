import OnboardingChoiceGroup from '@/onboarding/components/OnboardingChoiceGroup'
import { Heading, Text, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgType, orgTypePresets, orgTypes } from '../orgTypes'

interface Props {
  orgType: OrgType
  onChange(orgType: OrgType): void
}

export default function OrgSetupStepModel({ orgType, onChange }: Props) {
  const { t } = useTranslation()

  const options = useMemo(
    () =>
      orgTypes.map((type) => ({
        value: type,
        label: t(orgTypePresets[type].labelKey),
        description: t(orgTypePresets[type].helpKey),
      })),
    [t]
  )

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('OrgSetupModal.heading')}
      </Heading>
      <Text>{t('OrgSetupModal.subheading')}</Text>

      <OnboardingChoiceGroup
        ariaLabel={t('OrgSetupModal.orgType')}
        options={options}
        value={orgType}
        onChange={(v) => onChange(v as OrgType)}
        columns={1}
      />
    </VStack>
  )
}
