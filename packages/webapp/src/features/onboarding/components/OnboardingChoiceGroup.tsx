import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import ChoiceCard from './ChoiceCard'

export interface ChoiceOption {
  value: string
  label: string
  description?: string
}

interface Props {
  options: ChoiceOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  columns?: 1 | 2
}

// Single-select option cards (a radio group) for the onboarding wizard.
export default function OnboardingChoiceGroup({
  options,
  value,
  onChange,
  ariaLabel,
  columns = 2,
}: Props) {
  return (
    <SimpleGrid
      columns={columns}
      spacing={2.5}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          label={option.label}
          description={option.description}
          selected={value === option.value}
          onToggle={() => onChange(option.value)}
        />
      ))}
    </SimpleGrid>
  )
}
