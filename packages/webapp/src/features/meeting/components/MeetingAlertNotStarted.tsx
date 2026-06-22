import BounceAnimation from '@/common/atoms/BounceAnimation'
import useDateLocale from '@/common/hooks/useDateLocale'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BoxProps,
  Button,
  HStack,
  Link,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import { useUpdateMeetingMutation } from '@gql'
import { format } from 'date-fns'
import React, { useCallback, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { EditIcon, PlayIcon, VisioIcon } from 'src/icons'
import { MeetingContext } from '../contexts/MeetingContext'

interface Props extends BoxProps {
  onEdit: () => void
}

export default function MeetingAlertNotStarted({ onEdit, ...boxProps }: Props) {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()
  const toast = useToast()

  const { meeting, isToday, isStartTimePassed, videoConfUrl, handleNextStep } =
    useContext(MeetingContext)!

  // Meeting archiving
  const [updateMeeting] = useUpdateMeetingMutation()
  const handleArchive = () => {
    if (!meeting) return
    updateMeeting({
      variables: { id: meeting.id, values: { archivedAt: new Date().toISOString() } },
    })
  }

  // Start meeting
  const [starting, setStarting] = useState(false)
  const handleStart = useCallback(async () => {
    setStarting(true)
    try {
      await handleNextStep()
      toast({
        title: t('MeetingAlertNotStarted.toastStarted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: JSON.stringify(error),
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
      setStarting(false)
    }
  }, [meeting, handleNextStep])

  if (!meeting) return null

  const startDateLocale = format(new Date(meeting.startDate), 'PPPP', {
    locale: dateLocale,
  })

  return isToday ? (
    <HStack spacing={5} {...boxProps}>
      <BounceAnimation active={isStartTimePassed}>
        <Button
          leftIcon={<PlayIcon variant="Bold" />}
          colorScheme="green"
          isDisabled={starting}
          onClick={handleStart}
        >
          {t('MeetingAlertNotStarted.start')}
        </Button>
      </BounceAnimation>

      {videoConfUrl && (
        <a href={videoConfUrl} target="_blank" rel="noreferrer">
          <Button
            leftIcon={<VisioIcon variant="Bold" />}
            variant="ghost"
            colorScheme="blue"
          >
            {t('MeetingContent.videoConf')}
          </Button>
        </a>
      )}
    </HStack>
  ) : (
    <Alert status="info" {...boxProps}>
      <AlertIcon />

      <AlertDescription>
        <Trans
          i18nKey={
            isStartTimePassed
              ? 'MeetingAlertNotStarted.past'
              : 'MeetingAlertNotStarted.future'
          }
          values={{
            date: startDateLocale,
          }}
          components={{
            date: <Link href="#" textDecoration="underline" onClick={onEdit} />,
          }}
        />
      </AlertDescription>

      {isStartTimePassed && (
        <>
          <Spacer />
          <Button
            variant="outline"
            colorScheme="red"
            onClick={handleArchive}
            mr={2}
          >
            {t('common.delete')}
          </Button>
          <Button
            leftIcon={<EditIcon size={18} />}
            colorScheme="blue"
            onClick={onEdit}
          >
            {t('common.edit')}
          </Button>
        </>
      )}
    </Alert>
  )
}
