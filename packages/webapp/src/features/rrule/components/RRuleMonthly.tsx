import { HStack, Radio, RadioGroup, Select, Text } from '@chakra-ui/react'
import { range } from '@utils/range'
import { fromZonedTime } from 'date-fns-tz'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useI18nDays from '../hooks/useI18nDays'
import { FormRow } from './FormRow'
import { FormPartProps } from './RRuleEditor'

enum Choices {
  monthday = 'monthday',
  weekday = 'weekday',
}

export default function RRuleMonthly({ options, onChange }: FormPartProps) {
  const { t } = useTranslation()

  const startDate = useMemo(
    () =>
      options.dtstart
        ? fromZonedTime(options.dtstart, options.tzid || 'UTC')
        : new Date(),
    [options.dtstart]
  )

  const defaultMonthday = useMemo(() => startDate.getDate(), [startDate])

  const defaultWeekday = useMemo(
    () => (startDate.getDay() + 6) % 7,
    [startDate]
  )

  const defaultSetpos = useMemo(() => {
    const setpos = Math.floor((defaultMonthday - 1) / 7) + 1
    return setpos === 5 ? -1 : setpos
  }, [defaultMonthday])

  const isMonthday = !!options.bymonthday?.length
  const isWeekday = !!(options.byweekday?.length || options.bysetpos?.length)

  return (
    <FormRow label={t('RRuleEditor.bymonthday')}>
      <RadioGroup
        value={isMonthday ? Choices.monthday : isWeekday ? Choices.weekday : ''}
        onChange={(mode) => {
          if (mode === Choices.monthday) {
            onChange({
              bymonthday: [defaultMonthday],
              bysetpos: [],
              byweekday: [],
            })
          } else {
            onChange({
              bymonthday: [],
              bysetpos: [defaultSetpos],
              byweekday: [defaultWeekday],
            })
          }
        }}
      >
        <HStack mb={1}>
          <Radio value={Choices.monthday} />
          <Select
            value={options.bymonthday?.toString() || 1}
            w="80px"
            onChange={(e) =>
              onChange({
                bymonthday: [+e.target.value],
                bysetpos: [],
                byweekday: [],
              })
            }
          >
            {range(1, 31).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
          <Text>{t('RRuleEditor.bymonthday-suffix')}</Text>
        </HStack>

        <HStack>
          <Radio value={Choices.weekday} />
          <SelectBysetpos options={options} onChange={onChange} />
          <SelectByweekday options={options} onChange={onChange} />
        </HStack>
      </RadioGroup>
    </FormRow>
  )
}

function SelectBysetpos({ options, onChange }: FormPartProps) {
  const { t } = useTranslation()
  return (
    <Select
      value={options.bysetpos?.[0] || 1}
      onChange={(e) =>
        onChange({
          bymonthday: [],
          bysetpos: [+e.target.value],
          byweekday: options.byweekday || [0],
        })
      }
    >
      {[1, 2, 3, 4, -1].map((pos) => (
        <option key={pos} value={pos}>
          {t(`RRuleEditor.bysetpos.${pos}` as any)}
        </option>
      ))}
    </Select>
  )
}

function SelectByweekday({ options, onChange }: FormPartProps) {
  const i18nDays = useI18nDays()

  return (
    <Select
      value={options.byweekday?.[0] || 0}
      onChange={(e) =>
        onChange({
          bymonthday: [],
          bysetpos: options.bysetpos || [1],
          byweekday: [+e.target.value],
        })
      }
    >
      {i18nDays.map((day, index) => (
        <option key={index} value={index}>
          {day}
        </option>
      ))}
    </Select>
  )
}
