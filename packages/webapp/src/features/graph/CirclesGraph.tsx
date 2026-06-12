import { useColorMode } from '@chakra-ui/react'
import {
  CirclesGraph as CirclesGraphInstance,
  CirclesGraphView,
  CirclesGraphViewProps,
} from '@rolebase/graph'
import React, { forwardRef } from 'react'

export type { CirclesGraphInstance }

export type CirclesGraphProps = Omit<CirclesGraphViewProps, 'colorMode'>

// Org chart graph, bound to the Chakra color mode
export default forwardRef<CirclesGraphInstance | undefined, CirclesGraphProps>(
  function CirclesGraph(props, ref) {
    const { colorMode } = useColorMode()

    return <CirclesGraphView ref={ref} colorMode={colorMode} {...props} />
  }
)
