import ActionsMenu from '@/common/atoms/actionsMenu/ActionsMenu'
import ArchiveMenuItem from '@/common/atoms/actionsMenu/ArchiveMenuItem'
import DuplicateMenuItem from '@/common/atoms/actionsMenu/DuplicateMenuItem'
import EditMenuItem from '@/common/atoms/actionsMenu/EditMenuItem'
import ExportMenuItem from '@/common/atoms/actionsMenu/ExportMenuItem'
import MoveMenuItem from '@/common/atoms/actionsMenu/MoveMenuItem'
import useGraphViewParam from '@/graph/hooks/useGraphViewParam'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { MenuItem } from '@chakra-ui/react'
import { PointerPosition } from '@rolebase/graph'
import React, { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RoleIcon, SeparateIcon } from 'src/icons'
import RoleEditModal from '../../role/modals/RoleEditModal'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleCopyModal from '../modals/CircleCopyModal'
import CircleDeleteModal from '../modals/CircleDeleteModal'
import CircleMoveModal from '../modals/CircleMoveModal'
import MakeBaseRoleModal from '../modals/MakeBaseRoleModal'
import SeparateBaseRoleModal from '../modals/SeparateBaseRoleModal'
import AnchoredMenu from '@/common/atoms/actionsMenu/AnchoredMenu'

type ModalKind =
  | 'editRole'
  | 'delete'
  | 'move'
  | 'duplicate'
  | 'makeBaseRole'
  | 'separateBaseRole'

interface Props {
  // Anchor the menu at a viewport point (right click in the org chart) instead
  // of rendering the button that opens it
  anchor?: PointerPosition
  // Anchored mode: the menu is done (closed, and no modal left open), the
  // caller can unmount it
  onClose?(): void
  // Role edition only (proposal editor, demo): no org-wide navigation
  onlyRole?: boolean
  // Hide the editing affordances (preview)
  readOnly?: boolean
  // Edit the role through the caller's own modal (the role title opens it too)
  onEditRole?(): void
}

// Actions on a circle, shared by the role panel header and the org chart
// context menu. Owns the modals its items open, so they survive the menu
// closing.
export default function CircleActionsMenu({
  anchor,
  onClose,
  onlyRole,
  readOnly,
  onEditRole,
}: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember() && !readOnly
  const isOrgOwner = useOrgOwner()
  const { hasBackend } = useOrgContext()
  const navigateOrg = useNavigateOrg()
  const graphView = useGraphViewParam()
  const circleContext = useContext(CircleContext)

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

  if (!circleContext) return null
  const { circle, role, canEditCircle, canEditRole } = circleContext

  // An archived role only offers Restore (from the alert in CircleRole) and
  // Duplicate, which reads it into a new role without changing it.
  const canRestructure = canEditCircle && !circle.archivedAt

  // Base role actions. Turning a role into a base role is org-owner only (a
  // base role edit propagates everywhere). Detaching from a base role follows
  // the circle's structural edit permission. Both write to the database
  // directly, so neither applies to the root circle nor to an in-memory org
  // (proposal draft, website demo).
  const canMakeBaseRole =
    isOrgOwner &&
    canRestructure &&
    hasBackend &&
    !role.base &&
    !!circle.parentId
  const canSeparateBaseRole =
    canRestructure && hasBackend && role.base && !!circle.parentId
  const canExport = !onlyRole && !circle.archivedAt

  const hasItems =
    canEditRole ||
    canRestructure ||
    canEditCircle ||
    canExport ||
    canMakeBaseRole ||
    canSeparateBaseRole

  if (!isMember || !hasItems) return null

  const items = (
    <>
      {canEditRole && (
        <EditMenuItem onClick={onEditRole ?? (() => openModal('editRole'))} />
      )}
      {canRestructure && circle.parentId && (
        <MoveMenuItem onClick={() => openModal('move')} />
      )}
      {canEditCircle && circle.parentId && (
        <DuplicateMenuItem onClick={() => openModal('duplicate')} />
      )}
      {canExport && (
        <ExportMenuItem
          onClick={() =>
            navigateOrg(
              `export-circle?circleId=${circle.id}${
                graphView.view ? `&view=${graphView.view}` : ''
              }${graphView.folded ? `&folded=${graphView.folded}` : ''}`
            )
          }
        />
      )}
      {canMakeBaseRole && (
        <MenuItem
          icon={<RoleIcon size={20} />}
          onClick={() => openModal('makeBaseRole')}
        >
          {t('common.makeBaseRole')}
        </MenuItem>
      )}
      {canSeparateBaseRole && (
        <MenuItem
          icon={<SeparateIcon size={20} />}
          onClick={() => openModal('separateBaseRole')}
        >
          {t('common.separateBaseRole')}
        </MenuItem>
      )}
      {canRestructure && circle.parentId && (
        <ArchiveMenuItem onClick={() => openModal('delete')} />
      )}
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

      {modal === 'editRole' && (
        <RoleEditModal role={role} isOpen onClose={handleModalClose} />
      )}

      {modal === 'delete' && (
        <CircleDeleteModal id={circle.id} isOpen onClose={handleModalClose} />
      )}

      {modal === 'move' && (
        <CircleMoveModal
          circleId={circle.id}
          isOpen
          onClose={handleModalClose}
        />
      )}

      {modal === 'duplicate' && (
        <CircleCopyModal
          circleId={circle.id}
          isOpen
          onClose={handleModalClose}
        />
      )}

      {modal === 'makeBaseRole' && (
        <MakeBaseRoleModal role={role} isOpen onClose={handleModalClose} />
      )}

      {modal === 'separateBaseRole' && (
        <SeparateBaseRoleModal
          circleId={circle.id}
          role={role}
          isOpen
          onClose={handleModalClose}
        />
      )}
    </>
  )
}
