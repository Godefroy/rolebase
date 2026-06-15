import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  AlertIcon,
  Button,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { useGetCirclesStatsQuery } from '@gql'
import React, { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'

interface Props
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  id: string
  onDelete?(): void
}

export default function CircleDeleteModal({
  id,
  onDelete,
  ...alertProps
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const circle = orgData?.getCircle(id)
  const { archiveCircle } = useOrgEditActions()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const roleName = orgData?.getRole(circle?.roleId)?.name ?? ''

  // Get all circles ids that will be archived
  const circlesIds = orgData
    ? [id, ...orgData.descendantsOf(id).map((c) => c.id)]
    : [id]

  const { data, loading, error } = useGetCirclesStatsQuery({
    variables: { circlesIds },
  })

  // Stats of entities linked to circle
  const threadsCount = data?.thread_aggregate.aggregate?.count || 0
  const meetingsCount = data?.meeting_aggregate.aggregate?.count || 0
  const recurringMeetingsCount =
    data?.meeting_recurring_aggregate.aggregate?.count || 0
  const tasksCount = data?.task_aggregate.aggregate?.count || 0
  const decisionsCount = data?.decision_aggregate.aggregate?.count || 0

  const hasEntitiesToMove =
    threadsCount > 0 ||
    meetingsCount > 0 ||
    tasksCount > 0 ||
    decisionsCount > 0

  const handleDelete = async () => {
    if (!circle) return
    await archiveCircle(id)
    onDelete?.()
    alertProps.onClose()
  }

  if (!circle) return null

  return (
    <AlertDialog size="xl" {...alertProps} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {t('CircleDeleteModal.heading')}
          </AlertDialogHeader>

          <AlertDialogBody>
            {loading ? (
              <Loading active size="md" />
            ) : (
              <VStack spacing={4} align="start">
                <TextErrors errors={[error]} />

                <Text>
                  <Trans
                    i18nKey="CircleDeleteModal.info"
                    values={{ name: roleName }}
                    components={{ b: <strong /> }}
                  />
                </Text>

                {recurringMeetingsCount > 0 && (
                  <Alert status="warning">
                    <AlertIcon />
                    <AlertDescription>
                      {t('CircleDeleteModal.recurringMeetings', {
                        count: recurringMeetingsCount,
                      })}
                    </AlertDescription>
                  </Alert>
                )}

                {hasEntitiesToMove && (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>
                      <Text>{t('CircleDeleteModal.entities')}</Text>

                      <UnorderedList mt={2} ml={6}>
                        {threadsCount > 0 && (
                          <ListItem>
                            {t('CircleDeleteModal.threads', {
                              count: threadsCount,
                            })}
                          </ListItem>
                        )}
                        {meetingsCount > 0 && (
                          <ListItem>
                            {t('CircleDeleteModal.meetings', {
                              count: meetingsCount,
                            })}
                          </ListItem>
                        )}
                        {tasksCount > 0 && (
                          <ListItem>
                            {t('CircleDeleteModal.tasks', {
                              count: tasksCount,
                            })}
                          </ListItem>
                        )}
                        {decisionsCount > 0 && (
                          <ListItem>
                            {t('CircleDeleteModal.decisions', {
                              count: decisionsCount,
                            })}
                          </ListItem>
                        )}
                      </UnorderedList>
                    </AlertDescription>
                  </Alert>
                )}
              </VStack>
            )}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={alertProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              colorScheme="red"
              isDisabled={loading || !!error}
              onClick={handleDelete}
              ml={3}
            >
              {t('CircleDeleteModal.confirmButton', { name: roleName })}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
