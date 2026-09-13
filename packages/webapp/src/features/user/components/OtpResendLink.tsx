import { Link, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  sentAt: number
  isDisabled: boolean
  onResend(): void
}

// Delay before a new code can be requested, so a slow email is not replaced
// (and invalidated) by an impatient second request
const RESEND_DELAY_S = 30

export default function OtpResendLink({ sentAt, isDisabled, onResend }: Props) {
  const { t } = useTranslation()
  const [now, setNow] = useState(Date.now())

  const remaining = Math.max(
    0,
    Math.ceil(RESEND_DELAY_S - (now - sentAt) / 1000)
  )

  useEffect(() => {
    if (remaining === 0) return
    const timer = setTimeout(() => setNow(Date.now()), 1000)
    return () => clearTimeout(timer)
  }, [now, remaining])

  if (remaining > 0) {
    return (
      <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
        {t('OtpForm.resendIn', { count: remaining })}
      </Text>
    )
  }

  return (
    <Link
      as="button"
      type="button"
      fontSize="sm"
      textDecoration="underline"
      onClick={onResend}
      aria-disabled={isDisabled}
      pointerEvents={isDisabled ? 'none' : undefined}
      opacity={isDisabled ? 0.5 : 1}
    >
      {t('OtpForm.resend')}
    </Link>
  )
}
