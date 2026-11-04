import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

const defaultNS = 'translation'

const resources = {
  fr: {
    name: 'Français',
    emoji: '🇫🇷',
    translation: fr,
  },
  en: {
    name: 'English',
    emoji: '🇬🇧',
    translation: en,
  },
}

// Full typing for useTranslation
// https://www.i18next.com/overview/typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['fr']
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
export const locales = resources
export const langs = Object.keys(locales) as Array<keyof typeof locales>

export function getLocale(lang: string) {
  if (lang in locales) {
    return locales[lang as keyof typeof locales]
  }
  const shortLang = lang.split('-')[0]
  if (shortLang in locales) {
    return locales[shortLang as keyof typeof locales]
  }
  return {
    emoji: '',
    name: 'Language',
  }
}
