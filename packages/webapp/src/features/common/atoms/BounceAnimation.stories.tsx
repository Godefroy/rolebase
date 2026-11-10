import { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { decorators } from '../../../stories'
import BounceAnimation from './BounceAnimation'

export default {
  title: 'BounceAnimation',
  component: BounceAnimation,
  decorators,
} as Meta<typeof BounceAnimation>

export const Example: StoryObj<typeof BounceAnimation> = {
  render: (args) => (
    <BounceAnimation {...args}>
      <div style={{ width: 100, height: 100, backgroundColor: 'red' }} />
    </BounceAnimation>
  ),
  args: {
    active: true,
  },
}
