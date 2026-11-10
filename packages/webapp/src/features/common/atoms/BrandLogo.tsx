import React from 'react'
import Logo from 'src/images/logo.svg?react'

const logoWidth = 334 // 430
const logoHeight = 56 // 79

const sizes = {
  sm: 0.35,
  md: 0.51,
  lg: 0.9,
}

interface Props {
  size?: keyof typeof sizes
}

export default function BrandLogo({ size = 'md' }: Props) {
  const ratio = sizes[size]
  return (
    <Logo width={`${logoWidth * ratio}px`} height={`${logoHeight * ratio}px`} />
  )
}
