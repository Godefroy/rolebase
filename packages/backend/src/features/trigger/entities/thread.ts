import { SearchDoc, SearchTypes } from '@rolebase/shared/model/search'
import {
  DocumentType,
  ThreadActivityFragment,
  ThreadFragment,
  gql,
} from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import getActivitiesEditorTextByType from '../../../utils/getActivitiesEditorTextByType'
import { HasuraEvent } from '../../../utils/nhost'
import { IndexEntity } from './IndexEntity'

const Fragment = gql(`
  fragment ThreadSearch on thread {
    id
    orgId
    title
    createdAt
    activities {
      type
      data
    }
  }
`)

const transform = (fragment: DocumentType<typeof Fragment>): SearchDoc => ({
  objectID: fragment.id,
  orgId: fragment.orgId,
  type: SearchTypes.Thread,
  title: fragment.title,
  description: fragment.activities
    .map((activity) =>
      getActivitiesEditorTextByType(activity.data, activity.type)
    )
    .join('\n'),
  boost: 0,
})

export class IndexThread extends IndexEntity<ThreadFragment> {
  static table = 'public.thread'

  async getById(id: string) {
    const { thread_by_pk: thread } = await adminRequest(
      gql(`
        query GetThreadForSearch($id: uuid!) {
          thread_by_pk(id: $id) {
            ...ThreadSearch
          }
        }
      `),
      { id }
    )
    if (!thread) return undefined
    return thread && transform(thread)
  }

  async getAll() {
    const { thread } = await adminRequest(
      gql(`
        query GetThreadsForSearch {
          thread(where: { archivedAt: { _is_null: true } }) {
            ...ThreadSearch
          }
        }
      `)
    )
    return thread.map(transform)
  }
}

export class IndexThreadActivity extends IndexEntity<ThreadActivityFragment> {
  static table = 'public.thread_activity'

  async applyEvent(event: HasuraEvent<ThreadActivityFragment>) {
    const { data } = event.event
    const threadId = data.new?.threadId

    if (threadId && data.new?.data !== data.old?.data) {
      const searchDoc = await new IndexThread().getById(threadId)
      if (!searchDoc) return
      // Update thread
      await this.index.saveObject(searchDoc).catch(console.error)
    }
  }
}
