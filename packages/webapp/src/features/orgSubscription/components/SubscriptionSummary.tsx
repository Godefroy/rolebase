import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
  Spinner,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Subscription_Plan_Type_Enum } from '@gql'
import {
  CustomerBillingDetails,
  PricePreview,
} from '@rolebase/shared/model/subscription'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'

type SubscriptionSummaryProps = {
  planType: Subscription_Plan_Type_Enum
  billingDetails: CustomerBillingDetails
  onPromoApplied: (promoCode: string) => void
} & StackProps

export default function SubscriptionSummary({
  planType,
  billingDetails,
  onPromoApplied,
  ...stackProps
}: SubscriptionSummaryProps) {
  const { t } = useTranslation()
  const [coupon, setCoupon] = useState<string>('')
  const [retrievedCoupon, setRetrievedCoupon] = useState<PricePreview>()
  const [couponError, setCouponError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [couponDuration, setCouponDuration] = useState<number>()
  const [priceData, setPriceData] =
    useState<Omit<PricePreview, 'promotionCode'>>()
  const { orgId } = useOrgContext()
  const parsedDetails = useMemo(() => {
    if (!billingDetails?.address) return []

    return [billingDetails.name, ...Object.values(billingDetails.address)]
  }, [billingDetails])

  const textProps = useMemo(
    () => ({
      color: 'gray.600',
      _dark: {
        color: 'gray.200',
      },
    }),
    []
  )

  const retrievePricePreview = async () => {
    const address = billingDetails.address
    if (!address) return

    setLoading(true)

    try {
      const retrieved = await trpc.orgSubscription.getPricePreview.query({
        orgId: orgId ?? '',
        promotionCode: coupon,
        planType,
        address,
      })

      if (retrieved && retrieved.promotionCode) {
        setRetrievedCoupon(retrieved)
        onPromoApplied(coupon)
      }

      if (retrieved) {
        setPriceData(retrieved)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    retrievePricePreview()
  }, [billingDetails])

  const formatPriceCents = (price?: number) => {
    return price ? (price / 100).toFixed(2) : '0.00'
  }

  const applyCoupon = async () => {
    if (!coupon) return
    setCouponError('')
    setCouponDuration(undefined)
    try {
      await retrievePricePreview()
    } catch (e: any) {
      setCouponError(t('SubscriptionTabs.paymentModal.invalidPromotionCode'))
    }
  }

  const discountText = useMemo(() => {
    const { promotionCode } = retrievedCoupon ?? {}

    if (promotionCode) {
      if (promotionCode.amountOff) {
        return `(${promotionCode.name}: -${promotionCode.amountOff}€)`
      }

      if (promotionCode.percentOff) {
        return `(${promotionCode.name}: -${promotionCode.percentOff}%)`
      }
    }
  }, [retrievedCoupon])

  const calculatedPrice = priceData
    ? priceData.subTotalPerSeatInCents * priceData.quantity
    : 0

  const totalPrice = useMemo(() => {
    const { promotionCode } = retrievedCoupon ?? {}

    if (promotionCode) {
      if (promotionCode.amountOff && calculatedPrice)
        return calculatedPrice - promotionCode.amountOff
      if (promotionCode.percentOff && calculatedPrice)
        return (
          calculatedPrice - (calculatedPrice * promotionCode.percentOff) / 100
        )
    }

    return calculatedPrice
  }, [priceData, retrievedCoupon])

  const totalPriceWithVAT = useMemo(() => {
    return totalPrice + (totalPrice * priceData?.tax?.percentage!) / 100
  }, [priceData, totalPrice])

  const pricePerMonth = useMemo(() => {
    const { promotionCode } = retrievedCoupon ?? {}

    if (promotionCode) {
      if (promotionCode.duration.type === 'once') {
        return (
          priceData && priceData.subTotalPerSeatInCents * priceData.quantity
        )
      } else if (
        promotionCode.duration.type === 'repeating' &&
        promotionCode.duration.durationInMonth !== null
      ) {
        setCouponDuration(promotionCode.duration.durationInMonth)
        return totalPrice
      } else {
        return totalPrice
      }
    }
    return totalPrice
  }, [retrievedCoupon, totalPrice])

  return (
    <VStack w="100%" {...stackProps}>
      <Flex flexDir="column" alignItems="stretch" gap="2" h="100%" w="100%">
        <Card w="100%" h="100%" p="3" variant="outline">
          <Heading as="h4" fontSize="md" mb="4">
            {t('SubscriptionTabs.paymentModal.details')}
          </Heading>
          <VStack alignItems={'start'}>
            {parsedDetails.map((detail) => (
              <Text mt="0 !important" key={detail} {...textProps}>
                {detail}
              </Text>
            ))}
          </VStack>
        </Card>

        <Card w="100%" h="100%" p="3" variant="outline">
          <VStack h="100%" alignItems="space-between">
            <Heading as="h4" fontSize="md" mb="4">
              {t('SubscriptionTabs.paymentModal.payment')}
            </Heading>
            {loading && (
              <HStack w="100%" justify="center">
                <Spinner size="xl" />
              </HStack>
            )}
            {!loading && (
              <>
                <Box>
                  <HStack justifyContent="space-between" fontSize={14}>
                    <Text>
                      {t('SubscriptionTabs.paymentModal.subscription')}
                    </Text>
                    <Text {...textProps}>
                      {capitalizeFirstLetter(planType.toLocaleLowerCase())}
                    </Text>
                  </HStack>

                  <HStack justifyContent="space-between" fontSize={14}>
                    <Text>
                      {t('SubscriptionTabs.paymentModal.pricePerSeat')}
                    </Text>
                    <Text {...textProps}>
                      {formatPriceCents(priceData?.subTotalPerSeatInCents)} €
                    </Text>
                  </HStack>

                  <HStack justifyContent="space-between" fontSize={14}>
                    <Text>
                      {t('SubscriptionTabs.paymentModal.nbSeat', {
                        count: priceData?.quantity,
                      })}
                    </Text>
                    <Text {...textProps}>{priceData?.quantity}</Text>
                  </HStack>

                  <Divider mt="1" mb="2" />
                  {retrievedCoupon && (
                    <HStack
                      justifyContent="space-between"
                      alignItems="end"
                      fontSize={14}
                    >
                      <Text>{t('SubscriptionTabs.paymentModal.dueNow')}</Text>
                      <Flex flexDir="column" alignItems="end">
                        <Flex
                          flexDir="column"
                          alignItems="end"
                          fontWeight="400 !important"
                          as="i"
                          fontSize={12}
                        >
                          <Text textDecoration="line-through" {...textProps}>
                            {formatPriceCents(calculatedPrice)} €
                          </Text>
                          <Text {...textProps}>{discountText}</Text>
                        </Flex>
                        <Text fontSize={18} {...textProps}>
                          {formatPriceCents(totalPrice)} €
                        </Text>
                      </Flex>
                    </HStack>
                  )}

                  <HStack
                    justifyContent="space-between"
                    alignItems="end"
                    fontSize={14}
                  >
                    <Text>
                      {t(
                        `SubscriptionTabs.paymentModal.${
                          priceData?.tax ? 'subTotal' : 'total'
                        }`
                      )}
                    </Text>
                    <Text fontSize={18} {...textProps}>
                      {t('SubscriptionTabs.paymentModal.pricePerMonth', {
                        price: formatPriceCents(pricePerMonth),
                      })}
                    </Text>
                  </HStack>

                  {couponDuration && (
                    <Flex w="100%" justify="end">
                      <Text fontSize={12} {...textProps}>
                        {t('SubscriptionTabs.paymentModal.duration', {
                          price: calculatedPrice / 100,
                          durationInMonth: couponDuration,
                        })}
                      </Text>
                    </Flex>
                  )}

                  {priceData?.tax && (
                    <HStack
                      justifyContent="space-between"
                      alignItems="end"
                      fontSize={14}
                    >
                      <Text>
                        {t('SubscriptionTabs.paymentModal.totalWithVAT', {
                          percentage: priceData.tax.percentage,
                          amount:
                            (totalPrice * priceData?.tax?.percentage!) / 10000,
                        })}
                      </Text>
                      <Text fontSize={18} {...textProps}>
                        {t('SubscriptionTabs.paymentModal.pricePerMonth', {
                          price: formatPriceCents(totalPriceWithVAT),
                        })}
                      </Text>
                    </HStack>
                  )}
                </Box>
              </>
            )}
          </VStack>
        </Card>
      </Flex>
      <Flex mt="5" justifyContent="end" w="100%" gap="2">
        <Input
          value={coupon}
          placeholder={t('SubscriptionTabs.paymentModal.promotionPlaceholder')}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <Button isLoading={loading} onClick={applyCoupon}>
          {t('common.apply')}
        </Button>
      </Flex>
      {couponError && <Text color="red.500">{couponError}</Text>}
    </VStack>
  )
}
