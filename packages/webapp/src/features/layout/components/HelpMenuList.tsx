import { MenuDivider, MenuItem, MenuList } from '@chakra-ui/react'
import { Crisp } from 'crisp-sdk-web'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FileIcon, HelpIcon } from 'src/icons'
import settings from 'src/settings'

// Languages the website documentation is actually translated into. The
// webapp may ship more locales than the website, so fall back to English.
const docsLangs = ['en', 'fr']

export default function HelpMenuList() {
  const { t, i18n } = useTranslation()

  // Documentation is on the website, in the user's language
  const lang = i18n.language.split('-')[0]
  const docsLang = docsLangs.includes(lang) ? lang : 'en'

  const handleContact = () => {
    if (Crisp.chat.isVisible()) {
      Crisp.chat.hide()
    } else {
      Crisp.chat.show()
      Crisp.chat.open()
    }
  }

  return (
    <MenuList zIndex={10} shadow="lg">
      <MenuItem
        as="a"
        href={`${settings.websiteUrl}/${docsLang}/docs`}
        target="_blank"
        rel="noopener noreferrer"
        icon={<FileIcon size={20} />}
      >
        {t('HelpMenu.documentation')}
      </MenuItem>

      <MenuDivider />

      <MenuItem icon={<HelpIcon size={20} />} onClick={handleContact}>
        {t('HelpMenu.contact')}
      </MenuItem>
    </MenuList>
  )
}
