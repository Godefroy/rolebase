import AnchoredMenu from '@/common/atoms/actionsMenu/AnchoredMenu'
import { menuListProps } from '@/common/atoms/actionsMenu/menuListProps'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import { graphButtonsProps } from '@/graph/components/graphButtonsProps'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react'
import { PointerPosition } from '@rolebase/graph'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  HelpIcon,
  LogsIcon,
  RoleIcon,
  SettingsIcon,
  ShareIcon,
  VacantCircle,
} from 'src/icons'
import { CirclesPanel } from '../circlesPanels'

interface Props {
  // Anchor the menu at a viewport point (right click on the org chart
  // background) instead of rendering the settings button that opens it
  anchor?: PointerPosition
  // Anchored mode: the menu is closed, the caller can unmount it
  onClose?(): void
}

// Org chart options, shared by the button above the graph and the context menu
// of its background. Each item opens a panel of the org chart page, through the
// `panel` query param. Items that need the database are hidden in an in-memory
// org (proposal draft, website demo).
export default function CirclesGraphSettingsMenu({ anchor, onClose }: Props) {
  const { t } = useTranslation()
  const { changeParams } = useUpdatableQueryParams<{
    panel: string
    circleId: string
    memberId: string
    parentId: string
  }>()
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()
  const { hasBackend } = useOrgContext()

  // Any current selection is cleared so a single panel is open at a time.
  const openPanel = (panel: CirclesPanel) =>
    changeParams({
      panel,
      circleId: undefined,
      memberId: undefined,
      parentId: undefined,
    })

  if (!isMember) return null

  const items = (
    <>
      <MenuItem
        icon={<HelpIcon size={20} />}
        onClick={() => openPanel('shortcuts')}
      >
        {t('GraphShortcuts.button')}
      </MenuItem>

      {isOwner && hasBackend && (
        <MenuItem
          icon={<RoleIcon size={20} />}
          onClick={() => openPanel('baseRoles')}
        >
          {t('CirclesGraphOptions.baseRoles')}
        </MenuItem>
      )}

      <MenuItem
        icon={<VacantCircle size={20} />}
        onClick={() => openPanel('vacantRoles')}
      >
        {t('CirclesGraphOptions.vacantRoles')}
      </MenuItem>

      {hasBackend && (
        <MenuItem
          icon={<LogsIcon size={20} />}
          onClick={() => openPanel('logs')}
        >
          {t('CirclesGraphOptions.logs')}
        </MenuItem>
      )}

      {isAdmin && hasBackend && (
        <MenuItem
          icon={<ShareIcon size={20} />}
          onClick={() => openPanel('share')}
        >
          {t('CirclesGraphOptions.share')}
        </MenuItem>
      )}
    </>
  )

  if (anchor) {
    return (
      <AnchoredMenu anchor={anchor} onClose={() => onClose?.()}>
        {items}
      </AnchoredMenu>
    )
  }

  return (
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
  )
}
