import React from 'react'
import { Button, ButtonProps } from 'react-email'

export default function CtaButton(props: ButtonProps) {
  return (
    <Button
      className="bg-[#faa68c] text-[#29241f] rounded-lg font-semibold no-underline text-center px-5 py-3"
      {...props}
    />
  )
}
