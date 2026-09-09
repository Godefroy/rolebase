import ModalMaximizeButton from '@/common/atoms/ModalMaximizeButton'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import useGraphViewParam from '@/graph/hooks/useGraphViewParam'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import {
  Modal,
  ModalContent,
  ModalOverlay,
  UseModalProps,
} from '@chakra-ui/react'
import React from 'react'
import MemberContent from '../../member/components/MemberContent'
import CircleContent from '../components/CircleContent'
import { CircleProvider } from '../contexts/CIrcleContext'
import { getCircleMemberUrlSearch } from '../contexts/CircleMemberProvider'

interface Props extends UseModalProps {
  circleId?: string
  memberId?: string
}

// Modal that show either a circle or a member with a selected circle
export default function CircleMemberModal({
  circleId,
  memberId,
  ...modalProps
}: Props) {
  const handleClose = useNormalClickHandler(modalProps.onClose, true)
  const path = usePathInOrg('roles')
  const view = useGraphViewParam()

  if (!circleId && !memberId) return null

  return (
    <Modal size="lg" autoFocus={false} {...modalProps}>
      <ModalOverlay />

      <ModalContent borderRadius="lg" overflow="hidden">
        {memberId ? (
          <MemberContent
            id={memberId}
            headerIcons={
              <ModalMaximizeButton
                to={`${path}${getCircleMemberUrlSearch(
                  circleId,
                  memberId,
                  undefined,
                  view
                )}`}
                onClick={handleClose}
              />
            }
          />
        ) : (
          circleId && (
            <CircleProvider circleId={circleId}>
              <CircleContent
                headerIcons={
                  <ModalMaximizeButton
                    to={`${path}${getCircleMemberUrlSearch(
                      circleId,
                      undefined,
                      undefined,
                      view
                    )}`}
                    onClick={handleClose}
                  />
                }
              />
            </CircleProvider>
          )
        )}
      </ModalContent>
    </Modal>
  )
}
