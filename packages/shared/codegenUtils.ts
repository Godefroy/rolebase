export const schemaOverridesPath = `${__dirname}/model/schema-overrides.gql`
export const fragmentsPath = `${__dirname}/fragments/*.gql`

export function getAddPlugin() {
  return {
    add: {
      content: `
import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import { MeetingStepConfig, VideoConf } from '@rolebase/shared/model/meeting'
import { MeetingStepData } from '@rolebase/shared/model/meeting_step'
import { ParticipantsScope } from '@rolebase/shared/model/participants'
import { LogDisplay, EntitiesChanges } from '@rolebase/shared/model/log'
import { UserMetadata } from '@rolebase/shared/model/user'
`,
    },
  }
}

export function getConfig() {
  return {
    // Required for merge-and-override of schemas
    //ignoreFieldConflicts: true,
    onFieldTypeConflict: (left: any) => left,
    // Keep native TS enums and "any" for unmapped scalars (defaults changed in codegen v6+)
    enumType: 'native',
    defaultScalarType: 'any',
    // Set scalars to avoid "any" type
    scalars: {
      uuid: 'string',
      smallint: 'number',
      bigint: 'number',
      timestamptz: 'string',
      citext: 'string',
      user_metadata: 'UserMetadata',
      participants_scope: 'ParticipantsScope',
      graph_views: 'CirclesGraphViews',
      meeting_step_config: 'MeetingStepConfig',
      meeting_step_data: 'MeetingStepData',
      videoconf: 'VideoConf',
      log_display: 'LogDisplay',
      log_changes: 'EntitiesChanges',
    },
  }
}
