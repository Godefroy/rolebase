import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { DrawerBody, DrawerHeader, Stack, Tag, Text } from '@chakra-ui/react'
import { useAdminUserQuery } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useAdminSelection from '../hooks/useAdminSelection'
import AdminDangerAction from './AdminDangerAction'
import AdminDrawerHeader from './AdminDrawerHeader'
import AdminDrawerSection from './AdminDrawerSection'
import AdminInfoGrid from './AdminInfoGrid'
import AdminInfoRow from './AdminInfoRow'
import AdminListItem from './AdminListItem'
import AdminSubscriptionTag from './AdminSubscriptionTag'
import DeleteUserButton from './DeleteUserButton'
import DisableUserButton from './DisableUserButton'
import ImpersonateButton from './ImpersonateButton'

interface Props {
  userId: string
}

export default function AdminUserPanel({ userId }: Props) {
  const { t } = useTranslation()
  const { openOrg } = useAdminSelection()
  const { data, loading, error } = useAdminUserQuery({
    variables: { id: userId },
  })
  const user = data?.user

  if (!user) {
    return (
      <DrawerBody py={10}>
        {loading && <Loading active center />}
        {error && <TextError error={error} />}
        {!loading && !error && <Text>{t('SuperAdmin.notFound')}</Text>}
      </DrawerBody>
    )
  }

  const userName = user.displayName || user.email || user.id

  return (
    <>
      <DrawerHeader borderBottomWidth="1px" pb={5}>
        <AdminDrawerHeader
          title={user.displayName || user.email || '-'}
          subtitle={user.displayName ? user.email : undefined}
          avatarSrc={user.avatarUrl || undefined}
          tags={
            <>
              <Tag size="sm" colorScheme={user.disabled ? 'red' : 'green'}>
                {user.disabled
                  ? t('SuperAdmin.users.disabled')
                  : t('SuperAdmin.users.active')}
              </Tag>
              {!user.emailVerified && (
                <Tag size="sm" colorScheme="orange">
                  {t('SuperAdmin.users.emailNotVerified')}
                </Tag>
              )}
            </>
          }
          actions={
            !user.disabled && (
              <ImpersonateButton userId={user.id} userName={userName} />
            )
          }
        />
      </DrawerHeader>

      <DrawerBody py={5}>
        <Stack spacing={4}>
          <AdminDrawerSection title={t('SuperAdmin.panel.overview')}>
            <AdminInfoGrid>
              <AdminInfoRow label={t('SuperAdmin.panel.created')}>
                {new Date(user.createdAt).toLocaleString()}
              </AdminInfoRow>
              <AdminInfoRow label={t('SuperAdmin.users.columns.lastSeen')}>
                {user.lastSeen && new Date(user.lastSeen).toLocaleString()}
              </AdminInfoRow>
              <AdminInfoRow label={t('SuperAdmin.users.locale')}>
                {user.locale}
              </AdminInfoRow>
              <AdminInfoRow label="ID">
                <Text as="span" fontFamily="mono" fontSize="xs">
                  {user.id}
                </Text>
              </AdminInfoRow>
            </AdminInfoGrid>
          </AdminDrawerSection>

          <AdminDrawerSection
            title={t('SuperAdmin.sidebar.orgs')}
            count={user.members.length}
          >
            {user.members.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                {t('SuperAdmin.users.noOrgs')}
              </Text>
            ) : (
              <Stack spacing={0}>
                {user.members.map((member) => (
                  <AdminListItem
                    key={member.id}
                    title={member.org.name}
                    subtitle={[
                      member.name,
                      member.role &&
                        t(`MemberOrgRoleSelect.roles.${member.role}.title`),
                      member.archivedAt && t('SuperAdmin.users.memberArchived'),
                      member.org.archivedAt && t('SuperAdmin.orgs.archivedTag'),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                    dimmed={!!(member.archivedAt || member.org.archivedAt)}
                    aside={
                      <AdminSubscriptionTag
                        subscription={member.org.org_subscription}
                      />
                    }
                    onSelect={() => openOrg(member.org.id)}
                  />
                ))}
              </Stack>
            )}
          </AdminDrawerSection>

          <AdminDrawerSection title={t('SuperAdmin.panel.dangerZone')} danger>
            <Stack spacing={4}>
              <AdminDangerAction
                title={
                  user.disabled
                    ? t('SuperAdmin.users.enableAction.title')
                    : t('SuperAdmin.users.disableAction.title')
                }
                description={
                  user.disabled
                    ? t('SuperAdmin.users.enableAction.description')
                    : t('SuperAdmin.users.disableAction.description')
                }
              >
                <DisableUserButton
                  userId={user.id}
                  userName={userName}
                  isDisabled={user.disabled}
                />
              </AdminDangerAction>
              <AdminDangerAction
                title={t('SuperAdmin.users.delete.title')}
                description={t('SuperAdmin.users.delete.description')}
              >
                <DeleteUserButton userId={user.id} />
              </AdminDangerAction>
            </Stack>
          </AdminDrawerSection>
        </Stack>
      </DrawerBody>
    </>
  )
}
