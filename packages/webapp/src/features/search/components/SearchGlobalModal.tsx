import Loading from '@/common/atoms/Loading'
import { useIdleCallback } from '@/common/hooks/useIdleCallback'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  UseModalProps,
  useColorMode,
} from '@chakra-ui/react'
import { SearchTypes } from '@rolebase/shared/model/search'
import { UseComboboxStateChange, useCombobox } from 'downshift'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAlgoliaSearch } from '../hooks/useAlgoliaSearch'
import { SearchItem } from '../searchTypes'
import { searchIcons } from './SearchResultIcon'
import SearchResultItem from './SearchResultItem'

const maxDisplayedItems = 50

const searchTypes = [
  SearchTypes.Member,
  SearchTypes.Circle,
  SearchTypes.Thread,
  SearchTypes.Meeting,
  SearchTypes.Task,
  SearchTypes.Decision,
] as const

export default function SearchGlobalModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { org } = useOrgContext()
  const navigateOrg = useNavigateOrg()

  // Search
  const [type, setType] = useState<(typeof searchTypes)[number] | undefined>()
  const { items, search, loading } = useAlgoliaSearch()

  // Search when input value changes
  const onInputValueChange = useIdleCallback(
    ({ inputValue }: UseComboboxStateChange<SearchItem>) =>
      search(inputValue || '', type),
    [search, type]
  )

  const onSelectedItemChange = useCallback(
    (changes: UseComboboxStateChange<SearchItem>) => {
      const item = changes.selectedItem
      if (!item) return
      modalProps.onClose()
      if (item.type === SearchTypes.Member) {
        navigateOrg(`roles?memberId=${item.id}`)
      } else if (item.type === SearchTypes.Circle) {
        navigateOrg(`roles?circleId=${item.id}`)
      } else if (item.type === SearchTypes.Thread) {
        navigateOrg(`threads/${item.id}`)
      } else if (item.type === SearchTypes.Meeting) {
        navigateOrg(`meetings/${item.id}`)
      } else if (item.type === SearchTypes.Task) {
        navigateOrg(`tasks/${item.id}`)
      } else if (item.type === SearchTypes.Decision) {
        navigateOrg(`decisions/${item.id}`)
      }
    },
    []
  )

  const {
    highlightedIndex,
    getMenuProps,
    getInputProps,
    getItemProps,
    inputValue,
  } = useCombobox({
    items,
    itemToString: () => '',
    defaultHighlightedIndex: 0,
    onInputValueChange,
    onSelectedItemChange,
  })
  const noResult = !loading && inputValue !== '' && items.length === 0

  // Update search when type changes
  useEffect(() => {
    search(inputValue, type)
  }, [type])

  // Icon of selected type
  const TypeIcon = type && searchIcons[type]

  return (
    <Modal size="lg" closeOnEsc {...modalProps}>
      <ModalOverlay />
      <ModalContent p={5} bg="white" _dark={{ bg: 'gray.800' }}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder={t('SearchGlobalModal.placeholder', {
              org: org?.name,
            })}
            borderRadius="md"
            background={colorMode === 'light' ? 'white' : 'gray.800'}
            {...getInputProps(
              {
                onKeyDown(event) {
                  if (event.key === 'Escape') {
                    ;(event as any).preventDownshiftDefault = true
                  }
                },
              },
              { suppressRefError: true }
            )}
          />
        </InputGroup>

        <HStack mt={2}>
          <Text>{t('SearchGlobalModal.in')}</Text>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              size="sm"
              leftIcon={TypeIcon ? <TypeIcon size={20} /> : undefined}
              rightIcon={<ChevronDownIcon />}
            >
              {t(`common.searchTypes.${type || 'All'}`)}
            </MenuButton>
            <MenuList>
              <MenuItem key="All" onClick={() => setType(undefined)}>
                {t(`common.searchTypes.All`)}
              </MenuItem>
              {searchTypes.map((buttonType) => {
                const Icon = searchIcons[buttonType]
                return (
                  <MenuItem
                    key={buttonType}
                    icon={<Icon size={20} />}
                    onClick={() => setType(buttonType)}
                  >
                    {t(`common.searchTypes.${buttonType}`)}
                  </MenuItem>
                )
              })}
            </MenuList>
          </Menu>
        </HStack>

        <List
          mt={3}
          mx={-5}
          {...getMenuProps({}, { suppressRefError: true })}
          display={!loading && items.length > 0 ? undefined : 'none'}
        >
          {items.slice(0, maxDisplayedItems).map((item, index) => (
            <ListItem key={index} mb={1}>
              <SearchResultItem
                item={item}
                highlighted={index === highlightedIndex}
                highlightedBg={
                  colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
                }
                size="sm"
                w="100%"
                h="auto"
                whiteSpace="break-spaces"
                py={2}
                px={5}
                bg="transparent"
                borderRadius="none"
                {...getItemProps({ item, index })}
              />
            </ListItem>
          ))}
        </List>
        {loading ? (
          <Loading active size="sm" />
        ) : (
          noResult && (
            <Text color="gray.500" fontSize="sm" textAlign="center" mt={3}>
              {t('SearchGlobalModal.noResults')}
            </Text>
          )
        )}
      </ModalContent>
    </Modal>
  )
}
