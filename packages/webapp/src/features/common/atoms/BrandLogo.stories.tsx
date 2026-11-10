import { VStack } from '@chakra-ui/react'
import { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { decorators } from '../../../stories'
import BrandLogo from './BrandLogo'

export default {
  title: 'BrandLogo',
  component: BrandLogo,
  decorators,
} as Meta<typeof BrandLogo>

export const Example: StoryObj<typeof BrandLogo> = {
  render: () => (
    <VStack spacing={10} m={10}>
      <BrandLogo size="sm" />
      <BrandLogo size="md" />
      <BrandLogo size="lg" />
    </VStack>
  ),
}
