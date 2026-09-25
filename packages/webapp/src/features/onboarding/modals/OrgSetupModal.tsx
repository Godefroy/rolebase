import BrandModal from '@/common/atoms/BrandModal'
import OnboardingProgress from '@/onboarding/components/OnboardingProgress'
import useSubscriptionData from '@/orgSubscription/hooks/useSubscriptionData'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Button, Flex, Link, Spacer, useToast } from '@chakra-ui/react'
import { Member_Role_Enum, useUpdateOrgMutation } from '@gql'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track, trackOnce } from 'src/analytics'
import { ChevronLeftIcon, ChevronRightIcon, EmailIcon } from 'src/icons'
import { trpc } from 'src/trpc'
import useCreateMember from '@/member/hooks/useCreateMember'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { getNameFromEmail } from '@utils/getNameFromEmail'
import { getValidInvites, isNewInvite } from '../getValidInvites'
import useSeedOrg from '../hooks/useSeedOrg'
import { getRepresentativeRole, OrgType } from '../orgTypes'
import OrgSetupStepInvite from './OrgSetupStepInvite'
import OrgSetupStepModel from './OrgSetupStepModel'
import OrgSetupStepRoles from './OrgSetupStepRoles'
import { RoleDraft } from './orgSetupTypes'

interface Props {
  onClose(): void
}

enum SetupStep {
  Model = 'Model',
  Roles = 'Roles',
  Invite = 'Invite',
}

const stepOrder = [SetupStep.Model, SetupStep.Roles, SetupStep.Invite]

// Org-setup steps shown right after an org is created: pick the organizational
// model, define the main roles (with their leader and participants), then
// invite the members typed along the way. The chart and meeting templates are
// seeded on finish. The setup is mandatory: there is no close control, and the
// modal comes back until it is finished (see OrgSetupTrigger).
export default function OrgSetupModal({ onClose }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { orgId, orgData } = useOrgContext()
  const [updateOrg] = useUpdateOrgMutation()
  const seedOrg = useSeedOrg()
  const createMember = useCreateMember()
  const { availableSeats } = useSubscriptionData()

  useEffect(() => {
    track('org_setup_started')
  }, [])

  const [step, setStep] = useState<SetupStep>(SetupStep.Model)
  const [orgType, setOrgType] = useState<OrgType>(OrgType.Classic)
  const [roles, setRoles] = useState<RoleDraft[]>([])
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Start the roles step with a first role held by the person setting up, so
  // it shows what a filled role looks like and can be continued right away:
  // a "Direction" role for a classic org, the model's leader base role in the
  // root circle otherwise. Replaced when the model changes, until edited.
  const currentMember = useCurrentMember()
  const prefilledRole = useRef<RoleDraft>()
  const prefillRoles = () => {
    const isClassic = orgType === OrgType.Classic
    const leaderName = t(
      `Onboarding.roles.${getRepresentativeRole(orgType).nameKey}.name`
    )
    const untouched =
      roles.length === 0 ||
      (roles.length === 1 && roles[0] === prefilledRole.current)
    if (!untouched || !currentMember?.userId) {
      // Keep the leader base role named after the current model
      setRoles((rs) =>
        rs.map((r) => (r.isLeaderBaseRole ? { ...r, name: leaderName } : r))
      )
      return
    }
    const role: RoleDraft = {
      id: nanoid(8),
      name: isClassic ? t('Onboarding.roleExamples.direction') : leaderName,
      isLeaderBaseRole: !isClassic,
      responsibleId: currentMember.id,
      participantIds: [],
    }
    prefilledRole.current = role
    setRoles([role])
  }

  const rootCircle = useMemo(
    () => orgData?.circles.find((c) => !c.parentId),
    [orgData]
  )

  // Each main role needs a name. Its responsible is optional: a vacant role is
  // a legitimate state, and the org chart shows it.
  const canSeed = roles.length > 0 && roles.every((r) => r.name.trim())

  const members = orgData?.members ?? []
  const membersToInvite = members.filter((m) => !m.userId && !m.inviteEmail)
  const invites = getValidInvites(emails)

  // Leaving means closing the tab: report the step it happened on
  const stepRef = useRef(step)
  stepRef.current = step
  useEffect(() => {
    const handlePageHide = () =>
      trackOnce('org_setup_abandoned', { step: stepRef.current })
    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [])

  const addRole = (name: string) =>
    setRoles((rs) => [...rs, { id: nanoid(8), name, participantIds: [] }])

  const updateRole = (id: string, patch: Partial<RoleDraft>) =>
    setRoles((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const removeRole = (id: string) =>
    setRoles((rs) => rs.filter((r) => r.id !== id))

  // Send the invitations one by one: a failure on one address does not stop
  // the others. People typed by their address alone become members first,
  // named after it. Returns the number of invitations sent.
  const sendInvites = async () => {
    let sent = 0
    for (const invite of invites) {
      const { email } = invite
      try {
        const memberId = isNewInvite(invite.memberId)
          ? await createMember(getNameFromEmail(email) || email)
          : invite.memberId
        await trpc.member.inviteMember.mutate({
          memberId,
          email,
          role: Member_Role_Enum.Member,
        })
        sent++
      } catch (error) {
        console.error(error)
      }
    }
    if (sent > 0) track('member_invited', { count: sent, source: 'onboarding' })
    if (sent < invites.length) {
      toast({
        title: t('OrgSetupModal.invite.partialError', {
          count: invites.length - sent,
        }),
        status: 'warning',
        duration: 6000,
        isClosable: true,
      })
    }
    return sent
  }

  // Finish: persist the model, seed the chart + meetings, send the
  // invitations if asked, then close. Members already exist (created while
  // assigning roles), so seeding happens only here.
  const finish = async (withInvites: boolean) => {
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
          name: r.name.trim(),
          isLeaderBaseRole: r.isLeaderBaseRole,
          responsibleId: r.responsibleId,
          participantIds: r.participantIds,
        })),
      })

      if (!withInvites && membersToInvite.length > 0) {
        track('invite_step_skipped', { membersCount: membersToInvite.length })
      }
      const invitedCount = withInvites ? await sendInvites() : 0

      track('org_setup_completed', {
        orgType,
        rolesCount: roles.length,
        membersCount: members.length,
        invitedCount,
      })
      toast({
        title: t('OrgSetupModal.ready'),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      onClose()
    } catch (error: any) {
      track('org_setup_failed', { reason: error?.message })
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  const handleNextFromModel = () => {
    track('org_setup_model_done', { orgType })
    prefillRoles()
    setStep(SetupStep.Roles)
  }

  const handleNextFromRoles = () => {
    track('org_setup_roles_done', {
      orgType,
      rolesCount: roles.length,
      membersCount: members.length,
    })
    setStep(SetupStep.Invite)
  }

  return (
    <BrandModal
      size={step === SetupStep.Roles ? '6xl' : '2xl'}
      bodyProps={{ mx: 10 }}
      backButton={false}
      isOpen
      autoFocus={false}
      closeOnEsc={false}
      onClose={() => undefined}
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
      {step === SetupStep.Invite && (
        <OrgSetupStepInvite emails={emails} onChange={setEmails} />
      )}

      <Flex mt={8} align="center" gap={5}>
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
            onClick={handleNextFromModel}
          >
            {t('common.next')}
          </Button>
        )}
        {step === SetupStep.Roles && (
          <Button
            colorScheme="blue"
            rightIcon={<ChevronRightIcon size="1em" />}
            onClick={handleNextFromRoles}
            isDisabled={!canSeed}
          >
            {t('common.continue')}
          </Button>
        )}
        {step === SetupStep.Invite &&
          (invites.length > 0 ? (
            <>
              <Link
                as="button"
                type="button"
                textDecoration="underline"
                onClick={() => finish(false)}
                pointerEvents={loading ? 'none' : undefined}
                opacity={loading ? 0.5 : 1}
              >
                {t('OrgSetupModal.invite.later')}
              </Link>
              <Button
                colorScheme="blue"
                leftIcon={<EmailIcon size="1em" />}
                onClick={() => finish(true)}
                isLoading={loading}
                // The step shows the plan's limit instead
                isDisabled={invites.length > availableSeats}
              >
                {t('OrgSetupModal.invite.send', { count: invites.length })}
              </Button>
            </>
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => finish(false)}
              isLoading={loading}
            >
              {t('Onboarding.finish')}
            </Button>
          ))}
      </Flex>
    </BrandModal>
  )
}
