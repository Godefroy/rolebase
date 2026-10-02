import {
  Box,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react'
import React, { ChangeEventHandler, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteIcon, UploadIcon } from 'src/icons'
import BrandIcon from 'src/images/icon.svg'

interface Props {
  src?: string
  size?: number
  loading?: boolean
  onUpload(file: File): void
  onRemove(): void
}

// Org icon that opens a menu to upload an image or remove the icon. Shown at
// the left of the org name, in the org settings and the onboarding wizard.
export default function OrgIconMenu({
  src,
  size = 72,
  loading,
  onUpload,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
    // Reset input so selecting the same file again re-triggers change
    event.target.value = ''
  }

  const handleUploadClick = () => inputRef.current?.click()

  return (
    <>
      <Menu>
        <MenuButton
          aria-label={t('OrgIconMenu.label')}
          title={t('OrgIconMenu.label')}
          position="relative"
          flexShrink={0}
          boxSize={`${size}px`}
          borderRadius="md"
          borderWidth={src ? 0 : '1px'}
          overflow="hidden"
          bg="gray.50"
          _dark={{ bg: 'gray.700' }}
          _hover={{ opacity: 0.8 }}
          _focusVisible={{ boxShadow: 'outline' }}
          disabled={loading}
        >
          {src ? (
            <Image src={src} alt="" boxSize={`${size}px`} objectFit="cover" />
          ) : (
            <Box
              boxSize={`${size}px`}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <BrandIcon width={size / 2} height={size / 2} />
            </Box>
          )}
          {loading && (
            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(0, 0, 0, 0.4)"
            >
              <Spinner color="white" />
            </Box>
          )}
        </MenuButton>

        <MenuList zIndex={10} shadow="lg">
          <MenuItem icon={<UploadIcon size={20} />} onClick={handleUploadClick}>
            {t('OrgIconMenu.upload')}
          </MenuItem>
          {src && (
            <MenuItem icon={<DeleteIcon size={20} />} onClick={onRemove}>
              {t('common.delete')}
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <input
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  )
}
