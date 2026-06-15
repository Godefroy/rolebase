import ListItemWithButtons from '@/common/atoms/ListItemWithButtons'
import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  UseModalProps,
} from '@chakra-ui/react'
import { MeetingTemplateFragment, useMeetingTemplatesSubscription } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'
import MeetingTemplateEditModal from './MeetingTemplateEditModal'

export default function MeetingTemplateListModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()

  // Subscribe to templates
  const { data, loading, error } = useMeetingTemplatesSubscription({
    skip: !orgId,
    variables: { orgId: orgId! },
  })
  const meetingTemplates = data?.meeting_template

  // Create/Edit modal
  const [meetingTemplate, setMeetingTemplate] = useState<
    MeetingTemplateFragment | undefined
  >()
  const editModal = useDisclosure()

  const handleCreate = () => {
    setMeetingTemplate(undefined)
    editModal.onOpen()
  }

  const handleEdit = (mt: MeetingTemplateFragment) => {
    setMeetingTemplate(mt)
    editModal.onOpen()
  }

  return (
    <>
      <Modal {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('MeetingTemplateListModal.heading')}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={5}>
            {loading && <Loading active size="md" />}
            <TextErrors errors={[error]} />

            <Box textAlign="center" mb={7}>
              <Button
                leftIcon={<CreateIcon size={20} />}
                onClick={handleCreate}
              >
                {t('MeetingTemplateListModal.create')}
              </Button>
            </Box>

            {!loading && !meetingTemplates?.length ? (
              <Text fontStyle="italic" textAlign="center">
                {t('MeetingTemplateListModal.empty')}
              </Text>
            ) : (
              meetingTemplates?.map((mt) => (
                <ListItemWithButtons key={mt.id} onClick={() => handleEdit(mt)}>
                  {mt.title}
                </ListItemWithButtons>
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {editModal.isOpen && (
        <MeetingTemplateEditModal
          meetingTemplate={meetingTemplate}
          isOpen
          onClose={editModal.onClose}
        />
      )}
    </>
  )
}
