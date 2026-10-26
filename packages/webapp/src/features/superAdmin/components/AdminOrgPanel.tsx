import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import {
  Button,
  DrawerBody,
  DrawerHeader,
  Link,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'
import { useAdminOrgQuery } from '@gql'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { getOrgPurgeDate } from '@rolebase/shared/model/deletion'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiExternalLink } from 'react-icons/fi'
import { Link as ReactRouterLink } from 'react-router'
import useAdminSelection from '../hooks/useAdminSelection'
import AdminDangerAction from './AdminDangerAction'
import AdminDrawerHeader from './AdminDrawerHeader'
import AdminDrawerSection from './AdminDrawerSection'
import AdminInfoGrid from './AdminInfoGrid'
import AdminInfoRow from './AdminInfoRow'
import AdminListItem from './AdminListItem'
import AdminSubscriptionTag from './AdminSubscriptionTag'
import ArchiveOrgButton from './ArchiveOrgButton'
import DeleteOrgButton from './DeleteOrgButton'

interface Props {
  orgId: string
}

const stripeDashboardUrl = 'https://dashboard.stripe.com'

export default function AdminOrgPanel({ orgId }: Props) {
  const { t } = useTranslation()
  const { openUser } = useAdminSelection()
  const { data, loading, error } = useAdminOrgQuery({
    variables: { id: orgId },
  })
  const org = data?.org_by_pk
  const subscription = org?.org_subscription

  if (!org) {
    return (
      <DrawerBody py={10}>
        {loading && <Loading active center />}
        {error && <TextError error={error} />}
        {!loading && !error && <Text>{t('SuperAdmin.notFound')}</Text>}
      </DrawerBody>
    )
  }

  return (
    <>
      <DrawerHeader borderBottomWidth="1px" pb={5}>
        <AdminDrawerHeader
          title={org.name}
          subtitle={org.slug && `/${org.slug}`}
          tags={
            <>
              <AdminSubscriptionTag subscription={subscription} />
              {org.archivedAt && (
                <Tag size="sm" colorScheme="orange">
                  {t('SuperAdmin.orgs.archivedTag')}
                </Tag>
              )}
            </>
          }
          actions={
            <Button
              as={ReactRouterLink}
              to={`${getOrgPath(org)}/?admin`}
              target="_blank"
              size="sm"
              leftIcon={<FiExternalLink />}
            >
              {t('SuperAdmin.orgs.open')}
            </Button>
          }
        />
      </DrawerHeader>

      <DrawerBody py={5}>
        <Stack spacing={4}>
          <AdminDrawerSection title={t('SuperAdmin.panel.overview')}>
            <AdminInfoGrid>
              <AdminInfoRow label={t('SuperAdmin.panel.created')}>
                {new Date(org.createdAt).toLocaleString()}
              </AdminInfoRow>
              {org.archivedAt && (
                <>
                  <AdminInfoRow label={t('SuperAdmin.panel.archived')}>
                    {new Date(org.archivedAt).toLocaleString()}
                  </AdminInfoRow>
                  <AdminInfoRow label={t('SuperAdmin.orgs.purge')}>
                    {getOrgPurgeDate(org.archivedAt).toLocaleDateString()}
                  </AdminInfoRow>
                </>
              )}
              <AdminInfoRow label={t('SuperAdmin.orgs.columns.members')}>
                {org.members.length}
              </AdminInfoRow>
              <AdminInfoRow label={t('SuperAdmin.orgs.roles')}>
                {org.circles_aggregate.aggregate?.count ?? 0}
              </AdminInfoRow>
              <AdminInfoRow label="ID">
                <Text as="span" fontFamily="mono" fontSize="xs">
                  {org.id}
                </Text>
              </AdminInfoRow>
            </AdminInfoGrid>
          </AdminDrawerSection>

          <AdminDrawerSection title={t('SuperAdmin.orgs.columns.subscription')}>
            {subscription ? (
              <AdminInfoGrid>
                <AdminInfoRow label={t('SuperAdmin.orgs.plan')}>
                  {subscription.type}
                </AdminInfoRow>
                <AdminInfoRow label={t('SuperAdmin.orgs.status')}>
                  <AdminSubscriptionTag subscription={subscription} />
                </AdminInfoRow>
                <AdminInfoRow label={t('SuperAdmin.orgs.since')}>
                  {new Date(subscription.createdAt).toLocaleDateString()}
                </AdminInfoRow>
                <AdminInfoRow label="Stripe">
                  <Link
                    href={`${stripeDashboardUrl}/customers/${subscription.stripeCustomerId}`}
                    isExternal
                    color="blue.500"
                  >
                    {t('SuperAdmin.orgs.stripeCustomer')}
                  </Link>
                  {subscription.stripeSubscriptionId && (
                    <>
                      {' · '}
                      <Link
                        href={`${stripeDashboardUrl}/subscriptions/${subscription.stripeSubscriptionId}`}
                        isExternal
                        color="blue.500"
                      >
                        {t('SuperAdmin.orgs.stripeSubscription')}
                      </Link>
                    </>
                  )}
                </AdminInfoRow>
              </AdminInfoGrid>
            ) : (
              <Text fontSize="sm" color="gray.500">
                {t('SuperAdmin.orgs.freePlan')}
              </Text>
            )}
          </AdminDrawerSection>

          <AdminDrawerSection
            title={t('SuperAdmin.orgs.columns.members')}
            count={org.members.length}
          >
            {org.members.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                {t('SuperAdmin.orgs.noMembers')}
              </Text>
            ) : (
              <Stack spacing={0}>
                {org.members.map((member) => (
                  <AdminListItem
                    key={member.id}
                    title={member.name}
                    subtitle={
                      member.user?.email ||
                      (member.inviteEmail &&
                        t('SuperAdmin.orgs.invited', {
                          email: member.inviteEmail,
                        }))
                    }
                    dimmed={!member.user}
                    aside={
                      member.role && (
                        <Tag size="sm" variant="subtle">
                          {t(`MemberOrgRoleSelect.roles.${member.role}.title`)}
                        </Tag>
                      )
                    }
                    onSelect={
                      member.user ? () => openUser(member.user!.id) : undefined
                    }
                  />
                ))}
              </Stack>
            )}
          </AdminDrawerSection>

          <AdminDrawerSection title={t('SuperAdmin.panel.dangerZone')} danger>
            <Stack spacing={4}>
              <AdminDangerAction
                title={
                  org.archivedAt
                    ? t('SuperAdmin.orgs.restore.title')
                    : t('SuperAdmin.orgs.archive.title')
                }
                description={
                  org.archivedAt
                    ? t('SuperAdmin.orgs.restore.description')
                    : t('SuperAdmin.orgs.archive.description')
                }
              >
                <ArchiveOrgButton
                  orgId={org.id}
                  orgName={org.name}
                  isArchived={!!org.archivedAt}
                />
              </AdminDangerAction>
              <AdminDangerAction
                title={t('SuperAdmin.orgs.delete.title')}
                description={t('SuperAdmin.orgs.delete.description')}
              >
                <DeleteOrgButton orgId={org.id} />
              </AdminDangerAction>
            </Stack>
          </AdminDrawerSection>
        </Stack>
      </DrawerBody>
    </>
  )
}
