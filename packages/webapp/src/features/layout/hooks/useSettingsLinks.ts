import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgOwner from '@/member/hooks/useOrgOwner'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { Icon } from 'iconsax-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ApiIcon,
  AppsIcon,
  BillingIcon,
  CircleIcon,
  ExportIcon,
  MembersIcon,
  NotificationIcon,
  SubscriptionIcon,
  UserInfoIcon,
} from 'src/icons'

export interface SettingsLink {
  to: string
  icon: Icon
  label: string
}

export interface SettingsLinksGroup {
  title: string
  links: SettingsLink[]
}

// Single source of truth for the settings menu, rendered as a sidebar on
// desktop and as a dropdown on mobile
export default function useSettingsLinks(): SettingsLinksGroup[] {
  const { t } = useTranslation()
  const pathBase = usePathInOrg('settings') || '/settings'
  const { orgId } = useOrgContext()
  const isAdmin = useOrgAdmin()
  const isOwner = useOrgOwner()

  return useMemo(() => {
    const orgLinks = [
      isAdmin && {
        to: `${pathBase}/org`,
        icon: CircleIcon,
        label: t('Settings.orgSettings'),
      },
      {
        to: `${pathBase}/members`,
        icon: MembersIcon,
        label: t('Settings.members'),
      },
      isOwner && {
        to: `${pathBase}/subscription`,
        icon: SubscriptionIcon,
        label: t('Settings.subscription'),
      },
      isOwner && {
        to: `${pathBase}/billing`,
        icon: BillingIcon,
        label: t('Settings.billing'),
      },
      isOwner && {
        to: `${pathBase}/export`,
        icon: ExportIcon,
        label: t('Settings.export'),
      },
    ].filter(truthy)

    return [
      ...(orgId
        ? [{ title: t('SettingsMenu.org.heading'), links: orgLinks }]
        : []),
      {
        title: t('SettingsMenu.user.heading'),
        links: [
          {
            to: `${pathBase}/credentials`,
            icon: UserInfoIcon,
            label: t('SettingsMenu.user.credentials'),
          },
          {
            to: `${pathBase}/notifications`,
            icon: NotificationIcon,
            label: t('SettingsMenu.user.notifications'),
          },
          {
            to: `${pathBase}/apps`,
            icon: AppsIcon,
            label: t('Settings.apps'),
          },
          {
            to: `${pathBase}/api-keys`,
            icon: ApiIcon,
            label: t('Settings.api'),
          },
        ],
      },
    ]
  }, [orgId, isAdmin, isOwner, pathBase, t])
}
