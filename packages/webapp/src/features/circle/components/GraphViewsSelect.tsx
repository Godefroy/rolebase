import { CirclesGraphViews } from '@/graph/types'
import {
  Button,
  ButtonProps,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from '@chakra-ui/react'
import { GraphView } from '@rolebase/shared/model/graph'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'

interface Props extends Omit<ButtonProps, 'value' | 'onChange'> {
  value: GraphView
  onChange: (value: GraphView) => void
}

const viewsList = [
  CirclesGraphViews.Circles,
  CirclesGraphViews.Tree,
  CirclesGraphViews.Members,
]

export default function GraphViewsSelect({
  value,
  onChange,
  ...buttonProps
}: Props) {
  const { t } = useTranslation()

  const { view, folded } = value
  // The members view shows the whole organization by definition
  const foldable = view !== CirclesGraphViews.Members

  const label = t(`GraphViewsSelect.${view}` as any)

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon size="1em" />}
        {...buttonProps}
      >
        {foldable && folded
          ? t('GraphViewsSelect.foldedLabel', { view: label })
          : label}
      </MenuButton>

      <MenuList zIndex={2000} shadow="md" maxW="330px">
        <MenuOptionGroup type="radio" value={view}>
          {viewsList.map((itemView) => (
            <MenuItemOption
              key={itemView}
              value={itemView}
              alignItems="start"
              pt={2}
              onClick={() => onChange({ view: itemView, folded })}
            >
              <Flex flexDirection="column" alignItems="left" mt={-2} mb={2}>
                <Text fontWeight="bold">
                  {t(`GraphViewsSelect.${itemView}` as any)}
                </Text>
                <Text fontSize="sm">
                  {t(`GraphViewsSelect.${itemView}_desc` as any)}
                </Text>
              </Flex>
            </MenuItemOption>
          ))}
        </MenuOptionGroup>

        {foldable && (
          <>
            <MenuDivider />
            <MenuOptionGroup type="checkbox" value={folded ? ['folded'] : []}>
              <MenuItemOption
                value="folded"
                alignItems="start"
                pt={2}
                closeOnSelect={false}
                onClick={() => onChange({ view, folded: !folded })}
              >
                <Flex flexDirection="column" alignItems="left" mt={-2} mb={2}>
                  <Text fontWeight="bold">{t('GraphViewsSelect.folded')}</Text>
                  <Text fontSize="sm">{t('GraphViewsSelect.folded_desc')}</Text>
                </Flex>
              </MenuItemOption>
            </MenuOptionGroup>
          </>
        )}
      </MenuList>
    </Menu>
  )
}
