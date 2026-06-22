import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import { Title } from '@/common/atoms/Title'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { useAuth } from '@/user/hooks/useAuth'
import { Heading, Link, Text, VStack } from '@chakra-ui/react'
import { App_Type_Enum, useUserAppsSubscription } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import AppCard from '../components/AppCard'

const apps = [
  {
    type: App_Type_Enum.Office365,
  },
  {
    type: App_Type_Enum.GoogleCalendar,
  },
]

export default function AppsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const apiPath = usePathInOrg('settings/api-keys')

  // Get user apps
  const { data, error, loading } = useUserAppsSubscription({
    skip: !user,
    variables: { userId: user?.id! },
  })
  const userApps = data?.user_app

  return (
    <>
      <Title>{t('Settings.apps')}</Title>
      {loading && <Loading active center />}
      <TextErrors errors={[error]} />

      <VStack spacing={10} align="stretch" maxW="3xl">
        <Heading as="h1" size="lg">
          {t('Settings.apps')}
        </Heading>
        {apps.map(({ type }) => (
          <AppCard
            key={type}
            type={type}
            userApp={userApps?.find((app) => app.type === type)}
          />
        ))}

        <Text>
          {t('AppsPage.apiInfo')}{' '}
          <Link as={RouterLink} to={apiPath} color="blue.500">
            {t('AppsPage.apiLink')}
          </Link>
        </Text>
      </VStack>
    </>
  )
}
