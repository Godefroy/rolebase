import i18n from '@rolebase/backend/src/i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import fr from './locales/fr.json'

i18n.addResourceBundle('fr', 'emails', fr)
i18n.addResourceBundle('en', 'emails', en)
i18n.addResourceBundle('de', 'emails', de)

export default i18n
export { locales } from '@rolebase/backend/src/i18n'
