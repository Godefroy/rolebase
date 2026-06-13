import { SidebarContext } from '@/layout/contexts/SidebarContext'
import { UpDownIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { useStoreState } from '@store/hooks'
import { UserLocalStorageKeys } from '@utils/localStorage'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { CreateIcon } from 'src/icons'
import useCurrentOrg from '../hooks/useCurrentOrg'
import { useOrgId } from '../hooks/useOrgId'
import OrgCreateModal from '../modals/OrgCreateModal'
import OrgIcon from './OrgIcon'

export default function OrgSwitch(props: MenuButtonProps) {
  const { t } = useTranslation()
  const sidebarContext = useContext(SidebarContext)
  const orgId = useOrgId()
  const org = useCurrentOrg()
  const orgs = useStoreState((state) => state.orgs.entries)
  const sortedOrgs = orgs?.sort((a, b) => (a.name < b.name ? -1 : 1))
  const showName = org && org.id === orgId

  const handleOrgClick = (orgId: string) => {
    localStorage.setItem(UserLocalStorageKeys.DefaultOrgId, orgId)
    // Close sidebar on item click
    sidebarContext?.expand.onClose()
  }

  // Create modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        fontWeight="bold"
        justifyContent="left"
        h="auto"
        py={3}
        pl={3}
        pr={2}
        textAlign="left"
        borderRadius="xl"
        opacity={showName ? 1 : 0}
        _hover={{
          bg: 'whiteAlpha.600',
        }}
        _active={{
          bg: 'white',
        }}
        _dark={{
          color: 'whiteAlpha.800',
          _hover: {
            bg: 'whiteAlpha.50',
          },
          _active: {
            color: 'white',
            bg: 'whiteAlpha.100',
          },
        }}
        {...props}
      >
        <HStack spacing={3} w="100%">
          <OrgIcon icon={org?.icon} name={org?.name} size={24} />
          <Box
            flex={1}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {showName ? org.name : ''}
          </Box>
          <UpDownIcon opacity={0.6} flexShrink={0} />
        </HStack>
      </MenuButton>

      <MenuList zIndex={10} shadow="lg">
        <MenuGroup title={t('OrgSwitch.orgs')}>
          {sortedOrgs?.map((org) => (
            <Link
              key={org.id}
              to={`${getOrgPath(org)}/`}
              onClick={() => handleOrgClick(org.id)}
            >
              <MenuItem
                icon={
                  <OrgIcon
                    icon={org.icon}
                    name={org.name}
                    size={20}
                    fallback="blank"
                  />
                }
              >
                {org.name}
              </MenuItem>
            </Link>
          ))}
        </MenuGroup>

        <MenuDivider />

        <MenuItem icon={<CreateIcon size={20} />} onClick={onCreateOpen}>
          {t('OrgSwitch.create')}
        </MenuItem>
      </MenuList>

      {isCreateOpen && <OrgCreateModal isOpen onClose={onCreateClose} />}
    </Menu>
  )
}
