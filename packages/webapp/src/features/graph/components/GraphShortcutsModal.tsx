import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  AddIcon,
  CirclePick,
  CopyIcon,
  MemberIcon,
  MoveIcon,
  PanIcon,
  SearchIcon,
} from 'src/icons'

type IconComponent = React.ComponentType<{ size?: number | string }>

type ShortcutKey =
  | 'zoom'
  | 'pan'
  | 'open'
  | 'moveRole'
  | 'copyRole'
  | 'moveMember'
  | 'addMember'

const shortcuts: { key: ShortcutKey; Icon: IconComponent }[] = [
  { key: 'zoom', Icon: SearchIcon },
  { key: 'pan', Icon: PanIcon },
  { key: 'open', Icon: CirclePick },
  { key: 'moveRole', Icon: MoveIcon },
  { key: 'copyRole', Icon: CopyIcon },
  { key: 'moveMember', Icon: MemberIcon },
  { key: 'addMember', Icon: AddIcon },
]

export default function GraphShortcutsModal(modalProps: UseModalProps) {
  const { t } = useTranslation()

  return (
    <Modal isCentered size="lg" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('GraphShortcutsModal.heading')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={4}>
            {shortcuts.map(({ key, Icon }) => (
              <Flex key={key} align="center">
                <Flex
                  align="center"
                  justify="center"
                  boxSize={10}
                  mr={4}
                  flexShrink={0}
                  borderRadius="md"
                  bg="gray.100"
                  color="gray.600"
                  _dark={{ bg: 'gray.700', color: 'gray.200' }}
                >
                  <Icon size={22} />
                </Flex>
                <Box>
                  <Text fontWeight="bold">
                    {t(`GraphShortcutsModal.${key}_label`)}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    _dark={{ color: 'gray.300' }}
                  >
                    {t(`GraphShortcutsModal.${key}_desc`)}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
