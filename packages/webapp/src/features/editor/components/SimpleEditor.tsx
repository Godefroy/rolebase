import { FormControlOptions, useFormControl } from '@chakra-ui/react'
import { EditorHandle, RichEditor } from '@rolebase/editor/react'
import { pick } from '@utils/pick'
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import useEditorLabels from '../hooks/useEditorLabels'
import { useEditorValue } from '../hooks/useEditorValue'
import useFileUpload from '../hooks/useFileUpload'
import useMentionables from '../hooks/useMentionables'
import EditorContainer from './EditorContainer'

// Simple Markdown editor

interface Props extends FormControlOptions {
  value: string
  placeholder?: string
  autoFocus?: boolean
  readOnly?: boolean
  minH?: string
  maxH?: string
  onChange?(value: string): void
  onSubmit?(value: string): void // When the user presses Cmd/Ctrl + Enter
}

const SimpleEditor = forwardRef<EditorHandle, Props>(
  (
    { value, placeholder, autoFocus, readOnly, minH, maxH, onChange, onSubmit },
    ref
  ) => {
    const { t } = useTranslation()
    const localRef = useRef<EditorHandle>(null)
    const formControlProps = useFormControl<HTMLInputElement>({})
    const { handleUpload } = useFileUpload()
    const mentionables = useMentionables()
    const labels = useEditorLabels()

    // Convert legacy Lexical JSON values to markdown on the fly
    const editorValue = useEditorValue(value)

    useImperativeHandle(ref, () => localRef.current!, [])

    const computedReadOnly =
      readOnly || formControlProps.readOnly || formControlProps.disabled
    const ariaProps = pick(
      formControlProps,
      'aria-describedby',
      'aria-invalid',
      'aria-readonly',
      'aria-required'
    )

    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = useCallback(() => setIsFocused(true), [])

    // Save on blur
    const handleBlur = useCallback(() => {
      setIsFocused(false)
      if (!localRef.current) return
      onChange?.(localRef.current.getValue(true))
    }, [onChange])

    // Save on Cmd/Ctrl + Enter
    const handleSubmit = useCallback(() => {
      if (!localRef.current) return
      onSubmit?.(localRef.current.getValue(true))
    }, [onSubmit])

    if (editorValue === undefined) return null

    return (
      <EditorContainer
        readOnly={computedReadOnly}
        isFocused={isFocused}
        {...ariaProps}
      >
        <RichEditor
          ref={localRef}
          value={editorValue}
          placeholder={placeholder}
          emptyParagraphPlaceholder={t('common.emptyParagraphPlaceholder')}
          autoFocus={autoFocus}
          readOnly={computedReadOnly}
          minH={minH}
          maxH={maxH}
          mentionables={mentionables}
          labels={labels}
          onUpload={handleUpload}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />
      </EditorContainer>
    )
  }
)

SimpleEditor.displayName = 'SimpleEditor'

export default memo(SimpleEditor)
