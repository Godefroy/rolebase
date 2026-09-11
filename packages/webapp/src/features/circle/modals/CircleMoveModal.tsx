import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import useOrgEditPermissions from '@/org/hooks/useOrgEditPermissions'
import CircleSearchInput from '@/search/components/CircleSearchInput'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Kbd,
  Text,
  UseModalProps,
  useToast,
} from '@chakra-ui/react'
import { cmdOrCtrlKey } from '@utils/env'
import React, { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props extends UseModalProps {
  circleId: string
}

export default function CircleMoveModal({ circleId, ...modalProps }: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const { moveCircle } = useOrgEditActions()
  const { canAddSubCircleTo } = useOrgEditPermissions()
  const toast = useToast()

  const circle = orgData?.getCircle(circleId)
  const role = orgData?.getRole(circle?.roleId)

  const [targetCircleId, setTargetCircleId] = useState<string | undefined>()
  const [moving, setMoving] = useState(false)

  // Targets: the circles the role may be added under, excluding itself, its
  // own descendants and the parent it already has.
  const targetCircles = useMemo(() => {
    if (!orgData || !circle || !role) return []
    const excludeIds = new Set([
      circle.id,
      circle.parentId,
      ...orgData.descendantsOf(circle.id).map((c) => c.id),
    ])
    return orgData.circles.filter(
      (c) => !excludeIds.has(c.id) && canAddSubCircleTo(c.id, !!role.parentLink)
    )
  }, [orgData, circle, role, canAddSubCircleTo])

  // The move runs with the user's own rights, so surface a refusal instead of
  // failing silently.
  const handleSubmit = async () => {
    if (!targetCircleId || !role) return
    setMoving(true)
    try {
      await moveCircle(circleId, targetCircleId)
      toast({
        title: t('CircleMoveModal.toast', {
          name: role.name,
          parent: orgData?.getRole(orgData?.getCircle(targetCircleId)?.roleId)
            ?.name,
        }),
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      modalProps.onClose()
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || undefined,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setMoving(false)
    }
  }

  if (!circle || !role) return null

  return (
    <Modal size="xl" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('CircleMoveModal.heading')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {targetCircles.length === 0 ? (
            <Text>{t('CircleMoveModal.noTarget')}</Text>
          ) : (
            <FormControl>
              <FormLabel>
                {t('CircleMoveModal.label', { name: role.name })}
              </FormLabel>
              <CircleSearchInput
                circles={targetCircles}
                value={targetCircleId}
                onChange={setTargetCircleId}
              />
            </FormControl>
          )}

          <Alert status="info" mt={5}>
            <AlertIcon />
            <AlertDescription>
              <Trans
                i18nKey="CircleMoveModal.dragHint"
                values={{ key: cmdOrCtrlKey }}
                components={{ kbd: <Kbd /> }}
              />
            </AlertDescription>
          </Alert>
        </ModalBody>

        <ModalFooter>
          <Button onClick={modalProps.onClose}>{t('common.cancel')}</Button>
          <Button
            colorScheme="blue"
            isDisabled={!targetCircleId}
            isLoading={moving}
            onClick={handleSubmit}
            ml={3}
          >
            {t('CircleMoveModal.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
