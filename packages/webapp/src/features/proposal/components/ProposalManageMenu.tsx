import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'
import { useProposal } from '../contexts/ProposalContext'
import ProposalCancelModal from '../modals/ProposalCancelModal'
import ProposalModal from '../modals/ProposalModal'
import ProposalResolveModal from '../modals/ProposalResolveModal'

// "Manage" menu for the proposal author or a circle leader. The manual resolve
// action is a prominent button; the automatic one stays inside the menu. The
// resolve / cancel / re-create modals live here, next to their triggers.
export default function ProposalManageMenu() {
  const { t } = useTranslation()
  const {
    activity,
    votes,
    state,
    canEdit,
    editModal,
    remind,
    cancel,
    resolve,
  } = useProposal()

  const resolveModal = useDisclosure()
  const cancelModal = useDisclosure()
  const recreateModal = useDisclosure()
  const [cancelRecreate, setCancelRecreate] = useState(false)

  const openCancel = (recreate: boolean) => {
    setCancelRecreate(recreate)
    cancelModal.onOpen()
  }

  const confirmCancel = async () => {
    await cancel()
    if (cancelRecreate) recreateModal.onOpen()
  }

  const approveCount = votes?.filter((v) => v.vote === 'approve').length || 0
  const objectCount = votes?.filter((v) => v.vote === 'object').length || 0

  return (
    <HStack spacing={2}>
      <Menu placement="bottom-end" isLazy>
        <MenuButton
          as={Button}
          size="sm"
          variant="ghost"
          rightIcon={<ChevronDownIcon size="1em" />}
        >
          {t('ThreadActivityProposal.manage')}
        </MenuButton>
        <MenuList>
          {canEdit && (
            <MenuItem onClick={editModal.onOpen}>{t('common.edit')}</MenuItem>
          )}
          {state.canResolve && (
            <MenuItem onClick={resolveModal.onOpen}>
              {t('ThreadActivityProposal.resolveNow')}
            </MenuItem>
          )}
          {state.canResolve && (
            <MenuItem onClick={remind}>
              {t('ThreadActivityProposal.remind')}
            </MenuItem>
          )}
          <MenuItem onClick={() => openCancel(false)}>
            {t('ThreadActivityProposal.cancel')}
          </MenuItem>
          <MenuItem onClick={() => openCancel(true)}>
            {t('ThreadActivityProposal.cancelAndDuplicate')}
          </MenuItem>
        </MenuList>
      </Menu>

      {resolveModal.isOpen && (
        <ProposalResolveModal
          isOpen
          onClose={resolveModal.onClose}
          decisionMode={activity.data.decisionMode}
          approveCount={approveCount}
          objectCount={objectCount}
          votersCount={state.votersCount}
          willBeApproved={state.result.approved}
          hasOrgChanges={activity.data.logs.length > 0}
          onConfirm={resolve}
        />
      )}

      {cancelModal.isOpen && (
        <ProposalCancelModal
          isOpen
          onClose={cancelModal.onClose}
          duplicate={cancelRecreate}
          onConfirm={confirmCancel}
        />
      )}

      {recreateModal.isOpen && (
        <ProposalModal
          isOpen
          threadId={activity.threadId}
          defaults={activity.data}
          onClose={recreateModal.onClose}
        />
      )}
    </HStack>
  )
}
