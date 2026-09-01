import BrandModal from '@/common/atoms/BrandModal'
import Loading from '@/common/atoms/Loading'
import useQueryParams from '@/common/hooks/useQueryParams'
import useOrg from '@/org/hooks/useOrg'
import { Button, Heading, VStack, useToast } from '@chakra-ui/react'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router'
import { track } from 'src/analytics'
import { trpc } from 'src/trpc'
import { useMemberInvitationInfo } from '../hooks/useMemberInvitationInfo'

type Params = {
  memberId: string
  token: string
}

export default function MemberInvitationPage() {
  const { t } = useTranslation()
  const { orgId } = useParams<{ orgId: string }>()
  const { memberId, token } = useQueryParams<Params>()
  const toast = useToast()
  const storeOrg = useOrg(orgId)
  const [isAccepting, setIsAccepting] = useState(false)

  // Get org information for the invitation
  const {
    data: invitationData,
    error,
    loading: loadingInvitation,
  } = useMemberInvitationInfo({ memberId, token })

  // Handle accept invitation
  const handleAccept = () => {
    if (!memberId || !token) return

    setIsAccepting(true)
    trpc.member.acceptMemberInvitation
      .mutate({ memberId, token })
      .then(() => {
        track('member_invitation_accepted')
        toast({
          title: t('MemberInvitationPage.toastSuccess'),
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      })
      .catch((error) => {
        console.error(error, JSON.stringify(error))
        setIsAccepting(false)
        toast({
          title: t('common.error'),
          description: error?.response?.data || error?.message || undefined,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      })
  }

  // When org is joined and exist in the store, redirect to the org page
  if (storeOrg) {
    return <Navigate to={`${getOrgPath(storeOrg)}/`} />
  }

  // If error occurred, redirect to home
  if (error) {
    return <Navigate to="/" />
  }

  // Show loading while fetching org data
  if (loadingInvitation) {
    return <Loading center active />
  }

  // Show modal with invitation details
  return (
    <BrandModal isOpen onClose={() => {}} size="md" backButton={false}>
      <VStack spacing={10} align="stretch">
        <Heading size="md" textAlign="center">
          {t('MemberInvitationPage.title', {
            orgName: invitationData?.orgName,
          })}
        </Heading>

        <VStack spacing={3}>
          <Button
            colorScheme="blue"
            width="100%"
            onClick={handleAccept}
            isLoading={isAccepting}
          >
            {t('MemberInvitationPage.accept')}
          </Button>

          <Button
            variant="ghost"
            width="100%"
            onClick={() => (window.location.href = '/')}
            isDisabled={isAccepting}
          >
            {t('MemberInvitationPage.cancel')}
          </Button>
        </VStack>
      </VStack>
    </BrandModal>
  )
}
