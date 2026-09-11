import { graphButtonsProps } from '@/graph/components/graphButtonsProps'
import { Flex, StyleProps } from '@chakra-ui/react'
import { GraphView } from '@rolebase/shared/model/graph'
import React from 'react'
import CirclesGraphSettingsMenu from './CirclesGraphSettingsMenu'
import GraphViewsSelect from './GraphViewsSelect'

interface CirclesGraphOptionsProps extends StyleProps {
  value: GraphView
  onChange: (value: GraphView) => void
}

export default function CirclesGraphOptions({
  value,
  onChange,
  ...styleProps
}: CirclesGraphOptionsProps) {
  return (
    <Flex justifyContent="space-between" {...styleProps}>
      <GraphViewsSelect
        value={value}
        onChange={onChange}
        {...graphButtonsProps}
        fontWeight="bold"
      />

      <CirclesGraphSettingsMenu />
    </Flex>
  )
}
