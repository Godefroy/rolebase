import { useOrgContext } from '@/org/contexts/OrgContext'
import { GetSearchResultsQuery, useGetSearchResultsLazyQuery } from '@gql'
import { truthy } from '@rolebase/shared/helpers/truthy'
import {
  AlgoliaConfig,
  SearchDoc,
  SearchTypes,
} from '@rolebase/shared/model/search'
import { UserLocalStorageKeys } from '@utils/localStorage'
import algoliasearch from 'algoliasearch'
import debounce from 'lodash.debounce'
import { useMemo, useState } from 'react'
import { trpc } from 'src/trpc'
import { SearchItem } from '../searchTypes'

async function getConfig(orgId: string): Promise<AlgoliaConfig> {
  const key = UserLocalStorageKeys.AlgoliaConfig.replace('{id}', orgId)

  // Use config from localStorage
  const localConfig = localStorage.getItem(key)
  if (localConfig) {
    return JSON.parse(localConfig)
  }

  // Query function to get Algolia config
  const config = await trpc.search.getAlgoliaConfig.query({ orgId })
  localStorage.setItem(key, JSON.stringify(config))
  return config
}

export function useAlgoliaSearch() {
  const { orgId } = useOrgContext()
  const [getSearchResults] = useGetSearchResultsLazyQuery()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<SearchItem[]>([])

  // Get Algolia config
  const indexPromise = useMemo(() => {
    if (!orgId) return
    return getConfig(orgId)
      .then((config) =>
        algoliasearch(config.appId, config.apiKey).initIndex(config.indexName)
      )
      .catch(console.error)
  }, [orgId])

  const search = useMemo(() => {
    return debounce(async (value: string, type?: SearchTypes) => {
      if (!value) {
        setItems([])
        return
      }

      // Wait for index to be ready
      const index = await indexPromise
      if (!index) {
        // Retry
        search(value, type)
        return
      }

      try {
        setLoading(true)

        // Search query
        const { hits } = await index.search<SearchDoc>(
          value,
          type ? { facetFilters: `type:${type}` } : undefined
        )

        // Get results data from database
        const { data, error } = await getSearchResults({
          variables: {
            membersIds: getHitsIds(hits, SearchTypes.Member),
            circlesIds: getHitsIds(hits, SearchTypes.Circle),
            threadsIds: getHitsIds(hits, SearchTypes.Thread),
            meetingsIds: getHitsIds(hits, SearchTypes.Meeting),
            tasksIds: getHitsIds(hits, SearchTypes.Task),
            decisionsIds: getHitsIds(hits, SearchTypes.Decision),
          },
        })

        if (!data) {
          throw error || new Error('No data')
        }

        // Build search items data with hots order
        const resultsItems = hits
          .map((hit) => getResultByHit(hit, data))
          .filter(truthy)

        setItems(resultsItems)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 200)
  }, [indexPromise])

  return {
    loading,
    items,
    search,
  }
}

function getHitsIds(hits: SearchDoc[], type: SearchTypes) {
  return hits.filter((hit) => hit.type === type).map((hit) => hit.objectID)
}

function getResultByHit(
  hit: SearchDoc,
  data: GetSearchResultsQuery
): SearchItem | undefined {
  switch (hit.type) {
    case SearchTypes.Circle: {
      const circle = data.circle.find((circle) => circle.id === hit.objectID)
      return (
        circle && {
          id: hit.objectID,
          type: hit.type,
          text: circle.role.name,
          title: circle.role.name,
        }
      )
    }

    case SearchTypes.Member: {
      const member = data.member.find((member) => member.id === hit.objectID)
      return (
        member && {
          id: hit.objectID,
          type: hit.type,
          text: member.name,
          title: member.name,
          picture: member.picture || undefined,
        }
      )
    }

    case SearchTypes.Thread: {
      const thread = data.thread.find((thread) => thread.id === hit.objectID)
      return (
        thread && {
          id: hit.objectID,
          type: hit.type,
          text: thread.title,
          title: thread.title,
          circleId: thread.circleId,
          date: thread.createdAt,
        }
      )
    }

    case SearchTypes.Meeting: {
      const meeting = data.meeting.find(
        (meeting) => meeting.id === hit.objectID
      )
      return (
        meeting && {
          id: hit.objectID,
          type: hit.type,
          text: meeting.title,
          title: meeting.title,
          circleId: meeting.circleId,
          date: meeting.startDate,
        }
      )
    }

    case SearchTypes.Task: {
      const task = data.task.find((task) => task.id === hit.objectID)
      return (
        task && {
          id: hit.objectID,
          type: hit.type,
          text: task.title,
          title: task.title,
          circleId: task.circleId,
          date: task.dueDate || undefined,
        }
      )
    }
    case SearchTypes.Decision: {
      const decision = data.decision.find(
        (decision) => decision.id === hit.objectID
      )
      return (
        decision && {
          id: hit.objectID,
          type: hit.type,
          text: decision.title,
          title: decision.title,
          date: decision.createdAt,
        }
      )
    }
  }
}
