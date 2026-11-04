import i18next from 'i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

export const defaultLang = 'fr'
export const resources = {
  fr: {
    translation: fr,
  },
  en: {
    translation: en,
  },
}

i18next.init({
  lng: defaultLang,
  resources,
  interpolation: {
    escapeValue: false,
  },
})

// The webapp compiles this file through the tRPC types and declares its own
// keys on the 'i18next' module, so keys stay free-form here
type Translate = (key: string, options?: Record<string, unknown>) => string

export default i18next as unknown as Omit<typeof i18next, 't'> & {
  t: Translate
}
export const locales = resources
