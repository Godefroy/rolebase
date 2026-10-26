import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useAdminOrgsQuery } from '@gql'
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Tab,
  Table,
  TabList,
  Tabs,
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
import AdminSubscriptionTag from '../components/AdminSubscriptionTag'
import AdminTableRow from '../components/AdminTableRow'
import useAdminSelection from '../hooks/useAdminSelection'

const PAGE_SIZE = 50

export default function AdminOrgsPage() {
  const { t } = useTranslation()
  const { orgId, openOrg } = useAdminSelection()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [archived, setArchived] = useState(false)

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value)
        setOffset(0)
      }, 300),
    []
  )

  const { data, loading, error } = useAdminOrgsQuery({
    variables: {
      limit: PAGE_SIZE,
      offset,
      search: debouncedSearch ? `%${debouncedSearch}%` : '%',
      active: !archived,
    },
  })

  const totalCount = data?.org_aggregate.aggregate?.count ?? 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSetSearch(e.target.value)
  }

  const handleTabChange = (index: number) => {
    setArchived(index === 1)
    setOffset(0)
  }

  return (
    <>
      <Heading size="md" mb={6}>
        {t('SuperAdmin.orgs.heading')}
      </Heading>

      <Flex mb={4} gap={4} align="center" wrap="wrap">
        <Input
          placeholder={t('SuperAdmin.orgs.searchPlaceholder')}
          value={search}
          onChange={handleSearchChange}
          maxW="400px"
        />
        <Tabs
          variant="soft-rounded"
          size="sm"
          index={archived ? 1 : 0}
          onChange={handleTabChange}
        >
          <TabList>
            <Tab>{t('SuperAdmin.orgs.tabs.active')}</Tab>
            <Tab>{t('SuperAdmin.orgs.tabs.archived')}</Tab>
          </TabList>
        </Tabs>
      </Flex>

      {loading && <Loading active center />}
      {error && <TextError error={error} />}

      {data && (
        <>
          <Text mb={3} fontSize="sm" color="gray.500">
            {totalCount} {t('SuperAdmin.orgs.total')}
          </Text>

          <Table size="sm">
            <Thead>
              <Tr>
                <Th>{t('SuperAdmin.orgs.columns.name')}</Th>
                <Th>{t('SuperAdmin.orgs.columns.created')}</Th>
                <Th isNumeric>{t('SuperAdmin.orgs.columns.members')}</Th>
                <Th>{t('SuperAdmin.orgs.columns.subscription')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.org.map((org) => (
                <AdminTableRow
                  key={org.id}
                  label={org.name}
                  isSelected={org.id === orgId}
                  onSelect={() => openOrg(org.id)}
                >
                  <Td>
                    <HStack spacing={3}>
                      <Avatar name={org.name} size="sm" />
                      <Box minW={0}>
                        <Text fontWeight="medium" noOfLines={1}>
                          {org.name}
                        </Text>
                        {org.slug && (
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            /{org.slug}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    {org.members_aggregate.aggregate?.count ?? 0}
                  </Td>
                  <Td>
                    <AdminSubscriptionTag subscription={org.org_subscription} />
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
