import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, Stack, StackItem, Tooltip, useColorMode } from '@chakra-ui/react'
import { ThreadPollAnswerFragment } from '@gql'
import { ThreadActivityPollFragment } from '@rolebase/shared/model/thread_activity'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  activity: ThreadActivityPollFragment
  answers: ThreadPollAnswerFragment[]
}

function ThreadActivityPollResult({ activity, answers }: Props) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const members = useOrgContext().orgData?.members

  const results = useMemo(
    () =>
      activity.data.choices
        .map((choice, index) => ({
          // Choice's title
          title: choice.title,

          // Total number of votes for this choice
          points: answers.reduce(
            (sum, answer) => sum + answer.choicesPoints[index],
            0
          ),

          // Voters that gave at least 1 point to this choice
          voters: answers.reduce<string[]>((names, answer) => {
            if (answer.choicesPoints[index] > 0) {
              names.push(
                members?.find((m) => m.userId === answer.userId)?.name || '?'
              )
            }
            return names
          }, []),
        }))
        .sort((a, b) => b.points - a.points),
    [activity, members, answers]
  )

  const maxPoints = useMemo(
    () => results.reduce((max, result) => Math.max(max, result.points), 0),
    [results]
  )

  return (
    <Stack spacing={1} align="stretch">
      {results.map(({ title, points, voters }, index) => {
        const widthRatio = Math.round((points / maxPoints) * 1000) / 10
        return (
          <StackItem key={index} display="flex">
            <Tooltip
              label={
                activity.data.anonymous
                  ? t('ThreadActivityPollResult.anonymous')
                  : voters.join(', ')
              }
              placement="top"
              hasArrow
              openDelay={300}
            >
              <Box
                flex="1"
                justifyContent="space-between"
                px={4}
                py={1}
                border="1px solid #3182ce"
                borderRadius="md"
                minW="200px"
                bg={`linear-gradient(to right, ${
                  colorMode === 'light'
                    ? '#a6d1fa, #a6d1fa'
                    : '#10497e, #10497e'
                } ${widthRatio}%, transparent ${widthRatio}%, transparent 75%);`}
              >
                {title}
              </Box>
            </Tooltip>
            {/* Fixed size box is used to keep buttons the same size */}
            <Box w="70px" pl={2} display="flex" alignItems="center">
              {points} {activity.data.pointsPerUser ? 'point' : 'vote'}
              {points > 1 ? 's' : ''}
            </Box>
          </StackItem>
        )
      })}
    </Stack>
  )
}

export default memo(ThreadActivityPollResult)
