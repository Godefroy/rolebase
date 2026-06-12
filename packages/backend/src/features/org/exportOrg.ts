import { exportToMarkdown } from '@rolebase/editor-legacy'
import * as yup from 'yup'
import { gql, Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import * as XLSX from 'xlsx'

// Always-included entities
const coreEntities = [
  'members',
  'roles',
  'circles',
  'circle_members',
  'circle_links',
] as const

// Optional entity names (selectable by user)
const optionalEntityNames = [
  'decisions',
  'tasks',
  'threads',
  'meetings',
] as const

// All entity keys used in the export data map
type EntityName =
  | (typeof coreEntities)[number]
  | (typeof optionalEntityNames)[number]
  | 'thread_activities'
  | 'thread_extra_members'
  | 'thread_poll_answers'
  | 'thread_activity_reactions'
  | 'meeting_steps'
  | 'meeting_attendees'
  | 'meeting_templates'
  | 'meetings_recurring'

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
      format: yup.mixed().oneOf(['xlsx', 'json']).required(),
      entities: yup
        .array()
        .of(
          yup
            .mixed()
            .oneOf([...optionalEntityNames])
            .required()
        )
        .required(),
    })
  )
  .mutation(async (opts) => {
    const { orgId, format, entities } = opts.input as {
      orgId: string
      format: 'xlsx' | 'json'
      entities: EntityName[]
    }

    // Only org owners can export
    await guardOrg(orgId, Member_Role_Enum.Owner, opts.ctx)

    // Fetch all requested entities
    const data = await adminRequest(GET_ORG_EXPORT_DATA, { orgId })
    const org = data.org_by_pk
    if (!org) {
      throw new Error('Organization not found')
    }

    const roleRichTextFields = ['purpose', 'domain', 'accountabilities', 'checklist', 'indicators', 'notes']
    const richTextDescription = ['description']
    const richTextSummary = ['summary']
    const richTextNotes = ['notes']

    // All available entity data
    const allEntityData: Record<EntityName, unknown[]> = {
      members: org.members,
      roles: (org.roles as Record<string, unknown>[]).map((r) => convertRichTextFields(r, roleRichTextFields)),
      circles: org.circles,
      circle_members: data.circle_member,
      circle_links: data.circle_link,
      decisions: (org.decisions as Record<string, unknown>[]).map((r) => convertRichTextFields(r, richTextDescription)),
      tasks: (org.tasks as Record<string, unknown>[]).map((r) => convertRichTextFields(r, richTextDescription)),
      threads: org.threads,
      thread_activities: data.thread_activity.map(flattenThreadActivityData),
      thread_extra_members: data.thread_extra_member,
      thread_poll_answers: data.thread_poll_answer,
      thread_activity_reactions: data.thread_activity_reaction,
      meetings: (org.meetings as Record<string, unknown>[]).map((r) => convertRichTextFields(r, richTextSummary)),
      meeting_steps: (data.meeting_step as Record<string, unknown>[]).map(flattenMeetingStepData).map((r) => convertRichTextFields(r, richTextNotes)),
      meeting_attendees: data.meeting_attendee,
      meeting_templates: org.meeting_templates,
      meetings_recurring: org.meetings_recurring,
    }

    // Always include core entities, plus requested optional ones
    // Child entities are included automatically with their parent
    const selectedData: Record<string, unknown[]> = {}
    for (const entity of coreEntities) {
      selectedData[entity] = allEntityData[entity]
    }
    for (const entity of entities) {
      selectedData[entity] = allEntityData[entity]
    }
    if (entities.includes('threads')) {
      selectedData.thread_activities = allEntityData.thread_activities
      selectedData.thread_extra_members = allEntityData.thread_extra_members
      selectedData.thread_poll_answers = allEntityData.thread_poll_answers
      selectedData.thread_activity_reactions =
        allEntityData.thread_activity_reactions
    }
    if (entities.includes('meetings')) {
      selectedData.meeting_steps = allEntityData.meeting_steps
      selectedData.meeting_attendees = allEntityData.meeting_attendees
      selectedData.meeting_templates = allEntityData.meeting_templates
      selectedData.meetings_recurring = allEntityData.meetings_recurring
    }

    if (format === 'json') {
      return {
        filename: `${org.name}-export.json`,
        contentType: 'application/json',
        data: JSON.stringify(selectedData, null, 2),
      }
    }

    const wb = XLSX.utils.book_new()
    for (const [name, rows] of Object.entries(selectedData)) {
      const sheet = XLSX.utils.json_to_sheet(
        rows.length > 0 ? truncateForExcel(rows) : []
      )
      XLSX.utils.book_append_sheet(wb, sheet, name.substring(0, 31))
    }
    const buffer = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })
    return {
      filename: `${org.name}-export.xlsx`,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: buffer,
    }
  })

// XLSX: one sheet per entity
// Excel cells have a 32767 character limit
const EXCEL_MAX_CELL_LENGTH = 32767
function truncateForExcel(rows: unknown[]): unknown[] {
  return rows.map((row) => {
    if (typeof row !== 'object' || row === null) return row
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
      if (typeof value === 'string' && value.length > EXCEL_MAX_CELL_LENGTH) {
        result[key] = value.substring(0, EXCEL_MAX_CELL_LENGTH - 3) + '...'
      } else {
        result[key] = value
      }
    }
    return result
  })
}

// Extract the main interesting field from thread_activity.data based on type
function flattenThreadActivityData(
  activity: Record<string, unknown>
): Record<string, unknown> {
  const { data, ...rest } = activity
  if (data == null || typeof data !== 'object') return { ...rest, data }
  const d = data as Record<string, unknown>
  const type = rest.type as string

  // Extract the most relevant field per activity type
  switch (type) {
    case 'Message':
      return { ...rest, data: stringify(d.message) }
    case 'Poll':
      return { ...rest, data: stringify(d.question) }
    case 'MeetingNote':
      return { ...rest, data: stringify(d.notes) }
    default:
      // Thread, Meeting, Task, Decision, ChangeStatus: no large data
      return { ...rest, data: stringify(d) }
  }
}

// Extract the main interesting field from meeting_step.data based on type
function flattenMeetingStepData(
  step: Record<string, unknown>
): Record<string, unknown> {
  const { data, ...rest } = step
  if (data == null || typeof data !== 'object') return { ...rest, data }
  const d = data as Record<string, unknown>
  const type = rest.type as string

  switch (type) {
    case 'Threads':
      return { ...rest, data: stringify(d.threadsIds) }
    default:
      // Tour, Checklist, Indicators, Tasks: empty or small data
      return { ...rest, data: stringify(d) }
  }
}

function stringify(value: unknown): string {
  if (typeof value === 'string') return exportToMarkdown(value)
  return JSON.stringify(value)
}

// Convert Lexical JSON fields to markdown in a row
function convertRichTextFields(
  row: Record<string, unknown>,
  fields: string[]
): Record<string, unknown> {
  const result = { ...row }
  for (const field of fields) {
    const value = result[field]
    if (typeof value === 'string' && value.length > 0) {
      result[field] = exportToMarkdown(value)
    }
  }
  return result
}

const GET_ORG_EXPORT_DATA = gql(`
  query getOrgExportData($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      id
      name
      members(order_by: {name: asc}) {
        id
        name
        inviteEmail
        role
        description
        archived
      }
      roles(order_by: {name: asc}) {
        id
        name
        purpose
        domain
        accountabilities
        checklist
        indicators
        notes
        singleMember
        base
        archived
      }
      circles(order_by: {id: asc}) {
        id
        roleId
        parentId
        archived
      }
      decisions(order_by: {createdAt: desc}) {
        id
        title
        description
        circleId
        memberId
        createdAt
        archived
      }
      tasks(order_by: {createdAt: desc}) {
        id
        title
        description
        circleId
        memberId
        status
        dueDate
        createdAt
        archived
      }
      threads(order_by: {createdAt: desc}) {
        id
        title
        circleId
        initiatorMemberId
        status
        createdAt
        archived
      }
      meetings(order_by: {startDate: desc}) {
        id
        title
        circleId
        startDate
        endDate
        ended
        summary
        recurringId
        createdAt
        archived
      }
      meetings_recurring(order_by: {createdAt: desc}) {
        id
        circleId
        rrule
        duration
        scope
        createdAt
      }
      meeting_templates(order_by: {title: asc}) {
        id
        title
        stepsConfig
      }
    }
    circle_member(where: {circle: {orgId: {_eq: $orgId}}}, order_by: {createdAt: asc}) {
      id
      circleId
      memberId
      createdAt
      archived
    }
    circle_link(where: {hostCircle: {orgId: {_eq: $orgId}}}, order_by: {createdAt: asc}) {
      id
      circleId
      parentId
      createdAt
    }
    thread_activity(where: {thread: {orgId: {_eq: $orgId}}}, order_by: {createdAt: asc}) {
      id
      threadId
      type
      data
      userId
      createdAt
      refThreadId
      refTaskId
      refDecisionId
      refMeetingId
    }
    thread_extra_member(where: {thread: {orgId: {_eq: $orgId}}}) {
      id
      threadId
      memberId
    }
    thread_poll_answer(where: {activity: {thread: {orgId: {_eq: $orgId}}}}) {
      id
      activityId
      userId
      choicesPoints
      createdAt
    }
    thread_activity_reaction(where: {activity: {thread: {orgId: {_eq: $orgId}}}}) {
      id
      activityId
      userId
      shortcode
      createdAt
    }
    meeting_step(where: {meeting: {orgId: {_eq: $orgId}}}, order_by: {id: asc}) {
      id
      meetingId
      type
      stepConfigId
      data
      notes
    }
    meeting_attendee(where: {meeting: {orgId: {_eq: $orgId}}}) {
      id
      meetingId
      memberId
      present
      startNotified
    }
  }`)
