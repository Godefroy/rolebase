import { Link, useDisclosure } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import RoleEditModal from '../modals/RoleEditModal'

interface Props {
  id: string
  name: string
  readOnly?: boolean
}

export default function RoleEditLink({ id, name, readOnly }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  // The link only opens a modal: keep the browser from navigating to the hash
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      onOpen()
    },
    [onOpen]
  )

  return (
    <>
      <Link href="#" onClick={handleClick}>
        {name}
      </Link>

      {isOpen && (
        <RoleEditModal isOpen id={id} readOnly={readOnly} onClose={onClose} />
      )}
    </>
  )
}
