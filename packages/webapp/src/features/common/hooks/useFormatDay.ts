import { format, isToday, isTomorrow } from 'date-fns'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useDateLocale from './useDateLocale'

// Day label: today, tomorrow, or weekday and date
export default function useFormatDay() {
  const { t } = useTranslation()
  const dateLocale = useDateLocale()

  return useCallback(
    (date: Date) =>
      isToday(date)
        ? t('common.dates.today')
        : isTomorrow(date)
          ? t('common.dates.tomorrow')
          : format(
              date,
              date.getFullYear() !== new Date().getFullYear()
                ? 'eeee P'
                : 'eeee dd/MM',
              { locale: dateLocale }
            ),
    [t, dateLocale]
  )
}
