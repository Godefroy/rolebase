import { slugSchema } from '@rolebase/shared/schemas'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'
import { OnboardingValues } from './useOnboardingForm'

// Variants tried for a prefilled slug that is taken (acme-2, acme-3...)
const MAX_SUFFIX = 9

// The check never blocks the wizard: createOrg still guards the slug
const isAvailable = (slug: string) =>
  trpc.org.isOrgSlugAvailable.query({ slug }).catch(() => true)

// Flags a taken slug on the org name step. Otherwise it is only known when
// the org is created, at the end of the wizard. Returns whether it is free.
// With `suggest`, a taken slug is replaced by a free variant instead, for a
// prefilled name the person didn't choose (e.g. their archived org's name).
export default function useCheckOrgSlug(
  formMethods: UseFormReturn<OnboardingValues>
) {
  const { t } = useTranslation()

  return async (suggest = false): Promise<boolean> => {
    const slug = formMethods.getValues('slug')
    // Invalid slugs are reported by the form validation
    if (!slugSchema.isValidSync(slug)) return true

    if (await isAvailable(slug)) return true

    // Ignore the answer if the slug changed meanwhile
    if (formMethods.getValues('slug') !== slug) return true

    if (suggest) {
      for (let suffix = 2; suffix <= MAX_SUFFIX; suffix++) {
        const variant = `${slug}-${suffix}`
        if (!slugSchema.isValidSync(variant)) break
        if (!(await isAvailable(variant))) continue
        if (formMethods.getValues('slug') !== slug) return true
        formMethods.setValue('slug', variant)
        track('onboarding_slug_conflict', { step: 'prefill' })
        return true
      }
    }

    formMethods.setError('slug', { message: t('OrgSlugModal.already-exists') })
    track('onboarding_slug_conflict', { step: 'orgName' })
    return false
  }
}
