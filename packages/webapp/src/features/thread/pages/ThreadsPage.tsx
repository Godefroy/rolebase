import CircleAndMemberFilters from '@/circle/components/CircleAndMemberFilters'
import useFilterEntitiesByCircle from '@/circle/hooks/useFilterEntitiesByCircle'
import Loading from '@/common/atoms/Loading'
import IconTextButton from '@/common/atoms/IconTextButton'
import PageHeader from '@/common/atoms/PageHeader'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import TextErrors from '@/common/atoms/TextErrors'
import { Title } from '@/common/atoms/Title'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import useOrgMember from '@/member/hooks/useOrgMember'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useDisclosure,
} from '@chakra-ui/react'
import { Thread_Status_Enum } from '@gql'
import { threadStatusList } from '@rolebase/shared/model/thread'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, CreateIcon } from 'src/icons'
import ThreadsList from '../components/ThreadsList'
import useFilterThreadsByMember from '../hooks/useFilterThreadsByMember'
import useThreads from '../hooks/useThreads'
import ThreadEditModal from '../modals/ThreadEditModal'

type Params = {
  member: string
  circle: string
}

// Thread Status filter
const threadStatusNotClosed = 'NotClosed'
type ThreadStatusFilter = Thread_Status_Enum | typeof threadStatusNotClosed

const threadStatusFiltersList: ThreadStatusFilter[] = [
  threadStatusNotClosed,
  ...threadStatusList,
]

export default function ThreadsPage() {
  const { t } = useTranslation()
  const { params, changeParams } = useUpdatableQueryParams<Params>()
  const isMember = useOrgMember()

  // Member param
  const memberId =
    params.member && typeof params.member === 'string'
      ? params.member
      : undefined
  const handleMemberChange = (member: string | undefined) =>
    changeParams({ member })

  // Circle param
  const circleId =
    params.circle && typeof params.circle === 'string'
      ? params.circle
      : undefined
  const handleCircleChange = (circle: string | undefined) =>
    changeParams({ circle })

  // Status filter
  const [status, setStatus] = useState<Thread_Status_Enum | undefined>()

  // Subscribe to threads
  const { threads, error, loading } = useThreads({ status })

  // Filter threads
  const filteredByCircleThreads = useFilterEntitiesByCircle(threads, circleId)
  const filteredThreads = useFilterThreadsByMember(
    filteredByCircleThreads,
    memberId
  )

  // Create modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()

  const handleThreadStatusChange = useCallback((status: string | string[]) => {
    if (typeof status !== 'string') return
    setStatus(
      status === threadStatusNotClosed
        ? undefined
        : (status as Thread_Status_Enum)
    )
  }, [])

  return (
    <>
      <Title>{t('ThreadsPage.heading')}</Title>

      <ScrollableLayout
        beigeContent
        header={
          <PageHeader
            ml={5}
            title={t('ThreadsPage.heading')}
            filters={
              <CircleAndMemberFilters
                circleId={circleId}
                memberId={memberId}
                my={2}
                onCircleChange={handleCircleChange}
                onMemberChange={handleMemberChange}
              >
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon size="1em" />}
                    fontWeight="normal"
                  >
                    {t(
                      `common.threadStatus.${status ?? threadStatusNotClosed}`
                    )}
                  </MenuButton>
                  <MenuList zIndex={2000}>
                    <MenuOptionGroup
                      type="radio"
                      value={status ?? threadStatusNotClosed}
                      onChange={handleThreadStatusChange}
                    >
                      {threadStatusFiltersList.map((status) => (
                        <MenuItemOption key={status} value={status}>
                          {t(`common.threadStatus.${status}`)}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </CircleAndMemberFilters>
            }
            actions={
              isMember && (
                <IconTextButton
                  aria-label={t('ThreadsPage.create')}
                  showText={{ base: false, xl: true }}
                  size="md"
                  colorScheme="blue"
                  icon={<CreateIcon size={20} />}
                  onClick={onCreateOpen}
                />
              )
            }
          />
        }
      >
        <Box maxW="3xl" my={10} px={{ base: 5, sm: 10 }}>
          {loading && <Loading active center />}
          <TextErrors errors={[error]} />

          {filteredThreads && (
            <ThreadsList
              threads={filteredThreads}
              showIcon
              showCircle
              showMember
            />
          )}

          {threads?.length === 0 && (
            <OnboardingVideo
              type={OnboardingVideoType.ThreadsAndTasks}
              mt={10}
            />
          )}
        </Box>
      </ScrollableLayout>

      {isCreateOpen && <ThreadEditModal isOpen onClose={onCreateClose} />}
    </>
  )
}
