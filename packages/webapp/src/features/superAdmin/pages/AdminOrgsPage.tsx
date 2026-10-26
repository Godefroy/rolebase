import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useAdminOrgsQuery } from '@gql'
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
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { Link } from 'react-router'
import DeleteOrgButton from '../components/DeleteOrgButton'

const PAGE_SIZE = 50

export default function AdminOrgsPage() {
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

  const { data, loading, error } = useAdminOrgsQuery({
    variables: {
      limit: PAGE_SIZE,
      offset,
      search: debouncedSearch ? `%${debouncedSearch}%` : '%',
    },
  })

  const totalCount = data?.org_aggregate.aggregate?.count ?? 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSetSearch(e.target.value)
  }

  return (
    <>
      <Heading size="md" mb={6}>
        {t('SuperAdmin.orgs.heading')}
      </Heading>

      <Input
        placeholder={t('SuperAdmin.orgs.searchPlaceholder')}
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
            {totalCount} {t('SuperAdmin.orgs.total')}
          </Text>

          <Table size="sm">
            <Thead>
              <Tr>
                <Th>{t('SuperAdmin.orgs.columns.name')}</Th>
                <Th>{t('SuperAdmin.orgs.columns.slug')}</Th>
                <Th>{t('SuperAdmin.orgs.columns.created')}</Th>
                <Th isNumeric>{t('SuperAdmin.orgs.columns.members')}</Th>
                <Th>{t('SuperAdmin.orgs.columns.subscription')}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {data.org.map((org) => (
                <Tr key={org.id}>
                  <Td>
                    <Link to={`${getOrgPath(org)}/?admin`} target="_blank">
                      <Text
                        fontWeight="medium"
                        color="blue.500"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {org.name}
                      </Text>
                    </Link>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {org.slug}
                    </Text>
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
                    {org.org_subscription ? (
                      <Tag
                        size="sm"
                        colorScheme={
                          org.org_subscription.status === 'active'
                            ? 'green'
                            : 'gray'
                        }
                      >
                        {org.org_subscription.status}
                        {org.org_subscription.type &&
                          ` (${org.org_subscription.type})`}
                      </Tag>
                    ) : (
                      <Tag size="sm" colorScheme="gray">
                        {t('SuperAdmin.orgs.noSubscription')}
                      </Tag>
                    )}
                  </Td>
                  <Td isNumeric>
                    <DeleteOrgButton orgId={org.id} />
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
