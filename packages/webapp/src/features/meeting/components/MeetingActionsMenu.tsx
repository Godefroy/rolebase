import useCopyUrl from '@/common/hooks/useCopyUrl'
import useOrgMember from '@/member/hooks/useOrgMember'
import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { useUpdateMeetingMutation } from '@gql'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CancelIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  LinkIcon,
  MoreIcon,
  PlayIcon,
  RestoreIcon,
  SettingsIcon,
} from 'src/icons'
import settings from 'src/settings'
import { MeetingContext } from '../contexts/MeetingContext'

interface Props extends Omit<IconButtonProps, 'aria-label'> {
  onEdit(): void
  onDuplicate(): void
}

export default function MeetingActionsMenu({
  onEdit,
  onDuplicate,
  ...buttonProps
}: Props) {
  const { t } = useTranslation()
  const [updateMeeting] = useUpdateMeetingMutation()
  const isMember = useOrgMember()

  const {
    meeting,
    path,
    canEdit,
    forceEdit,
    isStarted,
    isEnded,
    handleNextStep,
    handleCancelStart,
    handleChangeForceEdit,
  } = useContext(MeetingContext)!

  // Archive / unarchive
  const setArchive = (archived: boolean) => {
    if (!meeting) return
    updateMeeting({
      variables: {
        id: meeting.id,
        values: { archivedAt: archived ? new Date().toISOString() : null },
      },
    })
  }
  const handleCopyLink = useCopyUrl(`${settings.url}${path}`)
  const handleArchive = () => setArchive(true)
  const handleUnarchive = () => setArchive(false)

  return (
    <Menu isLazy>
      <MenuButton
        aria-label={t('ActionsMenu.label')}
        as={IconButton}
        icon={<MoreIcon size={20} />}
        variant="ghost"
        size="sm"
        {...buttonProps}
      />

      <MenuList
        fontFamily="body"
        fontSize="1rem"
        fontWeight="normal"
        shadow="lg"
        zIndex={1000}
      >
        {canEdit && (
          <>
            <MenuItem icon={<SettingsIcon size={20} />} onClick={onEdit}>
              {t('MeetingActionsMenu.edit')}
            </MenuItem>

            {isEnded && !forceEdit && (
              <MenuItem
                icon={<EditIcon size={20} />}
                onClick={() => handleChangeForceEdit(true)}
              >
                {t('MeetingActionsMenu.forceEdit')}
              </MenuItem>
            )}

            {isStarted && (
              <MenuItem
                icon={<CancelIcon size={20} />}
                onClick={handleCancelStart}
              >
                {t('MeetingActionsMenu.cancelStart')}
              </MenuItem>
            )}

            {isEnded && (
              <MenuItem icon={<PlayIcon size={20} />} onClick={handleNextStep}>
                {t('MeetingActionsMenu.restart')}
              </MenuItem>
            )}
          </>
        )}

        {isMember && (
          <MenuItem icon={<CopyIcon size={20} />} onClick={onDuplicate}>
            {t('common.duplicate')}
          </MenuItem>
        )}

        <MenuItem icon={<LinkIcon size={20} />} onClick={handleCopyLink}>
          {t('common.copyLink')}
        </MenuItem>

        {canEdit && (
          <>
            {!meeting?.archivedAt && !isStarted && (
              <MenuItem icon={<DeleteIcon size={20} />} onClick={handleArchive}>
                {t('common.delete')}
              </MenuItem>
            )}

            {meeting?.archivedAt && (
              <MenuItem
                icon={<RestoreIcon size={20} />}
                onClick={handleUnarchive}
              >
                {t('common.unarchive')}
              </MenuItem>
            )}
          </>
        )}
      </MenuList>
    </Menu>
  )
}
