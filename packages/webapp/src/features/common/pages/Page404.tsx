import { Button, Container, Heading, VStack } from '@chakra-ui/react'
import { useStoreState } from '@store/hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router'
import { ChevronLeftIcon } from 'src/icons'
import { Title } from '../atoms/Title'

interface Props {
  to?: string
}

export default function Page404({ to }: Props) {
  const { t } = useTranslation()
  const orgs = useStoreState((state) => state.orgs.entries)

  // A user with no org reaching a dead/forbidden link (e.g. signed up from a
  // link they can't access) should go through onboarding instead of a 404.
  if (orgs && orgs.length === 0) {
    return <Navigate to="/" replace />
  }

  return (
    <Container maxW="sm" mt="100px">
      <Title>{t('Page404.heading')}</Title>

      <VStack spacing={10}>
        <iframe
          width="157"
          height="277"
          style={{
            // Fix transparency
            colorScheme: 'light',
          }}
          src="https://rive.app/s/_KTEFCoAdECSya8cB_ofqQ/embed"
        />

        <Heading as="h1" size="lg">
          {t('Page404.heading')}
        </Heading>

        <a href={to || '/'}>
          <Button leftIcon={<ChevronLeftIcon size="1em" />}>
            {t('Page404.home')}
          </Button>
        </a>
      </VStack>
    </Container>
  )
}
