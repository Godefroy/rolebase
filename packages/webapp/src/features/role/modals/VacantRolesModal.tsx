import CircleBreadcrumbButton from '@/circle/components/CircleBreadcrumbButton'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
  UseModalProps,
} from '@chakra-ui/react'
import { CircleFragment } from '@gql'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function VacantRolesModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const circles = orgData?.circles

  // Filter roles
  const vacantCircles: CircleFragment[] = useMemo(() => {
    if (!orgData || !circles) return []
    return (
      circles
        // Keep empty circles
        ?.filter(
          (c) =>
            orgData.membersOf(c.id).length === 0 &&
            !circles.some((c2) => c2.parentId === c.id)
        )
    )
  }, [orgData, circles])

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('VacantRolesModal.heading')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={5}>
          {!vacantCircles || vacantCircles.length === 0 ? (
            <>{t('VacantRolesModal.empty')}</>
          ) : (
            <UnorderedList>
              {vacantCircles.map((circle) => (
                <ListItem key={circle.id}>
                  <CircleBreadcrumbButton circle={circle} />
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
