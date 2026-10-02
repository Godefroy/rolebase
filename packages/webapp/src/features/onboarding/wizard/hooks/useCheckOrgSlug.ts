import { slugSchema } from '@rolebase/shared/schemas'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'
import { OnboardingValues } from './useOnboardingForm'

// Flags a taken slug on the org name step. Otherwise it is only known when
// the org is created, at the end of the wizard. Returns whether it is free.
export default function useCheckOrgSlug(
  formMethods: UseFormReturn<OnboardingValues>
) {
  const { t } = useTranslation()

  return async (): Promise<boolean> => {
    const slug = formMethods.getValues('slug')
    // Invalid slugs are reported by the form validation
    if (!slugSchema.isValidSync(slug)) return true

    // The check never blocks the wizard: createOrg still guards the slug
    const available = await trpc.org.isOrgSlugAvailable
      .query({ slug })
      .catch(() => true)

    // Ignore the answer if the slug changed meanwhile
    if (available || formMethods.getValues('slug') !== slug) return true
    formMethods.setError('slug', { message: t('OrgSlugModal.already-exists') })
    track('onboarding_slug_conflict', { step: 'orgName' })
    return false
  }
}
