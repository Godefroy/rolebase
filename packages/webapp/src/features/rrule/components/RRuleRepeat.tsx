import NumberInput from '@/common/atoms/NumberInput'
import { HStack, Select } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Frequency } from 'rrule/dist/esm/types'
import { FormRow } from './FormRow'
import { FormPartProps } from './RRuleEditor'

const freqs = [
  Frequency.DAILY,
  Frequency.WEEKLY,
  Frequency.MONTHLY,
  Frequency.YEARLY,
]

export default function RRuleRepeat({ options, onChange }: FormPartProps) {
  const { t } = useTranslation()

  return (
    <FormRow label={t('RRuleEditor.repeat')}>
      <HStack>
        <NumberInput
          min={1}
          value={options.interval ?? 1}
          onChange={(interval) => onChange({ interval })}
        />

        <Select
          value={options.freq ?? Frequency.MONTHLY}
          onChange={(e) => onChange({ freq: +e.target.value })}
        >
          {freqs.map((freq) => (
            <option key={freq} value={freq}>
              {t(`RRuleEditor.freqs.${Frequency[freq]}` as any, {
                count: options.interval ?? 1,
              })}
            </option>
          ))}
        </Select>
      </HStack>
    </FormRow>
  )
}
