import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  getSubscriptionSeats,
  isSubscriptionActive,
} from '@rolebase/shared/model/subscription'

export default function useSubscriptionData() {
  const { subscription, orgData } = useOrgContext()
  const members = orgData?.members

  const isActive = isSubscriptionActive(subscription?.status)
  const activeMembers =
    members?.filter((m) => !!m.userId || !!m.inviteEmail).length || 0
  const subscriptionSeats = getSubscriptionSeats(subscription)
  const availableSeats = Math.max(subscriptionSeats - activeMembers, 0)

  return {
    subscription,
    isActive,
    subscriptionSeats,
    availableSeats,
  }
}
