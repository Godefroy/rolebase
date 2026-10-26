import { Grid } from '@chakra-ui/react'
import React from 'react'

interface Props {
  children: React.ReactNode
}

// Two-column label / value grid of AdminInfoRow
export default function AdminInfoGrid({ children }: Props) {
  return (
    <Grid templateColumns="max-content 1fr" columnGap={6} rowGap={2}>
      {children}
    </Grid>
  )
}
