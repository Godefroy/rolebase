import { Locale } from 'date-fns'
import { de, enUS, fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n'

const dateLocales: Record<keyof typeof locales, Locale> = {
  fr,
  en: enUS,
  de,
}

export default function useDateLocale(): Locale {
  const {
    i18n: { language },
  } = useTranslation()
  return dateLocales[language as keyof typeof locales]
}
