import { getResizedImageUrl } from '@rolebase/shared/helpers/getResizedImageUrl'
import { Box, Image } from '@chakra-ui/react'
import React from 'react'
import BrandIcon from 'src/images/icon.svg'

interface Props {
  icon?: string | null
  name?: string
  size?: number
  // What to render when the org has no icon:
  // - 'brand': the Rolebase logo
  // - 'blank': an empty space of the same size (to keep names aligned)
  fallback?: 'brand' | 'blank'
}

export default function OrgIcon({
  icon,
  name,
  size = 24,
  fallback = 'brand',
}: Props) {
  const src = icon ? getResizedImageUrl(icon, size * 2) || undefined : undefined

  if (src) {
    return (
      <Image
        src={src}
        alt={name || ''}
        boxSize={`${size}px`}
        objectFit="cover"
        borderRadius="md"
        flexShrink={0}
      />
    )
  }

  if (fallback === 'brand') {
    return <BrandIcon width={size} height={size} />
  }

  return <Box boxSize={`${size}px`} flexShrink={0} />
}
