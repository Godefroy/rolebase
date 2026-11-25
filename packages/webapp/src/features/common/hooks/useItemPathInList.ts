import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import { useLocation } from 'react-router'

// Link of an item of a list page (threads, tasks). From that page, the item
// opens next to the list (no modal) and the link keeps the list filters.
export default function useItemPathInList(section: string, id: string) {
  const location = useLocation()
  const sectionPath = usePathInOrg(section)
  const path = `${sectionPath}/${id}`
  const isInListPage = location.pathname.startsWith(sectionPath)
  return {
    linkPath: isInListPage ? `${path}${location.search}` : path,
    isInListPage,
    isActive: location.pathname === path,
  }
}
