import CircleMemberLink from '@/circle/components/CircleMemberLink'
import ThemeSwitch from '@/common/atoms/ThemeSwitch'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import LangSelect from '@/user/components/LangSelect'
import { useAuth } from '@/user/hooks/useAuth'
import useSuperAdmin from '@/user/hooks/useSuperAdmin'
import useUserSignOut from '@/user/hooks/useUserSignOut'
import { Flex, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  CurrentMemberIcon,
  LogoutIcon,
  SuperAdminIcon,
  UserInfoIcon,
} from 'src/icons'

export default function UserSettingsMenuList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const member = useCurrentMember()
  const isSuperAdmin = useSuperAdmin()
  const signOut = useUserSignOut()
  const pathInOrg = usePathInOrg('settings') || '/settings'

  if (!user) return null

  return (
    <MenuList zIndex={10} shadow="lg">
      {member && (
        <CircleMemberLink memberId={member.id}>
          <MenuItem icon={<CurrentMemberIcon size={20} />}>
            {t('SettingsMenu.user.member')}
          </MenuItem>
        </CircleMemberLink>
      )}

      <Link to={`${pathInOrg}/credentials`}>
        <MenuItem icon={<UserInfoIcon size={20} />}>
          {t('SettingsMenu.user.credentials')}
        </MenuItem>
      </Link>

      {isSuperAdmin && (
        <Link to="/admin">
          <MenuItem icon={<SuperAdminIcon size={20} />}>
            {t('Settings.superAdmin')}
          </MenuItem>
        </Link>
      )}

      <MenuItem icon={<LogoutIcon size={20} />} onClick={signOut}>
        {t('SettingsMenu.user.signout')}
      </MenuItem>

      <MenuDivider />
      <Flex
        py={1}
        pl={1}
        pr={3}
        mt={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <LangSelect />
        <ThemeSwitch />
      </Flex>
    </MenuList>
  )
}
