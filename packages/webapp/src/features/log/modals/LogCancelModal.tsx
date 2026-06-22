import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Collapse,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { LogFragment } from '@gql'
import { EntitiesChanges, EntityChange } from '@rolebase/shared/model/log'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, ChevronUpIcon } from 'src/icons'
import LogCancelText from '../components/LogCancelText'
import LogEntityChanges from '../components/LogEntityChanges'
import LogText from '../components/LogText'
import { useCancelLog } from '../hooks/useCancelLog'

interface Props extends UseModalProps {
  log: LogFragment
  onCancelled?(): void
}

export default function LogCancelModal({
  log,
  onCancelled,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { hasChanged, cancel } = useCancelLog(log)

  // Show details
  const [showDetails, setShowDetails] = useState(false)

  // Checkbox to force cancel if there are changes
  const [force, setForce] = useState(false)

  // Cancel log
  const handleCancelLog = async () => {
    await cancel()
    onCancelled?.()
    modalProps.onClose()

    toast({
      title: t('LogCancelModal.toastSuccess'),
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <Modal returnFocusOnClose={false} size="lg" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('LogCancelModal.heading')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} alignItems="start">
            <Box
              p={3}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.500"
            >
              <LogCancelText log={log} />
              <LogText log={log} />
            </Box>

            {hasChanged && (
              <>
                <Alert status="warning" mb={5}>
                  <AlertIcon />
                  <AlertDescription>
                    {t('LogCancelModal.hadChanges')}
                  </AlertDescription>
                </Alert>
                <Checkbox
                  isChecked={force}
                  onChange={() => setForce((f) => !f)}
                >
                  {t('LogCancelModal.acceptCheckbox')}
                </Checkbox>
              </>
            )}

            <Button
              variant="link"
              rightIcon={
                showDetails ? (
                  <ChevronUpIcon size="1em" />
                ) : (
                  <ChevronDownIcon size="1em" />
                )
              }
              onClick={() => setShowDetails((s) => !s)}
            >
              {t('LogCancelModal.showChanges')}
            </Button>
            <Collapse in={showDetails} animateOpacity>
              <VStack spacing={3} align="stretch" wordBreak="break-word">
                {Object.keys(log.changes).flatMap(
                  (entityType) =>
                    log.changes[entityType as keyof EntitiesChanges]?.map(
                      (entityChange) => (
                        <LogEntityChanges
                          key={entityChange.id}
                          type={entityType}
                          entityChange={entityChange as EntityChange<any>}
                        />
                      )
                    )
                )}
              </VStack>
            </Collapse>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            type="submit"
            isDisabled={hasChanged && !force}
            onClick={handleCancelLog}
          >
            {t('LogCancelModal.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
