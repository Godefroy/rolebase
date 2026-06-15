import {
  Button,
  ButtonProps,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from '@chakra-ui/react'
import { Governance_Mode_Enum } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'

interface Props extends Omit<ButtonProps, 'value' | 'onChange'> {
  value: Governance_Mode_Enum
  onChange: (mode: Governance_Mode_Enum) => void
}

const governanceModes = [
  {
    value: Governance_Mode_Enum.Free,
    labelKey: 'OrgEditModal.governanceFree',
    helpKey: 'OrgEditModal.governanceFreeHelp',
  },
  {
    value: Governance_Mode_Enum.Agile,
    labelKey: 'OrgEditModal.governanceAgile',
    helpKey: 'OrgEditModal.governanceAgileHelp',
  },
  {
    value: Governance_Mode_Enum.Strict,
    labelKey: 'OrgEditModal.governanceStrict',
    helpKey: 'OrgEditModal.governanceStrictHelp',
  },
] as const

export default function GovernanceModeSelect({
  value,
  onChange,
  ...buttonProps
}: Props) {
  const { t } = useTranslation()
  const current = governanceModes.find((mode) => mode.value === value)

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon size="1em" />}
        {...buttonProps}
      >
        {t((current ?? governanceModes[0]).labelKey)}
      </MenuButton>

      <MenuList zIndex={2000} shadow="md" maxW="330px">
        <MenuOptionGroup type="radio" value={value}>
          {governanceModes.map(({ value: mode, labelKey, helpKey }) => (
            <MenuItemOption
              key={mode}
              value={mode}
              alignItems="start"
              pt={2}
              onClick={() => onChange(mode)}
            >
              <Flex flexDirection="column" alignItems="left" mt={-2} mb={2}>
                <Text fontWeight="bold">{t(labelKey)}</Text>
                <Text fontSize="sm">{t(helpKey)}</Text>
              </Flex>
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
