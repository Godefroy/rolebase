import useCurrentMember from '@/member/hooks/useCurrentMember'
import { Circle, FormControlOptions, Tooltip } from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import {
  CollaborationConfig,
  EditorHandle,
  RichEditor,
} from '@rolebase/editor/react'
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { nhost } from 'src/nhost'
import settings from 'src/settings'
import useEditorLabels from '../hooks/useEditorLabels'
import useFileUpload from '../hooks/useFileUpload'
import useMentionables from '../hooks/useMentionables'
import { CollabOfflineOverlay } from './CollabOfflineOverlay'
import EditorContainer from './EditorContainer'

// Collaborative Markdown editor. The backend loads the content from the
// entity behind docId and saves the changes to it.

// Access token required by the collab server, refreshed if it expires soon
async function getCollabToken() {
  const session = await nhost.refreshSession(60).catch(() => null)
  return (session ?? nhost.getUserSession())?.accessToken
}

interface Props extends FormControlOptions {
  docId: string
  placeholder?: string
  autoFocus?: boolean
  readOnly?: boolean
  minH?: string
  maxH?: string
  onFocus?(): void
  onBlur?(): void
}

const CollabEditor = forwardRef<EditorHandle, Props>(
  (
    { docId, placeholder, autoFocus, readOnly, minH, maxH, onFocus, onBlur },
    ref
  ) => {
    const { t } = useTranslation()
    const currentMember = useCurrentMember()
    const localRef = useRef<EditorHandle>(null)
    const { handleUpload } = useFileUpload()
    const mentionables = useMentionables()
    const labels = useEditorLabels()

    useImperativeHandle(ref, () => localRef.current!, [])

    const [online, setOnline] = useState(false)

    const collaboration: CollaborationConfig = useMemo(
      () => ({
        url: settings.yjsCollab.url,
        docId,
        username: currentMember?.name,
        cursorColor: randomColor({ string: currentMember?.name || '' }),
        getToken: getCollabToken,
        onStatusChange: setOnline,
      }),
      [docId, currentMember?.name]
    )

    const [isFocus, setIsFocus] = useState(false)

    const handleFocus = useCallback(() => {
      setIsFocus(true)
      onFocus?.()
    }, [])

    const handleBlur = useCallback(() => {
      setIsFocus(false)
      onBlur?.()
    }, [])

    return (
      <EditorContainer readOnly={readOnly} isFocused={isFocus}>
        <RichEditor
          key={docId}
          ref={localRef}
          collaboration={collaboration}
          placeholder={placeholder}
          emptyParagraphPlaceholder={t('common.emptyParagraphPlaceholder')}
          autoFocus={autoFocus}
          readOnly={readOnly}
          minH={minH}
          maxH={maxH}
          mentionables={mentionables}
          labels={labels}
          onUpload={handleUpload}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {!online && <CollabOfflineOverlay />}

        {!readOnly && (
          <Tooltip
            label={online ? 'Collaboration Online' : 'Collaboration Offline'}
            placement="top"
            hasArrow
          >
            <Circle
              position="absolute"
              top="0.4em"
              right="0.4em"
              size="0.5em"
              bg={online ? 'green.500' : 'red.500'}
            />
          </Tooltip>
        )}
      </EditorContainer>
    )
  }
)

CollabEditor.displayName = 'CollabEditor'

export default memo(CollabEditor)
