import { Meta, StoryObj } from '@storybook/react-vite'
import React, { useEffect, useState } from 'react'
import { fn } from 'storybook/test'
import { decorators } from '../../../stories'
import RRuleEditor from './RRuleEditor'

export default {
  title: 'RRuleEditor',
  component: RRuleEditor,
  decorators,
} as Meta<typeof RRuleEditor>

export const Example: StoryObj<typeof RRuleEditor> = {
  render: ({ value, onChange, ...args }) => {
    const [stateValue, setValue] = useState(value)

    useEffect(() => {
      setValue(value)
    }, [value])

    return (
      <RRuleEditor
        value={stateValue}
        onChange={(value) => {
          onChange(value)
          setValue(value)
        }}
        {...args}
      />
    )
  },
  args: {
    onChange: fn(),
    value:
      'DTSTART:20221118T230000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE;COUNT=42',
  },
}
