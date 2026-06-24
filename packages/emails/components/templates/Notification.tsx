import { Section, Text } from '@react-email/components'
import React from 'react'
import Card from '../common/Card'
import CtaButton from '../common/CtaButton'
import Layout from '../common/Layout'

interface Props {
  title: string
  // Body paragraphs, each rendered on its own line. Already localized.
  paragraphs: string[]
  preview?: string
  ctaUrl?: string
  ctaLabel?: string
}

// Generic transactional email: a title, one or more body paragraphs, and an
// optional call-to-action button. All text is passed in already localized so
// the template stays reusable for any notification.
export default function Notification({
  title = 'Notification',
  paragraphs = ['This is a notification.'],
  preview,
  ctaUrl,
  ctaLabel,
}: Props) {
  return (
    <Layout preview={preview || title}>
      <Card title={title}>
        <Section className="px-8">
          {paragraphs.map((paragraph, index) => (
            <Text key={index}>{paragraph}</Text>
          ))}
        </Section>
        {ctaUrl && ctaLabel && (
          <Section className="text-center mt-8">
            <CtaButton href={ctaUrl}>{ctaLabel}</CtaButton>
          </Section>
        )}
      </Card>
    </Layout>
  )
}
