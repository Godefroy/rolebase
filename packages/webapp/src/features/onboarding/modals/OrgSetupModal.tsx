import BrandModal from '@/common/atoms/BrandModal'
import OnboardingProgress from '@/onboarding/components/OnboardingProgress'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Button, Flex, Link, Spacer, useToast } from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import { nanoid } from 'nanoid'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from 'src/icons'
import useSeedOrg from '../hooks/useSeedOrg'
import { OrgType } from '../orgTypes'
import OrgSetupStepAvatars from './OrgSetupStepAvatars'
import OrgSetupStepModel from './OrgSetupStepModel'
import OrgSetupStepRoles from './OrgSetupStepRoles'
import { RoleDraft } from './orgSetupTypes'

interface Props {
  onClose(): void
}

enum SetupStep {
  Model = 'Model',
  Roles = 'Roles',
  Avatars = 'Avatars',
}

const stepOrder = [SetupStep.Model, SetupStep.Roles, SetupStep.Avatars]

// Org-setup steps shown right after an org is created: pick the organizational
// model, define the main roles (with their leader and participants), then add
// member pictures. The chart and meeting templates are seeded when leaving the
// roles step.
export default function OrgSetupModal({ onClose }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { orgId, orgData } = useOrgContext()
  const [updateOrg] = useUpdateOrgMutation()
  const seedOrg = useSeedOrg()

  const [step, setStep] = useState<SetupStep>(SetupStep.Model)
  const [orgType, setOrgType] = useState<OrgType>(OrgType.Classic)
  const [roles, setRoles] = useState<RoleDraft[]>([])
  const [loading, setLoading] = useState(false)

  const rootCircle = useMemo(
    () => orgData?.circles.find((c) => !c.parentId),
    [orgData]
  )

  // Each main role needs a name and a responsible before we can continue
  const canSeed =
    roles.length > 0 && roles.every((r) => r.name && r.responsibleId)

  // On the avatars step, suggest pictures; once everyone has one, finishing is
  // promoted from a skip link to a button.
  const members = orgData?.members ?? []
  const allHavePicture =
    members.length > 0 && members.every((m) => !!m.picture)

  const addRole = (name: string) =>
    setRoles((rs) => [...rs, { id: nanoid(8), name, participantIds: [] }])

  const updateRole = (id: string, patch: Partial<RoleDraft>) =>
    setRoles((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const removeRole = (id: string) =>
    setRoles((rs) => rs.filter((r) => r.id !== id))

  // Finish: persist the model, seed the chart + meetings, then close. Members
  // already exist (created while assigning roles), so seeding happens only here.
  const finish = async () => {
    if (!orgId || !rootCircle) return
    setLoading(true)
    try {
      await updateOrg({
        variables: { id: orgId, values: { onboardingOrgType: orgType } },
      })
      await seedOrg({
        orgType,
        rootCircleId: rootCircle.id,
        roles: roles.map((r) => ({
          name: r.name,
          responsibleId: r.responsibleId,
          participantIds: r.participantIds,
        })),
      })
      toast({
        title: t('OrgSetupModal.ready'),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      onClose()
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  return (
    <BrandModal
      size="2xl"
      bodyProps={{ mx: 10 }}
      backButton={false}
      isOpen
      autoFocus={false}
      closeOnEsc={false}
      onClose={onClose}
    >
      <OnboardingProgress
        total={stepOrder.length}
        current={stepOrder.indexOf(step)}
      />

      {step === SetupStep.Model && (
        <OrgSetupStepModel orgType={orgType} onChange={setOrgType} />
      )}
      {step === SetupStep.Roles && (
        <OrgSetupStepRoles
          orgType={orgType}
          roles={roles}
          onAdd={addRole}
          onChange={updateRole}
          onRemove={removeRole}
        />
      )}
      {step === SetupStep.Avatars && <OrgSetupStepAvatars />}

      <Flex mt={8} align="center">
        {stepOrder.indexOf(step) > 0 && (
          <Button
            variant="ghost"
            leftIcon={<ChevronLeftIcon size="1em" />}
            onClick={() => setStep(stepOrder[stepOrder.indexOf(step) - 1])}
            isDisabled={loading}
          >
            {t('common.back')}
          </Button>
        )}
        <Spacer />

        {step === SetupStep.Model && (
          <Button
            colorScheme="blue"
            rightIcon={<ChevronRightIcon size="1em" />}
            onClick={() => setStep(SetupStep.Roles)}
          >
            {t('common.next')}
          </Button>
        )}
        {step === SetupStep.Roles && (
          <Button
            colorScheme="blue"
            rightIcon={<ChevronRightIcon size="1em" />}
            onClick={() => setStep(SetupStep.Avatars)}
            isDisabled={!canSeed}
          >
            {t('common.continue')}
          </Button>
        )}
        {step === SetupStep.Avatars &&
          (allHavePicture ? (
            <Button colorScheme="blue" onClick={finish} isLoading={loading}>
              {t('Onboarding.finish')}
            </Button>
          ) : (
            <Link
              onClick={loading ? undefined : finish}
              opacity={loading ? 0.5 : 1}
              textDecoration="underline"
              cursor="pointer"
            >
              {t('OrgSetupModal.avatars.skip')}
            </Link>
          ))}
      </Flex>
    </BrandModal>
  )
}
