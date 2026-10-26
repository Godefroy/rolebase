import { Code, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { Trans } from 'react-i18next'

interface Props {
  expected: string
  value: string
  onChange(value: string): void
}

// Asks to type a name to confirm a deletion
export default function DeletionConfirmInput({
  expected,
  value,
  onChange,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value)

  return (
    <FormControl>
      <FormLabel fontSize="sm">
        <Trans
          i18nKey="Deletion.confirm"
          values={{ expected }}
          components={{ b: <Code colorScheme="red" fontSize="sm" /> }}
        />
      </FormLabel>
      <Input
        value={value}
        onChange={handleChange}
        autoComplete="off"
        spellCheck={false}
        focusBorderColor="red.400"
        aria-label={expected}
      />
    </FormControl>
  )
}
