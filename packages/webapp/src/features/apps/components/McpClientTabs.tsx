import Tab from '@/common/atoms/Tab'
import {
  Card,
  CardBody,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import React from 'react'
import { mcpClients } from '../mcpClients'
import McpClientPanel from './McpClientPanel'

export default function McpClientTabs() {
  return (
    <Card>
      <CardBody>
        <Tabs isLazy>
          <TabList
            borderBottomWidth={0}
            flexWrap="wrap"
            w="fit-content"
            p={1}
            borderRadius="3xl"
            bg="menulight"
            _dark={{ bg: 'menudark' }}
          >
            {mcpClients.map((client) => (
              <Tab key={client.id}>{client.name}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {mcpClients.map((client) => (
              <TabPanel key={client.id} px={0} pt={6}>
                <McpClientPanel client={client} />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  )
}
