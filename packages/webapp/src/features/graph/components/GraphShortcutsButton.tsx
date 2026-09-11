import { graphButtonsProps } from '@/graph/components/graphButtonsProps'
import { Button, ButtonProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HelpIcon } from 'src/icons'

// Overlay button that opens the org chart shortcuts, styled like the other
// graph controls. The caller decides what it opens: a panel next to the graph
// (website demo) or a modal (GraphShortcutsModalButton).
// Accepts ButtonProps for positioning (e.g. position="absolute" top right).
export default function GraphShortcutsButton(props: ButtonProps) {
  const { t } = useTranslation()

  return (
    <Button {...graphButtonsProps} leftIcon={<HelpIcon size={18} />} {...props}>
      {t('GraphShortcuts.button')}
    </Button>
  )
}
