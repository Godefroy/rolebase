import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import {
  useCreateMeetingRecurringMutation,
  useCreateMeetingTemplateMutation,
} from '@gql'
import { getUTCDateFromDate } from '@rolebase/shared/helpers/RRuleUTC'
import { MeetingStepConfig } from '@rolebase/shared/model/meeting'
import { ParticipantsScope } from '@rolebase/shared/model/participants'
import { getTimeZone } from '@utils/dates'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RRule } from 'rrule'
import { OrgType, orgTypePresets, SeedRecurrence } from '../orgTypes'

// Build a full rrule from a seed recurrence: the configured weekday at the
// configured hour, in the user's timezone (so meetings aren't at midnight).
// Monthly recurrences target the first such weekday of the month (BYSETPOS=1),
// so they never land on a weekend.
function buildRecurrenceRrule(recurrence: SeedRecurrence): string {
  const dtstart = new Date()
  dtstart.setHours(recurrence.hour, 0, 0, 0)
  return new RRule({
    freq: recurrence.freq === 'weekly' ? RRule.WEEKLY : RRule.MONTHLY,
    byweekday: [recurrence.weekday],
    bysetpos: recurrence.freq === 'monthly' ? 1 : undefined,
    dtstart: getUTCDateFromDate(dtstart),
    tzid: getTimeZone(),
  }).toString()
}

export interface SeedRoleInput {
  name: string
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
// Must run within the new org's OrgContext.
export default function useSeedOrg() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const { createCircle, createRole, addCircleMember } = useOrgEditActions()
  const [createMeetingTemplate] = useCreateMeetingTemplateMutation()
  const [createMeetingRecurring] = useCreateMeetingRecurringMutation()

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

      // Meeting templates (and a recurring meeting on the root circle)
      const scope: ParticipantsScope = {
        members: [],
        circles: [{ id: rootCircleId, children: true, excludeMembers: [] }],
      }
      for (const template of preset.meetingTemplates) {
        const stepsConfig: MeetingStepConfig[] = template.steps.map((type) => ({
          id: nanoid(8),
          type,
          title: t(`common.meetingSteps.${type}`),
        }))

        const { data } = await createMeetingTemplate({
          variables: {
            values: {
              orgId,
              title: t(`Onboarding.meetings.${template.titleKey}`),
              stepsConfig,
            },
          },
        })
        const createdTemplate = data?.insert_meeting_template_one
        if (createdTemplate && template.recurrence) {
          await createMeetingRecurring({
            variables: {
              values: {
                orgId,
                circleId: rootCircleId,
                templateId: createdTemplate.id,
                rrule: buildRecurrenceRrule(template.recurrence),
                duration: template.recurrence.duration,
                scope,
                private: false,
                invitedReadonly: false,
              },
            },
          })
        }
      }
    },
    [
      orgId,
      t,
      createCircle,
      createRole,
      addCircleMember,
      createMeetingTemplate,
      createMeetingRecurring,
    ]
  )
}
