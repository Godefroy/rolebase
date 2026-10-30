import MemberAvatar from '@/member/components/MemberAvatar'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon, DeleteIcon } from 'src/icons'
import { MemberDraft } from './orgSetupTypes'

interface Props {
  drafts: MemberDraft[]
  onChange(drafts: MemberDraft[]): void
}

// The people of the organization, by name only: they become members shown in
// the org chart, where the tour then gives them roles. Nobody is invited here,
// which the step says plainly: inviting comes next, and stays optional.
export default function OrgSetupStepMembers({ drafts, onChange }: Props) {
  const { t } = useTranslation()
  const { org, orgData } = useOrgContext()
  const currentMember = useCurrentMember()
  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({})

  // Members already created (the person, and any created by an earlier try)
  const members = orgData?.members ?? []

  const handleAdd = () => {
    const id = nanoid(8)
    onChange([...drafts, { id, name: '' }])
    setTimeout(() => inputsRef.current[id]?.focus(), 0)
  }

  const handleRemove = (id: string) =>
    onChange(drafts.filter((draft) => draft.id !== id))

  const handleNameChange = (id: string, name: string) =>
    onChange(
      drafts.map((draft) => (draft.id === id ? { ...draft, name } : draft))
    )

  // Enter on the last field adds the next person, to type a team in one go
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (index === drafts.length - 1) handleAdd()
    else inputsRef.current[drafts[index + 1].id]?.focus()
  }

  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading as="h1" size="md">
          {t('OrgSetupModal.members.heading', { orgName: org?.name ?? '' })}
        </Heading>
        <Text mt={1} fontSize="sm" color="gray.500">
          {t('OrgSetupModal.members.help')}
        </Text>
      </Box>

      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <AlertDescription fontSize="sm">
          {t('OrgSetupModal.members.notInvitation')}
        </AlertDescription>
      </Alert>

      <VStack spacing={2} align="stretch">
        {members.map((member) => (
          <Flex key={member.id} gap={3} align="center" minH={10}>
            <MemberAvatar member={member} size="sm" noTooltip />
            <Text noOfLines={1}>
              {member.id === currentMember?.id
                ? t('OrgSetupModal.members.you', { name: member.name })
                : member.name}
            </Text>
          </Flex>
        ))}
        {drafts.map((draft, index) => (
          <Flex key={draft.id} gap={2} align="center">
            <Input
              ref={(element) => {
                inputsRef.current[draft.id] = element
              }}
              flex={1}
              aria-label={t('OrgSetupModal.members.nameLabel')}
              placeholder={t('OrgSetupModal.members.namePlaceholder')}
              autoComplete="off"
              autoFocus={index === 0}
              value={draft.name}
              onChange={(e) => handleNameChange(draft.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
            <IconButton
              aria-label={t('common.delete')}
              icon={<DeleteIcon size="1em" />}
              variant="ghost"
              onClick={() => handleRemove(draft.id)}
            />
          </Flex>
        ))}
      </VStack>

      <Box>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<AddIcon size="1em" />}
          onClick={handleAdd}
        >
          {t('OrgSetupModal.members.add')}
        </Button>
      </Box>
    </VStack>
  )
}
