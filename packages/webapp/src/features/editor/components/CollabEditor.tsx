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
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import settings from 'src/settings'
import useEditorLabels from '../hooks/useEditorLabels'
import { useEditorValue } from '../hooks/useEditorValue'
import useFileUpload from '../hooks/useFileUpload'
import useMentionables from '../hooks/useMentionables'
import { CollabOfflineOverlay } from './CollabOfflineOverlay'
import EditorContainer from './EditorContainer'

// Collaborative Markdown editor

interface Props extends FormControlOptions {
  docId: string
  value: string
  placeholder?: string
  autoFocus?: boolean
  readOnly?: boolean
  minH?: string
  maxH?: string
  saveEvery?: number // Save every X ms if focused
  onSave?(value: string): void
  onFocus?(): void
  onBlur?(): void
}

const CollabEditor = forwardRef<EditorHandle, Props>(
  (
    {
      docId,
      value,
      placeholder,
      autoFocus,
      readOnly,
      minH,
      maxH,
      saveEvery,
      onSave,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const currentMember = useCurrentMember()
    const localRef = useRef<EditorHandle>(null)
    const { handleUpload } = useFileUpload()
    const mentionables = useMentionables()
    const labels = useEditorLabels()

    // Convert legacy Lexical JSON values to markdown on the fly
    const editorValue = useEditorValue(value)

    useImperativeHandle(ref, () => localRef.current!, [])

    const [online, setOnline] = useState(false)

    const collaboration: CollaborationConfig = useMemo(
      () => ({
        url: settings.yjsCollab.url,
        docId,
        username: currentMember?.name,
        cursorColor: randomColor({ string: currentMember?.name || '' }),
        onStatusChange: setOnline,
      }),
      [docId, currentMember?.name]
    )

    // Handle every little change in the doc
    // to save it with throttling
    const handleChange = useCallback(() => {
      if (!localRef.current) return
      const newValue = localRef.current.getValue(true)
      if (newValue === value) return
      onSave?.(newValue)
    }, [docId, value])

    const [isFocus, setIsFocus] = useState(false)

    const handleFocus = useCallback(() => {
      setIsFocus(true)
      onFocus?.()
    }, [])

    const handleBlur = useCallback(() => {
      setIsFocus(false)
      handleChange()
      onBlur?.()
    }, [handleChange])

    // Save every X ms
    useEffect(() => {
      if (!saveEvery || !isFocus) return
      const interval = setInterval(() => {
        handleChange()
      }, saveEvery)
      return () => clearInterval(interval)
    }, [saveEvery, isFocus, handleChange])

    if (editorValue === undefined) return null

    return (
      <EditorContainer readOnly={readOnly} isFocused={isFocus}>
        <RichEditor
          key={docId}
          ref={localRef}
          collaboration={collaboration}
          value={editorValue}
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
            label={
              online ? 'Collaboration Online' : 'Collaboration Offline'
            }
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
