import CopyLinkMenuItem from '@/common/atoms/actionsMenu/CopyLinkMenuItem'
import DeleteMenuItem from '@/common/atoms/actionsMenu/DeleteMenuItem'
import DuplicateMenuItem from '@/common/atoms/actionsMenu/DuplicateMenuItem'
import UnarchiveMenuItem from '@/common/atoms/actionsMenu/UnarchiveMenuItem'
import useOrgMember from '@/member/hooks/useOrgMember'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { MenuItem } from '@chakra-ui/react'
import { MeetingFragment, useUpdateMeetingMutation } from '@gql'
import React, { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SettingsIcon } from 'src/icons'
import settings from 'src/settings'
import MeetingEditModal from '../modals/MeetingEditModal'
import useMeetingPermissions from './useMeetingPermissions'

interface Options {
  // Items that only make sense in the meeting view (session controls),
  // inserted after the edit item
  sessionItems?: ReactNode
}

export interface MeetingActions {
  hasItems: boolean
  // Menu items, rendered in an ActionsMenu (content view) or ItemActionsMenu (card)
  items: ReactNode
  // Modals opened by the items, to render next to the menu
  modals: ReactNode
  openEdit(): void
}

// Actions on a meeting, shared by the meeting view header and the meeting cards
export default function useMeetingActions(
  meeting: MeetingFragment | undefined,
  { sessionItems }: Options = {}
): MeetingActions {
  const { t } = useTranslation()
  const isMember = useOrgMember()
  const { canEdit } = useMeetingPermissions(meeting)
  const path = usePathInOrg(`meetings/${meeting?.id}`)
  const [updateMeeting] = useUpdateMeetingMutation()
  const [modal, setModal] = useState<'edit' | 'duplicate' | undefined>()
  const handleModalClose = () => setModal(undefined)

  const isStarted =
    !!meeting && !meeting.ended && meeting.currentStepId !== null

  // Archive / unarchive
  const setArchived = (archived: boolean) => {
    if (!meeting) return
    updateMeeting({
      variables: {
        id: meeting.id,
        values: { archivedAt: archived ? new Date().toISOString() : null },
      },
    })
  }

  // Edition is for members only
  const openEdit = () => {
    if (isMember) setModal('edit')
  }

  return {
    hasItems: !!meeting,
    items: meeting && (
      <>
        {canEdit && (
          <>
            <MenuItem icon={<SettingsIcon size={20} />} onClick={openEdit}>
              {t('MeetingActionsMenu.edit')}
            </MenuItem>
            {sessionItems}
          </>
        )}

        {isMember && (
          <DuplicateMenuItem onClick={() => setModal('duplicate')} />
        )}

        <CopyLinkMenuItem url={`${settings.url}${path}`} />

        {canEdit && !meeting.archivedAt && !isStarted && (
          <DeleteMenuItem onClick={() => setArchived(true)} />
        )}
        {canEdit && meeting.archivedAt && (
          <UnarchiveMenuItem onClick={() => setArchived(false)} />
        )}
      </>
    ),
    modals: meeting && modal && (
      <MeetingEditModal
        meeting={meeting}
        duplicate={modal === 'duplicate'}
        isOpen
        onClose={handleModalClose}
      />
    ),
    openEdit,
  }
}
