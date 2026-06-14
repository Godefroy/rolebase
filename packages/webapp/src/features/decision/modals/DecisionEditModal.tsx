import CircleFormController from '@/circle/components/CircleFormController'
import useCircle from '@/circle/hooks/useCircle'
import SwitchController from '@/common/atoms/SwitchController'
import EditorController from '@/editor/components/EditorController'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgId } from '@/org/hooks/useOrgId'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import {
  DecisionFragment,
  useCreateDecisionMutation,
  useUpdateDecisionMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { nameSchema } from '@rolebase/shared/schemas'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

interface Props extends UseModalProps {
  decision?: DecisionFragment
  defaults?: Partial<DecisionFragment>
  onCreate?(id: string): void
}

interface Values {
  title: string
  description: string
  circleId: string
  private: boolean
}

const resolver = yupResolver(
  yup.object().shape({
    title: nameSchema.required(),
    circleId: yup.string().required(),
  })
)

export default function DecisionEditModal({
  defaults,
  decision,
  onCreate,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const orgId = useOrgId()
  const currentMember = useCurrentMember()
  const [createDecision] = useCreateDecisionMutation()
  const [updateDecision] = useUpdateDecisionMutation()

  const defaultValues = decision
    ? {
        title: decision.title,
        description: decision.description,
        circleId: decision.circleId,
        private: decision.private,
      }
    : {
        title: defaults?.title || '',
        description: defaults?.description || '',
        circleId: defaults?.circleId || '',
        private: defaults?.private || false,
      }

  const formMethods = useForm<Values>({
    resolver,
    defaultValues,
  })
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = formMethods

  // Watch selected circle
  const circleId = watch('circleId')
  const circle = useCircle(circleId)
  const participants = useCircleParticipants(circle)

  // Watch privacy field
  const isPrivate = watch('private')
  const isPrivateAllowed =
    !isPrivate || participants.some((p) => p.member.id === currentMember?.id)

  const onSubmit = handleSubmit(async (values) => {
    if (!orgId || !currentMember) return
    if (decision) {
      // Update decision
      await updateDecision({ variables: { id: decision.id, values } })
    } else {
      // Create decision
      const { data } = await createDecision({
        variables: {
          values: {
            orgId,
            memberId: currentMember.id,
            ...values,
          },
        },
      })
      const newDecision = data?.insert_decision_one
      if (!newDecision) return

      onCreate?.(newDecision.id)
    }
    modalProps.onClose()
  })

  return (
    <FormProvider {...formMethods}>
      <Modal size="xl" {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>
              {t(
                decision
                  ? 'DecisionEditModal.headingEdit'
                  : 'DecisionEditModal.headingCreate'
              )}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={5} align="stretch">
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>{t('DecisionEditModal.title')}</FormLabel>
                  <Input
                    {...register('title')}
                    placeholder={t('DecisionEditModal.titlePlaceholder')}
                    autoFocus
                  />
                </FormControl>

                <CircleFormController />

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>{t('DecisionEditModal.description')}</FormLabel>
                  <EditorController
                    name="description"
                    placeholder={t('DecisionEditModal.descriptionPlaceholder')}
                    control={control}
                  />
                </FormControl>

                <FormControl>
                  <SwitchController name="private" control={control}>
                    {t('DecisionEditModal.private')}
                    <ParticipantsNumber
                      participants={participants}
                      opacity={isPrivate ? 1 : 0.4}
                      ml={2}
                    />
                  </SwitchController>
                  <Collapse in={isPrivate}>
                    <FormHelperText ml="40px" mb={2}>
                      {t('DecisionEditModal.privateHelp', {
                        role: circle?.role.name,
                      })}
                    </FormHelperText>
                  </Collapse>
                </FormControl>

                <Collapse in={!isPrivateAllowed}>
                  <Alert status="warning">
                    <AlertIcon />
                    <AlertDescription>
                      {t('DecisionEditModal.privateNotAllowed', {
                        role: circle?.role.name,
                      })}
                    </AlertDescription>
                  </Alert>
                </Collapse>

                <Box textAlign="right" mt={2}>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isDisabled={!isPrivateAllowed}
                  >
                    {t(decision ? 'common.save' : 'common.create')}
                  </Button>
                </Box>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}
