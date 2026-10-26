import useSuperAdmin from '@/user/hooks/useSuperAdmin'
import { Icon, Link } from '@chakra-ui/react'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import React from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { Link as ReactRouterLink } from 'react-router'

interface Props {
  org: { id: string; name: string; slug?: string | null; archived?: boolean }
  // Only an icon, next to a name that is already clickable
  iconOnly?: boolean
  children?: React.ReactNode
}

// Opens an org in a new tab, in admin mode for super admins
export default function DeletionOrgLink({ org, iconOnly, children }: Props) {
  const isSuperAdmin = useSuperAdmin()

  // Archived orgs can only be opened by super admins
  if (org.archived && !isSuperAdmin) {
    return iconOnly ? null : <>{children ?? org.name}</>
  }

  return (
    <Link
      as={ReactRouterLink}
      to={`${getOrgPath(org)}/${isSuperAdmin ? '?admin' : ''}`}
      target="_blank"
      aria-label={org.name}
      display="inline-flex"
      alignItems="center"
      gap={1}
      _hover={{ textDecoration: 'underline' }}
    >
      {!iconOnly && (children ?? org.name)}
      <Icon as={FiExternalLink} boxSize={3} color="gray.500" />
    </Link>
  )
}
