import { Container, Heading } from 'react-email'
import React, { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

export default function Card({ title, children }: Props) {
  return (
    <Container className="bg-white rounded-3xl my-8 mx-auto p-4 pb-12 w-full max-w-[465px]">
      <Heading as="h1" className="text-2xl font-medium text-center p-0 my-8">
        {title}
      </Heading>
      {children}
    </Container>
  )
}
