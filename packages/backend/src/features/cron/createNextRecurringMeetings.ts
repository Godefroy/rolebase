import { RRuleUTC } from '@rolebase/shared/helpers/RRuleUTC'
import { add } from 'date-fns'
import { gql } from '../../gql'
import { webhookProcedure } from '../../trpc/webhookProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { loadOrgData } from '../org/loadOrgData'

const maxAheadTime = 14 * 24 * 60 * 60 * 1000 // 2 weeks

export default webhookProcedure.mutation(async () => {
  const { meeting_recurring } = await adminRequest(GET_RECURRING_MEETINGS)

  for (const { id, rrule, meetings } of meeting_recurring) {
    const nowDate = new Date()
    const nextDate = new RRuleUTC(rrule).after(nowDate, true)
    if (!nextDate) continue

    // Don't create meetings too far in the future
    if (nextDate.getTime() > nowDate.getTime() + maxAheadTime) continue

    // Check if next meeting already exists
    const nextDateStr = nextDate.toISOString().substring(0, 10)
    const meetingExists = meetings.some((meeting) => {
      const dateStr = meeting.recurringDate?.substring(0, 10)
      if (!dateStr) return false
      // Meeting exist (in the future, see query) at exact next date or before
      return dateStr <= nextDateStr
    })
    if (meetingExists) continue

    // Fetch all recurring meeting data
    const { meeting_recurring_by_pk: recurringMeeting } = await adminRequest(
      GET_RECURRING_MEETING,
      { id }
    )
    if (!recurringMeeting) continue
    const orgData = await loadOrgData(recurringMeeting.orgId)

    // Create meeting
    const { insert_meeting_one } = await adminRequest(CREATE_MEETING, {
      meeting: {
        orgId: recurringMeeting.orgId,
        circleId: recurringMeeting.circleId,
        startDate: nextDate.toISOString(),
        endDate: add(nextDate, {
          minutes: recurringMeeting.duration,
        }).toISOString(),
        title: recurringMeeting.template.title,
        stepsConfig: recurringMeeting.template.stepsConfig,
        videoConf: recurringMeeting.videoConf,
        private: recurringMeeting.private,
        invitedReadonly: recurringMeeting.invitedReadonly,
        recurringDate: nextDate.toISOString(),
        recurringId: id,
        meeting_attendees: {
          data: orgData
            .getScopeMemberIds(recurringMeeting.scope)
            .map((id) => ({ memberId: id })),
        },
      },
    })

    console.log(`Next meeting created for ${id}: ${insert_meeting_one?.id}`)
  }
})

const GET_RECURRING_MEETINGS = gql(`
  query GetRecurringMeetings {
    meeting_recurring(where: { archivedAt: { _is_null: true } }) {
      id
      rrule
      meetings(where: { recurringDate: { _gt: "now()" } }) {
        recurringDate
      }
    }
  }
`)

const GET_RECURRING_MEETING = gql(`
  query GetRecurringMeeting($id: uuid!) {
    meeting_recurring_by_pk(id: $id) {
      orgId
      circleId
      scope
      template {
        title
        stepsConfig
      }
      duration
      videoConf
      private
      invitedReadonly
    }
  }
`)

const CREATE_MEETING = gql(`
  mutation CreateMeeting($meeting: meeting_insert_input!) {
    insert_meeting_one(object: $meeting) {
      id
    }
  }
`)
