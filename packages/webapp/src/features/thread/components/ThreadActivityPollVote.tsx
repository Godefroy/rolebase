import NumberInput from '@/common/atoms/NumberInput'
import useDateLocale from '@/common/hooks/useDateLocale'
import { Box, Button, Stack, StackItem, Text } from '@chakra-ui/react'
import { ThreadPollAnswerFragment } from '@gql'
import { ThreadActivityPollFragment } from '@rolebase/shared/model/thread_activity'
import { format } from 'date-fns'
import React, { memo, useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CheckIcon } from 'src/icons'
import usePollState from '../hooks/usePollState'

interface Props {
  activity: ThreadActivityPollFragment
  answers: ThreadPollAnswerFragment[]
  onVote(choicesPoints: number[]): void
}

interface Values {
  choices: Array<{
    points: number
  }>
}

function getRange(length: number): number[] {
  return Array.from(Array(length).keys())
}

function getRandomIndexes(length: number): number[] {
  const indexes: number[] = []
  while (indexes.length < length) {
    const index = Math.floor(Math.random() * length)
    if (!indexes.includes(index)) {
      indexes.push(index)
    }
  }
  return indexes
}

function ThreadActivityPollVote({ activity, answers, onVote }: Props) {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()
  const { ended, userAnswer } = usePollState(activity, answers)
  const { data } = activity

  // Prepare ordered or random indexes choices
  const displayOrder = useMemo(
    () =>
      data.randomize
        ? getRandomIndexes(data.choices.length)
        : getRange(data.choices.length),
    [data.randomize, data.choices.length]
  )

  // Vote form
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<Values>({
    defaultValues: {
      choices: userAnswer
        ? userAnswer.choicesPoints.map((points) => ({ points }))
        : data.choices.map(() => ({ points: 0 })),
    },
  })

  // Reset form when user answer changes
  useEffect(() => {
    reset({
      choices: userAnswer
        ? userAnswer.choicesPoints.map((points) => ({ points }))
        : data.choices.map(() => ({ points: 0 })),
    })
  }, [userAnswer])

  // Array of choices fields
  const { fields: choicesFields, update: updateChoice } = useFieldArray({
    control,
    name: 'choices',
  })

  const nbSelectedChoices = useMemo(
    () =>
      choicesFields.reduce((sum, choice) => sum + (choice.points ? 1 : 0), 0),
    [choicesFields]
  )
  const usedPoints = useMemo(
    () => choicesFields.reduce((sum, choice) => sum + choice.points, 0),
    [choicesFields]
  )
  const remainingPoints = data.pointsPerUser
    ? data.pointsPerUser - usedPoints
    : 0 // Stay at 0 if no points per user
  const notEnoughChoices =
    !!data.minAnswers && nbSelectedChoices < data.minAnswers
  const tooMuchChoices =
    !!data.maxAnswers && nbSelectedChoices > data.maxAnswers

  const voteButtonDisabled =
    remainingPoints !== 0 || notEnoughChoices || tooMuchChoices

  // Click on a choice button
  const handleToggleVote = (choiceId: number) => {
    const points = choicesFields[choiceId]?.points
    if (data.multiple) {
      // Multiple choice
      if (points) {
        // Remove vote
        updateChoice(choiceId, { points: 0 })
      } else {
        // Add vote
        updateChoice(choiceId, { points: 1 })
      }
    } else {
      // Single choice
      if (!points) {
        // Change vote
        updateChoice(choiceId, { points: 1 })
        const existingVoteId = choicesFields.findIndex(
          (choice) => choice.points
        )
        if (existingVoteId !== -1) {
          updateChoice(existingVoteId, { points: 0 })
        }
      }
      handleVote()
    }
  }

  const handleVote = handleSubmit(({ choices }) => {
    onVote(choices.map((choice) => choice.points))
  })

  return (
    <>
      {data.multiple &&
        (data.minAnswers && data.minAnswers === data.maxAnswers ? (
          <Text>
            {t('ThreadActivityPollVote.chooseN', {
              count: data.minAnswers,
            })}
          </Text>
        ) : data.minAnswers && data.maxAnswers ? (
          <Text>
            {t('ThreadActivityPollVote.chooseMinAndMax', {
              min: data.minAnswers,
              max: data.maxAnswers,
            })}
          </Text>
        ) : data.minAnswers ? (
          <Text>
            {t('ThreadActivityPollVote.chooseMin', {
              count: data.minAnswers,
            })}
          </Text>
        ) : data.maxAnswers ? (
          <Text>
            {t('ThreadActivityPollVote.chooseMax', {
              count: data.maxAnswers,
            })}
          </Text>
        ) : (
          <Text>{t('ThreadActivityPollVote.chooseMultiple')}</Text>
        ))}

      {data.anonymous && <Text>{t('ThreadActivityPollVote.anonymous')}</Text>}

      <Stack spacing={1} align="stretch">
        {displayOrder.map((index) => {
          const choice = data.choices[index]
          const points = choicesFields[index]?.points || 0
          const checked = !!points
          return (
            <StackItem key={index} display="flex">
              <Button
                flex="1"
                justifyContent="space-between"
                variant="outline"
                colorScheme={checked ? 'blue' : 'gray'}
                whiteSpace="break-spaces"
                h="auto"
                py="0.5em"
                rightIcon={checked ? <CheckIcon /> : undefined}
                onClick={() => handleToggleVote(index)}
              >
                {choice.title}
              </Button>
              {/* Fixed size box is used to keep buttons the same size */}
              <Box w="70px" pl={2} display="flex" alignItems="center">
                {checked && data.pointsPerUser ? (
                  <NumberInput
                    value={points}
                    onChange={(value) => updateChoice(index, { points: value })}
                    size="xs"
                    maxW={16}
                    min={1}
                  />
                ) : null}
              </Box>
            </StackItem>
          )
        })}
      </Stack>

      {data.multiple && nbSelectedChoices > 0 && (!userAnswer || isDirty) && (
        <>
          {data.pointsPerUser &&
            (remainingPoints === 0 ? (
              <Text>{t('ThreadActivityPollVote.pointsDistributed')}</Text>
            ) : remainingPoints > 0 ? (
              <Text>
                {t('ThreadActivityPollVote.pointsRemaining', {
                  count: remainingPoints,
                })}
              </Text>
            ) : (
              <Text>
                {t('ThreadActivityPollVote.pointsExceeded', {
                  count: -remainingPoints,
                })}
              </Text>
            ))}

          <Box w="70px" pl={2} display="flex" alignItems="center">
            <Button
              mt={2}
              colorScheme="blue"
              isDisabled={voteButtonDisabled}
              onClick={handleVote}
            >
              {t('ThreadActivityPollVote.vote')}
            </Button>
          </Box>
        </>
      )}

      {!ended && data.hideUntilEnd && (
        <Text mt={2}>
          {data.endDate
            ? t(
                data.endWhenAllVoted
                  ? 'ThreadActivityPollVote.revealDateOrAllVoted'
                  : 'ThreadActivityPollVote.revealDate',
                {
                  date: format(new Date(data.endDate), 'PPPP', {
                    locale: dateLocale,
                  }),
                }
              )
            : data.endWhenAllVoted
              ? t('ThreadActivityPollVote.revealAllVoted')
              : t('ThreadActivityPollVote.revealLater')}
        </Text>
      )}
    </>
  )
}

export default memo(ThreadActivityPollVote)
