import { useOrgContext } from '@/org/contexts/OrgContext'
import { Avatar, Box, Flex, Text, VStack } from '@chakra-ui/react'
import {
  AVATAR_SM_WIDTH,
  getResizedImageUrl,
} from '@rolebase/shared/helpers/getResizedImageUrl'
import { MemberFragment, RoleSummaryFragment } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { OrgChartTourMoreStep } from '../hooks/useOrgChartTour'

interface Props {
  step: OrgChartTourMoreStep
}

// Diagram of a team inside the org, drawn with the org's own names: its first
// role, its members, and the leader and representative roles of its model.
// The people holding them show up in the parent too: that is what
// representing a team means, and who takes part in the parent.
export default function OrgChartTourIllustration({ step }: Props) {
  const { t } = useTranslation()
  const { org, orgData } = useOrgContext()
  if (!orgData) return null

  const rootCircle = orgData.circles.find((c) => !c.parentId)
  const [leaderRole, representativeRole] = orgData.roles
    .filter((r) => r.base && r.parentLink)
    .sort((a, b) => (a.colorHue ?? 0) - (b.colorHue ?? 0))
  const [leader, representative, ...others] = orgData.members
  if (!rootCircle || !leaderRole || !representativeRole || !leader) return null

  const teamCircle = orgData.circles.find((c) => c.parentId === rootCircle.id)
  const teamName =
    (teamCircle && orgData.getRole(teamCircle.roleId)?.name) ||
    t('OrgChartTour.illustration.team')
  const withRepresentative = step !== 'leader' && !!representative
  const teamMembers = (
    withRepresentative ? others : [representative, ...others]
  ).filter((member): member is MemberFragment => !!member)
  const parentParticipants =
    step === 'participants' && withRepresentative
      ? [leader, representative]
      : [leader]

  // A plain avatar: the diagram is an image, nothing in it is clickable
  const renderAvatar = (member: MemberFragment) => (
    <Avatar
      key={member.id}
      name={member.name}
      src={getResizedImageUrl(member.picture, AVATAR_SM_WIDTH) || undefined}
      size="2xs"
      flexShrink={0}
    />
  )

  // A base role held by a member, tinted with the role's color
  const renderHolder = (role: RoleSummaryFragment, member: MemberFragment) => (
    <Flex
      align="center"
      gap={1.5}
      px={2}
      py={1}
      borderRadius="md"
      bg={`hsl(${role.colorHue ?? 0}, 80%, 92%)`}
      color="gray.800"
      _dark={{
        bg: `hsl(${role.colorHue ?? 0}, 40%, 25%)`,
        color: 'gray.100',
      }}
    >
      {renderAvatar(member)}
      <Text fontSize="xs" lineHeight="short" noOfLines={1}>
        <Text as="span" fontWeight="semibold">
          {role.name}
        </Text>{' '}
        · {member.name}
      </Text>
    </Flex>
  )

  return (
    <VStack
      aria-hidden
      spacing={0}
      mb={4}
      p={3}
      borderRadius="lg"
      bg="gray.50"
      _dark={{ bg: 'whiteAlpha.50' }}
    >
      {/* The parent: the team's representatives take part in it */}
      <Box
        w="100%"
        px={3}
        py={2}
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        _dark={{ bg: 'gray.800' }}
      >
        <Flex align="center" gap={1}>
          <Text fontSize="xs" fontWeight="semibold" flex={1} noOfLines={1}>
            {org?.name}
          </Text>
          {parentParticipants.map((member) => renderAvatar(member))}
        </Flex>
        {step === 'participants' && (
          <Text fontSize="2xs" color="gray.500" mt={1}>
            {t('OrgChartTour.illustration.participants')}
          </Text>
        )}
      </Box>

      <Box w="1px" h={3} bg="gray.300" _dark={{ bg: 'whiteAlpha.400' }} />

      {/* The team, with its leader, its representative and its members */}
      <VStack
        w="100%"
        align="stretch"
        spacing={1.5}
        px={3}
        py={2}
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        _dark={{ bg: 'gray.800' }}
      >
        <Text fontSize="xs" fontWeight="semibold" noOfLines={1}>
          {teamName}
        </Text>
        {renderHolder(leaderRole, leader)}
        {withRepresentative && renderHolder(representativeRole, representative)}
        {teamMembers.length > 0 && (
          <Flex align="center" gap={1} px={2}>
            {teamMembers.map((member) => renderAvatar(member))}
            <Text fontSize="2xs" lineHeight="short" color="gray.500" ml={1}>
              {t('OrgChartTour.illustration.members')}
            </Text>
          </Flex>
        )}
      </VStack>
    </VStack>
  )
}
