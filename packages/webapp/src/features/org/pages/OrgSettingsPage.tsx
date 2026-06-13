import GraphViewsSelect from '@/circle/components/GraphViewsSelect'
import IconTextButton from '@/common/atoms/IconTextButton'
import SwitchController from '@/common/atoms/SwitchController'
import { Title } from '@/common/atoms/Title'
import useCopyUrl from '@/common/hooks/useCopyUrl'
import { CirclesGraphViews } from '@/graph/types'
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { nameSchema } from '@rolebase/shared/schemas'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CopyIcon, EditIcon } from 'src/icons'
import settings from 'src/settings'
import * as yup from 'yup'
import useOrg from '../hooks/useOrg'
import { useOrgId } from '../hooks/useOrgId'
import OrgIconEdit from '../components/OrgIconEdit'
import OrgDeleteModal from '../modals/OrgDeleteModal'
import OrgSlugModal from '../modals/OrgSlugModal '

interface Values {
  name: string
  protectGovernance: boolean
  defaultGraphView: CirclesGraphViews
}

const resolver = yupResolver(
  yup.object().shape({
    name: nameSchema.required(),
  })
)

export default function OrgSettingsPage() {
  const orgId = useOrgId()
  const org = useOrg(orgId)
  const { t } = useTranslation()
  const toast = useToast()
  const [editOrg] = useUpdateOrgMutation()

  const deleteModal = useDisclosure()
  const slugModal = useDisclosure()

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver })

  // Init form data
  useEffect(() => {
    if (!org) return
    reset({
      name: org.name,
      defaultGraphView: org.defaultGraphView || CirclesGraphViews.AllCircles,
      protectGovernance: org.protectGovernance,
    })
  }, [org])

  const onSubmit = handleSubmit(async (values) => {
    await editOrg({ variables: { id: orgId!, values } })
    toast({
      title: t('Settings.toastSaved'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  })

  // URL
  const url = settings.url + (org ? getOrgPath(org) : '')
  const copyUrl = useCopyUrl(url)

  if (!org || !orgId) return null

  return (
    <>
      <Title>{t('Settings.orgSettings')}</Title>

      <form onSubmit={onSubmit}>
        <VStack spacing={10} align="start" maxW="xl">
          <Heading as="h1" size="lg">
            {t('Settings.orgSettings')}
          </Heading>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>{t('common.name')}</FormLabel>
            <Input {...register('name')} autoComplete="off" />
          </FormControl>

          <FormControl>
            <FormLabel>{t('OrgEditModal.icon')}</FormLabel>
            <OrgIconEdit id={orgId} icon={org.icon} name={org.name} />
            <FormHelperText>{t('OrgEditModal.iconHelp')}</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>{t('OrgEditModal.slug')}</FormLabel>
            <Flex>
              <InputGroup>
                <Input value={url} isReadOnly />
                <InputRightElement>
                  <IconTextButton
                    aria-label={t('common.copy')}
                    icon={<CopyIcon size={20} />}
                    onClick={copyUrl}
                  />
                </InputRightElement>
              </InputGroup>
              <Button
                ml={1}
                leftIcon={<EditIcon size={20} />}
                onClick={slugModal.onOpen}
              >
                {t('common.edit')}
              </Button>
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel>{t('OrgEditModal.defaultGraphView')}</FormLabel>
            <Controller
              name="defaultGraphView"
              control={control}
              render={({ field }) => (
                <GraphViewsSelect
                  value={field.value}
                  onChange={field.onChange}
                  variant="outline"
                />
              )}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t('OrgEditModal.security')}</FormLabel>
            <SwitchController name="protectGovernance" control={control}>
              {t('OrgEditModal.protectGovernance')}
            </SwitchController>
            <FormHelperText ml="40px">
              {t('OrgEditModal.protectGovernanceHelp')}
            </FormHelperText>
          </FormControl>

          <Flex w="100%" justify="space-between" pt={4}>
            <Button
              colorScheme="red"
              variant="ghost"
              onClick={deleteModal.onOpen}
            >
              {t('common.delete')}
            </Button>
            <Button colorScheme="blue" type="submit">
              {t('common.save')}
            </Button>
          </Flex>
        </VStack>
      </form>

      {deleteModal.isOpen && (
        <OrgDeleteModal id={orgId} isOpen onClose={deleteModal.onClose} />
      )}

      {slugModal.isOpen && (
        <OrgSlugModal id={orgId} isOpen onClose={slugModal.onClose} />
      )}
    </>
  )
}
