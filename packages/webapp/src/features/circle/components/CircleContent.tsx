import ActionsMenu from '@/common/atoms/ActionsMenu'
import ModalCloseStaticButton from '@/common/atoms/ModalCloseStaticButton'
import Tab from '@/common/atoms/Tab'
import { Title } from '@/common/atoms/Title'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Spacer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CircleIcon,
  DecisionsIcon,
  MeetingsIcon,
  NewsIcon,
  TasksIcon,
  ThreadsIcon,
} from 'src/icons'
import RoleEditModal from '../../role/modals/RoleEditModal'
import { CircleContext } from '../contexts/CIrcleContext'
import CircleCopyModal from '../modals/CircleCopyModal'
import CircleDeleteModal from '../modals/CircleDeleteModal'
import CircleMoveModal from '../modals/CircleMoveModal'
import CircleAndParentsLinks from './CircleAndParentsLinks'
import CircleDecisions from './CircleDecisions'
import CircleMeetings from './CircleMeetings'
import CircleNews from './CircleNews'
import CirclePrivacy from './CirclePrivacy'
import CircleRole from './CircleRole'
import CircleTasks from './CircleTasks'
import CircleThreads from './CircleThreads'

interface Props {
  changeTitle?: boolean
  headerIcons?: React.ReactNode
  // When true, the content flows to its natural height instead of filling its
  // parent with an inner scroll. Used when the whole page scrolls (mobile/tablet).
  flowHeight?: boolean
}

enum TabsEnum {
  Role,
  News,
  Threads,
  Meetings,
  Tasks,
  Decisions,
}

type TabNames = keyof typeof TabsEnum

type Params = {
  tab: TabNames
}

export default function CircleContent({
  changeTitle,
  headerIcons,
  flowHeight,
}: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()
  const circleContext = useContext(CircleContext)
  const navigateOrg = useNavigateOrg()

  // Tabs
  const { params, changeParams } = useUpdatableQueryParams<Params>()
  const tab = params.tab ? TabsEnum[params.tab] : 0

  const handleTabChange = (tab: number) => {
    const tabName = TabsEnum[tab] as TabNames
    changeParams({ tab: tabName })
  }

  // Modals
  const editRoleModal = useDisclosure()
  const deleteModal = useDisclosure()
  const duplicateModal = useDisclosure()
  const moveModal = useDisclosure()

  if (!circleContext) {
    return (
      <>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('CircleContent.notFound')}</AlertTitle>
        </Alert>
        <ModalCloseStaticButton />
      </>
    )
  }

  const { circle, role, participants, canEditCircle, canEditRole } =
    circleContext

  return (
    <>
      {changeTitle && <Title>{role.name}</Title>}

      <Tabs
        index={tab}
        onChange={handleTabChange}
        isLazy
        display={flowHeight ? undefined : 'flex'}
        flexDirection={flowHeight ? undefined : 'column'}
        h={flowHeight ? undefined : '100%'}
      >
        <Flex p={2} pl={6} bg="menulight" _dark={{ bg: 'menudark' }}>
          <CircleAndParentsLinks circle={circle} size="md" overflow="hidden" />
          <Spacer />

          <Box mr={1}>
            <ParticipantsNumber participants={participants} />
          </Box>

          <Box>
            <CirclePrivacy />
          </Box>

          {isMember && (
            <ActionsMenu
              onEdit={canEditRole ? editRoleModal.onOpen : undefined}
              onDelete={
                canEditCircle && circle.parentId
                  ? deleteModal.onOpen
                  : undefined
              }
              onMove={
                canEditCircle && circle.parentId ? moveModal.onOpen : undefined
              }
              onDuplicate={
                canEditCircle && circle.parentId
                  ? duplicateModal.onOpen
                  : undefined
              }
              onExport={() =>
                navigateOrg(`export-circle?circleId=${circle.id}`)
              }
            />
          )}

          {headerIcons}
          <ModalCloseStaticButton />
        </Flex>

        <TabList
          borderBottomWidth={0}
          pb={2}
          pl={6}
          bg="menulight"
          _dark={{ bg: 'menudark' }}
        >
          <Tab icon={CircleIcon} minimize>
            {t('CircleContent.tabRole')}
          </Tab>
          <Tab icon={NewsIcon} minimize>
            {t('CircleContent.tabNews')}
          </Tab>
          <Tab icon={ThreadsIcon} minimize>
            {t('CircleContent.tabThreads')}
          </Tab>
          <Tab icon={MeetingsIcon} minimize>
            {t('CircleContent.tabMeetings')}
          </Tab>
          <Tab icon={TasksIcon} minimize>
            {t('CircleContent.tabTasks')}
          </Tab>
          <Tab icon={DecisionsIcon} minimize>
            {t('CircleContent.tabDecisions')}
          </Tab>
        </TabList>

        <TabPanels
          flex={flowHeight ? undefined : 1}
          overflowY={flowHeight ? undefined : 'auto'}
          bg={tab === TabsEnum.News ? 'menulight' : undefined}
          _dark={{ bg: tab === TabsEnum.News ? 'menudark' : undefined }}
        >
          <TabPanel px={6} py={10}>
            <CircleRole />
          </TabPanel>
          <TabPanel px={6} py={10}>
            <CircleNews circleId={circle.id} />
          </TabPanel>
          <TabPanel px={6} py={10}>
            <CircleThreads circleId={circle.id} />
          </TabPanel>
          <TabPanel px={6} py={10}>
            <CircleMeetings circleId={circle.id} />
          </TabPanel>
          <TabPanel px={6} py={10}>
            <CircleTasks circleId={circle.id} />
          </TabPanel>
          <TabPanel px={6} py={10}>
            <CircleDecisions circleId={circle.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {editRoleModal.isOpen && role && (
        <RoleEditModal role={role} isOpen onClose={editRoleModal.onClose} />
      )}

      {deleteModal.isOpen && (
        <CircleDeleteModal
          id={circle.id}
          isOpen
          onClose={deleteModal.onClose}
        />
      )}

      {moveModal.isOpen && (
        <CircleMoveModal isOpen onClose={moveModal.onClose} />
      )}

      {duplicateModal.isOpen && (
        <CircleCopyModal isOpen onClose={duplicateModal.onClose} />
      )}
    </>
  )
}
