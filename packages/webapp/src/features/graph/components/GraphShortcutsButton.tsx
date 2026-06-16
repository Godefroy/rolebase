import { graphButtonsProps } from '@/circle/components/CirclesGraphOptions'
import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HelpIcon } from 'src/icons'
import GraphShortcutsModal from './GraphShortcutsModal'

// Overlay button that opens the org-chart shortcuts modal, styled like the
// other graph controls. Shared by the proposal editor and the website demo.
// Accepts ButtonProps for positioning (e.g. position="absolute" top right).
export default function GraphShortcutsButton(props: ButtonProps) {
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
        <GraphShortcutsModal isOpen onClose={modal.onClose} />
      )}
    </>
  )
}
