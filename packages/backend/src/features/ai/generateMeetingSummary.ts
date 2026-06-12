import { MeetingStepDataThreads } from '@rolebase/shared/model/meeting_step'
import { nameSchema } from '@rolebase/shared/schemas'
import { TRPCError } from '@trpc/server'
import { Configuration, OpenAIApi } from 'openai'
import * as yup from 'yup'
import { Meeting_Step_Type_Enum, Member_Role_Enum, gql } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import getActivitiesEditorTextByType from '../../utils/getActivitiesEditorTextByType'
import getEditorText from '../../utils/getEditorText'

const configuration = new Configuration({
  apiKey: settings.openai.apiKey,
})
const openai = new OpenAIApi(configuration)

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
        const { threadsIds } = step.data as MeetingStepDataThreads
        const threads = (
          await adminRequest(GET_THREADS, { meetingId, threadsIds })
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

    const response = await openai.createChatCompletion({
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
      response.data.choices[0]?.message?.function_call?.arguments || ''
    )

    return summary || ''
  })

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
  query getThreadsWithMeetingNotes($meetingId: uuid!, $threadsIds: [uuid!]!) {
    thread(where:{id: {_in: $threadsIds}}) {
      title
      activities(
        where: {
          _and: { type: { _eq: MeetingNote }, refMeetingId: { _eq: $meetingId } }
        }
      ) {
        type
        data
      }
    }
  }`)
