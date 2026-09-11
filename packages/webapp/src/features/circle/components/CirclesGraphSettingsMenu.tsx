import AnchoredMenu from '@/common/atoms/actionsMenu/AnchoredMenu'
import { menuListProps } from '@/common/atoms/actionsMenu/menuListProps'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import GraphShortcutsModal from '@/graph/components/GraphShortcutsModal'
import { graphButtonsProps } from '@/graph/components/graphButtonsProps'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import BaseRolesModal from '@/role/modals/BaseRolesModal'
import VacantRolesModal from '@/role/modals/VacantRolesModal'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react'
import { PointerPosition } from '@rolebase/graph'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HelpIcon,
  LogsIcon,
  RoleIcon,
  SettingsIcon,
  ShareIcon,
  VacantCircle,
} from 'src/icons'
import CirclesShareModal from '../modals/CirclesShareModal'

type ModalKind = 'shortcuts' | 'baseRoles' | 'vacantRoles' | 'share'

interface Props {
  // Anchor the menu at a viewport point (right click on the org chart
  // background) instead of rendering the settings button that opens it
  anchor?: PointerPosition
  // Anchored mode: the menu is done (closed, and no modal left open), the
  // caller can unmount it
  onClose?(): void
}

// Org chart options, shared by the button above the graph and the context menu
// of its background. Owns the modals its items open, so they survive the menu
// closing. Items that need the database are hidden in an in-memory org
// (proposal draft, website demo).
export default function CirclesGraphSettingsMenu({ anchor, onClose }: Props) {
  const { t } = useTranslation()
  const { changeParams } = useUpdatableQueryParams<{
    logs: string
    circleId: string
    memberId: string
    parentId: string
  }>()
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()
  const { hasBackend } = useOrgContext()

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

  // The history is a panel of the org chart page, opened by a query param.
  // Any current selection is cleared so a single panel is open at a time.
  const handleOpenLogs = () =>
    changeParams({
      logs: '1',
      circleId: undefined,
      memberId: undefined,
      parentId: undefined,
    })

  if (!isMember) return null

  const items = (
    <>
      <MenuItem
        icon={<HelpIcon size={20} />}
        onClick={() => openModal('shortcuts')}
      >
        {t('GraphShortcutsModal.button')}
      </MenuItem>

      {isOwner && hasBackend && (
        <MenuItem
          icon={<RoleIcon size={20} />}
          onClick={() => openModal('baseRoles')}
        >
          {t('CirclesGraphOptions.baseRoles')}
        </MenuItem>
      )}

      <MenuItem
        icon={<VacantCircle size={20} />}
        onClick={() => openModal('vacantRoles')}
      >
        {t('CirclesGraphOptions.vacantRoles')}
      </MenuItem>

      {hasBackend && (
        <MenuItem icon={<LogsIcon size={20} />} onClick={handleOpenLogs}>
          {t('CirclesGraphOptions.logs')}
        </MenuItem>
      )}

      {isAdmin && hasBackend && (
        <MenuItem
          icon={<ShareIcon size={20} />}
          onClick={() => openModal('share')}
        >
          {t('CirclesGraphOptions.share')}
        </MenuItem>
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
        <Menu isLazy placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label={t('CirclesGraphOptions.settings')}
            icon={<SettingsIcon size={20} />}
            {...graphButtonsProps}
          />

          <Portal>
            <MenuList {...menuListProps}>{items}</MenuList>
          </Portal>
        </Menu>
      )}

      {modal === 'shortcuts' && (
        <GraphShortcutsModal isOpen onClose={handleModalClose} />
      )}

      {modal === 'baseRoles' && (
        <BaseRolesModal isOpen onClose={handleModalClose} />
      )}

      {modal === 'vacantRoles' && (
        <VacantRolesModal isOpen onClose={handleModalClose} />
      )}

      {modal === 'share' && (
        <CirclesShareModal isOpen onClose={handleModalClose} />
      )}
    </>
  )
}
