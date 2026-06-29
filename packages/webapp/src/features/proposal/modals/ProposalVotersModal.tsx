import Tab from '@/common/atoms/Tab'
import MemberButton from '@/member/components/MemberButton'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Badge,
  Box,
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import { useMembersByIdsQuery } from '@gql'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { ProposalVoteResult } from '@rolebase/shared/model/proposal'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends UseModalProps {
  votes: ProposalVoteResult[]
  initialTab?: number
}

const voteColor = (vote: string) =>
  vote === 'approve' ? 'green' : vote === 'abstain' ? 'gray' : 'red'

const tabs: {
  key: 'all' | 'approve' | 'object' | 'abstain'
  filter?: string
}[] = [
  { key: 'all' },
  { key: 'approve', filter: 'approve' },
  { key: 'object', filter: 'object' },
  { key: 'abstain', filter: 'abstain' },
]

export default function ProposalVotersModal({
  votes,
  initialTab,
  ...modalProps
}: Props) {
  const { t } = useTranslation()

  // Load voter members by id, including archived ones (the org provider excludes
  // archived members). Fall back to the org provider by userId for old snapshots
  // that don't carry a memberId.
  const memberIds = useMemo(
    () => [...new Set(votes.map((v) => v.memberId).filter(truthy))],
    [votes]
  )
  const { data } = useMembersByIdsQuery({
    variables: { ids: memberIds },
    skip: memberIds.length === 0,
  })
  const membersById = useMemo(
    () => new Map((data?.member ?? []).map((m) => [m.id, m])),
    [data]
  )
  const activeMembers = useOrgContext().orgData?.members

  const getVoterMember = (vote: ProposalVoteResult) =>
    (vote.memberId ? membersById.get(vote.memberId) : undefined) ??
    activeMembers?.find((m) => m.userId === vote.userId)

  const voteLabel = (vote: string) =>
    vote === 'approve'
      ? t('ProposalVotersModal.tab_approve')
      : vote === 'abstain'
      ? t('ProposalVotersModal.tab_abstain')
      : t('ProposalVotersModal.tab_object')

  return (
    <Modal isCentered size="md" {...modalProps}>
      <ModalOverlay />
      <ModalContent overflow="hidden">
        <ModalCloseButton zIndex={2} />
        <Tabs isLazy defaultIndex={initialTab ?? 0}>
          <Box bg="menulight" _dark={{ bg: 'menudark' }}>
            <Flex px={6} pt={4} pb={2}>
              <Heading as="h1" size="md">
                {t('ProposalVotersModal.heading')}
              </Heading>
            </Flex>
            <TabList borderBottomWidth={0} pb={3} px={4}>
              {tabs.map((tab) => {
                const count = tab.filter
                  ? votes.filter((v) => v.vote === tab.filter).length
                  : votes.length
                return (
                  <Tab key={tab.key}>
                    {`${t(`ProposalVotersModal.tab_${tab.key}`)} (${count})`}
                  </Tab>
                )
              })}
            </TabList>
          </Box>

          <TabPanels>
            {tabs.map((tab) => {
              const list = tab.filter
                ? votes.filter((v) => v.vote === tab.filter)
                : votes
              return (
                <TabPanel key={tab.key}>
                  {list.length === 0 ? (
                    <Text color="gray.500" _dark={{ color: 'gray.300' }}>
                      {t('ProposalVotersModal.empty')}
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={1}>
                      {list.map((vote) => {
                        const member = getVoterMember(vote)
                        return (
                          <Flex key={vote.userId} align="center" gap={2}>
                            {member ? (
                              <MemberButton member={member} variant="ghost" />
                            ) : (
                              <Text>?</Text>
                            )}
                            <Badge ml="auto" colorScheme={voteColor(vote.vote)}>
                              {voteLabel(vote.vote)}
                            </Badge>
                          </Flex>
                        )
                      })}
                    </VStack>
                  )}
                </TabPanel>
              )
            })}
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  )
}
