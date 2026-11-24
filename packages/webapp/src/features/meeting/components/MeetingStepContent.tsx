import { MeetingStepFragment, Meeting_Step_Type_Enum } from '@gql'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import CollabEditor from '../../editor/components/CollabEditor'
import { MeetingContext } from '../contexts/MeetingContext'
import MeetingStepContentTasks from './MeetingStepContentTasks'
import MeetingStepContentThreads from './MeetingStepContentThreads'

interface Props {
  step: MeetingStepFragment
}

export default function MeetingStepContent({ step }: Props) {
  const { meeting, editable } = useContext(MeetingContext)!
  const { t } = useTranslation()

  if (!meeting) return null

  return (
    <>
      {step.type === Meeting_Step_Type_Enum.Threads && (
        <MeetingStepContentThreads step={step as any} />
      )}

      {step.type === Meeting_Step_Type_Enum.Tasks && (
        <MeetingStepContentTasks step={step as any} />
      )}

      {(editable || step.notes) && (
        <CollabEditor
          docId={`meeting-step-${step.id}`}
          placeholder={t('MeetingStepContent.notesPlaceholder')}
          readOnly={!editable}
        />
      )}
    </>
  )
}
