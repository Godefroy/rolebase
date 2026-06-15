import { useOrgContext } from '@/org/contexts/OrgContext'
import { Button, Menu, MenuButton } from '@chakra-ui/react'
import { MeetingTemplateFragment, useMeetingTemplatesSubscription } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'
import MeetingTemplateMenuList from './MeetingTemplateMenuList'

interface Props {
  onSelect: (template: MeetingTemplateFragment) => void
}

export default function MeetingTemplateMenu({ onSelect }: Props) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()

  // Subscribe to templates
  const { data } = useMeetingTemplatesSubscription({
    skip: !orgId,
    variables: { orgId: orgId! },
  })
  const meetingTemplates = data?.meeting_template

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        size="sm"
        variant="link"
        rightIcon={<ChevronDownIcon size="1em" />}
      >
        {t('MeetingTemplateMenu.menu')}
      </MenuButton>
      <MeetingTemplateMenuList
        meetingTemplates={meetingTemplates}
        onSelect={onSelect}
      />
    </Menu>
  )
}
