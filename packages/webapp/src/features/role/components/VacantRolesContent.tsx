import CircleBreadcrumbButton from '@/circle/components/CircleBreadcrumbButton'
import PanelLayout from '@/common/atoms/PanelLayout'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Text, VStack } from '@chakra-ui/react'
import { CircleFragment } from '@gql'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  changeTitle?: boolean
  flowHeight?: boolean
  onClose?: () => void
}

// Roles nobody fills, as a panel of the org chart page.
export default function VacantRolesContent(panelProps: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const circles = orgData?.circles

  // Keep the roles with no member and no sub-role
  const vacantCircles: CircleFragment[] = useMemo(() => {
    if (!orgData || !circles) return []
    return circles.filter(
      (c) =>
        orgData.membersOf(c.id).length === 0 &&
        !circles.some((c2) => c2.parentId === c.id)
    )
  }, [orgData, circles])

  return (
    <PanelLayout title={t('VacantRolesPanel.heading')} {...panelProps}>
      {vacantCircles.length === 0 ? (
        <Text fontStyle="italic">{t('VacantRolesPanel.empty')}</Text>
      ) : (
        <VStack align="stretch" spacing={0}>
          {vacantCircles.map((circle) => (
            <CircleBreadcrumbButton key={circle.id} circle={circle} />
          ))}
        </VStack>
      )}
    </PanelLayout>
  )
}
