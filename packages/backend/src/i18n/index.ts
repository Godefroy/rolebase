import i18next from 'i18next'
import de from './locales/de.json'
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
  de: {
    translation: de,
  },
}

// Full typing
// https://www.i18next.com/overview/typescript#custom-type-options
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['fr']
  }
}

i18next.init({
  lng: defaultLang,
  resources,
  interpolation: {
    escapeValue: false,
  },
})

export default i18next
export const locales = resources
