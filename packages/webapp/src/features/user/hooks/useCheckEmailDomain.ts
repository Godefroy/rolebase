import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'

// Checks an address before creating an account or sending a sign-in code:
// refuses disposable inboxes and domains that cannot receive emails. Returns
// the error message to show, if any. Only the domain leaves the browser. The
// check never blocks: if it fails (backend unreachable), the address passes.
export default function useCheckEmailDomain(eventPrefix: string) {
  const { t } = useTranslation()

  return async (address: string): Promise<string | undefined> => {
    const { valid, disposable } = await trpc.user.checkEmailDomain
      .query({ domain: address.split('@')[1] ?? '' })
      .catch(() => ({ valid: true, disposable: false }))
    if (disposable) {
      track(`${eventPrefix}_domain_disposable`)
      return t('OtpForm.disposableDomain')
    }
    if (!valid) {
      track(`${eventPrefix}_domain_invalid`)
      return t('OtpForm.invalidDomain')
    }
  }
}
