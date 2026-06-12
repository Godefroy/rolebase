import { EditorHandle } from '@/editor'
import SimpleEditor from '@/editor/components/SimpleEditor'
import { Box, BoxProps, Button, Collapse, Heading } from '@chakra-ui/react'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EditIcon } from 'src/icons'
import { fieldsGap } from '../../circle/components/CircleRole'
import useEscKey from '../hooks/useEscKey'
import { useHoverItemStyle } from '../hooks/useHoverItemStyle'

interface Props extends Omit<BoxProps, 'value'> {
  label: string
  placeholder?: string
  editable: boolean
  hideTitle?: boolean
  value: string
  initValue?: string
  info?: React.ReactNode
  onSave(value: string): void
}

export function EditableField({
  label,
  placeholder,
  editable,
  hideTitle,
  value,
  initValue,
  info,
  onSave,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const hoverStyle = useHoverItemStyle()

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
                      ...hoverStyle,
                    },
                  }
                : undefined
            }
            onClick={canOpenEdit ? handleEditClick : undefined}
          >
            <SimpleEditor
              ref={editorRef}
              value={value || initValue || ''}
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
