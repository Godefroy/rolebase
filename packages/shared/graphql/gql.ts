/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment ApiKey on api_key {\n  id\n  name\n  value\n  createdAt\n}": types.ApiKeyFragmentDoc,
    "fragment Circle on circle {\n  id\n  orgId\n  roleId\n  parentId\n  archived\n}\n\nfragment CircleSummary on circle {\n  ...Circle\n  role {\n    ...RoleSummary\n  }\n}": types.CircleFragmentDoc,
    "fragment CircleLink on circle_link {\n  id\n  orgId\n  parentId\n  circleId\n  createdAt\n  archived\n}": types.CircleLinkFragmentDoc,
    "fragment CircleMember on circle_member {\n  id\n  orgId\n  circleId\n  memberId\n  createdAt\n  archived\n}": types.CircleMemberFragmentDoc,
    "fragment Decision on decision {\n  id\n  orgId\n  circleId\n  memberId\n  title\n  description\n  archived\n  createdAt\n  private\n}": types.DecisionFragmentDoc,
    "fragment Log on log {\n  id\n  orgId\n  userId\n  memberId\n  memberName\n  meetingId\n  createdAt\n  display\n  changes\n  cancelLogId\n  cancelMemberId\n  cancelMemberName\n  canceled\n  threadId\n  taskId\n  decisionId\n}": types.LogFragmentDoc,
    "fragment MeetingSummary on meeting {\n  id\n  orgId\n  circleId\n  startDate\n  endDate\n  ended\n  title\n  currentStepId\n  summary\n  private\n  meeting_attendees {\n    ...MeetingAttendee\n  }\n}\n\nfragment Meeting on meeting {\n  ...MeetingSummary\n  createdAt\n  stepsConfig\n  archived\n  videoConf\n  recurringId\n  recurringDate\n  invitedReadonly\n}": types.MeetingSummaryFragmentDoc,
    "fragment MeetingAttendee on meeting_attendee {\n  id\n  meetingId\n  memberId\n  present\n  startNotified\n}": types.MeetingAttendeeFragmentDoc,
    "fragment MeetingRecurring on meeting_recurring {\n  id\n  orgId\n  circleId\n  circle {\n    role {\n      name\n      colorHue\n    }\n  }\n  scope\n  templateId\n  template {\n    title\n    stepsConfig\n  }\n  rrule\n  duration\n  videoConf\n  private\n  invitedReadonly\n  createdAt\n}": types.MeetingRecurringFragmentDoc,
    "fragment MeetingStep on meeting_step {\n  id\n  meetingId\n  stepConfigId\n  notes\n  type\n  data\n}": types.MeetingStepFragmentDoc,
    "fragment Member on member {\n  id\n  orgId\n  archived\n  name\n  description\n  pictureFileId\n  picture\n  userId\n  inviteEmail\n  inviteDate\n  role\n}\n\nfragment MemberSummary on member {\n  id\n  userId\n  name\n  picture\n}": types.MemberFragmentDoc,
    "fragment News on news {\n  id\n  createdAt\n  decision {\n    ...Decision\n  }\n  meeting {\n    ...MeetingSummary\n  }\n  thread {\n    ...ThreadWithFirstActivity\n  }\n}": types.NewsFragmentDoc,
    "fragment Org on org {\n  id\n  name\n  archived\n  createdAt\n  slug\n  shareOrg\n  shareMembers\n  governanceMode\n  defaultGraphView\n  icon\n  homeNote\n}\n\nfragment OrgData on org {\n  ...Org\n  org_subscription {\n    ...OrgSubscription\n  }\n  circles(where: {archived: {_eq: false}}) {\n    ...Circle\n  }\n  circleMembers(where: {archived: {_eq: false}}) {\n    ...CircleMember\n  }\n  circleLinks(where: {archived: {_eq: false}}) {\n    ...CircleLink\n  }\n  roles(where: {archived: {_eq: false}}) {\n    ...RoleSummary\n  }\n  members(where: {archived: {_eq: false}}) {\n    ...Member\n  }\n}": types.OrgFragmentDoc,
    "fragment OrgSubscription on org_subscription {\n  id\n  stripeSubscriptionId\n  stripeCustomerId\n  status\n  type\n}": types.OrgSubscriptionFragmentDoc,
    "fragment Role on role {\n  id\n  orgId\n  archived\n  base\n  name\n  purpose\n  domain\n  accountabilities\n  checklist\n  indicators\n  notes\n  singleMember\n  parentLink\n  colorHue\n}\n\nfragment RoleSummary on role {\n  id\n  base\n  name\n  singleMember\n  parentLink\n  colorHue\n}": types.RoleFragmentDoc,
    "fragment RoleAI on role_ai {\n  id\n  name\n  purpose\n  domain\n  accountabilities\n  checklist\n  indicators\n  notes\n}": types.RoleAiFragmentDoc,
    "fragment Task on task {\n  id\n  orgId\n  circleId\n  memberId\n  title\n  description\n  archived\n  createdAt\n  dueDate\n  status\n  private\n}": types.TaskFragmentDoc,
    "fragment Thread on thread {\n  id\n  orgId\n  circleId\n  initiatorMemberId\n  title\n  createdAt\n  archived\n  pinned\n  status\n  private\n  extra_members {\n    ...ThreadExtraMember\n  }\n}\n\nfragment ThreadMemberStatus on thread_member_status {\n  lastReadActivityId\n  lastReadDate\n}\n\nfragment ThreadWithFirstActivity on thread {\n  ...Thread\n  activities(where: {type: {_eq: Message}}, order_by: {createdAt: asc}, limit: 1) {\n    ...ThreadActivity\n  }\n}": types.ThreadFragmentDoc,
    "fragment ThreadActivity on thread_activity {\n  id\n  threadId\n  userId\n  createdAt\n  type\n  data\n  reactions {\n    ...ThreadActivityReaction\n  }\n  refThread {\n    ...Thread\n  }\n  refMeeting {\n    ...MeetingSummary\n  }\n  refTask {\n    ...Task\n  }\n  refDecision {\n    ...Decision\n  }\n}": types.ThreadActivityFragmentDoc,
    "fragment ThreadActivityReaction on thread_activity_reaction {\n  id\n  userId\n  shortcode\n}": types.ThreadActivityReactionFragmentDoc,
    "fragment ThreadExtraMember on thread_extra_member {\n  id\n  threadId\n  memberId\n}": types.ThreadExtraMemberFragmentDoc,
    "fragment UserApp on user_app {\n  id\n  userId\n  type\n  config\n}\n\nfragment UserAppFull on user_app {\n  id\n  userId\n  type\n  secretConfig\n  config\n  tmpData\n  createdAt\n  user {\n    metadata\n  }\n}": types.UserAppFragmentDoc,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment ApiKey on api_key {\n  id\n  name\n  value\n  createdAt\n}"): (typeof documents)["fragment ApiKey on api_key {\n  id\n  name\n  value\n  createdAt\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Circle on circle {\n  id\n  orgId\n  roleId\n  parentId\n  archived\n}\n\nfragment CircleSummary on circle {\n  ...Circle\n  role {\n    ...RoleSummary\n  }\n}"): (typeof documents)["fragment Circle on circle {\n  id\n  orgId\n  roleId\n  parentId\n  archived\n}\n\nfragment CircleSummary on circle {\n  ...Circle\n  role {\n    ...RoleSummary\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment CircleLink on circle_link {\n  id\n  orgId\n  parentId\n  circleId\n  createdAt\n  archived\n}"): (typeof documents)["fragment CircleLink on circle_link {\n  id\n  orgId\n  parentId\n  circleId\n  createdAt\n  archived\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment CircleMember on circle_member {\n  id\n  orgId\n  circleId\n  memberId\n  createdAt\n  archived\n}"): (typeof documents)["fragment CircleMember on circle_member {\n  id\n  orgId\n  circleId\n  memberId\n  createdAt\n  archived\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Decision on decision {\n  id\n  orgId\n  circleId\n  memberId\n  title\n  description\n  archived\n  createdAt\n  private\n}"): (typeof documents)["fragment Decision on decision {\n  id\n  orgId\n  circleId\n  memberId\n  title\n  description\n  archived\n  createdAt\n  private\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Log on log {\n  id\n  orgId\n  userId\n  memberId\n  memberName\n  meetingId\n  createdAt\n  display\n  changes\n  cancelLogId\n  cancelMemberId\n  cancelMemberName\n  canceled\n  threadId\n  taskId\n  decisionId\n}"): (typeof documents)["fragment Log on log {\n  id\n  orgId\n  userId\n  memberId\n  memberName\n  meetingId\n  createdAt\n  display\n  changes\n  cancelLogId\n  cancelMemberId\n  cancelMemberName\n  canceled\n  threadId\n  taskId\n  decisionId\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment MeetingSummary on meeting {\n  id\n  orgId\n  circleId\n  startDate\n  endDate\n  ended\n  title\n  currentStepId\n  summary\n  private\n  meeting_attendees {\n    ...MeetingAttendee\n  }\n}\n\nfragment Meeting on meeting {\n  ...MeetingSummary\n  createdAt\n  stepsConfig\n  archived\n  videoConf\n  recurringId\n  recurringDate\n  invitedReadonly\n}"): (typeof documents)["fragment MeetingSummary on meeting {\n  id\n  orgId\n  circleId\n  startDate\n  endDate\n  ended\n  title\n  currentStepId\n  summary\n  private\n  meeting_attendees {\n    ...MeetingAttendee\n  }\n}\n\nfragment Meeting on meeting {\n  ...MeetingSummary\n  createdAt\n  stepsConfig\n  archived\n  videoConf\n  recurringId\n  recurringDate\n  invitedReadonly\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment MeetingAttendee on meeting_attendee {\n  id\n  meetingId\n  memberId\n  present\n  startNotified\n}"): (typeof documents)["fragment MeetingAttendee on meeting_attendee {\n  id\n  meetingId\n  memberId\n  present\n  startNotified\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment MeetingRecurring on meeting_recurring {\n  id\n  orgId\n  circleId\n  circle {\n    role {\n      name\n      colorHue\n    }\n  }\n  scope\n  templateId\n  template {\n    title\n    stepsConfig\n  }\n  rrule\n  duration\n  videoConf\n  private\n  invitedReadonly\n  createdAt\n}"): (typeof documents)["fragment MeetingRecurring on meeting_recurring {\n  id\n  orgId\n  circleId\n  circle {\n    role {\n      name\n      colorHue\n    }\n  }\n  scope\n  templateId\n  template {\n    title\n    stepsConfig\n  }\n  rrule\n  duration\n  videoConf\n  private\n  invitedReadonly\n  createdAt\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment MeetingStep on meeting_step {\n  id\n  meetingId\n  stepConfigId\n  notes\n  type\n  data\n}"): (typeof documents)["fragment MeetingStep on meeting_step {\n  id\n  meetingId\n  stepConfigId\n  notes\n  type\n  data\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Member on member {\n  id\n  orgId\n  archived\n  name\n  description\n  pictureFileId\n  picture\n  userId\n  inviteEmail\n  inviteDate\n  role\n}\n\nfragment MemberSummary on member {\n  id\n  userId\n  name\n  picture\n}"): (typeof documents)["fragment Member on member {\n  id\n  orgId\n  archived\n  name\n  description\n  pictureFileId\n  picture\n  userId\n  inviteEmail\n  inviteDate\n  role\n}\n\nfragment MemberSummary on member {\n  id\n  userId\n  name\n  picture\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment News on news {\n  id\n  createdAt\n  decision {\n    ...Decision\n  }\n  meeting {\n    ...MeetingSummary\n  }\n  thread {\n    ...ThreadWithFirstActivity\n  }\n}"): (typeof documents)["fragment News on news {\n  id\n  createdAt\n  decision {\n    ...Decision\n  }\n  meeting {\n    ...MeetingSummary\n  }\n  thread {\n    ...ThreadWithFirstActivity\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Org on org {\n  id\n  name\n  archived\n  createdAt\n  slug\n  shareOrg\n  shareMembers\n  governanceMode\n  defaultGraphView\n  icon\n  homeNote\n}\n\nfragment OrgData on org {\n  ...Org\n  org_subscription {\n    ...OrgSubscription\n  }\n  circles(where: {archived: {_eq: false}}) {\n    ...Circle\n  }\n  circleMembers(where: {archived: {_eq: false}}) {\n    ...CircleMember\n  }\n  circleLinks(where: {archived: {_eq: false}}) {\n    ...CircleLink\n  }\n  roles(where: {archived: {_eq: false}}) {\n    ...RoleSummary\n  }\n  members(where: {archived: {_eq: false}}) {\n    ...Member\n  }\n}"): (typeof documents)["fragment Org on org {\n  id\n  name\n  archived\n  createdAt\n  slug\n  shareOrg\n  shareMembers\n  governanceMode\n  defaultGraphView\n  icon\n  homeNote\n}\n\nfragment OrgData on org {\n  ...Org\n  org_subscription {\n    ...OrgSubscription\n  }\n  circles(where: {archived: {_eq: false}}) {\n    ...Circle\n  }\n  circleMembers(where: {archived: {_eq: false}}) {\n    ...CircleMember\n  }\n  circleLinks(where: {archived: {_eq: false}}) {\n    ...CircleLink\n  }\n  roles(where: {archived: {_eq: false}}) {\n    ...RoleSummary\n  }\n  members(where: {archived: {_eq: false}}) {\n    ...Member\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment OrgSubscription on org_subscription {\n  id\n  stripeSubscriptionId\n  stripeCustomerId\n  status\n  type\n}"): (typeof documents)["fragment OrgSubscription on org_subscription {\n  id\n  stripeSubscriptionId\n  stripeCustomerId\n  status\n  type\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Role on role {\n  id\n  orgId\n  archived\n  base\n  name\n  purpose\n  domain\n  accountabilities\n  checklist\n  indicators\n  notes\n  singleMember\n  parentLink\n  colorHue\n}\n\nfragment RoleSummary on role {\n  id\n  base\n  name\n  singleMember\n  parentLink\n  colorHue\n}"): (typeof documents)["fragment Role on role {\n  id\n  orgId\n  archived\n  base\n  name\n  purpose\n  domain\n  accountabilities\n  checklist\n  indicators\n  notes\n  singleMember\n  parentLink\n  colorHue\n}\n\nfragment RoleSummary on role {\n  id\n  base\n  name\n  singleMember\n  parentLink\n  colorHue\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment RoleAI on role_ai {\n  id\n  name\n  purpose\n  domain\n  accountabilities\n  checklist\n  indicators\n  notes\n}"): (typeof documents)["fragment RoleAI on role_ai {\n  id\n  name\n  purpose\n  domain\n  accountabilities\n  checklist\n  indicators\n  notes\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Task on task {\n  id\n  orgId\n  circleId\n  memberId\n  title\n  description\n  archived\n  createdAt\n  dueDate\n  status\n  private\n}"): (typeof documents)["fragment Task on task {\n  id\n  orgId\n  circleId\n  memberId\n  title\n  description\n  archived\n  createdAt\n  dueDate\n  status\n  private\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment Thread on thread {\n  id\n  orgId\n  circleId\n  initiatorMemberId\n  title\n  createdAt\n  archived\n  pinned\n  status\n  private\n  extra_members {\n    ...ThreadExtraMember\n  }\n}\n\nfragment ThreadMemberStatus on thread_member_status {\n  lastReadActivityId\n  lastReadDate\n}\n\nfragment ThreadWithFirstActivity on thread {\n  ...Thread\n  activities(where: {type: {_eq: Message}}, order_by: {createdAt: asc}, limit: 1) {\n    ...ThreadActivity\n  }\n}"): (typeof documents)["fragment Thread on thread {\n  id\n  orgId\n  circleId\n  initiatorMemberId\n  title\n  createdAt\n  archived\n  pinned\n  status\n  private\n  extra_members {\n    ...ThreadExtraMember\n  }\n}\n\nfragment ThreadMemberStatus on thread_member_status {\n  lastReadActivityId\n  lastReadDate\n}\n\nfragment ThreadWithFirstActivity on thread {\n  ...Thread\n  activities(where: {type: {_eq: Message}}, order_by: {createdAt: asc}, limit: 1) {\n    ...ThreadActivity\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment ThreadActivity on thread_activity {\n  id\n  threadId\n  userId\n  createdAt\n  type\n  data\n  reactions {\n    ...ThreadActivityReaction\n  }\n  refThread {\n    ...Thread\n  }\n  refMeeting {\n    ...MeetingSummary\n  }\n  refTask {\n    ...Task\n  }\n  refDecision {\n    ...Decision\n  }\n}"): (typeof documents)["fragment ThreadActivity on thread_activity {\n  id\n  threadId\n  userId\n  createdAt\n  type\n  data\n  reactions {\n    ...ThreadActivityReaction\n  }\n  refThread {\n    ...Thread\n  }\n  refMeeting {\n    ...MeetingSummary\n  }\n  refTask {\n    ...Task\n  }\n  refDecision {\n    ...Decision\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment ThreadActivityReaction on thread_activity_reaction {\n  id\n  userId\n  shortcode\n}"): (typeof documents)["fragment ThreadActivityReaction on thread_activity_reaction {\n  id\n  userId\n  shortcode\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment ThreadExtraMember on thread_extra_member {\n  id\n  threadId\n  memberId\n}"): (typeof documents)["fragment ThreadExtraMember on thread_extra_member {\n  id\n  threadId\n  memberId\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment UserApp on user_app {\n  id\n  userId\n  type\n  config\n}\n\nfragment UserAppFull on user_app {\n  id\n  userId\n  type\n  secretConfig\n  config\n  tmpData\n  createdAt\n  user {\n    metadata\n  }\n}"): (typeof documents)["fragment UserApp on user_app {\n  id\n  userId\n  type\n  config\n}\n\nfragment UserAppFull on user_app {\n  id\n  userId\n  type\n  secretConfig\n  config\n  tmpData\n  createdAt\n  user {\n    metadata\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;