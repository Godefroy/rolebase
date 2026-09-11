import Switch from '@/common/atoms/Switch'
import useCopyUrl from '@/common/hooks/useCopyUrl'
import useGraphView from '@/graph/hooks/useGraphView'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import { GraphView } from '@rolebase/shared/model/graph'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from 'src/icons'
import settings from 'src/settings'
import GraphViewsSelect from '../components/GraphViewsSelect'

export default function CirclesShareModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const { org } = useOrgContext()
  const [updateOrg] = useUpdateOrgMutation()

  // State. The shared view starts on the one the org chart is drawn with.
  const currentGraphView = useGraphView()
  const [shareOrg, setShareOrg] = useState(org?.shareOrg)
  const [shareMembers, setShareMembers] = useState(org?.shareMembers)
  const [graphView, setGraphView] = useState<GraphView>(currentGraphView)
  const [zoom, setZoom] = useState(true)
  const [transparent, setTransparent] = useState(false)

  // URL
  const url = `${settings.url}/share/?orgId=${org?.id}&view=${graphView.view}${
    graphView.folded ? '&folded=1' : ''
  }${zoom ? '&zoom' : ''}${transparent ? '&transparent' : ''}`
  const copyUrl = useCopyUrl(url)

  // Embed code
  const embed = `<iframe src="${url}" width="95%" height="800" frameborder="0"></iframe>`
  const copyEmbed = useCopyUrl(embed)

  const handleShareOrg = async () => {
    if (!org) return
    setShareOrg(!shareOrg)
    updateOrg({ variables: { id: org.id, values: { shareOrg: !shareOrg } } })
  }

  const handleShareMembers = async () => {
    if (!org) return
    setShareMembers(!shareMembers)
    updateOrg({
      variables: { id: org.id, values: { shareMembers: !shareMembers } },
    })
  }

  return (
    <Modal size="xl" autoFocus={false} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('CirclesShareModal.heading')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={10} align="stretch">
            <VStack spacing={4} align="stretch">
              <Switch isChecked={shareOrg} onChange={handleShareOrg}>
                {t('CirclesShareModal.enable')}
              </Switch>

              {!shareOrg && (
                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription>
                    {t('CirclesShareModal.enableHelp')}
                  </AlertDescription>
                </Alert>
              )}
            </VStack>

            {shareOrg && (
              <>
                <VStack spacing={4} align="start">
                  <Heading as="h2" size="sm">
                    {t('CirclesShareModal.headingAccess')}
                  </Heading>

                  <FormControl>
                    {/* The org chart is what is shared, it cannot be opted out */}
                    <Switch isChecked isDisabled>
                      {t('CirclesShareModal.shareOrg')}
                    </Switch>
                    <FormHelperText ml="40px">
                      {t('CirclesShareModal.shareOrgHelp')}
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <Switch
                      isChecked={shareMembers}
                      onChange={handleShareMembers}
                    >
                      {t('CirclesShareModal.shareMembers')}
                    </Switch>
                    <FormHelperText ml="40px">
                      {t('CirclesShareModal.shareMembersHelp')}
                    </FormHelperText>
                  </FormControl>
                </VStack>

                <VStack spacing={4} align="start">
                  <Heading as="h2" size="sm">
                    {t('CirclesShareModal.view')}
                  </Heading>
                  <GraphViewsSelect
                    variant="outline"
                    value={graphView}
                    onChange={setGraphView}
                  />
                  <Switch isChecked={zoom} onChange={() => setZoom((z) => !z)}>
                    {t('CirclesShareModal.zoom')}
                  </Switch>
                  <Switch
                    isChecked={transparent}
                    onChange={() => setTransparent((z) => !z)}
                  >
                    {t('CirclesShareModal.transparent')}
                  </Switch>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <Heading as="h2" size="sm">
                    {t('CirclesShareModal.link')}
                  </Heading>
                  <Flex>
                    <Input value={url} isReadOnly flex="1" />
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      leftIcon={<CopyIcon size={20} />}
                      onClick={copyUrl}
                    >
                      {t('common.copy')}
                    </Button>
                  </Flex>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <Heading as="h2" size="sm">
                    {t('CirclesShareModal.embed')}
                  </Heading>
                  <Flex>
                    <Textarea value={embed} isReadOnly flex="1" h="120px" />
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      leftIcon={<CopyIcon size={20} />}
                      onClick={copyEmbed}
                    >
                      {t('common.copy')}
                    </Button>
                  </Flex>
                </VStack>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
