import { useOrgContext } from '@/org/contexts/OrgContext'
import { useLastNewsQuery } from '@gql'
import { useEffect, useRef } from 'react'

export function useNewsFeed(circleId: string | undefined, limit = 8) {
  const { orgId } = useOrgContext()
  const bottomRef = useRef(null)

  // Subscribe to news
  const { data, error, loading, fetchMore } = useLastNewsQuery({
    skip: !orgId && !circleId,
    variables: {
      where: circleId
        ? { circleId: { _eq: circleId } }
        : { orgId: { _eq: orgId } },
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
