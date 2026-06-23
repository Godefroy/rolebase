import { EditorHandle } from '@/editor'
import SimpleEditor from '@/editor/components/SimpleEditor'
import { Box, BoxProps, Button, Collapse, Heading } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EditIcon } from 'src/icons'
import { fieldsGap } from '../../circle/components/CircleRole'
import useEscKey from '../hooks/useEscKey'

interface Props extends Omit<BoxProps, 'value'> {
  label: string
  placeholder?: string
  editable: boolean
  hideTitle?: boolean
  value: string
  // When editing an empty field, seed an empty list/todo so the user can start
  // typing items right away.
  initList?: 'bullet' | 'task'
  info?: React.ReactNode
  onSave(value: string): void
}

export function EditableField({
  label,
  placeholder,
  editable,
  hideTitle,
  value,
  initList,
  info,
  onSave,
  ...boxProps
}: Props) {
  const { t } = useTranslation()

  // State
  const [isEditing, setIsEditing] = useState(false)
  const isButton = !value && !isEditing
  const canOpenEdit = editable && !isEditing

  const editorRef = useRef<EditorHandle>(null)

  const handleSubmit = async () => {
    if (!editorRef.current) return
    setIsEditing(false)
    const newValue = editorRef.current.getValue(true)
    onSave(newValue)
  }

  const handleCancel = useCallback(() => {
    if (!isEditing) return
    editorRef.current?.setValue(value)
    setIsEditing(false)
  }, [isEditing, value])

  // Focus the editor when entering edit mode. The editor's own autofocus only
  // runs when it is created, which happens on click for empty fields but not
  // for non-empty ones (they stay mounted read-only and merely toggle editable),
  // so we focus it here for every case. For empty fields with an initial list
  // type, seed an empty list/todo and place the cursor in its first item.
  useEffect(() => {
    if (!isEditing) return
    let raf = 0
    let timer = 0
    let frames = 0
    const focusEditor = () => {
      const handle = editorRef.current
      const editor = handle?.editor
      if (!editor) {
        if (frames++ < 30) raf = requestAnimationFrame(focusEditor)
        return
      }
      if (initList && !value && handle?.isEmpty()) {
        // Seed an empty list/todo by wrapping the empty paragraph (a command,
        // not markdown content). StarterKit's TrailingNode then adds a paragraph
        // after the list, and the editor's autofocus selects 'end', which would
        // land the cursor on that extra line. Re-place it inside the first item
        // ('start') in a setTimeout that runs after autofocus's.
        const chain = editor.chain()
        if (initList === 'task') chain.toggleTaskList()
        else chain.toggleBulletList()
        chain.run()
        timer = window.setTimeout(() => {
          editorRef.current?.editor?.commands.focus('start')
        }, 0)
      } else if (!editor.isFocused) {
        editor.commands.focus('end')
      }
    }
    focusEditor()
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [isEditing])

  // Open edit mode on click, except when clicking a link or a file
  const handleEditClick = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('a')) return
    setIsEditing(true)
  }, [])

  // Cancel on escape if value didn't change
  useEscKey(
    useCallback(() => {
      if (!isEditing || editorRef.current?.getValue(true) !== value) {
        return
      }
      handleCancel()
    }, [isEditing, handleCancel])
  )

  // Hide if read only and empty
  if (!editable && isButton) return null

  return (
    <Box my={isButton ? 2 : fieldsGap} {...boxProps}>
      {isButton ? (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<EditIcon size={18} />}
          onClick={() => setIsEditing(true)}
        >
          {label}
        </Button>
      ) : (
        <>
          {!hideTitle && (
            <Heading as="h3" size="sm" mb={2}>
              {label}
            </Heading>
          )}
          <Box
            role="group"
            borderRadius="md"
            position="relative"
            // Isolate so the hover `_before` (zIndex: -1) paints within this box
            // rather than behind ancestor backgrounds. Without it, an ancestor
            // with a background (e.g. the inline panel on the website demo) paints
            // over the negative-z-index pseudo and the hover effect disappears.
            isolation="isolate"
            cursor={canOpenEdit ? 'pointer' : undefined}
            _hover={
              canOpenEdit
                ? {
                    _before: {
                      content: '""',
                      display: 'block',
                      borderRadius: 'md',
                      position: 'absolute',
                      left: '-8px',
                      right: '-8px',
                      top: '-4px',
                      bottom: '-4px',
                      zIndex: -1,
                      bg: 'bgItemHover',
                    },
                  }
                : undefined
            }
            onClick={canOpenEdit ? handleEditClick : undefined}
          >
            <SimpleEditor
              ref={editorRef}
              value={value}
              placeholder={placeholder}
              readOnly={!isEditing}
              autoFocus={isEditing}
              onSubmit={handleSubmit}
            />
          </Box>
        </>
      )}

      {isEditing && info}

      <Collapse in={isEditing}>
        <Box textAlign="right">
          <Button size="sm" mt={2} onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme="blue"
            size="sm"
            mt={2}
            ml={2}
            onClick={handleSubmit}
          >
            {t('common.save')}
          </Button>
        </Box>
      </Collapse>
    </Box>
  )
}
