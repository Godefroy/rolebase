import BrandModal from '@/common/atoms/BrandModal'
import OnboardingProgress from '@/onboarding/components/OnboardingProgress'
import useSubscriptionData from '@/orgSubscription/hooks/useSubscriptionData'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { Button, Flex, Spacer, useToast } from '@chakra-ui/react'
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
import useOrgChartTourStatus from '../hooks/useOrgChartTourStatus'
import useSeedOrg from '../hooks/useSeedOrg'
import { OrgType } from '../orgTypes'
import OrgSetupStepInvite from './OrgSetupStepInvite'
import OrgSetupStepMembers from './OrgSetupStepMembers'
import OrgSetupStepModel from './OrgSetupStepModel'
import { MemberDraft } from './orgSetupTypes'

interface Props {
  onClose(): void
}

enum SetupStep {
  Model = 'Model',
  Members = 'Members',
  Invite = 'Invite',
}

const stepOrder = [SetupStep.Model, SetupStep.Members, SetupStep.Invite]

// People asked for besides the person setting up: an org chart of one shows
// nothing of what Rolebase is for
const MIN_OTHER_MEMBERS = 1

// Org-setup steps shown right after an org is created: pick the organizational
// model, list the people of the organization (members, not invitations), then
// invite them if wanted. The org is seeded with the model's base roles and
// meeting templates once the members are validated, so leaving at the invite
// step loses nothing. Roles are then placed in the org chart itself, guided by
// the org chart tour started on finish. The setup is mandatory: there is no
// close control, and the modal comes back until the org is seeded (see
// OrgSetupTrigger).
export default function OrgSetupModal({ onClose }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { orgId, orgData } = useOrgContext()
  const [updateOrg] = useUpdateOrgMutation()
  const seedOrg = useSeedOrg()
  const createMember = useCreateMember()
  const currentMember = useCurrentMember()
  const navigateOrg = useNavigateOrg()
  const { availableSeats } = useSubscriptionData()
  const { setStatus: setTourStatus } = useOrgChartTourStatus()

  useEffect(() => {
    track('org_setup_started')
  }, [])

  const [step, setStep] = useState<SetupStep>(SetupStep.Model)
  const [orgType, setOrgType] = useState<OrgType>(OrgType.Classic)
  // Two empty fields: one person is required, a second suggests a team
  const [drafts, setDrafts] = useState<MemberDraft[]>(() => [
    { id: nanoid(8), name: '' },
    { id: nanoid(8), name: '' },
  ])
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const rootCircle = useMemo(
    () => orgData?.circles.find((c) => !c.parentId),
    [orgData]
  )

  const members = orgData?.members ?? []
  const typedNames = drafts.map((d) => d.name.trim()).filter(Boolean)
  const otherMembersCount =
    members.filter((m) => m.id !== currentMember?.id).length + typedNames.length
  const canSeed = otherMembersCount >= MIN_OTHER_MEMBERS
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

  const showError = (error: any) =>
    toast({
      title: error?.message || t('common.error'),
      status: 'error',
      duration: 4000,
      isClosable: true,
    })

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

  const handleNextFromModel = () => {
    track('org_setup_model_done', { orgType })
    setStep(SetupStep.Members)
  }

  // Create the typed members, then seed the org: from here on the setup is
  // saved, and only the optional invitations remain. A draft is dropped as
  // soon as its member exists, so a retry after an error creates no duplicate.
  const handleNextFromMembers = async () => {
    if (!orgId || !rootCircle) return
    setLoading(true)
    try {
      for (const draft of drafts) {
        const name = draft.name.trim()
        if (name) await createMember(name)
        setDrafts((ds) => ds.filter((d) => d.id !== draft.id))
      }
      await updateOrg({
        variables: { id: orgId, values: { onboardingOrgType: orgType } },
      })
      await seedOrg({ orgType })
      track('org_setup_members_done', {
        orgType,
        membersCount: otherMembersCount + 1,
      })
      setStep(SetupStep.Invite)
    } catch (error: any) {
      track('org_setup_failed', { reason: error?.message })
      showError(error)
    }
    setLoading(false)
  }

  // Finish: send the invitations if asked, then land on the org chart, where
  // the tour shows how to give roles to the members
  const finish = async (withInvites: boolean) => {
    setLoading(true)
    try {
      // Also sent for a solo org, whose invite step shows empty email fields
      if (!withInvites) {
        track('invite_step_skipped', { membersCount: membersToInvite.length })
      }
      const invitedCount = withInvites ? await sendInvites() : 0

      track('org_setup_completed', {
        orgType,
        membersCount: members.length,
        invitedCount,
      })
      track('org_tour_started')
      await setTourStatus('started')
      navigateOrg('roles')
      onClose()
    } catch (error: any) {
      track('org_setup_failed', { reason: error?.message })
      showError(error)
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
      onClose={() => undefined}
    >
      <OnboardingProgress
        total={stepOrder.length}
        current={stepOrder.indexOf(step)}
      />

      {step === SetupStep.Model && (
        <OrgSetupStepModel orgType={orgType} onChange={setOrgType} />
      )}
      {step === SetupStep.Members && (
        <OrgSetupStepMembers drafts={drafts} onChange={setDrafts} />
      )}
      {step === SetupStep.Invite && (
        <OrgSetupStepInvite emails={emails} onChange={setEmails} />
      )}

      <Flex mt={8} align="center" gap={3}>
        {/* Once seeded, the model and the members are saved: no way back */}
        {step === SetupStep.Members && (
          <Button
            variant="ghost"
            leftIcon={<ChevronLeftIcon size="1em" />}
            onClick={() => setStep(SetupStep.Model)}
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
        {step === SetupStep.Members && (
          <Button
            colorScheme="blue"
            rightIcon={<ChevronRightIcon size="1em" />}
            onClick={handleNextFromMembers}
            isLoading={loading}
            isDisabled={!canSeed}
          >
            {t('common.continue')}
          </Button>
        )}
        {step === SetupStep.Invite && (
          <>
            <Button
              variant="outline"
              onClick={() => finish(false)}
              isDisabled={loading}
            >
              {t('OrgSetupModal.invite.later')}
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<EmailIcon size="1em" />}
              onClick={() => finish(true)}
              isLoading={loading}
              // The step shows the plan's limit instead
              isDisabled={
                invites.length === 0 || invites.length > availableSeats
              }
            >
              {invites.length > 0
                ? t('OrgSetupModal.invite.send', { count: invites.length })
                : t('OrgSetupModal.invite.sendNone')}
            </Button>
          </>
        )}
      </Flex>
    </BrandModal>
  )
}
