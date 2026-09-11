import { ButtonProps, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import GraphShortcutsButton from './GraphShortcutsButton'
import { ShortcutKey } from './GraphShortcutsList'
import GraphShortcutsModal from './GraphShortcutsModal'

interface Props extends ButtonProps {
  // Restrict the listed shortcuts (see GraphShortcutsList)
  only?: ShortcutKey[]
}

// Shortcuts button for the org charts with no panel next to them: the proposal
// editor and the documentation illustrations.
export default function GraphShortcutsModalButton({ only, ...props }: Props) {
  const modal = useDisclosure()

  return (
    <>
      <GraphShortcutsButton {...props} onClick={modal.onOpen} />

      {modal.isOpen && (
        <GraphShortcutsModal isOpen only={only} onClose={modal.onClose} />
      )}
    </>
  )
}
