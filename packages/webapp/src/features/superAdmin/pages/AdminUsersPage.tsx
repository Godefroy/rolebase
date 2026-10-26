import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useAdminUsersQuery } from '@gql'
import {
  Avatar,
  Box,
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
import AdminPagination from '../components/AdminPagination'
import AdminTableRow from '../components/AdminTableRow'
import useAdminSelection from '../hooks/useAdminSelection'

const PAGE_SIZE = 50

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const { userId, openUser } = useAdminSelection()
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
                <Th>{t('SuperAdmin.users.columns.created')}</Th>
                <Th>{t('SuperAdmin.users.columns.lastSeen')}</Th>
                <Th isNumeric>{t('SuperAdmin.users.columns.orgs')}</Th>
                <Th>{t('SuperAdmin.users.columns.status')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((user) => (
                <AdminTableRow
                  key={user.id}
                  label={user.displayName || user.email || user.id}
                  isSelected={user.id === userId}
                  onSelect={() => openUser(user.id)}
                >
                  <Td>
                    <HStack spacing={3}>
                      <Avatar
                        name={user.displayName || user.email || undefined}
                        src={user.avatarUrl || undefined}
                        size="sm"
                      />
                      <Box minW={0}>
                        <Text fontWeight="medium" noOfLines={1}>
                          {user.displayName || '-'}
                        </Text>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {user.email}
                        </Text>
                      </Box>
                    </HStack>
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
                </AdminTableRow>
              ))}
            </Tbody>
          </Table>

          <AdminPagination
            offset={offset}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            onChange={setOffset}
          />
        </>
      )}
    </>
  )
}
