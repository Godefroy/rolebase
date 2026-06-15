import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  MeetingTemplateFragment,
  useCreateMeetingTemplateMutation,
  useUpdateMeetingTemplateMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { nameSchema, stepsConfigSchema } from '@rolebase/shared/schemas'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import MeetingStepsConfigController, {
  StepsValues,
} from '../components/MeetingStepsConfigController'
import MeetingTemplateDeleteModal from './MeetingTemplateDeleteModal'

interface Props extends UseModalProps {
  meetingTemplate?: MeetingTemplateFragment
  onCreate?: (meetingTemplate: MeetingTemplateFragment) => void
}

interface Values extends StepsValues {
  title: string
}

const resolver = yupResolver(
  yup.object().shape({
    title: nameSchema.required(),
    stepsConfig: stepsConfigSchema,
  })
)

export default function MeetingTemplateEditModal({
  meetingTemplate,
  onCreate,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { orgId } = useOrgContext()
  const [createMeetingTemplate] = useCreateMeetingTemplateMutation()
  const [updateMeetingTemplate] = useUpdateMeetingTemplateMutation()

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver,
    defaultValues: meetingTemplate
      ? {
          title: meetingTemplate.title,
          stepsConfig: meetingTemplate.stepsConfig,
        }
      : {
          title: '',
          stepsConfig: [],
        },
  })

  // Submit
  const onSubmit = handleSubmit(async (meetingUpdate) => {
    if (!orgId) return
    if (meetingTemplate) {
      // Update meeting
      await updateMeetingTemplate({
        variables: { id: meetingTemplate.id, values: meetingUpdate },
      })

      toast({
        title: t('MeetingTemplateEditModal.toastUpdated'),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } else {
      // Create meeting
      const { data } = await createMeetingTemplate({
        variables: {
          values: {
            orgId,
            ...meetingUpdate,
          },
        },
      })
      const newTemplate = data?.insert_meeting_template_one
      if (newTemplate && onCreate) {
        onCreate(newTemplate)
      }

      toast({
        title: t('MeetingTemplateEditModal.toastCreated'),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    }
    modalProps.onClose()
  })

  // Delete modal
  const deleteModal = useDisclosure()

  return (
    <Modal size="xl" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <form>
          <ModalHeader>
            {t(
              meetingTemplate
                ? 'MeetingTemplateEditModal.headingEdit'
                : 'MeetingTemplateEditModal.headingCreate'
            )}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={5} align="stretch">
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>{t('MeetingTemplateEditModal.title')}</FormLabel>
                <Input
                  {...register('title')}
                  placeholder={t('MeetingTemplateEditModal.titlePlaceholder')}
                  autoFocus
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('MeetingTemplateEditModal.steps')}</FormLabel>
                <MeetingStepsConfigController
                  control={control as any}
                  errors={errors}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            {meetingTemplate && (
              <Button
                colorScheme="red"
                variant="ghost"
                mr={2}
                onClick={deleteModal.onOpen}
              >
                {t('common.delete')}
              </Button>
            )}
            <Button colorScheme="blue" onClick={onSubmit}>
              {t(meetingTemplate ? 'common.save' : 'common.create')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>

      {deleteModal.isOpen && meetingTemplate && (
        <MeetingTemplateDeleteModal
          meetingTemplate={meetingTemplate}
          isOpen
          onDelete={modalProps.onClose}
          onClose={deleteModal.onClose}
        />
      )}
    </Modal>
  )
}
