import { z } from 'zod'

export const uuidSchema = z.string().uuid()

export const orgFields = `
  id
  name
  slug
  archived
  createdAt
  shareOrg
  shareMembers
  governanceMode
  defaultGraphView
  icon
  homeNote
`

export const roleFields = `
  id
  orgId
  name
  purpose
  domain
  accountabilities
  checklist
  indicators
  notes
  colorHue
  base
  singleMember
  parentLink
  archived
`

export const circleFields = `
  id
  orgId
  roleId
  parentId
  archived
`

export const memberFields = `
  id
  orgId
  userId
  name
  description
  picture
  inviteEmail
  inviteDate
  role
  archived
`

export const threadFields = `
  id
  orgId
  circleId
  initiatorMemberId
  title
  status
  createdAt
  archived
  pinned
  private
`

export const meetingFields = `
  id
  orgId
  circleId
  title
  startDate
  endDate
  ended
  summary
  videoConf
  private
  invitedReadonly
  archived
  createdAt
`

export const decisionFields = `
  id
  orgId
  circleId
  memberId
  title
  description
  private
  archived
  createdAt
`

export const taskFields = `
  id
  orgId
  circleId
  memberId
  title
  description
  dueDate
  status
  private
  archived
  createdAt
`

export const threadActivityFields = `
  id
  threadId
  userId
  type
  data
  createdAt
  refThreadId
  refMeetingId
  refTaskId
  refDecisionId
`
