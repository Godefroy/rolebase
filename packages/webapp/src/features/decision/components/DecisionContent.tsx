import CircleByIdButton from '@/circle/components/CircleByIdButton'
import ActionsMenu from '@/common/atoms/actionsMenu/ActionsMenu'
import DeleteMenuItem from '@/common/atoms/actionsMenu/DeleteMenuItem'
import EditMenuItem from '@/common/atoms/actionsMenu/EditMenuItem'
import Loading from '@/common/atoms/Loading'
import Markdown from '@/common/atoms/Markdown'
import { Title } from '@/common/atoms/Title'
import useDateLocale from '@/common/hooks/useDateLocale'
import Page404 from '@/common/pages/Page404'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import LogText from '@/log/components/LogText'
import {
  Box,
  BoxProps,
  Center,
  Flex,
  Heading,
  Spacer,
  Tag,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import ThreadItem from '@/thread/components/ThreadItem'
import {
  useDecisionLogsSubscription,
  useDecisionSubscription,
  useDecisionThreadsQuery,
} from '@gql'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PrivacyIcon } from 'src/icons'
import useCanEditDecisions from '../hooks/useCanEditDecisions'
import DecisionDeleteModal from '../modals/DecisionDeleteModal '
import DecisionEditModal from '../modals/DecisionEditModal'

interface Props extends BoxProps {
  id: string
  changeTitle?: boolean
  headerIcons?: React.ReactNode
  onClose(): void
}

export default function DecisionContent({
  id,
  changeTitle,
  headerIcons,
  onClose,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()
  const isMember = useOrgMember()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const { orgData } = useOrgContext()

  // Subscribe decision
  const { data, loading, error } = useDecisionSubscription({
    variables: { id },
  })
  const decision = data?.decision_by_pk || undefined

  const circle = orgData?.getCircle(decision?.circleId)
  const canEdit = useCanEditDecisions(decision?.circleId)

  // Org chart changes applied by this decision (when it came from a proposal)
  const { data: logsData } = useDecisionLogsSubscription({
    skip: !id,
    variables: { decisionId: id },
  })
  const logs = logsData?.log

  // Threads that reference this decision (in a thread activity)
  const { data: threadsData } = useDecisionThreadsQuery({
    skip: !id,
    variables: { decisionId: id },
  })
  const threadActivities = threadsData?.thread_activity

  if (error || (!decision && !loading)) {
    console.error(error || new Error('Decision not found'))
    return <Page404 />
  }

  return (
    <Box mb={3} {...boxProps}>
      {changeTitle && <Title>{decision?.title || '…'}</Title>}

      <Flex align="center" mb={5}>
        <Heading as="h1" size="md">
          {t('DecisionContent.heading')}
        </Heading>

        {decision && <CircleByIdButton id={decision.circleId} ml={3} />}

        {decision?.archivedAt && <Tag ml={2}>{t('common.archived')}</Tag>}

        <Spacer />

        {decision?.private && (
          <Tooltip
            label={t('DecisionContent.private', {
              role: orgData?.getRole(circle?.roleId)?.name,
            })}
            hasArrow
          >
            <Center mr={2}>
              <PrivacyIcon size={20} />
            </Center>
          </Tooltip>
        )}

        {isMember && (
          <Flex mr={headerIcons ? -3 : 0}>
            <ActionsMenu ml={3}>
              {canEdit && <EditMenuItem onClick={editModal.onOpen} />}
              {canEdit && <DeleteMenuItem onClick={deleteModal.onOpen} />}
            </ActionsMenu>
            {headerIcons}
          </Flex>
        )}
      </Flex>

      {id && loading && <Loading active size="md" />}

      <Text fontSize="lg" fontWeight="bold" mt={2} mb={1}>
        {decision?.title}
      </Text>

      {decision && (
        <Text fontSize="sm" fontWeight="normal" color="gray.400" mb={5}>
          {capitalizeFirstLetter(
            format(new Date(decision.createdAt), 'PPPP', {
              locale: dateLocale,
            })
          )}
        </Text>
      )}

      <Markdown>{decision?.description || ''}</Markdown>

      {logs && logs.length > 0 && (
        <Box mt={6}>
          <Heading as="h2" size="sm" mb={2}>
            {t('DecisionContent.changes')}
          </Heading>
          <VStack align="stretch" spacing={1}>
            {logs.map((log) => (
              <Box key={log.id} fontSize="sm">
                <LogText log={log} />
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {threadActivities && threadActivities.length > 0 && (
        <VStack align="stretch" spacing={1} mt={6}>
          {threadActivities.map(
            (activity) =>
              activity.thread && (
                <ThreadItem
                  key={activity.id}
                  thread={activity.thread}
                  showIcon
                  showCircle
                  openButton
                />
              )
          )}
        </VStack>
      )}

      {editModal.isOpen && (
        <DecisionEditModal
          decision={decision}
          isOpen
          onClose={editModal.onClose}
        />
      )}

      {deleteModal.isOpen && decision && (
        <DecisionDeleteModal
          decision={decision}
          isOpen
          onClose={deleteModal.onClose}
          onDelete={onClose}
        />
      )}
    </Box>
  )
}
