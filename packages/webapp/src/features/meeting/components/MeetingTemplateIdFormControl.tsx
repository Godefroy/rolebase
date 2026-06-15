import TextErrors from '@/common/atoms/TextErrors'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Menu,
  useMenuButton,
} from '@chakra-ui/react'
import { useMeetingTemplatesSubscription } from '@gql'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'
import MeetingTemplateMenuList from './MeetingTemplateMenuList'

export default function MeetingTemplateIdFormControl() {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  // Subscribe to templates
  const {
    data,
    loading,
    error: meetingTemplatesError,
  } = useMeetingTemplatesSubscription({
    skip: !orgId,
    variables: { orgId: orgId! },
  })
  const meetingTemplates = data?.meeting_template

  return (
    <FormControl isInvalid={!!errors.templateId}>
      <FormLabel>{t('MeetingTemplateIdFormControl.template')}</FormLabel>

      <TextErrors errors={[meetingTemplatesError]} />

      <Controller
        name="templateId"
        control={control}
        render={({ field }) => (
          <Menu placement="bottom-start">
            <MenuButton>
              {loading
                ? '…'
                : meetingTemplates?.find((mt) => mt.id === field.value)
                    ?.title || t('MeetingTemplateIdFormControl.select')}
            </MenuButton>
            <MeetingTemplateMenuList
              meetingTemplates={meetingTemplates}
              onSelect={(template) => field.onChange(template.id)}
            />
          </Menu>
        )}
      />
    </FormControl>
  )
}

interface MenuButtonProps {
  children: string
}

function MenuButton({ children }: MenuButtonProps) {
  const buttonProps = useMenuButton()
  return (
    <Box position="relative" w="100%">
      <Flex
        position="absolute"
        right={3}
        top={0}
        bottom={0}
        alignItems="center"
      >
        <ChevronDownIcon size="1em" />
      </Flex>
      <Input {...buttonProps} cursor="pointer" isReadOnly value={children} />
    </Box>
  )
}
