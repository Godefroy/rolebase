import PanelLayout from '@/common/atoms/PanelLayout'
import Switch from '@/common/atoms/Switch'
import useCopyUrl from '@/common/hooks/useCopyUrl'
import useGraphView from '@/graph/hooks/useGraphView'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import { GraphView } from '@rolebase/shared/model/graph'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from 'src/icons'
import settings from 'src/settings'
import GraphViewsSelect from './GraphViewsSelect'

interface Props {
  changeTitle?: boolean
  flowHeight?: boolean
  onClose?: () => void
}

// Public sharing of the org chart (link and embed code), as a panel of the org
// chart page. It answers two separate questions, and shows them as two
// sections: what the organization publishes, which is stored and holds for
// every visitor, and how a given link frames the page, which travels in its
// address and can differ from one link to the next.
export default function CirclesShareContent(panelProps: Props) {
  const { t } = useTranslation()
  const { org } = useOrgContext()
  const [updateOrg] = useUpdateOrgMutation()

  // Published, stored on the organization
  const [shareOrg, setShareOrg] = useState(org?.shareOrg)
  const [shareMembers, setShareMembers] = useState(org?.shareMembers)

  // Link settings. The shared view starts on the one the org chart is drawn
  // with. Its members option is left out of the selector here: the members are
  // published or not, above.
  const currentGraphView = useGraphView()
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
    <PanelLayout title={t('CirclesSharePanel.heading')} {...panelProps}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="sm">
            {t('CirclesSharePanel.headingPublished')}
          </Heading>

          <Switch isChecked={shareOrg} onChange={handleShareOrg}>
            {t('CirclesSharePanel.enable')}
          </Switch>

          <Alert status="info">
            <AlertIcon />
            <AlertDescription>
              {t('CirclesSharePanel.enableHelp')}
            </AlertDescription>
          </Alert>

          {shareOrg && (
            <FormControl>
              <Switch isChecked={shareMembers} onChange={handleShareMembers}>
                {t('CirclesSharePanel.shareMembers')}
              </Switch>
              <FormHelperText ml="40px">
                {t('CirclesSharePanel.shareMembersHelp')}
              </FormHelperText>
            </FormControl>
          )}
        </VStack>

        {shareOrg && (
          <>
            <VStack spacing={4} align="start">
              <VStack spacing={1} align="start">
                <Heading as="h2" size="sm">
                  {t('CirclesSharePanel.headingLink')}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {t('CirclesSharePanel.headingLinkHelp')}
                </Text>
              </VStack>

              <GraphViewsSelect
                variant="outline"
                value={graphView}
                membersOption={false}
                onChange={setGraphView}
              />
              <Switch isChecked={zoom} onChange={() => setZoom((z) => !z)}>
                {t('CirclesSharePanel.zoom')}
              </Switch>
              <Switch
                isChecked={transparent}
                onChange={() => setTransparent((z) => !z)}
              >
                {t('CirclesSharePanel.transparent')}
              </Switch>
            </VStack>

            {/* The panel is narrow: the copy button sits below its field
                instead of next to it */}
            <VStack spacing={3} align="stretch">
              <Heading as="h3" size="xs">
                {t('CirclesSharePanel.link')}
              </Heading>
              <Input value={url} isReadOnly />
              <Button
                variant="solid"
                colorScheme="blue"
                leftIcon={<CopyIcon size={20} />}
                onClick={copyUrl}
              >
                {t('common.copy')}
              </Button>
            </VStack>

            <VStack spacing={3} align="stretch">
              <Heading as="h3" size="xs">
                {t('CirclesSharePanel.embed')}
              </Heading>
              <Textarea value={embed} isReadOnly h="120px" />
              <Button
                variant="solid"
                colorScheme="blue"
                leftIcon={<CopyIcon size={20} />}
                onClick={copyEmbed}
              >
                {t('common.copy')}
              </Button>
            </VStack>
          </>
        )}
      </VStack>
    </PanelLayout>
  )
}
