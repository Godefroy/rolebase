import CircleMemberDeleteModal from '@/circle/modals/CircleMemberDeleteModal'
import ActionsMenu from '@/common/atoms/actionsMenu/ActionsMenu'
import AnchoredMenu from '@/common/atoms/actionsMenu/AnchoredMenu'
import ArchiveMenuItem from '@/common/atoms/actionsMenu/ArchiveMenuItem'
import { useOrgContext } from '@/org/contexts/OrgContext'
import useOrgEditPermissions from '@/org/hooks/useOrgEditPermissions'
import { MenuItem } from '@chakra-ui/react'
import { PointerPosition } from '@rolebase/graph'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RemoveMemberIcon } from 'src/icons'
import useCurrentMember from '../hooks/useCurrentMember'
import useOrgAdmin from '../hooks/useOrgAdmin'
import MemberDeleteModal from '../modals/MemberDeleteModal'

type ModalKind = 'archive' | 'removeFromRole'

interface Props {
  id: string
  // The role the member is right clicked in, in the org chart: adds the action
  // removing them from it
  circleId?: string
  // Anchor the menu at a viewport point (right click in the org chart) instead
  // of rendering the button that opens it
  anchor?: PointerPosition
  // Anchored mode: the menu is done (closed, and no modal left open), the
  // caller can unmount it
  onClose?(): void
}

// Actions on a member, shared by the member panel header and the org chart
// context menu. Owns the modals its items open, so they survive the menu
// closing.
export default function MemberActionsMenu({
  id,
  circleId,
  anchor,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { editable, isDraft } = useOrgContext()
  const isAdmin = useOrgAdmin()
  const currentMember = useCurrentMember()
  const { getPerms } = useOrgEditPermissions()

  // A single modal at a time. The ref is read while the menu closes, before
  // the state update is applied.
  const [modal, setModal] = useState<ModalKind | undefined>()
  const modalRef = useRef<ModalKind | undefined>()
  const openModal = (kind: ModalKind) => {
    modalRef.current = kind
    setModal(kind)
  }
  const handleModalClose = () => {
    modalRef.current = undefined
    setModal(undefined)
    if (anchor) onClose?.()
  }

  // Anchored mode: closing the menu ends it, unless it opened a modal
  const handleMenuClose = () => {
    if (!modalRef.current) onClose?.()
  }

  // Members can't archive themselves. Archiving a member is a profile action,
  // kept out of the org chart menu (which acts on the role that was clicked).
  const isSelf = !!currentMember && currentMember.id === id
  const canArchive = !anchor && isAdmin && editable && !isDraft && !isSelf
  const canRemoveFromRole = !!circleId && !!getPerms(circleId)?.canEditMembers

  if (!canArchive && !canRemoveFromRole) return null

  const items = (
    <>
      {canRemoveFromRole && (
        <MenuItem
          icon={<RemoveMemberIcon size={20} />}
          onClick={() => openModal('removeFromRole')}
        >
          {t('MemberActionsMenu.removeFromRole')}
        </MenuItem>
      )}
      {canArchive && <ArchiveMenuItem onClick={() => openModal('archive')} />}
    </>
  )

  return (
    <>
      {anchor ? (
        <AnchoredMenu anchor={anchor} onClose={handleMenuClose}>
          {items}
        </AnchoredMenu>
      ) : (
        <ActionsMenu>{items}</ActionsMenu>
      )}

      {modal === 'archive' && (
        <MemberDeleteModal id={id} isOpen onClose={handleModalClose} />
      )}

      {modal === 'removeFromRole' && circleId && (
        <CircleMemberDeleteModal
          circleId={circleId}
          memberId={id}
          isOpen
          onClose={handleModalClose}
        />
      )}
    </>
  )
}
