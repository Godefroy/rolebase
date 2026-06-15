import { Title } from '@/common/atoms/Title'
import DashboardMyRoles from '@/dashboard/components/DashboardMyRoles'
import DashboardNews from '@/dashboard/components/DashboardNews'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DashboardOrgChart from '../components/DashboardOrgChart'

const margin = 10

const DashboardPage = () => {
  const { t } = useTranslation()
  const { org } = useOrgContext()

  if (!org) return null

  return (
    <>
      <Title>{org?.name ?? t('DashboardPage.title')}</Title>

      <Flex
        w="100%"
        minH="100%"
        px={{ base: 3, md: margin }}
        py={margin}
        justifyContent="center"
        bg="menulight"
        _dark={{ bg: 'menudark' }}
      >
        <Flex
          w={{ base: '100%', xl: '1200px' }}
          flexDirection={{ base: 'column-reverse', xl: 'row' }}
        >
          <DashboardNews
            w={{ xl: '65%' }}
            mr={{ base: 0, xl: margin }}
            mt={{ base: margin, xl: 0 }}
          />

          <VStack spacing={margin} align="stretch" w={{ xl: '45%' }}>
            <DashboardOrgChart />
            <DashboardMyRoles />
          </VStack>
        </Flex>
      </Flex>
    </>
  )
}

export default DashboardPage
