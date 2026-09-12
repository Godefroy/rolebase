import { Column, Img, Row, Section, Text } from 'react-email'
import settings from '@rolebase/backend/src/settings'
import { formatInTimeZone } from 'date-fns-tz'
import React from 'react'
import i18n from '../../i18n'
import { getDateLocale } from '../../i18n/getDateLocale'
import Card from '../common/Card'
import CtaButton from '../common/CtaButton'
import Layout from '../common/Layout'

export interface MeetingEmailProps {
  lang: string
  timezone: string
  title: string
  role: string
  ctaUrl: string
  startDate: string
  endDate: string
}

export default function Meeting({
  lang = 'en',
  timezone = 'Europe/London',
  title = 'Tactical',
  role = 'Marketing',
  ctaUrl = settings.url,
  startDate = '2023-12-30T15:30:00+00:00',
  endDate = '2023-12-30T16:30:00+00:00',
}: MeetingEmailProps) {
  const t = (key: string) =>
    i18n.t(`emails:Meeting.${key}`, {
      lng: lang,
      replace: { title, role },
    })

  const dateLocale = getDateLocale(lang)
  const getDate = (date: string) =>
    formatInTimeZone(new Date(date), timezone, 'PPPP', { locale: dateLocale })
  const getHour = (date: string) =>
    formatInTimeZone(new Date(date), timezone, 'HH:mm', { locale: dateLocale })

  return (
    <Layout preview={t('preview')}>
      <Card title={t('title')}>
        <Section>
          <Row>
            <Column align="right" className="pl-8 pr-5">
              <Img
                src={settings.url + '/emails/icons/MeetingIcon.png'}
                width="40"
                height="40"
              />
            </Column>
            <Column>
              <Text className="my-0">{getDate(startDate)}</Text>
              <Text className="my-0">
                {getHour(startDate)} - {getHour(endDate)}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="text-center mt-8">
          <Text className="font-bold mt-0">{t('activity')}</Text>
          <CtaButton href={ctaUrl}>{t('cta')}</CtaButton>
        </Section>
      </Card>
    </Layout>
  )
}
