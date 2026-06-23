import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useOrgContext } from '@/org/contexts/OrgContext'
import RoleGeneratorModal from '@/role/modals/RoleGeneratorModal'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { RoleFragment, useRoleSubscription } from '@gql'
import React, { useContext, useMemo, useState } from 'react'
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
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'

interface Props {
  skipFetchRole?: boolean
}

const editableFields = [
  { field: 'domain' },
  { field: 'accountabilities' },
  // Open empty fields on an empty list/todo so the user can start typing items
  // right away (the cursor lands inside the first item, no extra line).
  { field: 'checklist', initList: 'task' },
  { field: 'indicators', initList: 'bullet' },
  { field: 'notes' },
] satisfies Array<{
  field: keyof RoleFragment
  initList?: 'bullet' | 'task'
}>

export const fieldsGap = 10

export default function CircleRole({ skipFetchRole }: Props) {
  const { t } = useTranslation()
  const isAdmin = useOrgAdmin()

  // Get circle context
  const circleContext = useContext(CircleContext)
  if (!circleContext) return null
  const { circle, parentCircle, canEditCircle, canEditRole, role: baseRole } =
    circleContext

  // In proposal draft mode, overlay the draft's pending role edits on top of
  // the DB role (still fetched via subscription, as on the org page).
  const { roleOverlays, isDraft, orgData, actions } = useOrgContext()
  const members = orgData?.members
  const overlay = roleOverlays?.[circle.roleId]

  // Restore an archived circle (and its subtree). Same rights as deletion
  // (canEditCircle on a non-root circle), and database only: an in-memory draft
  // can't unarchive in the live org.
  const canRestore = canEditCircle && !!circle.parentId && !isDraft
  const [restoring, setRestoring] = useState(false)
  const handleRestore = async () => {
    setRestoring(true)
    try {
      await actions.restoreCircle(circle.id)
    } finally {
      setRestoring(false)
    }
  }

  const { data, loading, error } = useRoleSubscription({
    skip: skipFetchRole,
    variables: { id: circle.roleId },
  })
  const role: RoleFragment = useMemo(
    () => ({
      orgId: circle.orgId,
      archivedAt: null,
      purpose: '',
      accountabilities: '',
      domain: '',
      indicators: '',
      checklist: '',
      notes: '',
      ...baseRole,
      ...data?.role_by_pk,
      ...overlay,
    }),
    [overlay, data, circle, baseRole]
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
      {(circle.archivedAt || role.archivedAt) && (
        <Alert status="warning" borderRadius="md" mb={fieldsGap}>
          <AlertIcon />
          <Box flex="1">{t('CircleRole.archived')}</Box>
          {canRestore && (
            <Button
              size="sm"
              colorScheme="orange"
              isLoading={restoring}
              onClick={handleRestore}
            >
              {t('CircleRole.restore')}
            </Button>
          )}
        </Alert>
      )}

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

        {role.parentLink && parentCircle && parentCircle.parentId && (
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

      {sortedFields.map(({ field, initList }) => (
        <RoleEditableField
          key={field}
          label={t(`CircleRole.${field}`)}
          placeholder={t(`CircleRole.${field}Placeholder`)}
          role={role}
          field={field}
          initList={initList}
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
