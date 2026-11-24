import CircleSearchButton from '@/search/components/CircleSearchButton'
import CircleSearchInput from '@/search/components/CircleSearchInput'
import MemberSearchButton from '@/search/components/MemberSearchButton'
import MemberSearchInput from '@/search/components/MemberSearchInput'
import { BoxProps, ButtonGroup } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'src/icons'

interface Props extends BoxProps {
  circleId?: string
  memberId?: string
  onCircleChange?(circleId: string | undefined): void
  onMemberChange?(memberId: string | undefined): void
}

export default function CircleAndMemberFilters({
  circleId,
  memberId,
  onCircleChange,
  onMemberChange,
  children,
  ...boxProps
}: Props) {
  const { t } = useTranslation()

  return (
    <ButtonGroup
      size="sm"
      variant="outline"
      spacing={0}
      gap={2}
      flexWrap="wrap"
      {...boxProps}
    >
      {onCircleChange &&
        (circleId ? (
          <CircleSearchInput
            value={circleId}
            placeholder={t('CircleAndMemberFilters.circle')}
            maxW="170px"
            onChange={onCircleChange}
            onClear={() => onCircleChange(undefined)}
          />
        ) : (
          <CircleSearchButton
            rightIcon={<ChevronDownIcon size="1em" />}
            fontWeight="normal"
            onSelect={onCircleChange}
          >
            {t('CircleAndMemberFilters.circle')}
          </CircleSearchButton>
        ))}

      {onMemberChange &&
        (memberId ? (
          <MemberSearchInput
            value={memberId}
            placeholder={t('CircleAndMemberFilters.member')}
            maxW="170px"
            onChange={onMemberChange}
            onClear={() => onMemberChange(undefined)}
          />
        ) : (
          <MemberSearchButton
            rightIcon={<ChevronDownIcon size="1em" />}
            fontWeight="normal"
            onSelect={onMemberChange}
          >
            {t('CircleAndMemberFilters.member')}
          </MemberSearchButton>
        ))}

      {children}
    </ButtonGroup>
  )
}
