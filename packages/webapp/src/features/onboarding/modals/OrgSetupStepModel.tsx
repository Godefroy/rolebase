import OnboardingChoiceGroup from '@/onboarding/components/OnboardingChoiceGroup'
import { Heading, Link, Text, VStack } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgType, orgTypePresets } from '../orgTypes'

interface Props {
  orgType: OrgType
  onChange(orgType: OrgType): void
}

// Models offered as a practice rather than a method name. Holacracy v4 is an
// expert choice, one link away.
const mainOrgTypes = [OrgType.Classic, OrgType.Sociocracy, OrgType.HolacracyV5]

export default function OrgSetupStepModel({ orgType, onChange }: Props) {
  const { t } = useTranslation()
  const [showV4, setShowV4] = useState(orgType === OrgType.HolacracyV4)

  const options = useMemo(
    () =>
      [...mainOrgTypes, ...(showV4 ? [OrgType.HolacracyV4] : [])].map(
        (type) => ({
          value: type,
          label: t(`OrgSetupModal.model.options.${type}`),
          // What the choice produces reassures more than the method's name:
          // the base roles and the meeting templates
          description: [
            t('OrgSetupModal.model.baseRoles', {
              roles: orgTypePresets[type].baseRoles
                .map((role) => t(`Onboarding.roles.${role.nameKey}.name`))
                .join(', '),
            }),
            t('OrgSetupModal.model.meetingTemplates', {
              templates: orgTypePresets[type].meetingTemplates
                .map(({ titleKey }) => t(`Onboarding.meetings.${titleKey}`))
                .join(', '),
            }),
          ].join('\n'),
        })
      ),
    [t, showV4]
  )

  const handleShowV4 = () => {
    setShowV4(true)
    onChange(OrgType.HolacracyV4)
  }

  return (
    <VStack spacing={5} align="stretch">
      <Heading as="h1" size="md">
        {t('OrgSetupModal.model.heading')}
      </Heading>
      <Text>{t('OrgSetupModal.model.subheading')}</Text>

      <OnboardingChoiceGroup
        ariaLabel={t('OrgSetupModal.model.heading')}
        options={options}
        value={orgType}
        onChange={(v) => onChange(v as OrgType)}
        columns={1}
      />

      <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
        {t('OrgSetupModal.model.editable')}
      </Text>

      {!showV4 && (
        <Link
          as="button"
          type="button"
          fontSize="sm"
          color="gray.500"
          _dark={{ color: 'gray.400' }}
          textDecoration="underline"
          alignSelf="start"
          onClick={handleShowV4}
        >
          {t('OrgSetupModal.model.v4')}
        </Link>
      )}
    </VStack>
  )
}
