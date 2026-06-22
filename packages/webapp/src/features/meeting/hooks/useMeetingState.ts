import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  CircleFragment,
  MeetingFragment,
  MeetingStepFragment,
  useMeetingSubscription,
  useUpdateMeetingAttendeeMutation,
  useUpdateMeetingMutation,
} from '@gql'
import getMeetingVideoConfUrl from '@rolebase/shared/helpers/getMeetingVideoConfUrl'
import { MeetingStepConfig } from '@rolebase/shared/model/meeting'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { isSameDay } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathInOrg } from '../../org/hooks/usePathInOrg'
import useCircleParticipants from '../../participants/hooks/useCircleParticipants'
import useExtraParticipants from '../../participants/hooks/useExtraParticipants'

/***
 * Meeting state hook
 * /!\ Do not call this too often
 * Consider using MeetingContext instead
 */

export interface MeetingState {
  meeting: MeetingFragment | undefined
  path: string
  loading: boolean
  error: Error | undefined
  steps: MeetingStepFragment[] | undefined
  circle: CircleFragment | undefined
  participants: ParticipantMember[]
  currentStep: MeetingStepFragment | undefined
  currentStepConfig: MeetingStepConfig | undefined
  canEdit: boolean
  canEditSteps: boolean
  forceEdit: boolean
  editable: boolean
  isParticipant: boolean
  isEnded: boolean
  isNotStarted: boolean
  isStarted: boolean
  isToday: boolean
  isStartTimePassed: boolean
  isEndTimePassed: boolean
  isLastStep: boolean
  videoConfUrl: string | undefined
  handleScrollToStep(stepId: string): void
  handleGoToStep(stepId: string): Promise<void>
  handleEnd(): Promise<void>
  handleCancelStart(): Promise<void>
  handleNextStep(): Promise<void>
  handleChangeForceEdit(forceEdit: boolean): void
}

export default function useMeetingState(meetingId: string): MeetingState {
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()
  const [updateMeeting] = useUpdateMeetingMutation()

  // Subscribe meeting
  const { data, loading, error } = useMeetingSubscription({
    variables: { id: meetingId },
  })
  const meeting = data?.meeting_by_pk || undefined
  const steps = meeting?.steps

  // Meeting page path
  const path = usePathInOrg(`meetings/${meeting?.id}`)

  // Circle
  const { orgData } = useOrgContext()
  const circle = orgData?.getCircle(meeting?.circleId)

  // Meeting not started?
  const isEnded = !!meeting?.ended
  const isNotStarted = !isEnded && meeting?.currentStepId === null
  const isStarted = !isEnded && meeting?.currentStepId !== null

  // Is meeting today?
  const isToday = useMemo(
    () =>
      meeting ? isSameDay(new Date(), new Date(meeting.startDate)) : false,
    [meeting?.startDate]
  )

  // Start time passed?
  const [isStartTimePassed, setStartTimePassed] = useState(false)
  useEffect(() => {
    if (!meeting) return
    const currentTime = new Date().getTime()
    const startDateTime = new Date(meeting.startDate).getTime()

    // Detect if start time has passed now
    const startTimePassed = isNotStarted && currentTime > startDateTime
    setStartTimePassed(startTimePassed)

    if (!startTimePassed && isStarted) {
      // If start time has not passed, schedule status change
      const timeout = window.setTimeout(() => {
        setStartTimePassed(true)
      }, startDateTime - currentTime)
      return () => window.clearTimeout(timeout)
    }
  }, [isStarted, meeting?.startDate])

  // End time passed?
  const [isEndTimePassed, setEndTimePassed] = useState(false)
  useEffect(() => {
    if (!meeting) return
    const currentTime = new Date().getTime()
    const endDateTime = new Date(meeting.endDate).getTime()

    // Detect if end time has passed now
    const endTimePassed = isStarted && currentTime > endDateTime
    setEndTimePassed(endTimePassed)

    if (!endTimePassed && isStarted) {
      // If end time has not passed, schedule status change
      const timeout = window.setTimeout(() => {
        setEndTimePassed(true)
      }, endDateTime - currentTime)
      return () => window.clearTimeout(timeout)
    }
  }, [isStarted, meeting?.endDate])

  // Participants
  const circleParticipants = useCircleParticipants(circle)
  const participants = useExtraParticipants([], meeting?.meeting_attendees)

  // Is current member participant? initiator?
  const isParticipant = currentMember
    ? participants.some((p) => p.member.id === currentMember.id)
    : false
  const isCirclePartcipant = currentMember
    ? circleParticipants.some((p) => p.member.id === currentMember.id)
    : false

  // Current member can edit meeting steps?
  const canEditSteps =
    isCirclePartcipant || (meeting?.invitedReadonly === false && isParticipant)

  // Current member can edit meeting?
  const canEdit =
    canEditSteps ||
    (meeting?.private === false &&
      meeting?.invitedReadonly === false &&
      isMember)

  // Force edit mode event if meeting is ended
  const [forceEdit, setForceEdit] = useState(false)

  // Edit mode? (steps)
  const editable = canEditSteps && (!isEnded || forceEdit) && !meeting?.archivedAt

  // Reset forced edition when meeting is not ended anymore
  useEffect(() => {
    if (forceEdit && !meeting?.ended) {
      setForceEdit(false)
    }
  }, [meeting?.ended, forceEdit])

  const handleScrollToStep = useCallback((stepId: string) => {
    document
      .getElementById(`step-${stepId}`)
      ?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Scroll to current step
  useEffect(() => {
    const stepId = meeting?.currentStepId
    if (!stepId) return
    handleScrollToStep(stepId)
  }, [meeting?.currentStepId, handleScrollToStep])

  // Current step
  const currentStep = useMemo(() => {
    const stepId = meeting?.currentStepId
    if (!stepId) return
    return steps?.find((s) => s.id === stepId)
  }, [meeting?.currentStepId, steps])

  // Current step config
  const currentStepConfig = useMemo(() => {
    const stepId = currentStep?.stepConfigId
    if (!stepId) return
    return meeting?.stepsConfig?.find((s) => s.id === stepId)
  }, [currentStep?.stepConfigId, meeting?.stepsConfig])

  // Last step
  const isLastStep = useMemo(() => {
    const stepsConfig = meeting?.stepsConfig
    if (!stepsConfig || !currentStep) return false
    const lastStepConfig = stepsConfig[stepsConfig.length - 1]
    if (!lastStepConfig) return false
    return currentStep?.stepConfigId === lastStepConfig.id
  }, [currentStep, meeting?.stepsConfig])

  // Go to step
  const handleGoToStep = useCallback(
    async (stepId: string) => {
      if (!meeting) return
      await updateMeeting({
        variables: {
          id: meeting.id,
          values: {
            currentStepId: stepId,
          },
        },
      })
    },
    [meeting]
  )

  // End meeting
  const handleEnd = useCallback(async () => {
    if (!meeting) return
    await updateMeeting({
      variables: {
        id: meetingId,
        values: {
          currentStepId: null,
          ended: true,
        },
      },
    })
  }, [meeting, participants])

  // Cancel start of meeting
  const handleCancelStart = useCallback(async () => {
    if (!meeting) return
    await updateMeeting({
      variables: {
        id: meetingId,
        values: {
          currentStepId: null,
          ended: false,
        },
      },
    })
  }, [meeting, participants])

  // Next step
  const handleNextStep = useCallback(async () => {
    if (!meeting || !steps) return

    // Meeting not started
    if (meeting.currentStepId === null) {
      const firstStepConfig = meeting.stepsConfig[0]
      const firstStep =
        firstStepConfig &&
        steps.find((s) => s.stepConfigId === firstStepConfig.id)

      if (!firstStep) {
        // No first step -> end meeting
        await handleEnd()
        return
      }

      // Go to first step
      await updateMeeting({
        variables: {
          id: meeting.id,
          values: {
            currentStepId: firstStep.id,
            ended: false,
          },
        },
      })
      return
    }

    // Find current and next step
    const currentStep = steps.find((s) => s.id === meeting.currentStepId)
    const currentStepIndex = meeting.stepsConfig.findIndex(
      (step) => step.id === currentStep?.stepConfigId
    )
    if (
      currentStepIndex === -1 ||
      currentStepIndex === meeting.stepsConfig.length - 1
    ) {
      // No next step -> end meeting
      await handleEnd()
      return
    }

    // Find next step
    const nextStepConfig = meeting.stepsConfig[currentStepIndex + 1]
    const nextStep = steps.find((s) => s.stepConfigId === nextStepConfig.id)
    if (!nextStep) throw new Error('Next step not found')

    // Go to next step
    await updateMeeting({
      variables: {
        id: meeting.id,
        values: {
          currentStepId: nextStep.id,
        },
      },
    })
  }, [meeting, steps, participants, handleEnd])

  // Video conference URL
  const videoConfUrl = useMemo(
    () =>
      getMeetingVideoConfUrl(
        meeting,
        orgData?.getRole(circle?.roleId)?.name,
        currentMember?.name
      ),
    [meeting, circle, currentMember, orgData]
  )

  // Set startNotified to true just before meeting start
  // to prevent sending start notification when meeting page is already open
  const [updateAttendee] = useUpdateMeetingAttendeeMutation()
  useEffect(() => {
    if (
      !meeting ||
      // Meeting is not started
      meeting.currentStepId !== null ||
      // Meeting is ended
      meeting.ended ||
      // Meetinig will start in more than 30 minutes
      Date.now() < +new Date(meeting.startDate) - 30 * 60 * 1000 ||
      !currentMember
    ) {
      return
    }

    const attendee = meeting.meeting_attendees.find(
      (attendee) => attendee.memberId === currentMember.id
    )
    if (attendee?.startNotified === false) {
      updateAttendee({
        variables: {
          id: attendee.id,
          values: {
            startNotified: true,
          },
        },
      })
    }
  }, [meeting, currentMember])

  return {
    meeting,
    path,
    loading,
    error,
    steps,
    circle,
    participants,
    currentStep,
    currentStepConfig,
    canEdit,
    canEditSteps,
    forceEdit,
    editable,
    isParticipant,
    isEnded,
    isNotStarted,
    isStarted,
    isToday,
    isStartTimePassed,
    isEndTimePassed,
    isLastStep,
    videoConfUrl,
    handleScrollToStep,
    handleGoToStep,
    handleEnd,
    handleCancelStart,
    handleNextStep,
    handleChangeForceEdit: setForceEdit,
  }
}
