import NumberInput from '@/common/atoms/NumberInput'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import CirclesGraph, { CirclesGraphInstance } from '@/graph/CirclesGraph'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import { CirclesGraphViews } from '@/graph/types'
import { useOrgId } from '@/org/hooks/useOrgId'
import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  Heading,
  Spacer,
  useColorMode,
  useToast,
} from '@chakra-ui/react'
import { getCircleChildren } from '@rolebase/shared/helpers/getCircleChildren'
import { useStoreState } from '@store/hooks'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DownloadIcon } from 'src/icons'
import { trpc } from 'src/trpc'
import CircleAndMemberFilters from '../components/CircleAndMemberFilters'
import GraphViewsSelect from '../components/GraphViewsSelect'

type CircleExportParams = {
  circleId: string
}

const defaultWidth = 600

export default function CircleExportPage() {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { params, changeParams } = useUpdatableQueryParams<CircleExportParams>()
  const circleId = params.circleId
  const orgId = useOrgId()
  const toast = useToast()
  const [downloading, setDownloading] = useState(false)
  const [ready, setReady] = useState(false)
  const graphRef = useRef<CirclesGraphInstance>(null)

  // Settings
  const [view, setView] = useState(CirclesGraphViews.AllCircles)
  const [width, setWidth] = useState(defaultWidth)
  const [showAllNodes, setShowAllNodes] = useState(true)

  // Data
  const circles = useStoreState((state) => state.org.circles)

  const selectedCircles = useMemo(() => {
    if (!circles || !circleId) return undefined

    const circle = circles.find((c) => c.id === circleId)
    if (!circle) return undefined

    return [
      { ...circle, parentId: null },
      ...getCircleChildren(circles, circleId),
    ]
  }, [circles, circleId])

  // Center graph
  const handleCenter = () => {
    if (!circleId || !graphRef.current) return
    graphRef.current.focusNodeId(undefined, true)
  }

  // Center graph and adapt scale on width change
  useEffect(() => {
    if (!ready) return
    setTimeout(handleCenter, 100)
  }, [circleId, ready, width, view])

  // Download as transparent PNG (generated server-side)
  const handleDownload = async () => {
    if (!orgId || !circleId) return
    setDownloading(true)

    try {
      const result = await trpc.org.exportOrgChart.mutate({
        orgId,
        circleId,
        view,
        width,
        colorMode,
        showAllNodes,
      })

      // Data is base64 encoded
      const binary = atob(result.data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: result.contentType })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.errorOccurred'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setDownloading(false)
    }
  }

  // Reset circleId to main circle if undefined
  useEffect(() => {
    if (!circleId) {
      const mainCircle = circles?.find((c) => c.parentId === null)
      if (mainCircle) changeParams({ circleId: mainCircle.id })
    }
  }, [circleId, circles])

  return (
    <GraphProvider>
      <ScrollableLayout
        header={
          <Flex ml={5} my={2} w="100%" alignItems="center" flexWrap="wrap">
            <Heading as="h1" size="md">
              {t('CircleExportPage.heading')}
            </Heading>
            <CircleAndMemberFilters
              circleId={circleId}
              ml={5}
              onCircleChange={(circleId) => changeParams({ circleId })}
            />
            <Spacer />

            <Button
              colorScheme="blue"
              leftIcon={<DownloadIcon />}
              isLoading={downloading}
              ml={5}
              onClick={handleDownload}
            >
              {t('CircleExportPage.download')}
            </Button>
          </Flex>
        }
      >
        <Title>{t('CircleExportPage.heading')}</Title>
        <Container
          maxW={`${defaultWidth}px`}
          display="flex"
          px={0}
          mt={10}
          mb={3}
        >
          <GraphViewsSelect
            variant="outline"
            size="sm"
            value={view}
            onChange={setView}
          />
          <Spacer />
          <Checkbox
            isChecked={showAllNodes}
            size="sm"
            onChange={(event) => setShowAllNodes(event.target.checked)}
          >
            {t('CircleExportPage.showAllNodes')}
          </Checkbox>
        </Container>
        <Box
          width={`${width}px`}
          height={`${width}px`}
          margin="0 auto"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          overflow="hidden"
          _dark={{
            bg: 'black',
            borderColor: 'gray.550',
          }}
        >
          {orgId && selectedCircles && (
            <CirclesGraph
              ref={graphRef}
              key={view + colorMode}
              view={view}
              circles={selectedCircles}
              width={width}
              height={width}
              showAllNodes={showAllNodes}
              panzoomDisabled
              focusCircleScale={(node) => node.r * 1.01}
              onReady={() => setReady(true)}
            />
          )}
        </Box>

        <Center my={3}>
          <NumberInput
            value={width}
            step={50}
            min={100}
            size="sm"
            w="80px"
            textAlign="center"
            mr={1}
            onChange={setWidth}
          />
          px
        </Center>
      </ScrollableLayout>
    </GraphProvider>
  )
}
