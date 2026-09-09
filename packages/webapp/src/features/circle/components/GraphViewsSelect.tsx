import { CirclesGraphViews } from '@/graph/types'
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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'

interface Props extends Omit<ButtonProps, 'value' | 'onChange'> {
  value: CirclesGraphViews
  onChange: (view: CirclesGraphViews) => void
}

export const viewsList = [
  CirclesGraphViews.AllCircles,
  CirclesGraphViews.SimpleCircles,
  CirclesGraphViews.HierarchyAll,
  CirclesGraphViews.HierarchySimple,
  CirclesGraphViews.FlatCircle,
  CirclesGraphViews.Members,
]

export default function GraphViewsSelect({
  value,
  onChange,
  ...buttonProps
}: Props) {
  const { t } = useTranslation()

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon size="1em" />}
        {...buttonProps}
      >
        {t(`GraphViewsSelect.${value}` as any)}
      </MenuButton>

      <MenuList zIndex={2000} shadow="md" maxW="330px">
        <MenuOptionGroup type="radio" value={value}>
          {viewsList.map((view) => (
            <MenuItemOption
              key={view}
              value={view}
              alignItems="start"
              pt={2}
              onClick={() => onChange(view)}
            >
              <Flex flexDirection="column" alignItems="left" mt={-2} mb={2}>
                <Text fontWeight="bold">
                  {t(`GraphViewsSelect.${view}` as any)}
                </Text>
                <Text fontSize="sm">
                  {t(`GraphViewsSelect.${view}_desc` as any)}
                </Text>
              </Flex>
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
