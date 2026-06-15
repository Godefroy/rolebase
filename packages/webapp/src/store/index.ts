import memberStatus from '@/member/store/memberStatus'
import orgs from '@/org/store/orgs'
import { createStore } from 'easy-peasy'

const model = {
  orgs,
  memberStatus,
}

export type StoreModel = typeof model

export const store = createStore(model)
