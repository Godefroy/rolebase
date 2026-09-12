import { Section, Text } from 'react-email'
import React from 'react'
import i18n from '../../i18n'
import Card from '../common/Card'
import Layout from '../common/Layout'

interface Props {
  type: string // i18n key
  lang: string
}

export default function NhostOtpEmail({
  type = 'signin-otp',
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
        <Section className="text-center mt-5">
          <Text className="bg-[#f5f5f5] text-[#29241f] py-3 rounded-lg text-xl tracking-widest font-semibold text-center">
            {'${ticket}'}
          </Text>
        </Section>
      </Card>
    </Layout>
  )
}
