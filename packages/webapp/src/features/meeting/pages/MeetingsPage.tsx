import CircleAndMemberFilters from '@/circle/components/CircleAndMemberFilters'
import useFilterEntitiesByCircle from '@/circle/hooks/useFilterEntitiesByCircle'
import Calendar from '@/common/atoms/Calendar'
import Loading from '@/common/atoms/Loading'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import TextErrors from '@/common/atoms/TextErrors'
import { Title } from '@/common/atoms/Title'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import useFilterScopedEntitiesByMember from '@/participants/hooks/useFilterScopedEntitiesByMember'
import useUserMetadata from '@/user/hooks/useUserMetadata'
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import {
  DateSelectArg,
  DatesSetArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core'
import { useMeetingsByDatesSubscription, useUpdateMeetingMutation } from '@gql'
import { RRuleUTC } from '@rolebase/shared/helpers/RRuleUTC'
import { circleColor } from '@rolebase/shared/helpers/circleColor'
import { truthy } from '@rolebase/shared/helpers/truthy'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  AppsIcon,
  CopyIcon,
  CreateIcon,
  ExportIcon,
  HideIcon,
  MeetingRecurringIcon,
  SettingsIcon,
  ShowIcon,
} from 'src/icons'
import MeetingOpenCurrent from '../components/MeetingOpenCurrent'
import MeetingEditModal from '../modals/MeetingEditModal'
import MeetingExportModal from '../modals/MeetingExportModal'
import MeetingRecurringEditModal from '../modals/MeetingRecurringEditModal'
import MeetingRecurringListModal from '../modals/MeetingRecurringListModal'
import MeetingRecurringModal from '../modals/MeetingRecurringModal'
import MeetingTemplateListModal from '../modals/MeetingTemplateListModal'

type Params = {
  member: string
  circle: string
}

export default function MeetingsPage() {
  const { t } = useTranslation()
  const { params, changeParams } = useUpdatableQueryParams<Params>()
  const isMember = useOrgMember()
  const { orgId, orgData } = useOrgContext()
  const circles = orgData?.circles
  const navigate = useNavigateOrg()

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

  // Colors
  const { colorMode } = useColorMode()
  const colorLightness = colorMode === 'light' ? 92 : 25

  // Dates range
  const [datesRange, setDatesRange] = useState<[Date, Date] | undefined>(
    undefined
  )

  // Subscribe to meetings
  const { data, error, loading } = useMeetingsByDatesSubscription({
    skip: !orgId || !datesRange,
    variables: {
      orgId: orgId!,
      fromDate: datesRange?.[0].toISOString()!,
      toDate: datesRange?.[1].toISOString()!,
      filters: [
        {
          archivedAt: { _is_null: true },
        },
        ...(circleId ? [{ circleId: { _eq: circleId } }] : []),
        ...(memberId
          ? [{ meeting_attendees: { memberId: { _eq: memberId } } }]
          : []),
      ],
      recurringFilters: circleId ? [{ circleId: { _eq: circleId } }] : [],
    },
  })

  // Filter meetings
  const meetings = data?.org_by_pk?.meetings

  // Filter recurring meetings
  const meetingsRecurringByScope = useFilterScopedEntitiesByMember(
    data?.org_by_pk?.meetings_recurring,
    memberId
  )
  const meetingsRecurring = useFilterEntitiesByCircle(
    meetingsRecurringByScope,
    circleId
  )

  // Prepare events for Fullcalendar
  const events = useMemo(
    () =>
      // Add events from meetings
      meetings
        ?.map((meeting): EventInput => {
          const baseEvent = {
            id: meeting.id,
            start: new Date(meeting.startDate),
            end: new Date(meeting.endDate),
          }

          // Add role name to title
          const circle = circles?.find((c) => c.id === meeting.circleId)

          if (!circle) {
            console.error('Circle not found', meeting.circleId)
            return {
              ...baseEvent,
              title: meeting.title,
              backgroundColor: circleColor(colorLightness),
            }
          }

          const title = `${orgData?.getRole(circle.roleId)?.name} - ${
            meeting.title
          }`

          // Can move event or change duration?
          const isStarted = meeting.currentStepId !== null
          const isNotStarted = !isStarted && !meeting.ended
          const canEditConfig = isNotStarted

          return {
            ...baseEvent,
            title,
            backgroundColor: circleColor(
              colorLightness,
              orgData?.getColor(circle.id) ?? undefined
            ),
            editable: canEditConfig,
          }
        })

        // Add events from recurring meetings
        .concat(
          (meetingsRecurring || [])
            .map((mr): EventInput | undefined => {
              const rrule = new RRuleUTC(mr.rrule)
              const nextDate = rrule.after(new Date())
              if (!nextDate) return undefined

              // Exclude dates of meetings from the serie
              rrule.excludeDates(mr.meetings.map((m) => m.recurringDate))

              // Only show occurrences after today
              rrule.changeStartDate(nextDate)

              // Resolve circle color (can be inherited from parents)
              const circle = circles?.find((c) => c.id === mr.circleId)
              const colorHue =
                (circle ? orgData?.getColor(circle.id) : undefined) ??
                mr.circle.role.colorHue ??
                undefined

              return {
                id: mr.id,
                title: `${mr.circle.role.name} - ${mr.template.title}`,
                rrule: rrule.toString(),
                duration: {
                  minutes: mr.duration,
                },
                backgroundColor: circleColor(colorLightness, colorHue),
                editable: false,
              }
            })
            .filter(truthy)
        ),
    [meetings, meetingsRecurring, circles, colorMode, orgData]
  )

  // Show/hide weekends
  const { metadata, setMetadata } = useUserMetadata()
  const weekend = metadata?.calendarShowWeekend ?? false

  // Modals
  const createModal = useDisclosure()
  const templatesModal = useDisclosure()
  const recurringModal = useDisclosure()
  const recurringEditModal = useDisclosure()
  const recurringListModal = useDisclosure()
  const exportModal = useDisclosure()
  const currentMeetingModal = useDisclosure({ defaultIsOpen: true })

  // Dates for meeting creation modal
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [duration, setDuration] = useState<number>(30)

  // Recurring meeting id and date for modal
  const [recurringId, setRecurringId] = useState<string | undefined>()
  const [recurringDate, setRecurringDate] = useState<Date | undefined>()

  // Handlers

  const handleCreate = useCallback(() => {
    setStartDate(undefined)
    setDuration(30)
    createModal.onOpen()
  }, [])

  const handleEventClick = useCallback(
    ({ event }: EventClickArg) => {
      // Open meeting
      const meeting = meetings?.find((m) => m.id === event.id)
      if (meeting) {
        navigate(`meetings/${meeting.id}`)
        return
      }

      // Ope recurring meeting
      const meetingRecurring = meetingsRecurring?.find((m) => m.id === event.id)
      if (meetingRecurring && event.start) {
        setRecurringId(meetingRecurring.id)
        setRecurringDate(event.start)
        recurringModal.onOpen()
      }
    },
    [meetings, meetingsRecurring]
  )

  const handleDateClick = useCallback(
    ({ date }: { date: Date }) => {
      setStartDate(date)
      createModal.onOpen()
    },
    [meetings]
  )

  const handleSelect = useCallback(({ start, end }: DateSelectArg) => {
    setStartDate(start)
    setDuration(Math.round((end.getTime() - start.getTime()) / (1000 * 60)))
    createModal.onOpen()
  }, [])

  const handleDatesChange = useCallback(
    ({ start, end }: DatesSetArg) => {
      setDatesRange([start, end])
    },
    [meetings]
  )

  const [updateMeeting] = useUpdateMeetingMutation()

  const handleEventChange = useCallback(({ event }: EventChangeArg) => {
    if (!event.start || !event.end) return
    updateMeeting({
      variables: {
        id: event.id,
        values: {
          startDate: event.start.toISOString(),
          endDate: event.end.toISOString(),
        },
      },
    })
  }, [])

  return (
    <Flex h="100%" flexDirection="column">
      <Title>{t('MeetingsPage.heading')}</Title>

      <ScrollableLayout
        header={
          <Flex ml={5} w="100%" alignItems="center" flexWrap="wrap">
            <Heading as="h1" size="lg">
              {t('MeetingsPage.heading')}
            </Heading>

            <CircleAndMemberFilters
              circleId={circleId}
              memberId={memberId}
              ml={5}
              my={2}
              onCircleChange={handleCircleChange}
              onMemberChange={handleMemberChange}
            />

            <Spacer />

            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                size="sm"
                variant="outline"
                fontWeight="normal"
                leftIcon={<SettingsIcon size={20} />}
                my={2}
              >
                {t('MeetingsPage.settings')}
              </MenuButton>
              <MenuList
                fontFamily="body"
                fontSize="1rem"
                fontWeight="normal"
                zIndex={1000}
              >
                {isMember && (
                  <>
                    <MenuItem
                      icon={<CopyIcon size={20} />}
                      onClick={templatesModal.onOpen}
                    >
                      {t('MeetingsPage.templates')}
                    </MenuItem>
                    <MenuItem
                      icon={<MeetingRecurringIcon size={20} />}
                      onClick={recurringListModal.onOpen}
                    >
                      {t('MeetingsPage.recurring')}
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  icon={
                    weekend ? <HideIcon size={20} /> : <ShowIcon size={20} />
                  }
                  onClick={() => setMetadata('calendarShowWeekend', !weekend)}
                >
                  {weekend
                    ? t('MeetingsPage.hideWeekend')
                    : t('MeetingsPage.showWeekend')}
                </MenuItem>
                <MenuItem
                  icon={<ExportIcon size={20} />}
                  onClick={exportModal.onOpen}
                >
                  {t('MeetingsPage.export')}
                </MenuItem>
                <Link to="/apps">
                  <MenuItem icon={<AppsIcon size={20} />}>
                    {t('MeetingsPage.apps')}
                  </MenuItem>
                </Link>
              </MenuList>
            </Menu>

            {isMember && (
              <Button
                size="md"
                colorScheme="blue"
                ml={5}
                my={1}
                leftIcon={<CreateIcon size={20} />}
                onClick={handleCreate}
              >
                {t('MeetingsPage.create')}
              </Button>
            )}
          </Flex>
        }
      >
        <Box py={5} h="100%">
          {loading && <Loading active center />}
          <TextErrors errors={[error]} />

          <Calendar
            events={events}
            weekends={weekend}
            editable={isMember}
            selectable={isMember}
            eventAllow={() => isMember}
            selectAllow={() => isMember}
            dateClick={isMember ? handleDateClick : undefined}
            select={handleSelect}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            datesSet={handleDatesChange}
          />
        </Box>
      </ScrollableLayout>

      {createModal.isOpen && (
        <MeetingEditModal
          defaultStartDate={startDate}
          defaultDuration={duration}
          isOpen
          onRecurring={() => {
            createModal.onClose()
            recurringEditModal.onOpen()
          }}
          onClose={createModal.onClose}
        />
      )}

      {templatesModal.isOpen && (
        <MeetingTemplateListModal isOpen onClose={templatesModal.onClose} />
      )}

      {recurringModal.isOpen && recurringId && (
        <MeetingRecurringModal
          id={recurringId}
          defaultDate={recurringDate}
          isOpen
          onClose={recurringModal.onClose}
        />
      )}

      {recurringEditModal.isOpen && (
        <MeetingRecurringEditModal
          isOpen
          onClose={recurringEditModal.onClose}
        />
      )}

      {recurringListModal.isOpen && (
        <MeetingRecurringListModal
          isOpen
          onClose={recurringListModal.onClose}
        />
      )}

      {exportModal.isOpen && (
        <MeetingExportModal isOpen onClose={exportModal.onClose} />
      )}

      {currentMeetingModal.isOpen && (
        <MeetingOpenCurrent isOpen onClose={currentMeetingModal.onClose} />
      )}
    </Flex>
  )
}
