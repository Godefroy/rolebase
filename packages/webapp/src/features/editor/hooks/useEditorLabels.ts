import { EditorLabels } from '@rolebase/editor/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function useEditorLabels(): EditorLabels {
  const { t } = useTranslation()
  return useMemo(
    () => ({
      heading1: t('RichEditor.heading1'),
      heading2: t('RichEditor.heading2'),
      heading3: t('RichEditor.heading3'),
      bulletList: t('RichEditor.bulletList'),
      orderedList: t('RichEditor.orderedList'),
      taskList: t('RichEditor.taskList'),
      table: t('RichEditor.table'),
      quote: t('RichEditor.quote'),
      codeBlock: t('RichEditor.codeBlock'),
      divider: t('RichEditor.divider'),
      collapsible: t('RichEditor.collapsible'),
      image: t('RichEditor.image'),
      file: t('RichEditor.file'),
      youtube: t('RichEditor.youtube'),
      youtubePrompt: t('RichEditor.youtubePrompt'),
      bold: t('RichEditor.bold'),
      italic: t('RichEditor.italic'),
      underline: t('RichEditor.underline'),
      strike: t('RichEditor.strike'),
      code: t('RichEditor.code'),
      link: t('RichEditor.link'),
      linkPlaceholder: t('RichEditor.linkPlaceholder'),
      unlink: t('RichEditor.unlink'),
      addRowBelow: t('RichEditor.addRowBelow'),
      addColumnRight: t('RichEditor.addColumnRight'),
      deleteRow: t('RichEditor.deleteRow'),
      deleteColumn: t('RichEditor.deleteColumn'),
      toggleHeaderRow: t('RichEditor.toggleHeaderRow'),
      deleteTable: t('RichEditor.deleteTable'),
    }),
    [t]
  )
}
