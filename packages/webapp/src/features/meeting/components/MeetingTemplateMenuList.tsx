import IconTextButton from '@/common/atoms/IconTextButton'
import {
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { MeetingTemplateFragment } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, EditIcon } from 'src/icons'
import MeetingTemplateEditModal from '../modals/MeetingTemplateEditModal'

interface Props {
  meetingTemplates?: MeetingTemplateFragment[]
  onSelect: (template: MeetingTemplateFragment) => void
}

export default function MeetingTemplateMenuList({
  meetingTemplates,
  onSelect,
}: Props) {
  const { t } = useTranslation()

  // Meeting templates modal
  const [meetingTemplate, setMeetingTemplate] =
    useState<MeetingTemplateFragment>()
  const editModal = useDisclosure()

  const handleCreate = () => {
    setMeetingTemplate(undefined)
    editModal.onOpen()
  }

  const handleEdit = (template: MeetingTemplateFragment) => {
    setMeetingTemplate(template)
    editModal.onOpen()
  }

  return (
    <>
      <MenuList shadow="lg" zIndex={2000} maxH="390px" overflow="auto">
        {meetingTemplates?.map((template) => (
          <MenuItem
            key={template.id}
            icon={
              <IconTextButton
                aria-label={t('common.edit')}
                icon={<EditIcon size={18} />}
                size="sm"
                variant="outline"
                mr="-0.75rem"
                onClick={(event) => {
                  event.stopPropagation()
                  handleEdit(template)
                }}
              />
            }
            display="flex"
            flexDirection="row-reverse"
            onClick={() => onSelect(template)}
          >
            {template.title}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem icon={<CreateIcon size={20} />} onClick={handleCreate}>
          {t('MeetingTemplateMenuList.create')}
        </MenuItem>
      </MenuList>

      {editModal.isOpen && (
        <MeetingTemplateEditModal
          isOpen
          meetingTemplate={meetingTemplate}
          onCreate={onSelect}
          onClose={editModal.onClose}
        />
      )}
    </>
  )
}
