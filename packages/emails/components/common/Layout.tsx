import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
} from 'react-email'
import settings from '@rolebase/backend/src/settings'
import React, { ReactNode } from 'react'

interface Props {
  preview?: string
  clientUrl?: string
  // The logo links to the app. Off for the sign-in code email, where a link
  // reads as a sign-in link and leads back to the email step instead.
  logoLink?: boolean
  children: ReactNode
}

export default function Layout({
  preview,
  clientUrl = settings.url,
  logoLink = true,
  children,
}: Props) {
  const logo = (
    <Img
      src={`${clientUrl}/logo.png`}
      width="150"
      alt="Rolebase"
      className="my-0 mx-auto"
    />
  )

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Basiercircle"
          fallbackFontFamily={['Arial', 'sans-serif']}
          webFont={{
            url: `${clientUrl}/emails/basiercircle-regular-webfont.woff2`,
            format: 'woff2',
          }}
          fontWeight={400}
        />
        <Font
          fontFamily="Basiercircle"
          fallbackFontFamily={['Arial', 'sans-serif']}
          webFont={{
            url: `${clientUrl}/emails/basiercircle-medium-webfont.woff2`,
            format: 'woff2',
          }}
          fontWeight={500}
        />
        <Font
          fontFamily="Basiercircle"
          fallbackFontFamily={['Arial', 'sans-serif']}
          webFont={{
            url: `${clientUrl}/emails/basiercircle-semibold-webfont.woff2`,
            format: 'woff2',
          }}
          fontWeight={600}
        />
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              fontFamily: {
                basier: ['Basiercircle', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="bg-[#f9f6f3] text-[#29241f] font-basier">
          <Container
            className="bg-[#f9f6f3] py-8 w-full max-w-none"
            style={{ backgroundColor: '#f9f6f3' }}
          >
            <Section>
              {logoLink ? <a href={clientUrl}>{logo}</a> : logo}
            </Section>

            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
