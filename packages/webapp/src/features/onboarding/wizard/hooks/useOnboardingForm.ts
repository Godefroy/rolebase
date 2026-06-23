import { useAuth } from '@/user/hooks/useAuth'
import { useChangeDisplayNameMutation, useChangeMetadataMutation } from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { nameSchema, slugSchema } from '@rolebase/shared/schemas'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { nhost } from 'src/nhost'
import slugify from 'slugify'
import { trpc } from 'src/trpc'
import * as yup from 'yup'
import { OTHER_VALUE } from '../onboardingOptions'

export interface OnboardingValues {
  name: string
  roleChoice: string
  roleOther: string
  objectiveChoices: string[]
  objectiveOther: string
  sourceChoice: string
  sourceOther: string
  orgName: string
  slug: string
}

export type OnboardingStep =
  | 'username'
  | 'role'
  | 'objective'
  | 'source'
  | 'orgName'

const schema = yup.object().shape({
  name: nameSchema.required(),
  orgName: nameSchema.required(),
  slug: slugSchema.required(),
})

// Resolve a single choice + its free-text "other" into the value to store as stats.
function resolveChoice(choice: string, other: string): string | undefined {
  if (!choice) return undefined
  if (choice === OTHER_VALUE) return other.trim() || undefined
  return choice
}

// Resolve a multi-choice selection ("other" replaced by its free text) into a
// comma-separated value to store as stats.
function resolveChoices(choices: string[], other: string): string | undefined {
  const resolved = choices
    .map((choice) => (choice === OTHER_VALUE ? other.trim() : choice))
    .filter(Boolean)
  return resolved.length ? resolved.join(', ') : undefined
}

// Drives the onboarding wizard for non-invited new users: collects the display
// name (if missing), a short profile (role, objective, source) via predefined
// choices, and the first org. On finish it creates the org (with profile stats)
// and redirects into it, triggering the org-setup step (model + seeding).
export default function useOnboardingForm() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Skip steps whose value we already have: the display name (when signup set
  // one) and any profile answer already stored in the user metadata. Snapshot
  // once so the step list stays stable: submitting writes the metadata and
  // refreshes the session, which would otherwise shrink the steps mid-flow.
  const [needs] = useState(() => ({
    name: !!user && user.displayName === user.email,
    role: !user?.metadata?.onboardingRole,
    objective: !user?.metadata?.onboardingObjective,
    source: !user?.metadata?.onboardingSource,
  }))
  const needsName = needs.name
  const needsRole = needs.role
  const needsObjective = needs.objective
  const needsSource = needs.source

  const formMethods = useForm<OnboardingValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: needsName ? '' : user?.displayName ?? '',
      roleChoice: '',
      roleOther: '',
      objectiveChoices: [],
      objectiveOther: '',
      sourceChoice: '',
      sourceOther: '',
      orgName: '',
      slug: '',
    },
  })
  const { watch, setValue } = formMethods

  // Auto-fill slug from org name
  const orgName = watch('orgName')
  useEffect(() => {
    if (orgName) {
      setValue('slug', slugify(orgName, { strict: true }).toLowerCase())
    }
  }, [orgName])

  const steps = useMemo<OnboardingStep[]>(
    () =>
      [
        needsName && 'username',
        needsRole && 'role',
        needsObjective && 'objective',
        needsSource && 'source',
        'orgName',
      ].filter(Boolean) as OnboardingStep[],
    [needsName, needsRole, needsObjective, needsSource]
  )

  // Whether the current step is complete enough to continue
  const values = watch()
  const isStepValid = (step: OnboardingStep): boolean => {
    switch (step) {
      case 'username':
        return !!values.name?.trim()
      case 'role':
        return (
          !!values.roleChoice &&
          (values.roleChoice !== OTHER_VALUE || !!values.roleOther.trim())
        )
      case 'objective':
        return (
          values.objectiveChoices.length > 0 &&
          (!values.objectiveChoices.includes(OTHER_VALUE) ||
            !!values.objectiveOther.trim())
        )
      case 'source':
        // Optional: continue unless "other" is picked without text
        return values.sourceChoice !== OTHER_VALUE || !!values.sourceOther.trim()
      case 'orgName':
        return true // validated via the yup resolver on submit
    }
  }

  const [changeDisplayName] = useChangeDisplayNameMutation()
  const [changeMetadata] = useChangeMetadataMutation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const submit = formMethods.handleSubmit(async (data) => {
    if (!user?.id) return
    setLoading(true)
    setError(undefined)
    try {
      // Set display name when it was missing after signup
      if (needsName) {
        await changeDisplayName({
          variables: { userId: user.id, displayName: data.name },
        })
      }

      // Store the profile answers collected in this run into the user metadata
      // (stats), preserving any value that was already present and skipped.
      if (needsRole || needsObjective || needsSource) {
        await changeMetadata({
          variables: {
            userId: user.id,
            metadata: {
              ...user.metadata,
              ...(needsRole && {
                onboardingRole: resolveChoice(data.roleChoice, data.roleOther),
              }),
              ...(needsObjective && {
                onboardingObjective: resolveChoices(
                  data.objectiveChoices,
                  data.objectiveOther
                ),
              }),
              ...(needsSource && {
                onboardingSource: resolveChoice(
                  data.sourceChoice,
                  data.sourceOther
                ),
              }),
            },
          },
        })
        await nhost.refreshSession(0)
      }

      // Create the org
      const newOrgId = await trpc.org.createOrg.mutate({
        name: data.orgName,
        slug: data.slug,
      })

      // Go straight into the new org (by slug, without waiting for the store).
      // The org-setup step opens there automatically (fresh, unseeded org).
      navigate(`${getOrgPath({ id: newOrgId, slug: data.slug })}/roles`)
    } catch (e: any) {
      setLoading(false)
      const message =
        e.message === 'Conflict'
          ? t('OrgSlugModal.already-exists')
          : e.message || e.toString()
      setError(new Error(message))
    }
  })

  return { formMethods, steps, isStepValid, submit, loading, error }
}
