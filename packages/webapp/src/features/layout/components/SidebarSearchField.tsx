import { Flex, Kbd, Spacer, Text } from '@chakra-ui/react'
import { cmdOrCtrlKey } from '@utils/env'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchIcon } from 'src/icons'

interface Props {
  showShortcut?: boolean
  onClick: () => void
}

// Looks like a search input, opens the search modal
export default function SidebarSearchField({ showShortcut, onClick }: Props) {
  const { t } = useTranslation()

  return (
    <Flex
      as="button"
      type="button"
      aria-label={t('Sidebar.search')}
      onClick={onClick}
      w="100%"
      h="38px"
      px={4}
      mb={2}
      align="center"
      gap={3}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="blackAlpha.200"
      bg="whiteAlpha.700"
      color="gray.500"
      _hover={{ bg: 'white', borderColor: 'blackAlpha.300' }}
      _dark={{
        borderColor: 'whiteAlpha.200',
        bg: 'whiteAlpha.50',
        color: 'whiteAlpha.700',
        _hover: { bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.400' },
      }}
    >
      <SearchIcon size={19} />

      <Text fontSize="sm">{t('Sidebar.search')}</Text>

      <Spacer />

      {showShortcut && (
        <Kbd fontSize="xs" bg="transparent">
          {cmdOrCtrlKey} P
        </Kbd>
      )}
    </Flex>
  )
}
