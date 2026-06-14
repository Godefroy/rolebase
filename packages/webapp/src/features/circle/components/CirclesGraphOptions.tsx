import GraphShortcutsModal from '@/graph/components/GraphShortcutsModal'
import { CirclesGraphViews } from '@/graph/types'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgMember from '@/member/hooks/useOrgMember'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import BaseRolesModal from '@/role/modals/BaseRolesModal'
import VacantRolesModal from '@/role/modals/VacantRolesModal'
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  StyleProps,
  useDisclosure,
} from '@chakra-ui/react'
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
import CirclesShareModal from '../modals/CirclesShareModal'
import GraphViewsSelect from './GraphViewsSelect'

interface CirclesGraphOptionsProps extends StyleProps {
  view: CirclesGraphViews
  onViewChange: (view: CirclesGraphViews) => void
}

export const graphButtonsProps = {
  variant: 'outline',
  size: 'sm',
  fontWeight: 'normal',
  border: 0,
  bg: 'white',
  _hover: {
    bg: 'gray.100',
  },
  _active: {
    bg: 'gray.200',
  },
  _dark: {
    bg: 'gray.700',
    _hover: {
      bg: 'gray.600',
    },
    _active: {
      bg: 'gray.550',
    },
  },
}

export default function CirclesGraphOptions({
  view,
  onViewChange,
  ...styleProps
}: CirclesGraphOptionsProps) {
  const { t } = useTranslation()
  const navigateOrg = useNavigateOrg()
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()

  // Modals
  const shortcutsModal = useDisclosure()
  const baseRolesModal = useDisclosure()
  const vacantRolesModal = useDisclosure()
  const shareModal = useDisclosure()

  return (
    <Flex justifyContent="space-between" {...styleProps}>
      <GraphViewsSelect
        value={view}
        onChange={onViewChange}
        {...graphButtonsProps}
        fontWeight="bold"
      />

      {isMember && (
        <Menu isLazy placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label={t('CirclesGraphOptions.settings')}
            icon={<SettingsIcon size={20} />}
            {...graphButtonsProps}
          />

          <Portal>
            <MenuList
              fontFamily="body"
              fontSize="1rem"
              fontWeight="normal"
              shadow="lg"
              zIndex={2000}
            >
              <MenuItem
                icon={<HelpIcon size={20} />}
                onClick={shortcutsModal.onOpen}
              >
                {t('GraphShortcutsModal.button')}
              </MenuItem>

              {isOwner && (
                <MenuItem
                  icon={<RoleIcon size={20} />}
                  onClick={baseRolesModal.onOpen}
                >
                  {t('CirclesGraphOptions.baseRoles')}
                </MenuItem>
              )}

              <MenuItem
                icon={<VacantCircle size={20} />}
                onClick={vacantRolesModal.onOpen}
              >
                {t('CirclesGraphOptions.vacantRoles')}
              </MenuItem>

              <MenuItem
                icon={<LogsIcon size={20} />}
                onClick={() => navigateOrg('logs')}
              >
                {t('CirclesGraphOptions.logs')}
              </MenuItem>

              {isAdmin && (
                <MenuItem
                  icon={<ShareIcon size={20} />}
                  onClick={shareModal.onOpen}
                >
                  {t('CirclesGraphOptions.share')}
                </MenuItem>
              )}
            </MenuList>
          </Portal>
        </Menu>
      )}

      {shortcutsModal.isOpen && (
        <GraphShortcutsModal isOpen onClose={shortcutsModal.onClose} />
      )}

      {baseRolesModal.isOpen && (
        <BaseRolesModal isOpen onClose={baseRolesModal.onClose} />
      )}

      {vacantRolesModal.isOpen && (
        <VacantRolesModal isOpen onClose={vacantRolesModal.onClose} />
      )}

      {shareModal.isOpen && (
        <CirclesShareModal isOpen onClose={shareModal.onClose} />
      )}
    </Flex>
  )
}
