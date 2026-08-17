import React, { useMemo } from 'react'
import {
  FaCcAmex,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcMastercard,
  FaCcVisa,
  FaCreditCard,
} from 'react-icons/fa'
import { IconBaseProps } from 'react-icons/lib'

type CreditCardIconProps = {
  name: string
} & IconBaseProps

export default function CreditCardIcon({
  name,
  ...iconProps
}: CreditCardIconProps) {
  const Icon = useMemo(() => {
    switch (name.toLocaleLowerCase()) {
      case 'american express':
        return FaCcAmex
      case 'diners club':
        return FaCcDinersClub
      case 'discover':
        return FaCcDiscover
      case 'jcb':
        return FaCcDiscover
      case 'mastercard':
        return FaCcMastercard
      case 'visa':
        return FaCcVisa
      default:
        return FaCreditCard
    }
  }, [name])

  // react-icons sets size as the svg width/height, so it needs a CSS length
  return <Icon size="1em" {...iconProps} />
}
