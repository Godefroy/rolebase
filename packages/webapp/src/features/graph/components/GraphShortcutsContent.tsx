import PanelLayout from '@/common/atoms/PanelLayout'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GraphShortcutsList, { ShortcutKey } from './GraphShortcutsList'

interface Props {
  // Narrow the list further (see GraphShortcutsList)
  only?: ShortcutKey[]
  changeTitle?: boolean
  flowHeight?: boolean
  onClose?: () => void
}

// Org chart shortcuts, as a panel of the org chart page.
export default function GraphShortcutsContent({ only, ...panelProps }: Props) {
  const { t } = useTranslation()

  return (
    <PanelLayout title={t('GraphShortcuts.heading')} {...panelProps}>
      <GraphShortcutsList only={only} />
    </PanelLayout>
  )
}
