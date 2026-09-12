import { Section, Text } from 'react-email'
import React from 'react'
import i18n from '../../i18n'
import Card from '../common/Card'
import CtaButton from '../common/CtaButton'
import Layout from '../common/Layout'

interface Props {
  type: string // i18n key
  lang: string
}

export default function NhostLinkEmail({
  type = 'email-confirm-change',
  lang = 'en',
}: Props) {
  const t = (key: string) =>
    i18n.t(`emails:NhostEmail.${type}.${key}`, { lng: lang })

  return (
    <Layout preview={t('description')} clientUrl="${clientUrl}">
      <Card title={t('title')}>
        <Section className="px-5">
          <Text>{t('description')}</Text>
        </Section>
        <Section className="text-center mt-8">
          <CtaButton href="${link}">{t('cta')}</CtaButton>
        </Section>
      </Card>
    </Layout>
  )
}
