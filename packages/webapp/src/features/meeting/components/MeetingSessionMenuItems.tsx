import { MenuItem } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CancelIcon, EditIcon, PlayIcon } from 'src/icons'
import { MeetingContext } from '../contexts/MeetingContext'

// Session controls of the meeting view menu (they need the live meeting state)
export default function MeetingSessionMenuItems() {
  const { t } = useTranslation()
  const {
    forceEdit,
    isStarted,
    isEnded,
    handleNextStep,
    handleCancelStart,
    handleChangeForceEdit,
  } = useContext(MeetingContext)!

  return (
    <>
      {isEnded && !forceEdit && (
        <MenuItem
          icon={<EditIcon size={20} />}
          onClick={() => handleChangeForceEdit(true)}
        >
          {t('MeetingActionsMenu.forceEdit')}
        </MenuItem>
      )}

      {isStarted && (
        <MenuItem icon={<CancelIcon size={20} />} onClick={handleCancelStart}>
          {t('MeetingActionsMenu.cancelStart')}
        </MenuItem>
      )}

      {isEnded && (
        <MenuItem icon={<PlayIcon size={20} />} onClick={handleNextStep}>
          {t('MeetingActionsMenu.restart')}
        </MenuItem>
      )}
    </>
  )
}
