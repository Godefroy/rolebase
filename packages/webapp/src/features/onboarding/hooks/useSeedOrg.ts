import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { useCreateMeetingTemplateMutation } from '@gql'
import { MeetingStepConfig } from '@rolebase/shared/model/meeting'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgType, orgTypePresets } from '../orgTypes'

export interface SeedRoleInput {
  name: string
  // Seeded as the model's leader base role in the root circle
  isLeaderBaseRole?: boolean
  responsibleId?: string
  participantIds: string[]
}

export interface SeedOrgInput {
  orgType: OrgType
  rootCircleId: string
  roles: SeedRoleInput[]
}

// Build the initial org chart client-side from the onboarding answers:
// the model's base governance roles (created once), one circle per main role
// under the root with members assigned, plus the model's meeting templates.
// No recurring meeting is scheduled here: planning one is a line of the
// onboarding todo, once the team is there.
// Must run within the new org's OrgContext.
export default function useSeedOrg() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const { createCircle, createRole, addCircleMember } = useOrgEditActions()
  const [createMeetingTemplate] = useCreateMeetingTemplateMutation()

  return useCallback(
    async ({ orgType, rootCircleId, roles }: SeedOrgInput): Promise<void> => {
      if (!orgId) return
      const preset = orgTypePresets[orgType]

      // Create the model's base governance roles once (shared across circles).
      // Keep the first parent-linking role as each circle's representation role.
      let leaderRole
      for (const baseRole of preset.baseRoles) {
        const role = await createRole({
          name: t(`Onboarding.roles.${baseRole.nameKey}.name`),
          base: true,
          singleMember: true,
          parentLink: baseRole.parentLink ?? false,
          colorHue: baseRole.colorHue,
          purpose: t(`Onboarding.roles.${baseRole.nameKey}.purpose`),
          domain: t(`Onboarding.roles.${baseRole.nameKey}.domain`),
          accountabilities: t(
            `Onboarding.roles.${baseRole.nameKey}.accountabilities`
          ),
        })
        if (role && baseRole.parentLink && !leaderRole) {
          leaderRole = role
        }
      }

      // One circle per main role under the root
      for (const role of roles) {
        if (role.isLeaderBaseRole) {
          if (!leaderRole || !role.responsibleId) continue
          const leadCircleId = await createCircle(rootCircleId, leaderRole)
          if (leadCircleId) {
            await addCircleMember(leadCircleId, role.responsibleId)
          }
          continue
        }

        const circleId = await createCircle(rootCircleId, role.name)
        if (!circleId) continue

        if (role.participantIds.length === 0) {
          // No one else: the person responsible occupies the role directly
          if (role.responsibleId) {
            await addCircleMember(circleId, role.responsibleId)
          }
        } else {
          // The person responsible leads the circle via the model's leader role
          // (a parent-linking sub-circle); the others are direct members.
          if (role.responsibleId && leaderRole) {
            const leadCircleId = await createCircle(circleId, leaderRole)
            if (leadCircleId) {
              await addCircleMember(leadCircleId, role.responsibleId)
            }
          }
          for (const participantId of role.participantIds) {
            await addCircleMember(circleId, participantId)
          }
        }
      }

      // Meeting templates
      for (const template of preset.meetingTemplates) {
        const stepsConfig: MeetingStepConfig[] = template.steps.map((type) => ({
          id: nanoid(8),
          type,
          title: t(`common.meetingSteps.${type}`),
        }))

        await createMeetingTemplate({
          variables: {
            values: {
              orgId,
              title: t(`Onboarding.meetings.${template.titleKey}`),
              stepsConfig,
            },
          },
        })
      }
    },
    [orgId, t, createCircle, createRole, addCircleMember, createMeetingTemplate]
  )
}
