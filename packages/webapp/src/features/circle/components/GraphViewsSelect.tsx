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
  // Offer the members option, on by default. The share panel leaves it out:
  // publishing the members is a setting of the organization, not of a link.
  membersOption?: boolean
}

const viewsList = [
  CirclesGraphViews.Circles,
  CirclesGraphViews.Tree,
  CirclesGraphViews.Members,
]

export default function GraphViewsSelect({
  value,
  onChange,
  membersOption = true,
  ...buttonProps
}: Props) {
  const { t } = useTranslation()

  const { view, folded, members } = value
  // The members view shows the whole organization by definition, and is made
  // of members: neither option applies to it
  const optionable = view !== CirclesGraphViews.Members

  const label = t(`GraphViewsSelect.${view}` as any)

  const options: string[] = []
  if (optionable && folded) options.push('folded')
  if (optionable && membersOption && members) options.push('members')

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon size="1em" />}
        {...buttonProps}
      >
        {optionable && folded
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
              onClick={() => onChange({ view: itemView, folded, members })}
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

        {optionable && (
          <>
            {/* The view descriptions are tall: a hairline gets lost between
                them */}
            <MenuDivider
              my={3}
              opacity={1}
              borderBottomWidth="2px"
              borderColor="gray.200"
              _dark={{ borderColor: 'gray.550' }}
            />
            <MenuOptionGroup type="checkbox" value={options}>
              <MenuItemOption
                value="folded"
                alignItems="start"
                pt={2}
                closeOnSelect={false}
                onClick={() => onChange({ view, folded: !folded, members })}
              >
                <Flex flexDirection="column" alignItems="left" mt={-2} mb={2}>
                  <Text fontWeight="bold">{t('GraphViewsSelect.folded')}</Text>
                  <Text fontSize="sm">{t('GraphViewsSelect.folded_desc')}</Text>
                </Flex>
              </MenuItemOption>

              {membersOption && (
                <MenuItemOption
                  value="members"
                  alignItems="start"
                  pt={2}
                  closeOnSelect={false}
                  onClick={() => onChange({ view, folded, members: !members })}
                >
                  <Flex flexDirection="column" alignItems="left" mt={-2} mb={2}>
                    <Text fontWeight="bold">
                      {t('GraphViewsSelect.members')}
                    </Text>
                    <Text fontSize="sm">
                      {t('GraphViewsSelect.members_desc')}
                    </Text>
                  </Flex>
                </MenuItemOption>
              )}
            </MenuOptionGroup>
          </>
        )}
      </MenuList>
    </Menu>
  )
}
