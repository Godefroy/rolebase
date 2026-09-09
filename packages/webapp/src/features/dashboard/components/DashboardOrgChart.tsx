import { useElementSize } from '@/common/hooks/useElementSize'
import CirclesGraph from '@/graph/CirclesGraph'
import useGraphEvents from '@/graph/hooks/useGraphEvents'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  useColorMode,
} from '@chakra-ui/react'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { defaultGraphView, parseGraphView } from '@rolebase/shared/model/graph'
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useOpenOrgChartOnZoom } from '../hooks/useOpenOrgChartOnZoom'

export default function DashboardOrgChart(boxProps: BoxProps) {
  const { t } = useTranslation()
  const navigateOrg = useNavigateOrg()

  // Content size
  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)
  const size = boxSize?.width // Square

  // Data
  const { org, orgData } = useOrgContext()
  const circles = orgData?.circles
  const { onCircleClick, onMemberClick } = useGraphEvents()
  const events = useMemo(() => ({ onCircleClick, onMemberClick }), [])

  // The organization default view, always folded: the dashboard only has room
  // for the roles around the selected one
  const { view } = parseGraphView(org?.defaultGraphView) || defaultGraphView

  // Color mode
  const { colorMode } = useColorMode()

  // A zoom gesture (wheel/pinch) opens the full, interactive org chart.
  useOpenOrgChartOnZoom(boxRef)

  // Redirect to org chart when there is only one circle
  useEffect(() => {
    if (circles?.length === 1 && org) {
      navigateOrg(`roles`)
    }
  }, [circles, org])

  if (circles?.length === 1 && org) {
    return (
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>{t('DashboardOrgChart.empty')}</AlertDescription>
        <Link to={`${getOrgPath(org)}/roles`}>
          <Button colorScheme="blue">{t('DashboardOrgChart.edit')}</Button>
        </Link>
      </Alert>
    )
  }

  return (
    <Box ref={boxRef} h={size} {...boxProps}>
      {org && orgData && size && (
        <CirclesGraph
          key={`${view}${colorMode}`}
          view={view}
          folded
          org={orgData}
          events={events}
          width={size}
          height={size}
          panzoomDisabled
          minimap={false}
        />
      )}
    </Box>
  )
}
