import { graphButtonsProps } from '@/graph/components/graphButtonsProps'
import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HelpIcon } from 'src/icons'
import GraphShortcutsModal, { ShortcutKey } from './GraphShortcutsModal'

interface Props extends ButtonProps {
  // Restrict the listed shortcuts (see GraphShortcutsModal)
  only?: ShortcutKey[]
}

// Overlay button that opens the org-chart shortcuts modal, styled like the
// other graph controls. Shared by the proposal editor, the website demo and
// the documentation illustrations.
// Accepts ButtonProps for positioning (e.g. position="absolute" top right).
export default function GraphShortcutsButton({ only, ...props }: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()

  return (
    <>
      <Button
        {...graphButtonsProps}
        leftIcon={<HelpIcon size={18} />}
        {...props}
        onClick={modal.onOpen}
      >
        {t('GraphShortcutsModal.button')}
      </Button>

      {modal.isOpen && (
        <GraphShortcutsModal isOpen only={only} onClose={modal.onClose} />
      )}
    </>
  )
}
