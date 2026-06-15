import Loading from '@/common/atoms/Loading'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import Page404 from '@/common/pages/Page404'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { BoxProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MeetingContext } from '../contexts/MeetingContext'
import useMeetingState from '../hooks/useMeetingState'
import MeetingContent from './MeetingContent'
import MeetingHeader from './MeetingHeader'
import MeetingPanelEnded from './MeetingPanelEnded'
import MeetingPanelStarted from './MeetingPanelStarted'

interface Props extends BoxProps {
  id: string
  changeTitle?: boolean
  headerIcons?: React.ReactNode
}

export default function MeetingContainer({
  id,
  changeTitle,
  headerIcons,
  ...boxProps
}: Props) {
  const { t } = useTranslation()

  // Load meeting and steps
  const meetingState = useMeetingState(id)

  const { meeting, loading, error, circle, isStarted, isEnded } = meetingState
  const { orgData } = useOrgContext()

  if (error) {
    console.error(error)
    return <Page404 />
  }

  return (
    <MeetingContext.Provider value={meetingState}>
      {changeTitle && (
        <Title>
          {t('MeetingContainer.title', {
            circle: orgData?.getRole(circle?.roleId)?.name || '',
            title: meeting?.title || '…',
          })}
        </Title>
      )}

      <ScrollableLayout
        {...boxProps}
        header={<MeetingHeader headerIcons={headerIcons} />}
        footer={
          isStarted ? (
            <MeetingPanelStarted />
          ) : isEnded ? (
            <MeetingPanelEnded />
          ) : undefined
        }
      >
        {loading ? <Loading active size="md" mt={10} /> : <MeetingContent />}
      </ScrollableLayout>
    </MeetingContext.Provider>
  )
}
