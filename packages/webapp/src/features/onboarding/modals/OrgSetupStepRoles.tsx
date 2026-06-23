import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useOrgContext } from '@/org/contexts/OrgContext'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'
import { MAIN_ROLE_EXAMPLES } from '../orgRoleExamples'
import { OrgType } from '../orgTypes'
import RoleAssignmentItem from './RoleAssignmentItem'
import { RoleDraft } from './orgSetupTypes'

interface Props {
  orgType: OrgType
  roles: RoleDraft[]
  onAdd(name: string): void
  onChange(id: string, patch: Partial<RoleDraft>): void
  onRemove(id: string): void
}

export default function OrgSetupStepRoles({
  orgType,
  roles,
  onAdd,
  onChange,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const { org } = useOrgContext()
  const [custom, setCustom] = useState('')

  const hasName = (name: string) =>
    roles.some((r) => r.name.toLowerCase() === name.toLowerCase())

  const addCustom = () => {
    const name = custom.trim()
    if (!name || hasName(name)) return
    onAdd(name)
    setCustom('')
  }

  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading as="h1" size="md">
          {t('OrgSetupModal.roles.heading')}
        </Heading>
        <Text mt={1} fontSize="sm" color="gray.500">
          {t('OrgSetupModal.roles.help', { orgName: org?.name ?? '' })}
        </Text>
      </Box>

      {roles.length > 0 && (
        <VStack spacing={3} align="stretch" my={5}>
          {roles.map((role) => (
            <RoleAssignmentItem
              key={role.id}
              role={role}
              orgType={orgType}
              onChange={(patch) => onChange(role.id, patch)}
              onRemove={() => onRemove(role.id)}
            />
          ))}
        </VStack>
      )}

      <Wrap>
        {MAIN_ROLE_EXAMPLES.map((example) => {
          const name = t(`Onboarding.roleExamples.${example}`)
          return (
            <WrapItem key={example}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<CreateIcon size="1em" />}
                isDisabled={hasName(name)}
                onClick={() => onAdd(name)}
              >
                {name}
              </Button>
            </WrapItem>
          )
        })}
      </Wrap>

      <Flex gap={2}>
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
          placeholder={t('OrgSetupModal.roles.customPlaceholder')}
          autoComplete="off"
        />
        <Button onClick={addCustom} isDisabled={!custom.trim()}>
          {t('common.add')}
        </Button>
      </Flex>
    </VStack>
  )
}
