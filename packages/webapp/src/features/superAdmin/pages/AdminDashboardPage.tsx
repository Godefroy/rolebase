import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useAdminGrowthQuery, useAdminStatsQuery } from '@gql'
import {
  Button,
  ButtonGroup,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Period = '30d' | '90d' | '1y' | '3y'

const periodDays: Record<Period, number> = {
  '30d': 30,
  '90d': 90,
  '1y': 365,
  '3y': 1095,
}

function getSinceDate(period: Period): string {
  const d = new Date()
  d.setDate(d.getDate() - periodDays[period])
  return d.toISOString()
}

function buildCumulativeData(
  orgs: { createdAt: string }[],
  users: { createdAt: string }[],
  baseOrgs: number,
  baseUsers: number,
  period: Period
) {
  const days = periodDays[period]
  const bucketCount = Math.min(days, 100)
  const msPerBucket = (days * 86400000) / bucketCount
  const start = Date.now() - days * 86400000

  const buckets: { date: string; orgs: number; users: number }[] = []
  let orgIdx = 0
  let userIdx = 0
  let cumulOrgs = baseOrgs
  let cumulUsers = baseUsers

  for (let i = 0; i <= bucketCount; i++) {
    const bucketEnd = start + msPerBucket * i
    const bucketDate = new Date(bucketEnd)

    while (
      orgIdx < orgs.length &&
      new Date(orgs[orgIdx].createdAt).getTime() <= bucketEnd
    ) {
      cumulOrgs++
      orgIdx++
    }
    while (
      userIdx < users.length &&
      new Date(users[userIdx].createdAt).getTime() <= bucketEnd
    ) {
      cumulUsers++
      userIdx++
    }

    buckets.push({
      date: bucketDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        ...(days > 365 ? { year: '2-digit' } : {}),
      }),
      orgs: cumulOrgs,
      users: cumulUsers,
    })
  }

  return buckets
}

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<Period>('90d')

  const statsVariables = useMemo(() => {
    const now = new Date()
    const dauSince = new Date(now.getTime() - 86400000).toISOString()
    const mauSince = new Date(now.getTime() - 30 * 86400000).toISOString()
    return { dauSince, mauSince }
  }, [])

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useAdminStatsQuery({ variables: statsVariables })

  const since = useMemo(() => getSinceDate(period), [period])
  const {
    data: growthData,
    loading: growthLoading,
    error: growthError,
  } = useAdminGrowthQuery({ variables: { since } })

  const chartData = useMemo(() => {
    if (!growthData) return []
    return buildCumulativeData(
      growthData.org,
      growthData.users,
      growthData.org_aggregate.aggregate?.count ?? 0,
      growthData.usersAggregate.aggregate?.count ?? 0,
      period
    )
  }, [growthData, period])

  const gridColor = useColorModeValue('#e2e8f0', '#4a5568')
  const orgsColor = '#3182CE'
  const usersColor = '#38A169'

  return (
    <>
      <Heading size="md" mb={6}>
        {t('SuperAdmin.dashboard.heading')}
      </Heading>

      {(statsLoading || growthLoading) && <Loading active center />}
      {(statsError || growthError) && (
        <TextError error={statsError || growthError} />
      )}

      {statsData && (
        <SimpleGrid columns={{ base: 2, xl: 4 }} spacing={6} mb={8}>
          <Stat
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            _dark={{ borderColor: 'gray.600' }}
          >
            <StatLabel>{t('SuperAdmin.dashboard.totalOrgs')}</StatLabel>
            <StatNumber>
              {statsData.org_aggregate.aggregate?.count ?? 0}
            </StatNumber>
          </Stat>

          <Stat
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            _dark={{ borderColor: 'gray.600' }}
          >
            <StatLabel>{t('SuperAdmin.dashboard.totalUsers')}</StatLabel>
            <StatNumber>
              {statsData.usersAggregate.aggregate?.count ?? 0}
            </StatNumber>
          </Stat>

          <Stat
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            _dark={{ borderColor: 'gray.600' }}
          >
            <StatLabel>{t('SuperAdmin.dashboard.dau')}</StatLabel>
            <StatNumber>{statsData.dau.aggregate?.count ?? 0}</StatNumber>
          </Stat>

          <Stat
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            _dark={{ borderColor: 'gray.600' }}
          >
            <StatLabel>{t('SuperAdmin.dashboard.mau')}</StatLabel>
            <StatNumber>{statsData.mau.aggregate?.count ?? 0}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}

      <Heading size="sm" mb={4}>
        {t('SuperAdmin.dashboard.growth')}
      </Heading>

      <ButtonGroup size="sm" mb={4} isAttached variant="outline">
        {(['30d', '90d', '1y', '3y'] as Period[]).map((p) => (
          <Button
            key={p}
            onClick={() => setPeriod(p)}
            colorScheme={period === p ? 'blue' : undefined}
            variant={period === p ? 'solid' : 'outline'}
          >
            {t(`SuperAdmin.dashboard.period.${p}`)}
          </Button>
        ))}
      </ButtonGroup>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis fontSize={12} tickLine={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              name={t('SuperAdmin.dashboard.totalUsers')}
              stroke={usersColor}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="orgs"
              name={t('SuperAdmin.dashboard.totalOrgs')}
              stroke={orgsColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  )
}
