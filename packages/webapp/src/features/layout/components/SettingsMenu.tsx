import {
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { ChevronDownIcon } from 'src/icons'
import useSettingsLinks from '../hooks/useSettingsLinks'

// Settings navigation as a dropdown, for small screens
export default function SettingsMenu() {
  const { t } = useTranslation()
  const groups = useSettingsLinks()
  const location = useLocation()

  const currentLink = groups
    .flatMap((group) => group.links)
    .find((link) => location.pathname.startsWith(link.to))

  const CurrentIcon = currentLink?.icon

  return (
    <Menu matchWidth>
      <MenuButton
        as={Button}
        w="100%"
        variant="outline"
        textAlign="left"
        leftIcon={CurrentIcon ? <CurrentIcon size={20} /> : undefined}
        rightIcon={<ChevronDownIcon size={20} />}
      >
        {currentLink?.label ?? t('Settings.heading')}
      </MenuButton>

      <MenuList zIndex={10} shadow="lg">
        {groups.map((group) => (
          <MenuGroup key={group.title} title={group.title}>
            {group.links.map((link) => {
              const LinkIcon = link.icon
              return (
                <Link key={link.to} to={link.to}>
                  <MenuItem
                    icon={<LinkIcon size={20} />}
                    fontWeight={link === currentLink ? 'semibold' : undefined}
                  >
                    {link.label}
                  </MenuItem>
                </Link>
              )
            })}
          </MenuGroup>
        ))}
      </MenuList>
    </Menu>
  )
}
