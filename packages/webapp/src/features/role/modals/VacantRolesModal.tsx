import CircleBreadcrumbButton from '@/circle/components/CircleBreadcrumbButton'
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
import { CircleFullFragment } from '@gql'
import { useStoreState } from '@store/hooks'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function VacantRolesModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const circles = useStoreState((state) => state.org.circles)

  // Filter roles
  const vacantCircles: CircleFullFragment[] = useMemo(() => {
    if (!circles) return []
    return (
      circles
        // Keep empty circles
        ?.filter(
          (c) =>
            c.members.length === 0 &&
            !circles.some((c2) => c2.parentId === c.id)
        )
    )
  }, [circles])

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
