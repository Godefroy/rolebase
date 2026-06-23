import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import ChoiceCard from './ChoiceCard'
import { ChoiceOption } from './OnboardingChoiceGroup'

interface Props {
  options: ChoiceOption[]
  value: string[]
  onChange: (value: string[]) => void
  ariaLabel: string
  columns?: 1 | 2
}

// Multi-select option cards (a group of checkboxes) for the onboarding wizard.
export default function OnboardingMultiChoiceGroup({
  options,
  value,
  onChange,
  ariaLabel,
  columns = 2,
}: Props) {
  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    )
  }

  return (
    <SimpleGrid columns={columns} spacing={2.5} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          label={option.label}
          description={option.description}
          selected={value.includes(option.value)}
          multi
          onToggle={() => toggle(option.value)}
        />
      ))}
    </SimpleGrid>
  )
}
