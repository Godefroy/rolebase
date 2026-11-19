import { Button } from '@chakra-ui/react'
import { MeetingStepFragment, Meeting_Step_Type_Enum } from '@gql'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { EditIcon } from 'src/icons'
import { EditorHandle } from '../../editor'
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
  const editorRef = useRef<EditorHandle>(null)
  const [forceEdit, setForceEdit] = useState(false)

  // Disable force edit after having saved some notes
  useEffect(() => {
    if (forceEdit && step.notes) {
      setForceEdit(false)
    }
  }, [forceEdit, step.notes])

  // Disable force edit on blur if editor is empty
  const handleNotesBlur = useCallback(() => {
    if (editorRef.current?.isEmpty()) {
      setForceEdit(false)
    }
  }, [])

  if (!meeting) return null

  return (
    <>
      {step.type === Meeting_Step_Type_Enum.Threads && (
        <MeetingStepContentThreads step={step as any} />
      )}

      {step.type === Meeting_Step_Type_Enum.Tasks && (
        <MeetingStepContentTasks step={step as any} />
      )}

      {step.notes || forceEdit ? (
        <CollabEditor
          ref={editorRef}
          docId={`meeting-step-${step.id}`}
          placeholder={t('MeetingStepContent.notesPlaceholder')}
          readOnly={!editable}
          autoFocus={forceEdit}
          onBlur={handleNotesBlur}
        />
      ) : (
        editable && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<EditIcon size={18} />}
            onClick={() => setForceEdit(true)}
          >
            {t('MeetingStepContent.addNotes')}
          </Button>
        )
      )}
    </>
  )
}
