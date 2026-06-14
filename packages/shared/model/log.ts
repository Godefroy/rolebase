import {
  CircleFragment,
  CircleLinkFragment,
  CircleMemberFragment,
  RoleFragment,
} from '../gql'

// Logs concern the org chart only (circles, roles, circle members, circle
// links). This keeps the log system identical for direct edits and proposals.
export enum LogType {
  CircleCreate = 'CircleCreate',
  CircleMove = 'CircleMove',
  CircleCopy = 'CircleCopy',
  CircleArchive = 'CircleArchive',
  CircleMemberAdd = 'CircleMemberAdd',
  CircleMemberRemove = 'CircleMemberRemove',
  CircleLinkAdd = 'CircleLinkAdd',
  CircleLinkRemove = 'CircleLinkRemove',
  RoleCreate = 'RoleCreate',
  RoleUpdate = 'RoleUpdate',
  RoleArchive = 'RoleArchive',
}

export type LogDisplay =
  | {
      type: LogType.CircleCreate | LogType.CircleMove | LogType.CircleCopy
      id: string
      name: string
      parentId: string | null
      parentName: string | null
    }
  | {
      type:
        | LogType.CircleArchive
        | LogType.RoleCreate
        | LogType.RoleUpdate
        | LogType.RoleArchive
      id: string
      name: string
    }
  | {
      type: LogType.CircleMemberAdd | LogType.CircleMemberRemove
      id: string
      name: string
      memberId: string
      memberName: string
    }
  | {
      type: LogType.CircleLinkAdd | LogType.CircleLinkRemove
      id: string // host (parent) circle id
      name: string // host (parent) circle name
      circleId: string // invited circle id
      circleName: string // invited circle name
    }

export enum EntityChangeType {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}

export type EntityChange<Entity> =
  | {
      type: EntityChangeType.Create
      id: string
      data: Entity
    }
  | {
      type: EntityChangeType.Update
      id: string
      prevData: Partial<Entity>
      newData: Partial<Entity>
    }
  | {
      type: EntityChangeType.Delete
      id: string
      data: Entity
    }

export interface EntitiesTypes {
  circles: CircleFragment
  circlesMembers: CircleMemberFragment
  circlesLinks: CircleLinkFragment
  roles: RoleFragment
}

export type EntitiesChanges = {
  [type in keyof EntitiesTypes]?: EntityChange<EntitiesTypes[type]>[]
}

export type EntityMethodGet<Entity> = (
  id: string
) => Promise<Entity | undefined>

export type EntityMethodCreate<Entity> = (data: Entity) => Promise<void>

export type EntityMethodUpdate<Entity> = (
  id: string,
  data: Partial<Entity>
) => Promise<void>

export interface EntityMethods<Entity> {
  get: EntityMethodGet<Entity>
  update: EntityMethodUpdate<Entity>
}

export type EntitiesMethods = {
  [type in keyof EntitiesTypes]: EntityMethods<EntitiesTypes[type]>
}

// Methods to apply changes forward (replay), including creation
export interface EntityApplyMethods<Entity> {
  get: EntityMethodGet<Entity>
  create: EntityMethodCreate<Entity>
  update: EntityMethodUpdate<Entity>
}

export type EntitiesApplyMethods = {
  [type in keyof EntitiesTypes]: EntityApplyMethods<EntitiesTypes[type]>
}
