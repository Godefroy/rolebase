import useQueryParams from '@/common/hooks/useQueryParams'

// Graph view held in the URL. Every navigation that changes the selected
// circle or member rebuilds the query string, so it has to carry it over or
// the org chart falls back to the organization default.
export default function useGraphViewParam(): string | undefined {
  return useQueryParams<{ view: string }>().view
}
