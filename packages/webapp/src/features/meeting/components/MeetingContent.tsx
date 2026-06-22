import Page404 from '@/common/pages/Page404'
import useOrgMember from '@/member/hooks/useOrgMember'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Collapse,
  Container,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { VisioIcon } from 'src/icons'
import { MeetingContext } from '../contexts/MeetingContext'
import useCreateMissingMeetingSteps from '../hooks/useCreateMissingMeetingSteps'
import MeetingEditModal from '../modals/MeetingEditModal'
import MeetingAlertForceEdit from './MeetingAlertForceEdit'
import MeetingAlertNotStarted from './MeetingAlertNotStarted'
import MeetingAttendeesList from './MeetingAttendeesList'
import MeetingContentEmpty from './MeetingContentEmpty'
import MeetingLogs from './MeetingLogs'
import MeetingStepContent from './MeetingStepContent'
import { taskLogTypes } from './MeetingStepContentTasks'
import MeetingStepLayout from './MeetingStepLayout'
import MeetingThreadsDragDropContext from './MeetingThreadsDragDropContext'

export default function MeetingContent() {
  const { t } = useTranslation()
  const isMember = useOrgMember()

  const {
    meeting,
    error,
    steps,
    circle,
    isParticipant,
    editable,
    canEdit,
    forceEdit,
    isEnded,
    isNotStarted,
    isStarted,
    videoConfUrl,
    handleGoToStep,
  } = useContext(MeetingContext)!

  // Create missing steps
  const createMissingMeetingSteps = useCreateMissingMeetingSteps()
  useEffect(() => {
    if (!meeting || !circle || !steps) return
    // We want to create missing steps only if there is already some steps defined,
    // because MeetingContentEmpty is in charge of creating steps of a new meeting
    if (steps.length > 0) {
      createMissingMeetingSteps()
    }
  }, [meeting, circle, steps])

  // Meeting edition modal
  const editModal = useDisclosure()

  if (error || !meeting) {
    console.error(error)
    return <Page404 />
  }

  return (
    <Container maxW="3xl" py={10}>
      {isMember && !isEnded && !isParticipant && (
        <Alert status="info" mb={16}>
          <AlertIcon />
          <AlertDescription>{t('MeetingContent.notInvited')}</AlertDescription>
        </Alert>
      )}

      {meeting.archivedAt && (
        <Alert status="info" mb={16}>
          <AlertIcon />
          <AlertDescription>{t('MeetingContent.archived')}</AlertDescription>
        </Alert>
      )}

      {isParticipant &&
        !meeting.archivedAt &&
        (steps?.length === 0 && meeting.stepsConfig.length !== 0 ? (
          <MeetingContentEmpty />
        ) : isNotStarted ? (
          <MeetingAlertNotStarted mb={16} onEdit={editModal.onOpen} />
        ) : (
          isEnded && forceEdit && <MeetingAlertForceEdit mb={16} />
        ))}

      <Collapse
        in={!!videoConfUrl && isStarted && isParticipant}
        animateOpacity
      >
        <Box mb={16}>
          <a href={videoConfUrl} target="_blank" rel="noreferrer">
            <Button leftIcon={<VisioIcon variant="Bold" />} colorScheme="blue">
              {t('MeetingContent.videoConf')}
            </Button>
          </a>
        </Box>
      </Collapse>

      <MeetingAttendeesList mb={16} />

      <MeetingThreadsDragDropContext disabled={!editable}>
        {meeting.stepsConfig.map((stepConfig, index) => {
          const step = steps?.find((s) => s.stepConfigId === stepConfig.id)
          if (!step) return null
          const current = meeting.currentStepId === step.id

          return (
            <MeetingStepLayout
              key={step.id}
              index={index}
              stepId={step.id}
              title={stepConfig.title}
              current={current}
              onStepClick={
                isStarted && canEdit ? () => handleGoToStep(step.id) : undefined
              }
            >
              <MeetingStepContent step={step} />
            </MeetingStepLayout>
          )
        })}
      </MeetingThreadsDragDropContext>

      {!isNotStarted && (
        <MeetingLogs
          meetingId={meeting.id}
          title={t('MeetingContent.logs')}
          excludeTypes={taskLogTypes}
          hideEmpty
          mt={10}
        />
      )}

      <Box h="100px" />

      {editModal.isOpen && (
        <MeetingEditModal
          meeting={meeting}
          isOpen
          onClose={editModal.onClose}
        />
      )}
    </Container>
  )
}
