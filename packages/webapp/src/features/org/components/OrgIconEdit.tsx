import { getResizedImageUrl } from '@rolebase/shared/helpers/getResizedImageUrl'
import {
  Box,
  Button,
  chakra,
  HStack,
  Image,
  Spinner,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { useUpdateOrgMutation } from '@gql'
import React, {
  ChangeEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { UploadIcon } from 'src/icons'
import BrandIcon from 'src/images/icon.svg'
import { nhost } from 'src/nhost'

const iconSize = 80

interface Props {
  id: string
  icon?: string | null
  name?: string
}

export default function OrgIconEdit({ id, icon, name }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [updateOrg] = useUpdateOrgMutation()
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      const file = event.target.files?.[0]
      if (file) {
        setLoading(true)
        try {
          const fileName = `orgs/${id}/icon`
          const { body } = await nhost.storage.uploadFiles({
            'file[]': [file],
            'metadata[]': [{ name: fileName }],
          })
          const fileId = body.processedFiles[0].id
          const iconUrl = `${nhost.storage.baseURL}/files/${fileId}`
          await updateOrg({
            variables: { id, values: { icon: iconUrl, iconFileId: fileId } },
          })
        } catch (error) {
          toast({
            title: t('common.error'),
            description: error instanceof Error ? error.message : '',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
        setLoading(false)
      }
      // Reset input so selecting the same file again re-triggers change
      if (inputRef.current) inputRef.current.value = ''
    },
    [id]
  )

  const handleRemove = useCallback(() => {
    updateOrg({ variables: { id, values: { icon: null, iconFileId: null } } })
  }, [id])

  const src = icon
    ? getResizedImageUrl(icon, iconSize * 2) || undefined
    : undefined

  return (
    <HStack spacing={3} align="center">
      <chakra.label position="relative" cursor="pointer">
        <Tooltip label={t('OrgIconEdit.editIcon')} placement="top" hasArrow>
          <Box
            position="absolute"
            w="100%"
            h="100%"
            zIndex={1}
            borderRadius="md"
            opacity={loading ? 1 : 0}
            _hover={{ opacity: 1 }}
            bg="rgba(0, 0, 0, 0.4)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <Spinner color="white" />
            ) : (
              <UploadIcon size={32} color="white" />
            )}
          </Box>
        </Tooltip>

        {src ? (
          <Image
            src={src}
            alt={name || ''}
            boxSize={`${iconSize}px`}
            objectFit="cover"
            borderRadius="md"
          />
        ) : (
          <Box
            boxSize={`${iconSize}px`}
            borderRadius="md"
            borderWidth="1px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
            _dark={{ bg: 'gray.700' }}
          >
            <BrandIcon width={40} height={40} />
          </Box>
        )}

        <input
          ref={inputRef}
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
        />
      </chakra.label>

      {icon && (
        <Button variant="ghost" size="sm" onClick={handleRemove}>
          {t('common.delete')}
        </Button>
      )}
    </HStack>
  )
}
