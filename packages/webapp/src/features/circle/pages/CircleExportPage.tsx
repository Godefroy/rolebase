import NumberInput from '@/common/atoms/NumberInput'
import ScrollableLayout from '@/common/atoms/ScrollableLayout'
import { Title } from '@/common/atoms/Title'
import { useElementSize } from '@/common/hooks/useElementSize'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import CirclesGraph, { CirclesGraphInstance } from '@/graph/CirclesGraph'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import { CirclesGraphViews, GraphLayoutKind } from '@/graph/types'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Spacer,
  useColorMode,
  useToast,
} from '@chakra-ui/react'
import { computeLayout } from '@rolebase/graph'
import { OrgData } from '@rolebase/shared/model/OrgData'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DownloadIcon } from 'src/icons'
import { trpc } from 'src/trpc'
import CircleAndMemberFilters from '../components/CircleAndMemberFilters'
import GraphViewsSelect, { viewsList } from '../components/GraphViewsSelect'

type CircleExportParams = {
  circleId: string
  view: string
  showMembers: string
}

const defaultWidth = 2048

export default function CircleExportPage() {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { params, changeParams } = useUpdatableQueryParams<CircleExportParams>()
  const circleId = params.circleId
  const toast = useToast()
  const [downloading, setDownloading] = useState(false)
  const [ready, setReady] = useState(false)
  const graphRef = useRef<CirclesGraphInstance>(null)

  // The capture is rendered at its real size and scaled down to fit the page,
  // so what is on screen is exactly what the PNG will contain
  const previewRef = useRef<HTMLDivElement>(null)
  const previewSize = useElementSize(previewRef)

  // Settings. The view is kept in the URL, so opening the export from the org
  // chart lands on the same view and the link stays shareable.
  const viewParam = params.view as CirclesGraphViews | undefined
  const view =
    viewParam && viewsList.includes(viewParam)
      ? viewParam
      : CirclesGraphViews.AllCircles
  const handleViewChange = useCallback(
    (newView: CirclesGraphViews) => changeParams({ view: newView }),
    [changeParams]
  )
  const [width, setWidth] = useState(defaultWidth)

  // Kept in the URL too. On by default, so only the off state is written.
  const showMembers = params.showMembers !== '0'
  const handleShowMembersChange = useCallback(
    (checked: boolean) =>
      changeParams({ showMembers: checked ? undefined : '0' }),
    [changeParams]
  )

  // Data
  const { orgId, orgData, getOrgResult } = useOrgContext()
  const circles = orgData?.circles

  // Build a derived org data restricted to the selected circle subtree, with
  // the selected circle reparented as the root.
  const selectedOrg = useMemo(() => {
    const result = getOrgResult()
    if (!orgData || !circleId || !result) return undefined

    const circle = orgData.circleById.get(circleId)
    if (!circle) return undefined

    const subCircles = [
      { ...circle, parentId: null },
      ...orgData.descendantsOf(circleId),
    ]

    return new OrgData({ ...result, circles: subCircles })
  }, [orgData, circleId, getOrgResult])

  // A hierarchical org chart is much wider than it is tall: give the frame the
  // aspect ratio of its layout instead of a square
  const height = useMemo(() => {
    if (!selectedOrg) return width
    const layout = computeLayout(selectedOrg, view, undefined, {
      hideMembers: !showMembers,
    })
    if (layout.kind !== GraphLayoutKind.Tree) return width
    const layoutWidth = layout.bounds.x1 - layout.bounds.x0
    const layoutHeight = layout.bounds.y1 - layout.bounds.y0
    if (layoutWidth <= 0 || layoutHeight <= 0) return width
    return Math.max(
      100,
      Math.min(3000, Math.round((width * layoutHeight) / layoutWidth))
    )
  }, [selectedOrg, view, width, showMembers])

  const previewScale = Math.min(1, (previewSize?.width || width) / width)

  // Center graph
  const handleCenter = () => {
    if (!circleId || !graphRef.current) return
    graphRef.current.focusNodeId(undefined, true)
  }

  // Center graph and adapt scale on width change
  useEffect(() => {
    if (!ready) return
    setTimeout(handleCenter, 100)
  }, [circleId, ready, width, height, view])

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
        height,
        colorMode,
        showMembers,
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
        {/* Side margins: the capture is scaled to the width left inside them */}
        <Box px={{ base: 4, md: 8 }}>
          <Flex alignItems="center" flexWrap="wrap" gap={3} my={10}>
            <CircleAndMemberFilters
              circleId={circleId}
              onCircleChange={(circleId) => changeParams({ circleId })}
            />
            <GraphViewsSelect
              variant="outline"
              size="sm"
              value={view}
              onChange={handleViewChange}
            />
            <Spacer />
            <Checkbox
              isChecked={showMembers}
              size="sm"
              onChange={(event) =>
                handleShowMembersChange(event.target.checked)
              }
            >
              {t('CircleExportPage.showMembers')}
            </Checkbox>
            <Flex alignItems="center">
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
            </Flex>
          </Flex>
          {/* Clips the first frame, before the width is measured */}
          <Box ref={previewRef} w="100%" overflow="hidden">
            <Box
              width={`${width * previewScale}px`}
              height={`${height * previewScale}px`}
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
              <Box
                width={`${width}px`}
                height={`${height}px`}
                transformOrigin="top left"
                transform={`scale(${previewScale})`}
              >
                {orgId && selectedOrg && (
                  <CirclesGraph
                    ref={graphRef}
                    key={`${view}${colorMode}${showMembers}`}
                    view={view}
                    org={selectedOrg}
                    width={width}
                    height={height}
                    showAllNodes
                    hideMembers={!showMembers}
                    panzoomDisabled
                    focusCircleScale={(node) => node.r * 1.01}
                    onReady={() => setReady(true)}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollableLayout>
    </GraphProvider>
  )
}
