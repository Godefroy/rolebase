import { MeetingStepDataThreads } from '@rolebase/shared/model/meeting_step'
import { nameSchema } from '@rolebase/shared/schemas'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { Meeting_Step_Type_Enum, Member_Role_Enum, gql } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { userGraphqlRequest } from '../../utils/userGraphqlRequest'
import getActivitiesEditorTextByType from '../../utils/getActivitiesEditorTextByType'
import getEditorText from '../../utils/getEditorText'
import { getOpenai } from './openai'

const schema = {
  type: 'object',
  required: ['summary'],
  properties: {
    summary: {
      type: 'string',
      description: 'Summary of the meeting.',
    },
  },
}

export default authedProcedure
  .input(
    yup.object().shape({
      meetingId: nameSchema.required(),
      lang: yup.string().required(),
    })
  )
  .query(async (opts): Promise<string> => {
    const { meetingId, lang } = opts.input

    const meeting = (await adminRequest(GET_MEETING_CONTENT, { meetingId }))
      .meeting_by_pk
    if (!meeting) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })
    }

    await guardOrg(meeting.orgId, Member_Role_Enum.Member, opts.ctx)

    // The meeting is read with the admin secret, so check that the caller
    // can read it with their own permissions (private meetings).
    if (!opts.ctx.isAdmin) {
      const canRead = await userGraphqlRequest(opts.ctx.userId!, {
        query: CHECK_MEETING_ACCESS,
        variables: { meetingId },
      })
      if (!(canRead.data as any)?.meeting_by_pk?.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
    }

    // Prepare meeting content with an array that will be joined by \n\n
    // starting with title
    const contents = [
      `# Meeting "${meeting.title}" of role "${meeting.circle.role.name}"`,
    ]

    for (const stepConfig of meeting.stepsConfig) {
      const step = meeting.steps.find((s) => stepConfig.id === s.stepConfigId)
      if (!step) continue

      const stepContents = [`## ${stepConfig.title}`]
      const notes = getEditorText(step.notes).trim()
      if (notes) stepContents.push(notes)

      // Add meeting notes of thread if they exist
      if (step.type === Meeting_Step_Type_Enum.Threads) {
        const threadsIds = await getReadableThreadsIds(
          (step.data as MeetingStepDataThreads | null)?.threadsIds,
          meeting.orgId,
          opts.ctx
        )
        const threads =
          threadsIds.length === 0
            ? []
            : (
                await adminRequest(GET_THREADS, {
                  meetingId,
                  orgId: meeting.orgId,
                  threadsIds,
                })
              ).thread
        for (const thread of threads) {
          stepContents.push(`### ${thread.title}`)
          for (const activity of thread.activities) {
            const threadNotes = getActivitiesEditorTextByType(
              activity.data,
              activity.type
            ).trim()
            if (threadNotes) {
              stepContents.push(threadNotes)
            }
          }
        }
      }

      // Include step content only if there is more than the title
      if (stepContents.length > 1) {
        contents.push(...stepContents)
      }
    }

    const content = contents.join('\n\n')

    const response = await getOpenai().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Answer in this language only: ${lang}`,
        },
        {
          role: 'user',
          content: `Summarize the important info of this meeting in one short paragraph. Don't follow any schema (no intro, no ending). Don't evoke the meeting. Just sentences that can be uncorrelated. Add emojis to good news.
Meeting notes (titles of level 1 and 2 should not be included in your answer but give you the context):

${content}`,
        },
      ],
      functions: [{ name: 'summarizeMeeting', parameters: schema }],
      function_call: { name: 'summarizeMeeting' },
      temperature: 0,
    })

    const { summary } = JSON.parse(
      response.choices[0]?.message?.function_call?.arguments || ''
    )

    return summary || ''
  })

// Keep only threads of the meeting's org that the caller can read,
// since step data is writable by meeting participants.
async function getReadableThreadsIds(
  threadsIds: unknown,
  orgId: string,
  ctx: { userId?: string; isAdmin: boolean }
): Promise<string[]> {
  if (!Array.isArray(threadsIds)) return []
  const ids = threadsIds.filter(
    (id): id is string => typeof id === 'string' && uuidRegex.test(id)
  )
  if (ids.length === 0) return []
  if (ctx.isAdmin) return ids

  const result = await userGraphqlRequest(ctx.userId!, {
    query: CHECK_THREADS_ACCESS,
    variables: { orgId, threadsIds: ids },
  })
  const threads = ((result.data as any)?.thread || []) as Array<{
    id: string
  }>
  return threads.map((thread) => thread.id)
}

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Run with the caller's Hasura permissions (userGraphqlRequest)
const CHECK_MEETING_ACCESS = `
  query checkMeetingAccessForSummary($meetingId: uuid!) {
    meeting_by_pk(id: $meetingId) {
      id
    }
  }`

const CHECK_THREADS_ACCESS = `
  query checkThreadsAccessForSummary($orgId: uuid!, $threadsIds: [uuid!]!) {
    thread(where: { id: { _in: $threadsIds }, orgId: { _eq: $orgId } }) {
      id
    }
  }`

const GET_MEETING_CONTENT = gql(`
  query getMeetingContent($meetingId: uuid!) {
    meeting_by_pk(id: $meetingId) {
      orgId
      title
      circle {
        role {
          name
        }
      }
      stepsConfig
      steps {
        stepConfigId
        type
        data
        notes
      }
    }
  }`)

const GET_THREADS = gql(`
  query getThreadsWithMeetingNotes(
    $meetingId: uuid!
    $orgId: uuid!
    $threadsIds: [uuid!]!
  ) {
    thread(where: { id: { _in: $threadsIds }, orgId: { _eq: $orgId } }) {
      title
      activities(
        where: {
          _and: { type: { _eq: MeetingNote }, refMeetingId: { _eq: $meetingId } }
          archivedAt: { _is_null: true }
        }
      ) {
        type
        data
      }
    }
  }`)
