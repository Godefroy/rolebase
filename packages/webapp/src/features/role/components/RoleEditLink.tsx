import { Link, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import RoleEditModal from '../modals/RoleEditModal'

interface Props {
  id: string
  name: string
  readOnly?: boolean
}

export default function RoleEditLink({ id, name, readOnly }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Link href="#" onClick={onOpen}>
        {name}
      </Link>

      {isOpen && (
        <RoleEditModal isOpen id={id} readOnly={readOnly} onClose={onClose} />
      )}
    </>
  )
}
