import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useAdminUsersQuery } from '@gql'
import {
  Button,
  Heading,
  HStack,
  Input,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import debounce from 'lodash.debounce'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImpersonateButton from '../components/ImpersonateButton'

const PAGE_SIZE = 50

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [offset, setOffset] = useState(0)

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value)
        setOffset(0)
      }, 300),
    []
  )

  const searchPattern = debouncedSearch ? `%${debouncedSearch}%` : '%'
  const { data, loading, error } = useAdminUsersQuery({
    variables: {
      limit: PAGE_SIZE,
      offset,
      search: searchPattern,
      searchCitext: searchPattern,
    },
  })

  const totalCount = data?.usersAggregate.aggregate?.count ?? 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSetSearch(e.target.value)
  }

  return (
    <>
      <Heading size="md" mb={6}>
        {t('SuperAdmin.users.heading')}
      </Heading>

      <Input
        placeholder={t('SuperAdmin.users.searchPlaceholder')}
        value={search}
        onChange={handleSearchChange}
        mb={4}
        maxW="400px"
      />

      {loading && <Loading active center />}
      {error && <TextError error={error} />}

      {data && (
        <>
          <Text mb={3} fontSize="sm" color="gray.500">
            {totalCount} {t('SuperAdmin.users.total')}
          </Text>

          <Table size="sm">
            <Thead>
              <Tr>
                <Th>{t('SuperAdmin.users.columns.name')}</Th>
                <Th>{t('SuperAdmin.users.columns.email')}</Th>
                <Th>{t('SuperAdmin.users.columns.created')}</Th>
                <Th>{t('SuperAdmin.users.columns.lastSeen')}</Th>
                <Th isNumeric>{t('SuperAdmin.users.columns.orgs')}</Th>
                <Th>{t('SuperAdmin.users.columns.status')}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <Text fontWeight="medium">
                      {user.displayName || '-'}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{user.email}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {user.lastSeen
                        ? new Date(user.lastSeen).toLocaleDateString()
                        : '-'}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    {user.members_aggregate.aggregate?.count ?? 0}
                  </Td>
                  <Td>
                    <Tag
                      size="sm"
                      colorScheme={user.disabled ? 'red' : 'green'}
                    >
                      {user.disabled
                        ? t('SuperAdmin.users.disabled')
                        : t('SuperAdmin.users.active')}
                    </Tag>
                  </Td>
                  <Td isNumeric>
                    {!user.disabled && (
                      <ImpersonateButton
                        userId={user.id}
                        userName={user.displayName || user.email || user.id}
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {totalCount > PAGE_SIZE && (
            <HStack mt={4} spacing={4} justify="center">
              <Button
                size="sm"
                isDisabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                {t('SuperAdmin.pagination.previous')}
              </Button>
              <Text fontSize="sm">
                {Math.floor(offset / PAGE_SIZE) + 1} /{' '}
                {Math.ceil(totalCount / PAGE_SIZE)}
              </Text>
              <Button
                size="sm"
                isDisabled={offset + PAGE_SIZE >= totalCount}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                {t('SuperAdmin.pagination.next')}
              </Button>
            </HStack>
          )}
        </>
      )}
    </>
  )
}
