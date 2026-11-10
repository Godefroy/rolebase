import { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import { decorators } from '../../../stories'
import { StarsRating } from './StarsRating'

export default {
  title: 'StarsRating',
  component: StarsRating,
  decorators,
} as Meta<typeof StarsRating>

export const Example: StoryObj<typeof StarsRating> = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0)
    return (
      <StarsRating
        {...args}
        value={value}
        onChange={(...params) => {
          // args.onChange(...params)
          setValue(...params)
        }}
      />
    )
  },
  args: {
    value: 0,
  },
}
