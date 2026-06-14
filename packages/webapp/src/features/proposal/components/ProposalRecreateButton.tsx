import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react'
import { ThreadActivityDataProposal } from '@rolebase/shared/model/proposal'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from 'src/icons'
import ProposalModal from '../modals/ProposalModal'

interface Props extends ButtonProps {
  threadId: string
  data: ThreadActivityDataProposal
}

// Open a fresh, editable proposal prefilled from an existing one. Shared by the
// "cancel and recreate" menu action and the recreate button on refused cards.
export default function ProposalRecreateButton({
  threadId,
  data,
  ...buttonProps
}: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        leftIcon={<CopyIcon size={18} />}
        onClick={modal.onOpen}
        {...buttonProps}
      >
        {t('ThreadActivityProposal.recreate')}
      </Button>

      {modal.isOpen && (
        <ProposalModal
          isOpen
          threadId={threadId}
          defaults={data}
          onClose={modal.onClose}
        />
      )}
    </>
  )
}
