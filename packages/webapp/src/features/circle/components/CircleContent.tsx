import ActionsMenu from '@/common/atoms/ActionsMenu'
import TitleLink from '@/common/atoms/TitleLink'
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
  Heading,
  HStack,
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
  CircleParentLinkIcon,
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
import CircleBreadcrumb from './CircleBreadcrumb'
import CircleByIdButton from './CircleByIdButton'
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
  // When true, only the Role tab is shown (no tab bar). Used by the proposal
  // org-chart editor, which only edits roles/circles.
  onlyRole?: boolean
  // When true, hide editing affordances (the role panel becomes a preview).
  readOnly?: boolean
  // Override the header close button handler (otherwise closes the parent modal)
  onClose?: () => void
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
  onlyRole,
  readOnly,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember() && !readOnly
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
        index={onlyRole ? 0 : tab}
        onChange={handleTabChange}
        isLazy
        display={flowHeight ? undefined : 'flex'}
        flexDirection={flowHeight ? undefined : 'column'}
        h={flowHeight ? undefined : '100%'}
      >
        <Box bg="menulight" _dark={{ bg: 'menudark' }}>
          <Flex p={2} pl={6}>
            <CircleBreadcrumb circleId={circle.id} mt={2} />
            <Spacer />

            <Box mr={1}>
              <ParticipantsNumber participants={participants} />
            </Box>

            {!onlyRole && (
              <Box>
                <CirclePrivacy />
              </Box>
            )}

            {isMember && (
              <ActionsMenu
                onEdit={canEditRole ? editRoleModal.onOpen : undefined}
                onArchive={
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
                onExport={
                  onlyRole
                    ? undefined
                    : () => navigateOrg(`export-circle?circleId=${circle.id}`)
                }
              />
            )}

            {headerIcons}
            <ModalCloseStaticButton onClose={onClose} />
          </Flex>

          <Flex alignItems="center" gap={3} minH={10} px={6} pt={2} pb={4}>
            <Heading as="h1" size="md" fontWeight="bold">
              {isMember && canEditRole ? (
                <TitleLink href="#" onClick={editRoleModal.onOpen}>
                  {role.name}
                </TitleLink>
              ) : (
                role.name
              )}
            </Heading>
            {role.parentLink && circle.parentId && (
              <>
                <Box color="gray.500" _dark={{ color: 'gray.300' }}>
                  <CircleParentLinkIcon size="1.5em" />
                </Box>
                <CircleByIdButton id={circle.parentId} size="md" />
              </>
            )}
          </Flex>

          {!onlyRole && (
            <TabList borderBottomWidth={0} pb={2} pl={6}>
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
          )}
        </Box>

        <TabPanels
          flex={flowHeight ? undefined : 1}
          minH={flowHeight ? undefined : 0}
          overflowY={flowHeight ? undefined : 'auto'}
          bg={tab === TabsEnum.News ? 'menulight' : undefined}
          _dark={{ bg: tab === TabsEnum.News ? 'menudark' : undefined }}
        >
          <TabPanel px={6} py={10}>
            <CircleRole />
          </TabPanel>
          {!onlyRole && (
            <TabPanel px={6} py={10}>
              <CircleNews circleId={circle.id} />
            </TabPanel>
          )}
          {!onlyRole && (
            <TabPanel px={6} py={10}>
              <CircleThreads circleId={circle.id} />
            </TabPanel>
          )}
          {!onlyRole && (
            <TabPanel px={6} py={10}>
              <CircleMeetings circleId={circle.id} />
            </TabPanel>
          )}
          {!onlyRole && (
            <TabPanel px={6} py={10}>
              <CircleTasks circleId={circle.id} />
            </TabPanel>
          )}
          {!onlyRole && (
            <TabPanel px={6} py={10}>
              <CircleDecisions circleId={circle.id} />
            </TabPanel>
          )}
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
