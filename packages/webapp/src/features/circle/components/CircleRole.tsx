import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useOrgData } from '@/org/contexts/OrgDataContext'
import RoleGeneratorModal from '@/role/modals/RoleGeneratorModal'
import { Button, Text, VStack, useDisclosure } from '@chakra-ui/react'
import { RoleFragment, useRoleSubscription } from '@gql'
import React, { useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { MagicIcon } from 'src/icons'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleButton from './CircleButton'
import CircleByIdButton from './CircleByIdButton'
import CircleRoleMembers from './CircleRoleMembers'
import CircleRoleSubCircles from './CircleRoleSubCircles'
import CircleRoleLinkParents from './CircleRoleLinkParents'
import { RoleEditableField } from './RoleEditableField'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import { useStoreState } from '@store/hooks'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'

interface Props {
  skipFetchRole?: boolean
}

const editableFields = [
  { field: 'domain' },
  { field: 'accountabilities' },
  { field: 'checklist', initValue: '[] ' },
  { field: 'indicators', initValue: '- ' },
  { field: 'notes' },
] satisfies Array<{
  field: keyof RoleFragment
  initValue?: string
}>

export const fieldsGap = 10

export default function CircleRole({ skipFetchRole }: Props) {
  const { t } = useTranslation()
  const isAdmin = useOrgAdmin()
  const members = useStoreState((state) => state.org.members)

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const { circle, parentCircle, canEditRole } = circleContext

  // In proposal draft mode, overlay the draft's pending role edits on top of
  // the DB role (still fetched via subscription, as on the org page).
  const { roleOverlays } = useOrgData()
  const overlay = roleOverlays?.[circle.roleId]

  const { data, loading, error } = useRoleSubscription({
    skip: skipFetchRole,
    variables: { id: circle.roleId },
  })
  const role: RoleFragment = useMemo(
    () => ({
      orgId: circle.orgId,
      archived: false,
      purpose: '',
      accountabilities: '',
      domain: '',
      indicators: '',
      checklist: '',
      notes: '',
      ...circle.role,
      ...data?.role_by_pk,
      ...overlay,
    }),
    [overlay, data, circle]
  )

  const sortedFields = useMemo(() => {
    if (!role) return editableFields
    return [...editableFields].sort((a, b) => {
      if (role[a.field] && !role[b.field]) return -1
      if (!role[a.field] && role[b.field]) return 1
      return 0
    })
  }, [role])

  const generatorModal = useDisclosure()

  if (loading) {
    return <Loading active size="md" />
  }
  if (error || !role) {
    return <TextError error={error || new Error('Role not found')} />
  }

  return (
    <>
      <RoleEditableField
        label={t('CircleRole.purpose')}
        placeholder={t('CircleRole.purposePlaceholder')}
        role={role}
        field="purpose"
        mt={0}
        mb={fieldsGap}
      />

      <VStack
        spacing={fieldsGap}
        align="stretch"
        mb={canEditRole ? fieldsGap : 0}
      >
        <CircleRoleSubCircles />
        <CircleRoleMembers />

        {circle.role.parentLink && parentCircle && parentCircle.parentId && (
          <Text>
            <Trans
              i18nKey="CircleRole.representCircle"
              components={{
                link: <CircleButton circle={parentCircle} />,
              }}
            />
            <br />
            <Trans
              i18nKey="CircleRole.representInCircle"
              components={{
                link: <CircleByIdButton id={parentCircle.parentId} />,
              }}
            />
          </Text>
        )}

        <CircleRoleLinkParents />
      </VStack>

      {isAdmin &&
        members?.length === 1 &&
        (circle.parentId ? (
          <OnboardingVideo
            type={OnboardingVideoType.AddMembers}
            my={fieldsGap}
          />
        ) : (
          <OnboardingVideo
            type={OnboardingVideoType.CreateOrgChart}
            my={fieldsGap}
          />
        ))}

      {sortedFields.map(({ field, initValue }) => (
        <RoleEditableField
          key={field}
          label={t(`CircleRole.${field}`)}
          placeholder={t(`CircleRole.${field}Placeholder`)}
          role={role}
          field={field}
          initValue={initValue}
        />
      ))}

      {role.purpose === '' &&
        circle.parentId &&
        canEditRole &&
        editableFields.every(({ field }) => role[field] === '') && (
          <Button
            leftIcon={<MagicIcon />}
            variant="outline"
            colorScheme="blue"
            onClick={generatorModal.onOpen}
          >
            {t('CircleRole.generate')}
          </Button>
        )}

      {generatorModal.isOpen && (
        <RoleGeneratorModal
          isOpen
          role={role}
          onClose={generatorModal.onClose}
        />
      )}
    </>
  )
}
