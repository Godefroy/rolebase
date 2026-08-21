import { useOrgContext } from '@/org/contexts/OrgContext'
import { News_Bool_Exp, useLastNewsQuery } from '@gql'
import { useEffect, useMemo, useRef } from 'react'
import { NewsType, newsTypeColumns } from '../newsTypes'

export function useNewsFeed(
  circleId: string | undefined,
  type?: NewsType,
  limit = 8
) {
  const { orgId } = useOrgContext()
  const bottomRef = useRef(null)

  const where = useMemo((): News_Bool_Exp => {
    const scope: News_Bool_Exp = circleId
      ? { circleId: { _eq: circleId } }
      : { orgId: { _eq: orgId } }
    if (!type) return scope
    return { ...scope, [newsTypeColumns[type]]: { _is_null: false } }
  }, [circleId, orgId, type])

  // Subscribe to news
  const { data, error, loading, fetchMore } = useLastNewsQuery({
    skip: !orgId && !circleId,
    variables: {
      where,
      limit,
    },
    fetchPolicy: 'cache-and-network',
    initialFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })
  const news = data?.news
  const count = data?.news_aggregate.aggregate?.count

  // Load more news when user reaches bottom of page
  useEffect(() => {
    if (!bottomRef.current || !news || news.length === count || loading) return

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchMore({
          variables: {
            offset: news.length,
          },
          // Update cache with new news
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult
            }
            return {
              ...fetchMoreResult,
              news: [...previousResult.news, ...fetchMoreResult.news],
            }
          },
        })
      }
    }, options)

    observer.observe(bottomRef.current)

    return () => {
      if (!bottomRef.current) return
      observer.unobserve(bottomRef.current)
    }
  }, [news, loading])

  return { news, error, loading, bottomRef }
}
