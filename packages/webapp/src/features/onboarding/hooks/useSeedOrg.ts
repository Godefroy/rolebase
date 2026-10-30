import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { useCreateMeetingTemplateMutation } from '@gql'
import { MeetingStepConfig } from '@rolebase/shared/model/meeting'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgType, orgTypePresets } from '../orgTypes'

export interface SeedOrgInput {
  orgType: OrgType
}

// Build the initial org chart client-side from the chosen model: its base
// governance roles and its meeting templates. Placing roles and members in the
// org chart is left to the person, guided by the org chart tour.
// No recurring meeting is scheduled here: planning one is a line of the
// onboarding todo, once the team is there.
// Must run within the new org's OrgContext.
export default function useSeedOrg() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const { createRole } = useOrgEditActions()
  const [createMeetingTemplate] = useCreateMeetingTemplateMutation()

  return useCallback(
    async ({ orgType }: SeedOrgInput): Promise<void> => {
      if (!orgId) return
      const preset = orgTypePresets[orgType]

      // Create the model's base governance roles (shared across circles)
      for (const baseRole of preset.baseRoles) {
        await createRole({
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
    [orgId, t, createRole, createMeetingTemplate]
  )
}
