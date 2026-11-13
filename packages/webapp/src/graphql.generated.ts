/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import { MeetingStepConfig, VideoConf } from '@rolebase/shared/model/meeting'
import { MeetingStepData } from '@rolebase/shared/model/meeting_step'
import { ParticipantsScope } from '@rolebase/shared/model/participants'
import { LogDisplay, EntitiesChanges } from '@rolebase/shared/model/log'
import { UserMetadata } from '@rolebase/shared/model/user'

const defaultOptions = {} as const;
/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: boolean | null | undefined;
  _gt?: boolean | null | undefined;
  _gte?: boolean | null | undefined;
  _in?: Array<boolean> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: boolean | null | undefined;
  _lte?: boolean | null | undefined;
  _neq?: boolean | null | undefined;
  _nin?: Array<boolean> | null | undefined;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: number | null | undefined;
  _gt?: number | null | undefined;
  _gte?: number | null | undefined;
  _in?: Array<number> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: number | null | undefined;
  _lte?: number | null | undefined;
  _neq?: number | null | undefined;
  _nin?: Array<number> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: Array<string> | null | undefined;
  /** does the array contain the given value */
  _contains?: Array<string> | null | undefined;
  _eq?: Array<string> | null | undefined;
  _gt?: Array<string> | null | undefined;
  _gte?: Array<string> | null | undefined;
  _in?: Array<Array<string>> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: Array<string> | null | undefined;
  _lte?: Array<string> | null | undefined;
  _neq?: Array<string> | null | undefined;
  _nin?: Array<Array<string>> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  /** does the column match the given case-insensitive pattern */
  _ilike?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: string | null | undefined;
  _is_null?: boolean | null | undefined;
  /** does the column match the given pattern */
  _like?: string | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: string | null | undefined;
  /** does the column NOT match the given pattern */
  _nlike?: string | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: string | null | undefined;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: string | null | undefined;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: string | null | undefined;
  /** does the column match the given SQL regular expression */
  _similar?: string | null | undefined;
};

export enum App_Type_Enum {
  GoogleCalendar = 'GoogleCalendar',
  Office365 = 'Office365'
}

/** Boolean expression to compare columns of type "app_type_enum". All fields are combined with logical 'AND'. */
export type App_Type_Enum_Comparison_Exp = {
  _eq?: App_Type_Enum | null | undefined;
  _in?: Array<App_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: App_Type_Enum | null | undefined;
  _nin?: Array<App_Type_Enum> | null | undefined;
};

export type AuthOauth2AuthRequests_Aggregate_Bool_Exp = {
  bool_and?: AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: AuthOauth2AuthRequests_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_And = {
  arguments: AuthOauth2AuthRequests_Select_Column_AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_Or = {
  arguments: AuthOauth2AuthRequests_Select_Column_AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type AuthOauth2AuthRequests_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthOauth2AuthRequests_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.oauth2_auth_requests" */
export type AuthOauth2AuthRequests_Arr_Rel_Insert_Input = {
  data: Array<AuthOauth2AuthRequests_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthOauth2AuthRequests_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.oauth2_auth_requests". All fields are combined with a logical 'AND'. */
export type AuthOauth2AuthRequests_Bool_Exp = {
  _and?: Array<AuthOauth2AuthRequests_Bool_Exp> | null | undefined;
  _not?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  _or?: Array<AuthOauth2AuthRequests_Bool_Exp> | null | undefined;
  authTime?: Timestamptz_Comparison_Exp | null | undefined;
  authorizationCodes?: AuthOauth2AuthorizationCodes_Bool_Exp | null | undefined;
  authorizationCodes_aggregate?: AuthOauth2AuthorizationCodes_Aggregate_Bool_Exp | null | undefined;
  client?: AuthOauth2Clients_Bool_Exp | null | undefined;
  clientId?: String_Comparison_Exp | null | undefined;
  codeChallenge?: String_Comparison_Exp | null | undefined;
  codeChallengeMethod?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  done?: Boolean_Comparison_Exp | null | undefined;
  expiresAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  nonce?: String_Comparison_Exp | null | undefined;
  redirectUri?: String_Comparison_Exp | null | undefined;
  refreshTokens?: AuthOauth2RefreshTokens_Bool_Exp | null | undefined;
  refreshTokens_aggregate?: AuthOauth2RefreshTokens_Aggregate_Bool_Exp | null | undefined;
  resource?: String_Comparison_Exp | null | undefined;
  responseType?: String_Comparison_Exp | null | undefined;
  scopes?: String_Array_Comparison_Exp | null | undefined;
  state?: String_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.oauth2_auth_requests" */
export enum AuthOauth2AuthRequests_Constraint {
  /** unique or primary key constraint on columns "id" */
  Oauth2AuthRequestsPkey = 'oauth2_auth_requests_pkey'
}

/** input type for inserting data into table "auth.oauth2_auth_requests" */
export type AuthOauth2AuthRequests_Insert_Input = {
  authTime?: string | null | undefined;
  authorizationCodes?: AuthOauth2AuthorizationCodes_Arr_Rel_Insert_Input | null | undefined;
  client?: AuthOauth2Clients_Obj_Rel_Insert_Input | null | undefined;
  clientId?: string | null | undefined;
  codeChallenge?: string | null | undefined;
  codeChallengeMethod?: string | null | undefined;
  createdAt?: string | null | undefined;
  done?: boolean | null | undefined;
  expiresAt?: string | null | undefined;
  id?: string | null | undefined;
  nonce?: string | null | undefined;
  redirectUri?: string | null | undefined;
  refreshTokens?: AuthOauth2RefreshTokens_Arr_Rel_Insert_Input | null | undefined;
  resource?: string | null | undefined;
  responseType?: string | null | undefined;
  scopes?: Array<string> | null | undefined;
  state?: string | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** input type for inserting object relation for remote table "auth.oauth2_auth_requests" */
export type AuthOauth2AuthRequests_Obj_Rel_Insert_Input = {
  data: AuthOauth2AuthRequests_Insert_Input;
  /** upsert condition */
  on_conflict?: AuthOauth2AuthRequests_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "auth.oauth2_auth_requests" */
export type AuthOauth2AuthRequests_On_Conflict = {
  constraint: AuthOauth2AuthRequests_Constraint;
  update_columns?: Array<AuthOauth2AuthRequests_Update_Column>;
  where?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
};

/** select columns of table "auth.oauth2_auth_requests" */
export enum AuthOauth2AuthRequests_Select_Column {
  /** column name */
  AuthTime = 'authTime',
  /** column name */
  ClientId = 'clientId',
  /** column name */
  CodeChallenge = 'codeChallenge',
  /** column name */
  CodeChallengeMethod = 'codeChallengeMethod',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Done = 'done',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Nonce = 'nonce',
  /** column name */
  RedirectUri = 'redirectUri',
  /** column name */
  Resource = 'resource',
  /** column name */
  ResponseType = 'responseType',
  /** column name */
  Scopes = 'scopes',
  /** column name */
  State = 'state',
  /** column name */
  UserId = 'userId'
}

/** select "authOauth2AuthRequests_aggregate_bool_exp_bool_and_arguments_columns" columns of table "auth.oauth2_auth_requests" */
export enum AuthOauth2AuthRequests_Select_Column_AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Done = 'done'
}

/** select "authOauth2AuthRequests_aggregate_bool_exp_bool_or_arguments_columns" columns of table "auth.oauth2_auth_requests" */
export enum AuthOauth2AuthRequests_Select_Column_AuthOauth2AuthRequests_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Done = 'done'
}

/** update columns of table "auth.oauth2_auth_requests" */
export enum AuthOauth2AuthRequests_Update_Column {
  /** column name */
  AuthTime = 'authTime',
  /** column name */
  ClientId = 'clientId',
  /** column name */
  CodeChallenge = 'codeChallenge',
  /** column name */
  CodeChallengeMethod = 'codeChallengeMethod',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Done = 'done',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Nonce = 'nonce',
  /** column name */
  RedirectUri = 'redirectUri',
  /** column name */
  Resource = 'resource',
  /** column name */
  ResponseType = 'responseType',
  /** column name */
  Scopes = 'scopes',
  /** column name */
  State = 'state',
  /** column name */
  UserId = 'userId'
}

export type AuthOauth2AuthorizationCodes_Aggregate_Bool_Exp = {
  count?: AuthOauth2AuthorizationCodes_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthOauth2AuthorizationCodes_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthOauth2AuthorizationCodes_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthOauth2AuthorizationCodes_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.oauth2_authorization_codes" */
export type AuthOauth2AuthorizationCodes_Arr_Rel_Insert_Input = {
  data: Array<AuthOauth2AuthorizationCodes_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthOauth2AuthorizationCodes_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.oauth2_authorization_codes". All fields are combined with a logical 'AND'. */
export type AuthOauth2AuthorizationCodes_Bool_Exp = {
  _and?: Array<AuthOauth2AuthorizationCodes_Bool_Exp> | null | undefined;
  _not?: AuthOauth2AuthorizationCodes_Bool_Exp | null | undefined;
  _or?: Array<AuthOauth2AuthorizationCodes_Bool_Exp> | null | undefined;
  authRequest?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  authRequestId?: Uuid_Comparison_Exp | null | undefined;
  codeHash?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  expiresAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.oauth2_authorization_codes" */
export enum AuthOauth2AuthorizationCodes_Constraint {
  /** unique or primary key constraint on columns "code_hash" */
  Oauth2AuthorizationCodesCodeHashKey = 'oauth2_authorization_codes_code_hash_key',
  /** unique or primary key constraint on columns "id" */
  Oauth2AuthorizationCodesPkey = 'oauth2_authorization_codes_pkey'
}

/** input type for inserting data into table "auth.oauth2_authorization_codes" */
export type AuthOauth2AuthorizationCodes_Insert_Input = {
  authRequest?: AuthOauth2AuthRequests_Obj_Rel_Insert_Input | null | undefined;
  authRequestId?: string | null | undefined;
  codeHash?: string | null | undefined;
  createdAt?: string | null | undefined;
  expiresAt?: string | null | undefined;
  id?: string | null | undefined;
};

/** on_conflict condition type for table "auth.oauth2_authorization_codes" */
export type AuthOauth2AuthorizationCodes_On_Conflict = {
  constraint: AuthOauth2AuthorizationCodes_Constraint;
  update_columns?: Array<AuthOauth2AuthorizationCodes_Update_Column>;
  where?: AuthOauth2AuthorizationCodes_Bool_Exp | null | undefined;
};

/** select columns of table "auth.oauth2_authorization_codes" */
export enum AuthOauth2AuthorizationCodes_Select_Column {
  /** column name */
  AuthRequestId = 'authRequestId',
  /** column name */
  CodeHash = 'codeHash',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id'
}

/** update columns of table "auth.oauth2_authorization_codes" */
export enum AuthOauth2AuthorizationCodes_Update_Column {
  /** column name */
  AuthRequestId = 'authRequestId',
  /** column name */
  CodeHash = 'codeHash',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id'
}

/** Boolean expression to filter rows from the table "auth.oauth2_clients". All fields are combined with a logical 'AND'. */
export type AuthOauth2Clients_Bool_Exp = {
  _and?: Array<AuthOauth2Clients_Bool_Exp> | null | undefined;
  _not?: AuthOauth2Clients_Bool_Exp | null | undefined;
  _or?: Array<AuthOauth2Clients_Bool_Exp> | null | undefined;
  authRequests?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  authRequests_aggregate?: AuthOauth2AuthRequests_Aggregate_Bool_Exp | null | undefined;
  clientId?: String_Comparison_Exp | null | undefined;
  clientSecretHash?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  createdBy?: Uuid_Comparison_Exp | null | undefined;
  createdByUser?: Users_Bool_Exp | null | undefined;
  metadata?: Jsonb_Comparison_Exp | null | undefined;
  metadataDocumentFetchedAt?: Timestamptz_Comparison_Exp | null | undefined;
  oauth2RefreshTokens?: AuthOauth2RefreshTokens_Bool_Exp | null | undefined;
  oauth2RefreshTokens_aggregate?: AuthOauth2RefreshTokens_Aggregate_Bool_Exp | null | undefined;
  redirectUris?: String_Array_Comparison_Exp | null | undefined;
  scopes?: String_Array_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updatedAt?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.oauth2_clients" */
export enum AuthOauth2Clients_Constraint {
  /** unique or primary key constraint on columns "client_id" */
  Oauth2ClientsPkey = 'oauth2_clients_pkey'
}

/** input type for inserting data into table "auth.oauth2_clients" */
export type AuthOauth2Clients_Insert_Input = {
  authRequests?: AuthOauth2AuthRequests_Arr_Rel_Insert_Input | null | undefined;
  clientId?: string | null | undefined;
  clientSecretHash?: string | null | undefined;
  createdAt?: string | null | undefined;
  createdBy?: string | null | undefined;
  createdByUser?: Users_Obj_Rel_Insert_Input | null | undefined;
  metadata?: any;
  metadataDocumentFetchedAt?: string | null | undefined;
  oauth2RefreshTokens?: AuthOauth2RefreshTokens_Arr_Rel_Insert_Input | null | undefined;
  redirectUris?: Array<string> | null | undefined;
  scopes?: Array<string> | null | undefined;
  type?: string | null | undefined;
  updatedAt?: string | null | undefined;
};

/** input type for inserting object relation for remote table "auth.oauth2_clients" */
export type AuthOauth2Clients_Obj_Rel_Insert_Input = {
  data: AuthOauth2Clients_Insert_Input;
  /** upsert condition */
  on_conflict?: AuthOauth2Clients_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "auth.oauth2_clients" */
export type AuthOauth2Clients_On_Conflict = {
  constraint: AuthOauth2Clients_Constraint;
  update_columns?: Array<AuthOauth2Clients_Update_Column>;
  where?: AuthOauth2Clients_Bool_Exp | null | undefined;
};

/** update columns of table "auth.oauth2_clients" */
export enum AuthOauth2Clients_Update_Column {
  /** column name */
  ClientId = 'clientId',
  /** column name */
  ClientSecretHash = 'clientSecretHash',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CreatedBy = 'createdBy',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MetadataDocumentFetchedAt = 'metadataDocumentFetchedAt',
  /** column name */
  RedirectUris = 'redirectUris',
  /** column name */
  Scopes = 'scopes',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type AuthOauth2RefreshTokens_Aggregate_Bool_Exp = {
  count?: AuthOauth2RefreshTokens_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthOauth2RefreshTokens_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthOauth2RefreshTokens_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthOauth2RefreshTokens_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.oauth2_refresh_tokens" */
export type AuthOauth2RefreshTokens_Arr_Rel_Insert_Input = {
  data: Array<AuthOauth2RefreshTokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthOauth2RefreshTokens_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.oauth2_refresh_tokens". All fields are combined with a logical 'AND'. */
export type AuthOauth2RefreshTokens_Bool_Exp = {
  _and?: Array<AuthOauth2RefreshTokens_Bool_Exp> | null | undefined;
  _not?: AuthOauth2RefreshTokens_Bool_Exp | null | undefined;
  _or?: Array<AuthOauth2RefreshTokens_Bool_Exp> | null | undefined;
  authRequest?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  authRequestId?: Uuid_Comparison_Exp | null | undefined;
  client?: AuthOauth2Clients_Bool_Exp | null | undefined;
  clientId?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  expiresAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  scopes?: String_Array_Comparison_Exp | null | undefined;
  tokenHash?: String_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.oauth2_refresh_tokens" */
export enum AuthOauth2RefreshTokens_Constraint {
  /** unique or primary key constraint on columns "id" */
  Oauth2RefreshTokensPkey = 'oauth2_refresh_tokens_pkey',
  /** unique or primary key constraint on columns "token_hash" */
  Oauth2RefreshTokensTokenHashKey = 'oauth2_refresh_tokens_token_hash_key'
}

/** input type for inserting data into table "auth.oauth2_refresh_tokens" */
export type AuthOauth2RefreshTokens_Insert_Input = {
  authRequest?: AuthOauth2AuthRequests_Obj_Rel_Insert_Input | null | undefined;
  authRequestId?: string | null | undefined;
  client?: AuthOauth2Clients_Obj_Rel_Insert_Input | null | undefined;
  clientId?: string | null | undefined;
  createdAt?: string | null | undefined;
  expiresAt?: string | null | undefined;
  id?: string | null | undefined;
  scopes?: Array<string> | null | undefined;
  tokenHash?: string | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "auth.oauth2_refresh_tokens" */
export type AuthOauth2RefreshTokens_On_Conflict = {
  constraint: AuthOauth2RefreshTokens_Constraint;
  update_columns?: Array<AuthOauth2RefreshTokens_Update_Column>;
  where?: AuthOauth2RefreshTokens_Bool_Exp | null | undefined;
};

/** select columns of table "auth.oauth2_refresh_tokens" */
export enum AuthOauth2RefreshTokens_Select_Column {
  /** column name */
  AuthRequestId = 'authRequestId',
  /** column name */
  ClientId = 'clientId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Scopes = 'scopes',
  /** column name */
  TokenHash = 'tokenHash',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "auth.oauth2_refresh_tokens" */
export enum AuthOauth2RefreshTokens_Update_Column {
  /** column name */
  AuthRequestId = 'authRequestId',
  /** column name */
  ClientId = 'clientId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Scopes = 'scopes',
  /** column name */
  TokenHash = 'tokenHash',
  /** column name */
  UserId = 'userId'
}

/** Boolean expression to filter rows from the table "auth.providers". All fields are combined with a logical 'AND'. */
export type AuthProviders_Bool_Exp = {
  _and?: Array<AuthProviders_Bool_Exp> | null | undefined;
  _not?: AuthProviders_Bool_Exp | null | undefined;
  _or?: Array<AuthProviders_Bool_Exp> | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  userProviders?: AuthUserProviders_Bool_Exp | null | undefined;
  userProviders_aggregate?: AuthUserProviders_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.providers" */
export enum AuthProviders_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey'
}

/** input type for inserting data into table "auth.providers" */
export type AuthProviders_Insert_Input = {
  id?: string | null | undefined;
  userProviders?: AuthUserProviders_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "auth.providers" */
export type AuthProviders_Obj_Rel_Insert_Input = {
  data: AuthProviders_Insert_Input;
  /** upsert condition */
  on_conflict?: AuthProviders_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "auth.providers" */
export type AuthProviders_On_Conflict = {
  constraint: AuthProviders_Constraint;
  update_columns?: Array<AuthProviders_Update_Column>;
  where?: AuthProviders_Bool_Exp | null | undefined;
};

/** update columns of table "auth.providers" */
export enum AuthProviders_Update_Column {
  /** column name */
  Id = 'id'
}

export enum AuthRefreshTokenTypes_Enum {
  /** Personal access token */
  Pat = 'pat',
  /** Regular refresh token */
  Regular = 'regular'
}

/** Boolean expression to compare columns of type "authRefreshTokenTypes_enum". All fields are combined with logical 'AND'. */
export type AuthRefreshTokenTypes_Enum_Comparison_Exp = {
  _eq?: AuthRefreshTokenTypes_Enum | null | undefined;
  _in?: Array<AuthRefreshTokenTypes_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: AuthRefreshTokenTypes_Enum | null | undefined;
  _nin?: Array<AuthRefreshTokenTypes_Enum> | null | undefined;
};

export type AuthRefreshTokens_Aggregate_Bool_Exp = {
  count?: AuthRefreshTokens_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthRefreshTokens_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthRefreshTokens_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthRefreshTokens_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.refresh_tokens" */
export type AuthRefreshTokens_Arr_Rel_Insert_Input = {
  data: Array<AuthRefreshTokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthRefreshTokens_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.refresh_tokens". All fields are combined with a logical 'AND'. */
export type AuthRefreshTokens_Bool_Exp = {
  _and?: Array<AuthRefreshTokens_Bool_Exp> | null | undefined;
  _not?: AuthRefreshTokens_Bool_Exp | null | undefined;
  _or?: Array<AuthRefreshTokens_Bool_Exp> | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  expiresAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  metadata?: Jsonb_Comparison_Exp | null | undefined;
  refreshTokenHash?: String_Comparison_Exp | null | undefined;
  type?: AuthRefreshTokenTypes_Enum_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Constraint {
  /** unique or primary key constraint on columns "id" */
  RefreshTokensPkey = 'refresh_tokens_pkey'
}

/** input type for inserting data into table "auth.refresh_tokens" */
export type AuthRefreshTokens_Insert_Input = {
  createdAt?: string | null | undefined;
  expiresAt?: string | null | undefined;
  id?: string | null | undefined;
  metadata?: any;
  refreshTokenHash?: string | null | undefined;
  type?: AuthRefreshTokenTypes_Enum | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "auth.refresh_tokens" */
export type AuthRefreshTokens_On_Conflict = {
  constraint: AuthRefreshTokens_Constraint;
  update_columns?: Array<AuthRefreshTokens_Update_Column>;
  where?: AuthRefreshTokens_Bool_Exp | null | undefined;
};

/** select columns of table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  RefreshTokenHash = 'refreshTokenHash',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  RefreshTokenHash = 'refreshTokenHash',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

/** Boolean expression to filter rows from the table "auth.roles". All fields are combined with a logical 'AND'. */
export type AuthRoles_Bool_Exp = {
  _and?: Array<AuthRoles_Bool_Exp> | null | undefined;
  _not?: AuthRoles_Bool_Exp | null | undefined;
  _or?: Array<AuthRoles_Bool_Exp> | null | undefined;
  role?: String_Comparison_Exp | null | undefined;
  userRoles?: AuthUserRoles_Bool_Exp | null | undefined;
  userRoles_aggregate?: AuthUserRoles_Aggregate_Bool_Exp | null | undefined;
  usersByDefaultRole?: Users_Bool_Exp | null | undefined;
  usersByDefaultRole_aggregate?: Users_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.roles" */
export enum AuthRoles_Constraint {
  /** unique or primary key constraint on columns "role" */
  RolesPkey = 'roles_pkey'
}

/** input type for inserting data into table "auth.roles" */
export type AuthRoles_Insert_Input = {
  role?: string | null | undefined;
  userRoles?: AuthUserRoles_Arr_Rel_Insert_Input | null | undefined;
  usersByDefaultRole?: Users_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "auth.roles" */
export type AuthRoles_Obj_Rel_Insert_Input = {
  data: AuthRoles_Insert_Input;
  /** upsert condition */
  on_conflict?: AuthRoles_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "auth.roles" */
export type AuthRoles_On_Conflict = {
  constraint: AuthRoles_Constraint;
  update_columns?: Array<AuthRoles_Update_Column>;
  where?: AuthRoles_Bool_Exp | null | undefined;
};

/** update columns of table "auth.roles" */
export enum AuthRoles_Update_Column {
  /** column name */
  Role = 'role'
}

export type AuthUserProviders_Aggregate_Bool_Exp = {
  count?: AuthUserProviders_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthUserProviders_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthUserProviders_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthUserProviders_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.user_providers" */
export type AuthUserProviders_Arr_Rel_Insert_Input = {
  data: Array<AuthUserProviders_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthUserProviders_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.user_providers". All fields are combined with a logical 'AND'. */
export type AuthUserProviders_Bool_Exp = {
  _and?: Array<AuthUserProviders_Bool_Exp> | null | undefined;
  _not?: AuthUserProviders_Bool_Exp | null | undefined;
  _or?: Array<AuthUserProviders_Bool_Exp> | null | undefined;
  accessToken?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  provider?: AuthProviders_Bool_Exp | null | undefined;
  providerId?: String_Comparison_Exp | null | undefined;
  providerUserId?: String_Comparison_Exp | null | undefined;
  refreshToken?: String_Comparison_Exp | null | undefined;
  updatedAt?: Timestamptz_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.user_providers" */
export enum AuthUserProviders_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserProvidersPkey = 'user_providers_pkey',
  /** unique or primary key constraint on columns "provider_user_id", "provider_id" */
  UserProvidersProviderIdProviderUserIdKey = 'user_providers_provider_id_provider_user_id_key'
}

/** input type for inserting data into table "auth.user_providers" */
export type AuthUserProviders_Insert_Input = {
  accessToken?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  provider?: AuthProviders_Obj_Rel_Insert_Input | null | undefined;
  providerId?: string | null | undefined;
  providerUserId?: string | null | undefined;
  refreshToken?: string | null | undefined;
  updatedAt?: string | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "auth.user_providers" */
export type AuthUserProviders_On_Conflict = {
  constraint: AuthUserProviders_Constraint;
  update_columns?: Array<AuthUserProviders_Update_Column>;
  where?: AuthUserProviders_Bool_Exp | null | undefined;
};

/** select columns of table "auth.user_providers" */
export enum AuthUserProviders_Select_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'providerId',
  /** column name */
  ProviderUserId = 'providerUserId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "auth.user_providers" */
export enum AuthUserProviders_Update_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'providerId',
  /** column name */
  ProviderUserId = 'providerUserId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

export type AuthUserRoles_Aggregate_Bool_Exp = {
  count?: AuthUserRoles_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthUserRoles_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthUserRoles_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthUserRoles_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.user_roles" */
export type AuthUserRoles_Arr_Rel_Insert_Input = {
  data: Array<AuthUserRoles_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthUserRoles_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.user_roles". All fields are combined with a logical 'AND'. */
export type AuthUserRoles_Bool_Exp = {
  _and?: Array<AuthUserRoles_Bool_Exp> | null | undefined;
  _not?: AuthUserRoles_Bool_Exp | null | undefined;
  _or?: Array<AuthUserRoles_Bool_Exp> | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  role?: String_Comparison_Exp | null | undefined;
  roleByRole?: AuthRoles_Bool_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.user_roles" */
export enum AuthUserRoles_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserRolesPkey = 'user_roles_pkey',
  /** unique or primary key constraint on columns "user_id", "role" */
  UserRolesUserIdRoleKey = 'user_roles_user_id_role_key'
}

/** input type for inserting data into table "auth.user_roles" */
export type AuthUserRoles_Insert_Input = {
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  role?: string | null | undefined;
  roleByRole?: AuthRoles_Obj_Rel_Insert_Input | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "auth.user_roles" */
export type AuthUserRoles_On_Conflict = {
  constraint: AuthUserRoles_Constraint;
  update_columns?: Array<AuthUserRoles_Update_Column>;
  where?: AuthUserRoles_Bool_Exp | null | undefined;
};

/** select columns of table "auth.user_roles" */
export enum AuthUserRoles_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "auth.user_roles" */
export enum AuthUserRoles_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

export type AuthUserSecurityKeys_Aggregate_Bool_Exp = {
  count?: AuthUserSecurityKeys_Aggregate_Bool_Exp_Count | null | undefined;
};

export type AuthUserSecurityKeys_Aggregate_Bool_Exp_Count = {
  arguments?: Array<AuthUserSecurityKeys_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: AuthUserSecurityKeys_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Arr_Rel_Insert_Input = {
  data: Array<AuthUserSecurityKeys_Insert_Input>;
  /** upsert condition */
  on_conflict?: AuthUserSecurityKeys_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.user_security_keys". All fields are combined with a logical 'AND'. */
export type AuthUserSecurityKeys_Bool_Exp = {
  _and?: Array<AuthUserSecurityKeys_Bool_Exp> | null | undefined;
  _not?: AuthUserSecurityKeys_Bool_Exp | null | undefined;
  _or?: Array<AuthUserSecurityKeys_Bool_Exp> | null | undefined;
  counter?: Bigint_Comparison_Exp | null | undefined;
  credentialId?: String_Comparison_Exp | null | undefined;
  credentialPublicKey?: Bytea_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  nickname?: String_Comparison_Exp | null | undefined;
  transports?: String_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Constraint {
  /** unique or primary key constraint on columns "credential_id" */
  UserSecurityKeyCredentialIdKey = 'user_security_key_credential_id_key',
  /** unique or primary key constraint on columns "id" */
  UserSecurityKeysPkey = 'user_security_keys_pkey'
}

/** input type for inserting data into table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Insert_Input = {
  counter?: number | null | undefined;
  credentialId?: string | null | undefined;
  credentialPublicKey?: any;
  id?: string | null | undefined;
  nickname?: string | null | undefined;
  transports?: string | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "auth.user_security_keys" */
export type AuthUserSecurityKeys_On_Conflict = {
  constraint: AuthUserSecurityKeys_Constraint;
  update_columns?: Array<AuthUserSecurityKeys_Update_Column>;
  where?: AuthUserSecurityKeys_Bool_Exp | null | undefined;
};

/** select columns of table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Select_Column {
  /** column name */
  Counter = 'counter',
  /** column name */
  CredentialId = 'credentialId',
  /** column name */
  CredentialPublicKey = 'credentialPublicKey',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Transports = 'transports',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Update_Column {
  /** column name */
  Counter = 'counter',
  /** column name */
  CredentialId = 'credentialId',
  /** column name */
  CredentialPublicKey = 'credentialPublicKey',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Transports = 'transports',
  /** column name */
  UserId = 'userId'
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: number | null | undefined;
  _gt?: number | null | undefined;
  _gte?: number | null | undefined;
  _in?: Array<number> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: number | null | undefined;
  _lte?: number | null | undefined;
  _neq?: number | null | undefined;
  _nin?: Array<number> | null | undefined;
};

/** Boolean expression to filter rows from the table "storage.buckets". All fields are combined with a logical 'AND'. */
export type Buckets_Bool_Exp = {
  _and?: Array<Buckets_Bool_Exp> | null | undefined;
  _not?: Buckets_Bool_Exp | null | undefined;
  _or?: Array<Buckets_Bool_Exp> | null | undefined;
  cacheControl?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  downloadExpiration?: Int_Comparison_Exp | null | undefined;
  files?: Files_Bool_Exp | null | undefined;
  files_aggregate?: Files_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  maxUploadFileSize?: Int_Comparison_Exp | null | undefined;
  minUploadFileSize?: Int_Comparison_Exp | null | undefined;
  presignedUrlsEnabled?: Boolean_Comparison_Exp | null | undefined;
  updatedAt?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "storage.buckets" */
export enum Buckets_Constraint {
  /** unique or primary key constraint on columns "id" */
  BucketsPkey = 'buckets_pkey'
}

/** input type for inserting data into table "storage.buckets" */
export type Buckets_Insert_Input = {
  cacheControl?: string | null | undefined;
  createdAt?: string | null | undefined;
  downloadExpiration?: number | null | undefined;
  files?: Files_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  maxUploadFileSize?: number | null | undefined;
  minUploadFileSize?: number | null | undefined;
  presignedUrlsEnabled?: boolean | null | undefined;
  updatedAt?: string | null | undefined;
};

/** input type for inserting object relation for remote table "storage.buckets" */
export type Buckets_Obj_Rel_Insert_Input = {
  data: Buckets_Insert_Input;
  /** upsert condition */
  on_conflict?: Buckets_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "storage.buckets" */
export type Buckets_On_Conflict = {
  constraint: Buckets_Constraint;
  update_columns?: Array<Buckets_Update_Column>;
  where?: Buckets_Bool_Exp | null | undefined;
};

/** update columns of table "storage.buckets" */
export enum Buckets_Update_Column {
  /** column name */
  CacheControl = 'cacheControl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DownloadExpiration = 'downloadExpiration',
  /** column name */
  Id = 'id',
  /** column name */
  MaxUploadFileSize = 'maxUploadFileSize',
  /** column name */
  MinUploadFileSize = 'minUploadFileSize',
  /** column name */
  PresignedUrlsEnabled = 'presignedUrlsEnabled',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
export type Bytea_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Circle_Aggregate_Bool_Exp = {
  count?: Circle_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Circle_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Circle_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Circle_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "circle" */
export type Circle_Arr_Rel_Insert_Input = {
  data: Array<Circle_Insert_Input>;
  /** upsert condition */
  on_conflict?: Circle_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "circle". All fields are combined with a logical 'AND'. */
export type Circle_Bool_Exp = {
  _and?: Array<Circle_Bool_Exp> | null | undefined;
  _not?: Circle_Bool_Exp | null | undefined;
  _or?: Array<Circle_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  children?: Circle_Bool_Exp | null | undefined;
  children_aggregate?: Circle_Aggregate_Bool_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  decisions?: Decision_Bool_Exp | null | undefined;
  decisions_aggregate?: Decision_Aggregate_Bool_Exp | null | undefined;
  hostCircleLinks?: Circle_Link_Bool_Exp | null | undefined;
  hostCircleLinks_aggregate?: Circle_Link_Aggregate_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  invitedCircleLinks?: Circle_Link_Bool_Exp | null | undefined;
  invitedCircleLinks_aggregate?: Circle_Link_Aggregate_Bool_Exp | null | undefined;
  leaders?: Circle_Leader_Bool_Exp | null | undefined;
  leaders_aggregate?: Circle_Leader_Aggregate_Bool_Exp | null | undefined;
  meetings?: Meeting_Bool_Exp | null | undefined;
  meetings_aggregate?: Meeting_Aggregate_Bool_Exp | null | undefined;
  meetings_recurring?: Meeting_Recurring_Bool_Exp | null | undefined;
  meetings_recurring_aggregate?: Meeting_Recurring_Aggregate_Bool_Exp | null | undefined;
  members?: Circle_Member_Bool_Exp | null | undefined;
  members_aggregate?: Circle_Member_Aggregate_Bool_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  parent?: Circle_Bool_Exp | null | undefined;
  parentId?: Uuid_Comparison_Exp | null | undefined;
  participants?: Circle_Participant_Cache_Bool_Exp | null | undefined;
  participants_aggregate?: Circle_Participant_Cache_Aggregate_Bool_Exp | null | undefined;
  role?: Role_Bool_Exp | null | undefined;
  roleId?: Uuid_Comparison_Exp | null | undefined;
  tasks?: Task_Bool_Exp | null | undefined;
  tasks_aggregate?: Task_Aggregate_Bool_Exp | null | undefined;
  threads?: Thread_Bool_Exp | null | undefined;
  threads_aggregate?: Thread_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "circle" */
export enum Circle_Constraint {
  /** unique or primary key constraint on columns "id" */
  CirclePkey = 'circle_pkey'
}

/** input type for inserting data into table "circle" */
export type Circle_Insert_Input = {
  archivedAt?: string | null | undefined;
  children?: Circle_Arr_Rel_Insert_Input | null | undefined;
  createdAt?: string | null | undefined;
  decisions?: Decision_Arr_Rel_Insert_Input | null | undefined;
  hostCircleLinks?: Circle_Link_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  invitedCircleLinks?: Circle_Link_Arr_Rel_Insert_Input | null | undefined;
  leaders?: Circle_Leader_Arr_Rel_Insert_Input | null | undefined;
  meetings?: Meeting_Arr_Rel_Insert_Input | null | undefined;
  meetings_recurring?: Meeting_Recurring_Arr_Rel_Insert_Input | null | undefined;
  members?: Circle_Member_Arr_Rel_Insert_Input | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  parent?: Circle_Obj_Rel_Insert_Input | null | undefined;
  parentId?: string | null | undefined;
  participants?: Circle_Participant_Cache_Arr_Rel_Insert_Input | null | undefined;
  role?: Role_Obj_Rel_Insert_Input | null | undefined;
  roleId?: string | null | undefined;
  tasks?: Task_Arr_Rel_Insert_Input | null | undefined;
  threads?: Thread_Arr_Rel_Insert_Input | null | undefined;
};

export type Circle_Leader_Aggregate_Bool_Exp = {
  count?: Circle_Leader_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Circle_Leader_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Circle_Leader_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Circle_Leader_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "circle_leader" */
export type Circle_Leader_Arr_Rel_Insert_Input = {
  data: Array<Circle_Leader_Insert_Input>;
};

/** Boolean expression to filter rows from the table "circle_leader". All fields are combined with a logical 'AND'. */
export type Circle_Leader_Bool_Exp = {
  _and?: Array<Circle_Leader_Bool_Exp> | null | undefined;
  _not?: Circle_Leader_Bool_Exp | null | undefined;
  _or?: Array<Circle_Leader_Bool_Exp> | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "circle_leader" */
export type Circle_Leader_Insert_Input = {
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  orgId?: string | null | undefined;
};

/** select columns of table "circle_leader" */
export enum Circle_Leader_Select_Column {
  /** column name */
  CircleId = 'circleId',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId'
}

export type Circle_Link_Aggregate_Bool_Exp = {
  count?: Circle_Link_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Circle_Link_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Circle_Link_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Circle_Link_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "circle_link" */
export type Circle_Link_Arr_Rel_Insert_Input = {
  data: Array<Circle_Link_Insert_Input>;
  /** upsert condition */
  on_conflict?: Circle_Link_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "circle_link". All fields are combined with a logical 'AND'. */
export type Circle_Link_Bool_Exp = {
  _and?: Array<Circle_Link_Bool_Exp> | null | undefined;
  _not?: Circle_Link_Bool_Exp | null | undefined;
  _or?: Array<Circle_Link_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  hostCircle?: Circle_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  invitedCircle?: Circle_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  parentId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "circle_link" */
export enum Circle_Link_Constraint {
  /** unique or primary key constraint on columns "parentId", "circleId" */
  CircleLinkActiveUnique = 'circle_link_active_unique',
  /** unique or primary key constraint on columns "id" */
  CircleLinkPkey = 'circle_link_pkey'
}

/** input type for inserting data into table "circle_link" */
export type Circle_Link_Insert_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  hostCircle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  invitedCircle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  parentId?: string | null | undefined;
};

/** on_conflict condition type for table "circle_link" */
export type Circle_Link_On_Conflict = {
  constraint: Circle_Link_Constraint;
  update_columns?: Array<Circle_Link_Update_Column>;
  where?: Circle_Link_Bool_Exp | null | undefined;
};

/** select columns of table "circle_link" */
export enum Circle_Link_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ParentId = 'parentId'
}

/** input type for updating data in table "circle_link" */
export type Circle_Link_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  orgId?: string | null | undefined;
  parentId?: string | null | undefined;
};

/** update columns of table "circle_link" */
export enum Circle_Link_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ParentId = 'parentId'
}

export type Circle_Member_Aggregate_Bool_Exp = {
  count?: Circle_Member_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Circle_Member_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Circle_Member_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Circle_Member_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "circle_member" */
export type Circle_Member_Arr_Rel_Insert_Input = {
  data: Array<Circle_Member_Insert_Input>;
  /** upsert condition */
  on_conflict?: Circle_Member_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "circle_member". All fields are combined with a logical 'AND'. */
export type Circle_Member_Bool_Exp = {
  _and?: Array<Circle_Member_Bool_Exp> | null | undefined;
  _not?: Circle_Member_Bool_Exp | null | undefined;
  _or?: Array<Circle_Member_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "circle_member" */
export enum Circle_Member_Constraint {
  /** unique or primary key constraint on columns "memberId", "circleId" */
  CircleMemberActiveUnique = 'circle_member_active_unique',
  /** unique or primary key constraint on columns "id" */
  CircleMemberPkey = 'circle_member_pkey'
}

/** input type for inserting data into table "circle_member" */
export type Circle_Member_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  orgId?: string | null | undefined;
};

/** on_conflict condition type for table "circle_member" */
export type Circle_Member_On_Conflict = {
  constraint: Circle_Member_Constraint;
  update_columns?: Array<Circle_Member_Update_Column>;
  where?: Circle_Member_Bool_Exp | null | undefined;
};

/** select columns of table "circle_member" */
export enum Circle_Member_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId'
}

/** input type for updating data in table "circle_member" */
export type Circle_Member_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  orgId?: string | null | undefined;
};

/** update columns of table "circle_member" */
export enum Circle_Member_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId'
}

/** input type for inserting object relation for remote table "circle" */
export type Circle_Obj_Rel_Insert_Input = {
  data: Circle_Insert_Input;
  /** upsert condition */
  on_conflict?: Circle_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "circle" */
export type Circle_On_Conflict = {
  constraint: Circle_Constraint;
  update_columns?: Array<Circle_Update_Column>;
  where?: Circle_Bool_Exp | null | undefined;
};

export type Circle_Participant_Cache_Aggregate_Bool_Exp = {
  count?: Circle_Participant_Cache_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Circle_Participant_Cache_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Circle_Participant_Cache_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Circle_Participant_Cache_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "circle_participant_cache" */
export type Circle_Participant_Cache_Arr_Rel_Insert_Input = {
  data: Array<Circle_Participant_Cache_Insert_Input>;
  /** upsert condition */
  on_conflict?: Circle_Participant_Cache_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "circle_participant_cache". All fields are combined with a logical 'AND'. */
export type Circle_Participant_Cache_Bool_Exp = {
  _and?: Array<Circle_Participant_Cache_Bool_Exp> | null | undefined;
  _not?: Circle_Participant_Cache_Bool_Exp | null | undefined;
  _or?: Array<Circle_Participant_Cache_Bool_Exp> | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "circle_participant_cache" */
export enum Circle_Participant_Cache_Constraint {
  /** unique or primary key constraint on columns "id" */
  CircleParticipantCachePkey = 'circle_participant_cache_pkey'
}

/** input type for inserting data into table "circle_participant_cache" */
export type Circle_Participant_Cache_Insert_Input = {
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
};

/** on_conflict condition type for table "circle_participant_cache" */
export type Circle_Participant_Cache_On_Conflict = {
  constraint: Circle_Participant_Cache_Constraint;
  update_columns?: Array<Circle_Participant_Cache_Update_Column>;
  where?: Circle_Participant_Cache_Bool_Exp | null | undefined;
};

/** select columns of table "circle_participant_cache" */
export enum Circle_Participant_Cache_Select_Column {
  /** column name */
  CircleId = 'circleId',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId'
}

/** update columns of table "circle_participant_cache" */
export enum Circle_Participant_Cache_Update_Column {
  /** column name */
  CircleId = 'circleId',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId'
}

/** select columns of table "circle" */
export enum Circle_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ParentId = 'parentId',
  /** column name */
  RoleId = 'roleId'
}

/** input type for updating data in table "circle" */
export type Circle_Set_Input = {
  archivedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  orgId?: string | null | undefined;
  parentId?: string | null | undefined;
  roleId?: string | null | undefined;
};

/** update columns of table "circle" */
export enum Circle_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ParentId = 'parentId',
  /** column name */
  RoleId = 'roleId'
}

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  /** does the column match the given case-insensitive pattern */
  _ilike?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: string | null | undefined;
  _is_null?: boolean | null | undefined;
  /** does the column match the given pattern */
  _like?: string | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: string | null | undefined;
  /** does the column NOT match the given pattern */
  _nlike?: string | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: string | null | undefined;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: string | null | undefined;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: string | null | undefined;
  /** does the column match the given SQL regular expression */
  _similar?: string | null | undefined;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Decision_Aggregate_Bool_Exp = {
  bool_and?: Decision_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Decision_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Decision_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Decision_Aggregate_Bool_Exp_Bool_And = {
  arguments: Decision_Select_Column_Decision_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Decision_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Decision_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Decision_Select_Column_Decision_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Decision_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Decision_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Decision_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Decision_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "decision" */
export type Decision_Arr_Rel_Insert_Input = {
  data: Array<Decision_Insert_Input>;
  /** upsert condition */
  on_conflict?: Decision_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "decision". All fields are combined with a logical 'AND'. */
export type Decision_Bool_Exp = {
  _and?: Array<Decision_Bool_Exp> | null | undefined;
  _not?: Decision_Bool_Exp | null | undefined;
  _or?: Array<Decision_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  private?: Boolean_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "decision" */
export enum Decision_Constraint {
  /** unique or primary key constraint on columns "id" */
  DecisionPkey = 'decision_pkey'
}

/** input type for inserting data into table "decision" */
export type Decision_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  title?: string | null | undefined;
};

/** input type for inserting object relation for remote table "decision" */
export type Decision_Obj_Rel_Insert_Input = {
  data: Decision_Insert_Input;
  /** upsert condition */
  on_conflict?: Decision_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "decision" */
export type Decision_On_Conflict = {
  constraint: Decision_Constraint;
  update_columns?: Array<Decision_Update_Column>;
  where?: Decision_Bool_Exp | null | undefined;
};

/** select columns of table "decision" */
export enum Decision_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  Title = 'title'
}

/** select "decision_aggregate_bool_exp_bool_and_arguments_columns" columns of table "decision" */
export enum Decision_Select_Column_Decision_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Private = 'private'
}

/** select "decision_aggregate_bool_exp_bool_or_arguments_columns" columns of table "decision" */
export enum Decision_Select_Column_Decision_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Private = 'private'
}

/** input type for updating data in table "decision" */
export type Decision_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  title?: string | null | undefined;
};

/** update columns of table "decision" */
export enum Decision_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  Title = 'title'
}

export type Files_Aggregate_Bool_Exp = {
  bool_and?: Files_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Files_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Files_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Files_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Files_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Files_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Files_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Files_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "storage.files" */
export type Files_Arr_Rel_Insert_Input = {
  data: Array<Files_Insert_Input>;
  /** upsert condition */
  on_conflict?: Files_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "storage.files". All fields are combined with a logical 'AND'. */
export type Files_Bool_Exp = {
  _and?: Array<Files_Bool_Exp> | null | undefined;
  _not?: Files_Bool_Exp | null | undefined;
  _or?: Array<Files_Bool_Exp> | null | undefined;
  bucket?: Buckets_Bool_Exp | null | undefined;
  bucketId?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  etag?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  isUploaded?: Boolean_Comparison_Exp | null | undefined;
  members?: Member_Bool_Exp | null | undefined;
  members_aggregate?: Member_Aggregate_Bool_Exp | null | undefined;
  metadata?: Jsonb_Comparison_Exp | null | undefined;
  mimeType?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  orgs?: Org_File_Bool_Exp | null | undefined;
  orgs_aggregate?: Org_File_Aggregate_Bool_Exp | null | undefined;
  size?: Int_Comparison_Exp | null | undefined;
  updatedAt?: Timestamptz_Comparison_Exp | null | undefined;
  uploadedByUserId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "storage.files" */
export enum Files_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilesPkey = 'files_pkey'
}

/** input type for inserting data into table "storage.files" */
export type Files_Insert_Input = {
  bucket?: Buckets_Obj_Rel_Insert_Input | null | undefined;
  bucketId?: string | null | undefined;
  createdAt?: string | null | undefined;
  etag?: string | null | undefined;
  id?: string | null | undefined;
  isUploaded?: boolean | null | undefined;
  members?: Member_Arr_Rel_Insert_Input | null | undefined;
  metadata?: any;
  mimeType?: string | null | undefined;
  name?: string | null | undefined;
  orgs?: Org_File_Arr_Rel_Insert_Input | null | undefined;
  size?: number | null | undefined;
  updatedAt?: string | null | undefined;
  uploadedByUserId?: string | null | undefined;
};

/** input type for inserting object relation for remote table "storage.files" */
export type Files_Obj_Rel_Insert_Input = {
  data: Files_Insert_Input;
  /** upsert condition */
  on_conflict?: Files_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "storage.files" */
export type Files_On_Conflict = {
  constraint: Files_Constraint;
  update_columns?: Array<Files_Update_Column>;
  where?: Files_Bool_Exp | null | undefined;
};

/** select columns of table "storage.files" */
export enum Files_Select_Column {
  /** column name */
  BucketId = 'bucketId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Etag = 'etag',
  /** column name */
  Id = 'id',
  /** column name */
  IsUploaded = 'isUploaded',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  Name = 'name',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UploadedByUserId = 'uploadedByUserId'
}

/** select "files_aggregate_bool_exp_bool_and_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUploaded = 'isUploaded'
}

/** select "files_aggregate_bool_exp_bool_or_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUploaded = 'isUploaded'
}

/** update columns of table "storage.files" */
export enum Files_Update_Column {
  /** column name */
  BucketId = 'bucketId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Etag = 'etag',
  /** column name */
  Id = 'id',
  /** column name */
  IsUploaded = 'isUploaded',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  Name = 'name',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UploadedByUserId = 'uploadedByUserId'
}

export enum Governance_Mode_Enum {
  /** Roles can be edited by their leaders */
  Agile = 'Agile',
  /** All members can edit the whole org chart */
  Free = 'Free',
  /** Roles can only be changed through proposals (Holacracy) */
  Strict = 'Strict'
}

/** Boolean expression to compare columns of type "governance_mode_enum". All fields are combined with logical 'AND'. */
export type Governance_Mode_Enum_Comparison_Exp = {
  _eq?: Governance_Mode_Enum | null | undefined;
  _in?: Array<Governance_Mode_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Governance_Mode_Enum | null | undefined;
  _nin?: Array<Governance_Mode_Enum> | null | undefined;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Jsonb_Cast_Exp = {
  String?: String_Comparison_Exp | null | undefined;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: Jsonb_Cast_Exp | null | undefined;
  /** is the column contained in the given json value */
  _contained_in?: any;
  /** does the column contain the given json value at the top level */
  _contains?: any;
  _eq?: any;
  _gt?: any;
  _gte?: any;
  /** does the string exist as a top-level key in the column */
  _has_key?: string | null | undefined;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Array<string> | null | undefined;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Array<string> | null | undefined;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Log_Aggregate_Bool_Exp = {
  bool_and?: Log_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Log_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Log_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Log_Aggregate_Bool_Exp_Bool_And = {
  arguments: Log_Select_Column_Log_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Log_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Log_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Log_Select_Column_Log_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Log_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Log_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Log_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Log_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "log" */
export type Log_Arr_Rel_Insert_Input = {
  data: Array<Log_Insert_Input>;
  /** upsert condition */
  on_conflict?: Log_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "log". All fields are combined with a logical 'AND'. */
export type Log_Bool_Exp = {
  _and?: Array<Log_Bool_Exp> | null | undefined;
  _not?: Log_Bool_Exp | null | undefined;
  _or?: Array<Log_Bool_Exp> | null | undefined;
  cancelLog?: Log_Bool_Exp | null | undefined;
  cancelLogId?: Uuid_Comparison_Exp | null | undefined;
  cancelMember?: Member_Bool_Exp | null | undefined;
  cancelMemberId?: Uuid_Comparison_Exp | null | undefined;
  cancelMemberName?: String_Comparison_Exp | null | undefined;
  canceled?: Boolean_Comparison_Exp | null | undefined;
  changes?: Json_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  decisionId?: Uuid_Comparison_Exp | null | undefined;
  display?: Json_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  meetingId?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  memberName?: String_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "log" */
export enum Log_Constraint {
  /** unique or primary key constraint on columns "id" */
  LogPkey = 'log_pkey'
}

/** input type for inserting data into table "log" */
export type Log_Insert_Input = {
  cancelLog?: Log_Obj_Rel_Insert_Input | null | undefined;
  /** Id of canceled log, if it's a cancellation */
  cancelLogId?: string | null | undefined;
  cancelMember?: Member_Obj_Rel_Insert_Input | null | undefined;
  /** Member that did the action that's canceled */
  cancelMemberId?: string | null | undefined;
  cancelMemberName?: string | null | undefined;
  canceled?: boolean | null | undefined;
  /** Log of changes to entities, useful to cancel */
  changes?: any;
  createdAt?: string | null | undefined;
  decisionId?: string | null | undefined;
  /** Type of log and data to display */
  display?: any;
  id?: string | null | undefined;
  /** Meeting during which this log was created (optional) */
  meetingId?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  /** Keep name for display, in case of deleted member */
  memberName?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  /** User and member who made the change */
  userId?: string | null | undefined;
};

/** input type for inserting object relation for remote table "log" */
export type Log_Obj_Rel_Insert_Input = {
  data: Log_Insert_Input;
  /** upsert condition */
  on_conflict?: Log_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "log" */
export type Log_On_Conflict = {
  constraint: Log_Constraint;
  update_columns?: Array<Log_Update_Column>;
  where?: Log_Bool_Exp | null | undefined;
};

/** select columns of table "log" */
export enum Log_Select_Column {
  /** column name */
  CancelLogId = 'cancelLogId',
  /** column name */
  CancelMemberId = 'cancelMemberId',
  /** column name */
  CancelMemberName = 'cancelMemberName',
  /** column name */
  Canceled = 'canceled',
  /** column name */
  Changes = 'changes',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DecisionId = 'decisionId',
  /** column name */
  Display = 'display',
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  MemberName = 'memberName',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  UserId = 'userId'
}

/** select "log_aggregate_bool_exp_bool_and_arguments_columns" columns of table "log" */
export enum Log_Select_Column_Log_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Canceled = 'canceled'
}

/** select "log_aggregate_bool_exp_bool_or_arguments_columns" columns of table "log" */
export enum Log_Select_Column_Log_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Canceled = 'canceled'
}

/** update columns of table "log" */
export enum Log_Update_Column {
  /** column name */
  CancelLogId = 'cancelLogId',
  /** column name */
  CancelMemberId = 'cancelMemberId',
  /** column name */
  CancelMemberName = 'cancelMemberName',
  /** column name */
  Canceled = 'canceled',
  /** column name */
  Changes = 'changes',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DecisionId = 'decisionId',
  /** column name */
  Display = 'display',
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  MemberName = 'memberName',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  UserId = 'userId'
}

export type Meeting_Aggregate_Bool_Exp = {
  bool_and?: Meeting_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Meeting_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Meeting_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Meeting_Aggregate_Bool_Exp_Bool_And = {
  arguments: Meeting_Select_Column_Meeting_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Meeting_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Meeting_Select_Column_Meeting_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Meeting_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Meeting_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "meeting" */
export type Meeting_Arr_Rel_Insert_Input = {
  data: Array<Meeting_Insert_Input>;
  /** upsert condition */
  on_conflict?: Meeting_On_Conflict | null | undefined;
};

export type Meeting_Attendee_Aggregate_Bool_Exp = {
  bool_and?: Meeting_Attendee_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Meeting_Attendee_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Meeting_Attendee_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Meeting_Attendee_Aggregate_Bool_Exp_Bool_And = {
  arguments: Meeting_Attendee_Select_Column_Meeting_Attendee_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Attendee_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Meeting_Attendee_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Meeting_Attendee_Select_Column_Meeting_Attendee_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Attendee_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Meeting_Attendee_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Meeting_Attendee_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Attendee_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "meeting_attendee" */
export type Meeting_Attendee_Arr_Rel_Insert_Input = {
  data: Array<Meeting_Attendee_Insert_Input>;
  /** upsert condition */
  on_conflict?: Meeting_Attendee_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "meeting_attendee". All fields are combined with a logical 'AND'. */
export type Meeting_Attendee_Bool_Exp = {
  _and?: Array<Meeting_Attendee_Bool_Exp> | null | undefined;
  _not?: Meeting_Attendee_Bool_Exp | null | undefined;
  _or?: Array<Meeting_Attendee_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  meeting?: Meeting_Bool_Exp | null | undefined;
  meetingId?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  present?: Boolean_Comparison_Exp | null | undefined;
  startNotified?: Boolean_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "meeting_attendee" */
export enum Meeting_Attendee_Constraint {
  /** unique or primary key constraint on columns "memberId", "meetingId" */
  MeetingAttendeeMeetingIdMemberIdKey = 'meeting_attendee_meetingId_memberId_key',
  /** unique or primary key constraint on columns "id" */
  MeetingAttendeePkey = 'meeting_attendee_pkey'
}

/** input type for inserting data into table "meeting_attendee" */
export type Meeting_Attendee_Insert_Input = {
  id?: string | null | undefined;
  meeting?: Meeting_Obj_Rel_Insert_Input | null | undefined;
  meetingId?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  present?: boolean | null | undefined;
  startNotified?: boolean | null | undefined;
};

/** on_conflict condition type for table "meeting_attendee" */
export type Meeting_Attendee_On_Conflict = {
  constraint: Meeting_Attendee_Constraint;
  update_columns?: Array<Meeting_Attendee_Update_Column>;
  where?: Meeting_Attendee_Bool_Exp | null | undefined;
};

/** select columns of table "meeting_attendee" */
export enum Meeting_Attendee_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  Present = 'present',
  /** column name */
  StartNotified = 'startNotified'
}

/** select "meeting_attendee_aggregate_bool_exp_bool_and_arguments_columns" columns of table "meeting_attendee" */
export enum Meeting_Attendee_Select_Column_Meeting_Attendee_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Present = 'present',
  /** column name */
  StartNotified = 'startNotified'
}

/** select "meeting_attendee_aggregate_bool_exp_bool_or_arguments_columns" columns of table "meeting_attendee" */
export enum Meeting_Attendee_Select_Column_Meeting_Attendee_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Present = 'present',
  /** column name */
  StartNotified = 'startNotified'
}

/** input type for updating data in table "meeting_attendee" */
export type Meeting_Attendee_Set_Input = {
  id?: string | null | undefined;
  meetingId?: string | null | undefined;
  memberId?: string | null | undefined;
  present?: boolean | null | undefined;
  startNotified?: boolean | null | undefined;
};

/** update columns of table "meeting_attendee" */
export enum Meeting_Attendee_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  Present = 'present',
  /** column name */
  StartNotified = 'startNotified'
}

/** Boolean expression to filter rows from the table "meeting". All fields are combined with a logical 'AND'. */
export type Meeting_Bool_Exp = {
  _and?: Array<Meeting_Bool_Exp> | null | undefined;
  _not?: Meeting_Bool_Exp | null | undefined;
  _or?: Array<Meeting_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  currentStepId?: Uuid_Comparison_Exp | null | undefined;
  endDate?: Timestamptz_Comparison_Exp | null | undefined;
  ended?: Boolean_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  invitedReadonly?: Boolean_Comparison_Exp | null | undefined;
  lastUpdateSource?: String_Comparison_Exp | null | undefined;
  meeting_attendees?: Meeting_Attendee_Bool_Exp | null | undefined;
  meeting_attendees_aggregate?: Meeting_Attendee_Aggregate_Bool_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  private?: Boolean_Comparison_Exp | null | undefined;
  recurring?: Meeting_Recurring_Bool_Exp | null | undefined;
  recurringDate?: Timestamptz_Comparison_Exp | null | undefined;
  recurringId?: Uuid_Comparison_Exp | null | undefined;
  startDate?: Timestamptz_Comparison_Exp | null | undefined;
  steps?: Meeting_Step_Bool_Exp | null | undefined;
  stepsConfig?: Json_Comparison_Exp | null | undefined;
  steps_aggregate?: Meeting_Step_Aggregate_Bool_Exp | null | undefined;
  summary?: String_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
  videoConf?: Json_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "meeting" */
export enum Meeting_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeetingPkey = 'meeting_pkey'
}

/** input type for inserting data into table "meeting" */
export type Meeting_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  currentStepId?: string | null | undefined;
  endDate?: string | null | undefined;
  ended?: boolean | null | undefined;
  id?: string | null | undefined;
  invitedReadonly?: boolean | null | undefined;
  lastUpdateSource?: string | null | undefined;
  meeting_attendees?: Meeting_Attendee_Arr_Rel_Insert_Input | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  recurring?: Meeting_Recurring_Obj_Rel_Insert_Input | null | undefined;
  recurringDate?: string | null | undefined;
  recurringId?: string | null | undefined;
  startDate?: string | null | undefined;
  steps?: Meeting_Step_Arr_Rel_Insert_Input | null | undefined;
  stepsConfig?: any;
  summary?: string | null | undefined;
  title?: string | null | undefined;
  videoConf?: any;
};

/** input type for inserting object relation for remote table "meeting" */
export type Meeting_Obj_Rel_Insert_Input = {
  data: Meeting_Insert_Input;
  /** upsert condition */
  on_conflict?: Meeting_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "meeting" */
export type Meeting_On_Conflict = {
  constraint: Meeting_Constraint;
  update_columns?: Array<Meeting_Update_Column>;
  where?: Meeting_Bool_Exp | null | undefined;
};

export type Meeting_Recurring_Aggregate_Bool_Exp = {
  bool_and?: Meeting_Recurring_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Meeting_Recurring_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Meeting_Recurring_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Meeting_Recurring_Aggregate_Bool_Exp_Bool_And = {
  arguments: Meeting_Recurring_Select_Column_Meeting_Recurring_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Recurring_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Meeting_Recurring_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Meeting_Recurring_Select_Column_Meeting_Recurring_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Recurring_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Meeting_Recurring_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Meeting_Recurring_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Recurring_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "meeting_recurring" */
export type Meeting_Recurring_Arr_Rel_Insert_Input = {
  data: Array<Meeting_Recurring_Insert_Input>;
  /** upsert condition */
  on_conflict?: Meeting_Recurring_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "meeting_recurring". All fields are combined with a logical 'AND'. */
export type Meeting_Recurring_Bool_Exp = {
  _and?: Array<Meeting_Recurring_Bool_Exp> | null | undefined;
  _not?: Meeting_Recurring_Bool_Exp | null | undefined;
  _or?: Array<Meeting_Recurring_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  duration?: Smallint_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  invitedReadonly?: Boolean_Comparison_Exp | null | undefined;
  meetings?: Meeting_Bool_Exp | null | undefined;
  meetings_aggregate?: Meeting_Aggregate_Bool_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  private?: Boolean_Comparison_Exp | null | undefined;
  rrule?: String_Comparison_Exp | null | undefined;
  scope?: Json_Comparison_Exp | null | undefined;
  template?: Meeting_Template_Bool_Exp | null | undefined;
  templateId?: Uuid_Comparison_Exp | null | undefined;
  videoConf?: Json_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "meeting_recurring" */
export enum Meeting_Recurring_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeetingRecurringPkey = 'meeting_recurring_pkey'
}

/** input type for inserting data into table "meeting_recurring" */
export type Meeting_Recurring_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  duration?: number | null | undefined;
  id?: string | null | undefined;
  invitedReadonly?: boolean | null | undefined;
  meetings?: Meeting_Arr_Rel_Insert_Input | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  rrule?: string | null | undefined;
  scope?: any;
  template?: Meeting_Template_Obj_Rel_Insert_Input | null | undefined;
  templateId?: string | null | undefined;
  videoConf?: any;
};

/** input type for inserting object relation for remote table "meeting_recurring" */
export type Meeting_Recurring_Obj_Rel_Insert_Input = {
  data: Meeting_Recurring_Insert_Input;
  /** upsert condition */
  on_conflict?: Meeting_Recurring_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "meeting_recurring" */
export type Meeting_Recurring_On_Conflict = {
  constraint: Meeting_Recurring_Constraint;
  update_columns?: Array<Meeting_Recurring_Update_Column>;
  where?: Meeting_Recurring_Bool_Exp | null | undefined;
};

/** select columns of table "meeting_recurring" */
export enum Meeting_Recurring_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Duration = 'duration',
  /** column name */
  Id = 'id',
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  Rrule = 'rrule',
  /** column name */
  Scope = 'scope',
  /** column name */
  TemplateId = 'templateId',
  /** column name */
  VideoConf = 'videoConf'
}

/** select "meeting_recurring_aggregate_bool_exp_bool_and_arguments_columns" columns of table "meeting_recurring" */
export enum Meeting_Recurring_Select_Column_Meeting_Recurring_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  Private = 'private'
}

/** select "meeting_recurring_aggregate_bool_exp_bool_or_arguments_columns" columns of table "meeting_recurring" */
export enum Meeting_Recurring_Select_Column_Meeting_Recurring_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  Private = 'private'
}

/** input type for updating data in table "meeting_recurring" */
export type Meeting_Recurring_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  duration?: number | null | undefined;
  id?: string | null | undefined;
  invitedReadonly?: boolean | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  rrule?: string | null | undefined;
  scope?: any;
  templateId?: string | null | undefined;
  videoConf?: any;
};

/** update columns of table "meeting_recurring" */
export enum Meeting_Recurring_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Duration = 'duration',
  /** column name */
  Id = 'id',
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  Rrule = 'rrule',
  /** column name */
  Scope = 'scope',
  /** column name */
  TemplateId = 'templateId',
  /** column name */
  VideoConf = 'videoConf'
}

/** select columns of table "meeting" */
export enum Meeting_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentStepId = 'currentStepId',
  /** column name */
  EndDate = 'endDate',
  /** column name */
  Ended = 'ended',
  /** column name */
  Id = 'id',
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  LastUpdateSource = 'lastUpdateSource',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  RecurringDate = 'recurringDate',
  /** column name */
  RecurringId = 'recurringId',
  /** column name */
  StartDate = 'startDate',
  /** column name */
  StepsConfig = 'stepsConfig',
  /** column name */
  Summary = 'summary',
  /** column name */
  Title = 'title',
  /** column name */
  VideoConf = 'videoConf'
}

/** select "meeting_aggregate_bool_exp_bool_and_arguments_columns" columns of table "meeting" */
export enum Meeting_Select_Column_Meeting_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Ended = 'ended',
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  Private = 'private'
}

/** select "meeting_aggregate_bool_exp_bool_or_arguments_columns" columns of table "meeting" */
export enum Meeting_Select_Column_Meeting_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Ended = 'ended',
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  Private = 'private'
}

/** input type for updating data in table "meeting" */
export type Meeting_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  currentStepId?: string | null | undefined;
  endDate?: string | null | undefined;
  ended?: boolean | null | undefined;
  id?: string | null | undefined;
  invitedReadonly?: boolean | null | undefined;
  lastUpdateSource?: string | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  recurringDate?: string | null | undefined;
  recurringId?: string | null | undefined;
  startDate?: string | null | undefined;
  stepsConfig?: any;
  summary?: string | null | undefined;
  title?: string | null | undefined;
  videoConf?: any;
};

export type Meeting_Step_Aggregate_Bool_Exp = {
  count?: Meeting_Step_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Meeting_Step_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Meeting_Step_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Step_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "meeting_step" */
export type Meeting_Step_Arr_Rel_Insert_Input = {
  data: Array<Meeting_Step_Insert_Input>;
  /** upsert condition */
  on_conflict?: Meeting_Step_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "meeting_step". All fields are combined with a logical 'AND'. */
export type Meeting_Step_Bool_Exp = {
  _and?: Array<Meeting_Step_Bool_Exp> | null | undefined;
  _not?: Meeting_Step_Bool_Exp | null | undefined;
  _or?: Array<Meeting_Step_Bool_Exp> | null | undefined;
  data?: Json_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  meeting?: Meeting_Bool_Exp | null | undefined;
  meetingId?: Uuid_Comparison_Exp | null | undefined;
  notes?: String_Comparison_Exp | null | undefined;
  stepConfigId?: String_Comparison_Exp | null | undefined;
  type?: Meeting_Step_Type_Enum_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "meeting_step" */
export enum Meeting_Step_Constraint {
  /** unique or primary key constraint on columns "meetingId", "stepConfigId" */
  MeetingStepMeetingIdStepConfigIdKey = 'meeting_step_meetingId_stepConfigId_key',
  /** unique or primary key constraint on columns "id" */
  MeetingStepPkey = 'meeting_step_pkey'
}

/** input type for inserting data into table "meeting_step" */
export type Meeting_Step_Insert_Input = {
  data?: any;
  id?: string | null | undefined;
  meeting?: Meeting_Obj_Rel_Insert_Input | null | undefined;
  meetingId?: string | null | undefined;
  notes?: string | null | undefined;
  stepConfigId?: string | null | undefined;
  type?: Meeting_Step_Type_Enum | null | undefined;
};

/** on_conflict condition type for table "meeting_step" */
export type Meeting_Step_On_Conflict = {
  constraint: Meeting_Step_Constraint;
  update_columns?: Array<Meeting_Step_Update_Column>;
  where?: Meeting_Step_Bool_Exp | null | undefined;
};

/** select columns of table "meeting_step" */
export enum Meeting_Step_Select_Column {
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  Notes = 'notes',
  /** column name */
  StepConfigId = 'stepConfigId',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "meeting_step" */
export type Meeting_Step_Set_Input = {
  data?: any;
  id?: string | null | undefined;
  meetingId?: string | null | undefined;
  notes?: string | null | undefined;
  stepConfigId?: string | null | undefined;
  type?: Meeting_Step_Type_Enum | null | undefined;
};

export enum Meeting_Step_Type_Enum {
  Checklist = 'Checklist',
  Indicators = 'Indicators',
  Tasks = 'Tasks',
  Threads = 'Threads',
  Tour = 'Tour'
}

/** Boolean expression to compare columns of type "meeting_step_type_enum". All fields are combined with logical 'AND'. */
export type Meeting_Step_Type_Enum_Comparison_Exp = {
  _eq?: Meeting_Step_Type_Enum | null | undefined;
  _in?: Array<Meeting_Step_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Meeting_Step_Type_Enum | null | undefined;
  _nin?: Array<Meeting_Step_Type_Enum> | null | undefined;
};

/** update columns of table "meeting_step" */
export enum Meeting_Step_Update_Column {
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  Notes = 'notes',
  /** column name */
  StepConfigId = 'stepConfigId',
  /** column name */
  Type = 'type'
}

export type Meeting_Template_Aggregate_Bool_Exp = {
  count?: Meeting_Template_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Meeting_Template_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Meeting_Template_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Meeting_Template_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "meeting_template" */
export type Meeting_Template_Arr_Rel_Insert_Input = {
  data: Array<Meeting_Template_Insert_Input>;
  /** upsert condition */
  on_conflict?: Meeting_Template_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "meeting_template". All fields are combined with a logical 'AND'. */
export type Meeting_Template_Bool_Exp = {
  _and?: Array<Meeting_Template_Bool_Exp> | null | undefined;
  _not?: Meeting_Template_Bool_Exp | null | undefined;
  _or?: Array<Meeting_Template_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  stepsConfig?: Json_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "meeting_template" */
export enum Meeting_Template_Constraint {
  /** unique or primary key constraint on columns "id" */
  MeetingTemplatePkey = 'meeting_template_pkey'
}

/** input type for inserting data into table "meeting_template" */
export type Meeting_Template_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  stepsConfig?: any;
  title?: string | null | undefined;
};

/** input type for inserting object relation for remote table "meeting_template" */
export type Meeting_Template_Obj_Rel_Insert_Input = {
  data: Meeting_Template_Insert_Input;
  /** upsert condition */
  on_conflict?: Meeting_Template_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "meeting_template" */
export type Meeting_Template_On_Conflict = {
  constraint: Meeting_Template_Constraint;
  update_columns?: Array<Meeting_Template_Update_Column>;
  where?: Meeting_Template_Bool_Exp | null | undefined;
};

/** select columns of table "meeting_template" */
export enum Meeting_Template_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  StepsConfig = 'stepsConfig',
  /** column name */
  Title = 'title'
}

/** input type for updating data in table "meeting_template" */
export type Meeting_Template_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  orgId?: string | null | undefined;
  stepsConfig?: any;
  title?: string | null | undefined;
};

/** update columns of table "meeting_template" */
export enum Meeting_Template_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  StepsConfig = 'stepsConfig',
  /** column name */
  Title = 'title'
}

/** update columns of table "meeting" */
export enum Meeting_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentStepId = 'currentStepId',
  /** column name */
  EndDate = 'endDate',
  /** column name */
  Ended = 'ended',
  /** column name */
  Id = 'id',
  /** column name */
  InvitedReadonly = 'invitedReadonly',
  /** column name */
  LastUpdateSource = 'lastUpdateSource',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  RecurringDate = 'recurringDate',
  /** column name */
  RecurringId = 'recurringId',
  /** column name */
  StartDate = 'startDate',
  /** column name */
  StepsConfig = 'stepsConfig',
  /** column name */
  Summary = 'summary',
  /** column name */
  Title = 'title',
  /** column name */
  VideoConf = 'videoConf'
}

export type Member_Aggregate_Bool_Exp = {
  count?: Member_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Member_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Member_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Member_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "member" */
export type Member_Arr_Rel_Insert_Input = {
  data: Array<Member_Insert_Input>;
  /** upsert condition */
  on_conflict?: Member_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "member". All fields are combined with a logical 'AND'. */
export type Member_Bool_Exp = {
  _and?: Array<Member_Bool_Exp> | null | undefined;
  _not?: Member_Bool_Exp | null | undefined;
  _or?: Array<Member_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle_members?: Circle_Member_Bool_Exp | null | undefined;
  circle_members_aggregate?: Circle_Member_Aggregate_Bool_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  inviteDate?: Timestamptz_Comparison_Exp | null | undefined;
  inviteEmail?: String_Comparison_Exp | null | undefined;
  meeting_attendees?: Meeting_Attendee_Bool_Exp | null | undefined;
  meeting_attendees_aggregate?: Meeting_Attendee_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  picture?: String_Comparison_Exp | null | undefined;
  pictureFile?: Files_Bool_Exp | null | undefined;
  pictureFileId?: Uuid_Comparison_Exp | null | undefined;
  role?: Member_Role_Enum_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "member" */
export enum Member_Constraint {
  /** unique or primary key constraint on columns "orgId", "userId" */
  MemberOrgIdUserIdKey = 'member_orgId_userId_key',
  /** unique or primary key constraint on columns "id" */
  MemberPkey = 'member_pkey'
}

/** input type for inserting data into table "member" */
export type Member_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle_members?: Circle_Member_Arr_Rel_Insert_Input | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  id?: string | null | undefined;
  inviteDate?: string | null | undefined;
  inviteEmail?: string | null | undefined;
  meeting_attendees?: Meeting_Attendee_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  picture?: string | null | undefined;
  pictureFile?: Files_Obj_Rel_Insert_Input | null | undefined;
  pictureFileId?: string | null | undefined;
  role?: Member_Role_Enum | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** input type for inserting object relation for remote table "member" */
export type Member_Obj_Rel_Insert_Input = {
  data: Member_Insert_Input;
  /** upsert condition */
  on_conflict?: Member_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "member" */
export type Member_On_Conflict = {
  constraint: Member_Constraint;
  update_columns?: Array<Member_Update_Column>;
  where?: Member_Bool_Exp | null | undefined;
};

export enum Member_Role_Enum {
  /** Can invite members */
  Admin = 'Admin',
  /** Can participate and edit everything */
  Member = 'Member',
  /** Can subscribe */
  Owner = 'Owner',
  /** Can view but not participate */
  Readonly = 'Readonly'
}

/** Boolean expression to compare columns of type "member_role_enum". All fields are combined with logical 'AND'. */
export type Member_Role_Enum_Comparison_Exp = {
  _eq?: Member_Role_Enum | null | undefined;
  _in?: Array<Member_Role_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Member_Role_Enum | null | undefined;
  _nin?: Array<Member_Role_Enum> | null | undefined;
};

/** select columns of table "member" */
export enum Member_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  InviteDate = 'inviteDate',
  /** column name */
  InviteEmail = 'inviteEmail',
  /** column name */
  Name = 'name',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Picture = 'picture',
  /** column name */
  PictureFileId = 'pictureFileId',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "member" */
export type Member_Set_Input = {
  archivedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  id?: string | null | undefined;
  inviteDate?: string | null | undefined;
  inviteEmail?: string | null | undefined;
  name?: string | null | undefined;
  orgId?: string | null | undefined;
  picture?: string | null | undefined;
  pictureFileId?: string | null | undefined;
  role?: Member_Role_Enum | null | undefined;
  userId?: string | null | undefined;
};

/** update columns of table "member" */
export enum Member_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  InviteDate = 'inviteDate',
  /** column name */
  InviteEmail = 'inviteEmail',
  /** column name */
  Name = 'name',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Picture = 'picture',
  /** column name */
  PictureFileId = 'pictureFileId',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

export type News_Aggregate_Bool_Exp = {
  count?: News_Aggregate_Bool_Exp_Count | null | undefined;
};

export type News_Aggregate_Bool_Exp_Count = {
  arguments?: Array<News_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: News_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "news" */
export type News_Arr_Rel_Insert_Input = {
  data: Array<News_Insert_Input>;
};

/** Boolean expression to filter rows from the table "news". All fields are combined with a logical 'AND'. */
export type News_Bool_Exp = {
  _and?: Array<News_Bool_Exp> | null | undefined;
  _not?: News_Bool_Exp | null | undefined;
  _or?: Array<News_Bool_Exp> | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  decision?: Decision_Bool_Exp | null | undefined;
  decisionId?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  meeting?: Meeting_Bool_Exp | null | undefined;
  meetingId?: Uuid_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  thread?: Thread_Bool_Exp | null | undefined;
  threadId?: Uuid_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "news" */
export type News_Insert_Input = {
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  decision?: Decision_Obj_Rel_Insert_Input | null | undefined;
  decisionId?: string | null | undefined;
  id?: string | null | undefined;
  meeting?: Meeting_Obj_Rel_Insert_Input | null | undefined;
  meetingId?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  thread?: Thread_Obj_Rel_Insert_Input | null | undefined;
  threadId?: string | null | undefined;
};

/** select columns of table "news" */
export enum News_Select_Column {
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DecisionId = 'decisionId',
  /** column name */
  Id = 'id',
  /** column name */
  MeetingId = 'meetingId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ThreadId = 'threadId'
}

/** Boolean expression to filter rows from the table "org". All fields are combined with a logical 'AND'. */
export type Org_Bool_Exp = {
  _and?: Array<Org_Bool_Exp> | null | undefined;
  _not?: Org_Bool_Exp | null | undefined;
  _or?: Array<Org_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circleLinks?: Circle_Link_Bool_Exp | null | undefined;
  circleLinks_aggregate?: Circle_Link_Aggregate_Bool_Exp | null | undefined;
  circleMembers?: Circle_Member_Bool_Exp | null | undefined;
  circleMembers_aggregate?: Circle_Member_Aggregate_Bool_Exp | null | undefined;
  circles?: Circle_Bool_Exp | null | undefined;
  circles_aggregate?: Circle_Aggregate_Bool_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  decisions?: Decision_Bool_Exp | null | undefined;
  decisions_aggregate?: Decision_Aggregate_Bool_Exp | null | undefined;
  defaultGraphFolded?: Boolean_Comparison_Exp | null | undefined;
  defaultGraphMembers?: Boolean_Comparison_Exp | null | undefined;
  defaultGraphView?: String_Comparison_Exp | null | undefined;
  files?: Org_File_Bool_Exp | null | undefined;
  files_aggregate?: Org_File_Aggregate_Bool_Exp | null | undefined;
  governanceMode?: Governance_Mode_Enum_Comparison_Exp | null | undefined;
  homeNote?: String_Comparison_Exp | null | undefined;
  icon?: String_Comparison_Exp | null | undefined;
  iconFile?: Files_Bool_Exp | null | undefined;
  iconFileId?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  logs?: Log_Bool_Exp | null | undefined;
  logs_aggregate?: Log_Aggregate_Bool_Exp | null | undefined;
  meeting_templates?: Meeting_Template_Bool_Exp | null | undefined;
  meeting_templates_aggregate?: Meeting_Template_Aggregate_Bool_Exp | null | undefined;
  meetings?: Meeting_Bool_Exp | null | undefined;
  meetings_aggregate?: Meeting_Aggregate_Bool_Exp | null | undefined;
  meetings_recurring?: Meeting_Recurring_Bool_Exp | null | undefined;
  meetings_recurring_aggregate?: Meeting_Recurring_Aggregate_Bool_Exp | null | undefined;
  members?: Member_Bool_Exp | null | undefined;
  members_aggregate?: Member_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  news?: News_Bool_Exp | null | undefined;
  news_aggregate?: News_Aggregate_Bool_Exp | null | undefined;
  onboardingOrgType?: String_Comparison_Exp | null | undefined;
  onboardingTodo?: String_Comparison_Exp | null | undefined;
  org_subscription?: Org_Subscription_Bool_Exp | null | undefined;
  roles?: Role_Bool_Exp | null | undefined;
  roles_aggregate?: Role_Aggregate_Bool_Exp | null | undefined;
  shareMembers?: Boolean_Comparison_Exp | null | undefined;
  shareOrg?: Boolean_Comparison_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
  task_views?: Task_View_Bool_Exp | null | undefined;
  task_views_aggregate?: Task_View_Aggregate_Bool_Exp | null | undefined;
  tasks?: Task_Bool_Exp | null | undefined;
  tasks_aggregate?: Task_Aggregate_Bool_Exp | null | undefined;
  threads?: Thread_Bool_Exp | null | undefined;
  threads_aggregate?: Thread_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "org" */
export enum Org_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrgPkey = 'org_pkey',
  /** unique or primary key constraint on columns "slug" */
  OrgSlugKey = 'org_slug_key'
}

export type Org_File_Aggregate_Bool_Exp = {
  count?: Org_File_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Org_File_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Org_File_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Org_File_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "org_file" */
export type Org_File_Arr_Rel_Insert_Input = {
  data: Array<Org_File_Insert_Input>;
  /** upsert condition */
  on_conflict?: Org_File_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "org_file". All fields are combined with a logical 'AND'. */
export type Org_File_Bool_Exp = {
  _and?: Array<Org_File_Bool_Exp> | null | undefined;
  _not?: Org_File_Bool_Exp | null | undefined;
  _or?: Array<Org_File_Bool_Exp> | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  file?: Files_Bool_Exp | null | undefined;
  fileId?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "org_file" */
export enum Org_File_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrgFilePkey = 'org_file_pkey'
}

/** input type for inserting data into table "org_file" */
export type Org_File_Insert_Input = {
  createdAt?: string | null | undefined;
  file?: Files_Obj_Rel_Insert_Input | null | undefined;
  fileId?: string | null | undefined;
  id?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
};

/** on_conflict condition type for table "org_file" */
export type Org_File_On_Conflict = {
  constraint: Org_File_Constraint;
  update_columns?: Array<Org_File_Update_Column>;
  where?: Org_File_Bool_Exp | null | undefined;
};

/** select columns of table "org_file" */
export enum Org_File_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  FileId = 'fileId',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId'
}

/** update columns of table "org_file" */
export enum Org_File_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  FileId = 'fileId',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId'
}

/** input type for inserting data into table "org" */
export type Org_Insert_Input = {
  archivedAt?: string | null | undefined;
  circleLinks?: Circle_Link_Arr_Rel_Insert_Input | null | undefined;
  circleMembers?: Circle_Member_Arr_Rel_Insert_Input | null | undefined;
  circles?: Circle_Arr_Rel_Insert_Input | null | undefined;
  createdAt?: string | null | undefined;
  decisions?: Decision_Arr_Rel_Insert_Input | null | undefined;
  defaultGraphFolded?: boolean | null | undefined;
  defaultGraphMembers?: boolean | null | undefined;
  defaultGraphView?: string | null | undefined;
  files?: Org_File_Arr_Rel_Insert_Input | null | undefined;
  governanceMode?: Governance_Mode_Enum | null | undefined;
  homeNote?: string | null | undefined;
  icon?: string | null | undefined;
  iconFile?: Files_Obj_Rel_Insert_Input | null | undefined;
  iconFileId?: string | null | undefined;
  id?: string | null | undefined;
  logs?: Log_Arr_Rel_Insert_Input | null | undefined;
  meeting_templates?: Meeting_Template_Arr_Rel_Insert_Input | null | undefined;
  meetings?: Meeting_Arr_Rel_Insert_Input | null | undefined;
  meetings_recurring?: Meeting_Recurring_Arr_Rel_Insert_Input | null | undefined;
  members?: Member_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
  news?: News_Arr_Rel_Insert_Input | null | undefined;
  onboardingOrgType?: string | null | undefined;
  onboardingTodo?: string | null | undefined;
  org_subscription?: Org_Subscription_Obj_Rel_Insert_Input | null | undefined;
  roles?: Role_Arr_Rel_Insert_Input | null | undefined;
  shareMembers?: boolean | null | undefined;
  shareOrg?: boolean | null | undefined;
  slug?: string | null | undefined;
  task_views?: Task_View_Arr_Rel_Insert_Input | null | undefined;
  tasks?: Task_Arr_Rel_Insert_Input | null | undefined;
  threads?: Thread_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "org" */
export type Org_Obj_Rel_Insert_Input = {
  data: Org_Insert_Input;
  /** upsert condition */
  on_conflict?: Org_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "org" */
export type Org_On_Conflict = {
  constraint: Org_Constraint;
  update_columns?: Array<Org_Update_Column>;
  where?: Org_Bool_Exp | null | undefined;
};

/** input type for updating data in table "org" */
export type Org_Set_Input = {
  archivedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  defaultGraphFolded?: boolean | null | undefined;
  defaultGraphMembers?: boolean | null | undefined;
  defaultGraphView?: string | null | undefined;
  governanceMode?: Governance_Mode_Enum | null | undefined;
  homeNote?: string | null | undefined;
  icon?: string | null | undefined;
  iconFileId?: string | null | undefined;
  id?: string | null | undefined;
  name?: string | null | undefined;
  onboardingOrgType?: string | null | undefined;
  onboardingTodo?: string | null | undefined;
  shareMembers?: boolean | null | undefined;
  shareOrg?: boolean | null | undefined;
  slug?: string | null | undefined;
};

/** Boolean expression to filter rows from the table "org_subscription". All fields are combined with a logical 'AND'. */
export type Org_Subscription_Bool_Exp = {
  _and?: Array<Org_Subscription_Bool_Exp> | null | undefined;
  _not?: Org_Subscription_Bool_Exp | null | undefined;
  _or?: Array<Org_Subscription_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  status?: Subscription_Payment_Status_Enum_Comparison_Exp | null | undefined;
  stripeCustomerId?: String_Comparison_Exp | null | undefined;
  stripeSubscriptionId?: String_Comparison_Exp | null | undefined;
  type?: Subscription_Plan_Type_Enum_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "org_subscription" */
export enum Org_Subscription_Constraint {
  /** unique or primary key constraint on columns "orgId" */
  OrgSubscriptionOrgIdKey = 'org_subscription_orgId_key',
  /** unique or primary key constraint on columns "id" */
  OrgSubscriptionPkey = 'org_subscription_pkey',
  /** unique or primary key constraint on columns "stripeCustomerId" */
  OrgSubscriptionStripeCustomerIdKey = 'org_subscription_stripeCustomerId_key',
  /** unique or primary key constraint on columns "stripeSubscriptionId" */
  OrgSubscriptionStripeSubscriptionIdKey = 'org_subscription_stripeSubscriptionId_key'
}

/** input type for inserting data into table "org_subscription" */
export type Org_Subscription_Insert_Input = {
  archivedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  status?: Subscription_Payment_Status_Enum | null | undefined;
  stripeCustomerId?: string | null | undefined;
  stripeSubscriptionId?: string | null | undefined;
  type?: Subscription_Plan_Type_Enum | null | undefined;
};

/** input type for inserting object relation for remote table "org_subscription" */
export type Org_Subscription_Obj_Rel_Insert_Input = {
  data: Org_Subscription_Insert_Input;
  /** upsert condition */
  on_conflict?: Org_Subscription_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "org_subscription" */
export type Org_Subscription_On_Conflict = {
  constraint: Org_Subscription_Constraint;
  update_columns?: Array<Org_Subscription_Update_Column>;
  where?: Org_Subscription_Bool_Exp | null | undefined;
};

/** update columns of table "org_subscription" */
export enum Org_Subscription_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Status = 'status',
  /** column name */
  StripeCustomerId = 'stripeCustomerId',
  /** column name */
  StripeSubscriptionId = 'stripeSubscriptionId',
  /** column name */
  Type = 'type'
}

/** update columns of table "org" */
export enum Org_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DefaultGraphFolded = 'defaultGraphFolded',
  /** column name */
  DefaultGraphMembers = 'defaultGraphMembers',
  /** column name */
  DefaultGraphView = 'defaultGraphView',
  /** column name */
  GovernanceMode = 'governanceMode',
  /** column name */
  HomeNote = 'homeNote',
  /** column name */
  Icon = 'icon',
  /** column name */
  IconFileId = 'iconFileId',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OnboardingOrgType = 'onboardingOrgType',
  /** column name */
  OnboardingTodo = 'onboardingTodo',
  /** column name */
  ShareMembers = 'shareMembers',
  /** column name */
  ShareOrg = 'shareOrg',
  /** column name */
  Slug = 'slug'
}

export type Role_Aggregate_Bool_Exp = {
  bool_and?: Role_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Role_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Role_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Role_Aggregate_Bool_Exp_Bool_And = {
  arguments: Role_Select_Column_Role_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Role_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Role_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Role_Select_Column_Role_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Role_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Role_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Role_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Role_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "role" */
export type Role_Arr_Rel_Insert_Input = {
  data: Array<Role_Insert_Input>;
  /** upsert condition */
  on_conflict?: Role_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'. */
export type Role_Bool_Exp = {
  _and?: Array<Role_Bool_Exp> | null | undefined;
  _not?: Role_Bool_Exp | null | undefined;
  _or?: Array<Role_Bool_Exp> | null | undefined;
  accountabilities?: String_Comparison_Exp | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  base?: Boolean_Comparison_Exp | null | undefined;
  checklist?: String_Comparison_Exp | null | undefined;
  circles?: Circle_Bool_Exp | null | undefined;
  circles_aggregate?: Circle_Aggregate_Bool_Exp | null | undefined;
  colorHue?: Smallint_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  domain?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  indicators?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  notes?: String_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  parentLink?: Boolean_Comparison_Exp | null | undefined;
  purpose?: String_Comparison_Exp | null | undefined;
  singleMember?: Boolean_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "role" */
export enum Role_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolesPkey = 'roles_pkey'
}

/** input type for inserting data into table "role" */
export type Role_Insert_Input = {
  accountabilities?: string | null | undefined;
  archivedAt?: string | null | undefined;
  base?: boolean | null | undefined;
  checklist?: string | null | undefined;
  circles?: Circle_Arr_Rel_Insert_Input | null | undefined;
  colorHue?: number | null | undefined;
  createdAt?: string | null | undefined;
  domain?: string | null | undefined;
  id?: string | null | undefined;
  indicators?: string | null | undefined;
  name?: string | null | undefined;
  notes?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  parentLink?: boolean | null | undefined;
  purpose?: string | null | undefined;
  singleMember?: boolean | null | undefined;
};

/** input type for inserting object relation for remote table "role" */
export type Role_Obj_Rel_Insert_Input = {
  data: Role_Insert_Input;
  /** upsert condition */
  on_conflict?: Role_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "role" */
export type Role_On_Conflict = {
  constraint: Role_Constraint;
  update_columns?: Array<Role_Update_Column>;
  where?: Role_Bool_Exp | null | undefined;
};

/** select columns of table "role" */
export enum Role_Select_Column {
  /** column name */
  Accountabilities = 'accountabilities',
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Base = 'base',
  /** column name */
  Checklist = 'checklist',
  /** column name */
  ColorHue = 'colorHue',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Domain = 'domain',
  /** column name */
  Id = 'id',
  /** column name */
  Indicators = 'indicators',
  /** column name */
  Name = 'name',
  /** column name */
  Notes = 'notes',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ParentLink = 'parentLink',
  /** column name */
  Purpose = 'purpose',
  /** column name */
  SingleMember = 'singleMember'
}

/** select "role_aggregate_bool_exp_bool_and_arguments_columns" columns of table "role" */
export enum Role_Select_Column_Role_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Base = 'base',
  /** column name */
  ParentLink = 'parentLink',
  /** column name */
  SingleMember = 'singleMember'
}

/** select "role_aggregate_bool_exp_bool_or_arguments_columns" columns of table "role" */
export enum Role_Select_Column_Role_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Base = 'base',
  /** column name */
  ParentLink = 'parentLink',
  /** column name */
  SingleMember = 'singleMember'
}

/** input type for updating data in table "role" */
export type Role_Set_Input = {
  accountabilities?: string | null | undefined;
  archivedAt?: string | null | undefined;
  base?: boolean | null | undefined;
  checklist?: string | null | undefined;
  colorHue?: number | null | undefined;
  createdAt?: string | null | undefined;
  domain?: string | null | undefined;
  id?: string | null | undefined;
  indicators?: string | null | undefined;
  name?: string | null | undefined;
  notes?: string | null | undefined;
  orgId?: string | null | undefined;
  parentLink?: boolean | null | undefined;
  purpose?: string | null | undefined;
  singleMember?: boolean | null | undefined;
};

/** update columns of table "role" */
export enum Role_Update_Column {
  /** column name */
  Accountabilities = 'accountabilities',
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Base = 'base',
  /** column name */
  Checklist = 'checklist',
  /** column name */
  ColorHue = 'colorHue',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Domain = 'domain',
  /** column name */
  Id = 'id',
  /** column name */
  Indicators = 'indicators',
  /** column name */
  Name = 'name',
  /** column name */
  Notes = 'notes',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  ParentLink = 'parentLink',
  /** column name */
  Purpose = 'purpose',
  /** column name */
  SingleMember = 'singleMember'
}

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: number | null | undefined;
  _gt?: number | null | undefined;
  _gte?: number | null | undefined;
  _in?: Array<number> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: number | null | undefined;
  _lte?: number | null | undefined;
  _neq?: number | null | undefined;
  _nin?: Array<number> | null | undefined;
};

export enum Subscription_Payment_Status_Enum {
  Active = 'active',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Paused = 'paused',
  Trialing = 'trialing',
  Unpaid = 'unpaid'
}

/** Boolean expression to compare columns of type "subscription_payment_status_enum". All fields are combined with logical 'AND'. */
export type Subscription_Payment_Status_Enum_Comparison_Exp = {
  _eq?: Subscription_Payment_Status_Enum | null | undefined;
  _in?: Array<Subscription_Payment_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Subscription_Payment_Status_Enum | null | undefined;
  _nin?: Array<Subscription_Payment_Status_Enum> | null | undefined;
};

export enum Subscription_Plan_Type_Enum {
  Business = 'Business',
  Startup = 'Startup'
}

/** Boolean expression to compare columns of type "subscription_plan_type_enum". All fields are combined with logical 'AND'. */
export type Subscription_Plan_Type_Enum_Comparison_Exp = {
  _eq?: Subscription_Plan_Type_Enum | null | undefined;
  _in?: Array<Subscription_Plan_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Subscription_Plan_Type_Enum | null | undefined;
  _nin?: Array<Subscription_Plan_Type_Enum> | null | undefined;
};

export type Task_Aggregate_Bool_Exp = {
  bool_and?: Task_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Task_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Task_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Task_Aggregate_Bool_Exp_Bool_And = {
  arguments: Task_Select_Column_Task_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Task_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Task_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Task_Select_Column_Task_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Task_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Task_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Task_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Task_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "task" */
export type Task_Arr_Rel_Insert_Input = {
  data: Array<Task_Insert_Input>;
  /** upsert condition */
  on_conflict?: Task_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "task". All fields are combined with a logical 'AND'. */
export type Task_Bool_Exp = {
  _and?: Array<Task_Bool_Exp> | null | undefined;
  _not?: Task_Bool_Exp | null | undefined;
  _or?: Array<Task_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  dueDate?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  private?: Boolean_Comparison_Exp | null | undefined;
  status?: Task_Status_Enum_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "task" */
export enum Task_Constraint {
  /** unique or primary key constraint on columns "id" */
  TaskPkey = 'task_pkey'
}

/** input type for inserting data into table "task" */
export type Task_Insert_Input = {
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  dueDate?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  status?: Task_Status_Enum | null | undefined;
  title?: string | null | undefined;
};

/** input type for inserting object relation for remote table "task" */
export type Task_Obj_Rel_Insert_Input = {
  data: Task_Insert_Input;
  /** upsert condition */
  on_conflict?: Task_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "task" */
export type Task_On_Conflict = {
  constraint: Task_Constraint;
  update_columns?: Array<Task_Update_Column>;
  where?: Task_Bool_Exp | null | undefined;
};

/** select columns of table "task" */
export enum Task_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  DueDate = 'dueDate',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title'
}

/** select "task_aggregate_bool_exp_bool_and_arguments_columns" columns of table "task" */
export enum Task_Select_Column_Task_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Private = 'private'
}

/** select "task_aggregate_bool_exp_bool_or_arguments_columns" columns of table "task" */
export enum Task_Select_Column_Task_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Private = 'private'
}

/** input type for updating data in table "task" */
export type Task_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  dueDate?: string | null | undefined;
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  orgId?: string | null | undefined;
  private?: boolean | null | undefined;
  status?: Task_Status_Enum | null | undefined;
  title?: string | null | undefined;
};

export enum Task_Status_Enum {
  Blocked = 'Blocked',
  Done = 'Done',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Open = 'Open'
}

/** Boolean expression to compare columns of type "task_status_enum". All fields are combined with logical 'AND'. */
export type Task_Status_Enum_Comparison_Exp = {
  _eq?: Task_Status_Enum | null | undefined;
  _in?: Array<Task_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Task_Status_Enum | null | undefined;
  _nin?: Array<Task_Status_Enum> | null | undefined;
};

/** update columns of table "task" */
export enum Task_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  DueDate = 'dueDate',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Private = 'private',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title'
}

export type Task_View_Aggregate_Bool_Exp = {
  count?: Task_View_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Task_View_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Task_View_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Task_View_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "task_view" */
export type Task_View_Arr_Rel_Insert_Input = {
  data: Array<Task_View_Insert_Input>;
  /** upsert condition */
  on_conflict?: Task_View_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "task_view". All fields are combined with a logical 'AND'. */
export type Task_View_Bool_Exp = {
  _and?: Array<Task_View_Bool_Exp> | null | undefined;
  _not?: Task_View_Bool_Exp | null | undefined;
  _or?: Array<Task_View_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  key?: String_Comparison_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  tasksIds?: Json_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "task_view" */
export enum Task_View_Constraint {
  /** unique or primary key constraint on columns "orgId", "key" */
  TaskViewOrgIdKeyKey = 'task_view_orgId_key_key',
  /** unique or primary key constraint on columns "id" */
  TaskViewPkey = 'task_view_pkey'
}

/** input type for inserting data into table "task_view" */
export type Task_View_Insert_Input = {
  id?: string | null | undefined;
  key?: string | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  tasksIds?: any;
};

/** on_conflict condition type for table "task_view" */
export type Task_View_On_Conflict = {
  constraint: Task_View_Constraint;
  update_columns?: Array<Task_View_Update_Column>;
  where?: Task_View_Bool_Exp | null | undefined;
};

/** select columns of table "task_view" */
export enum Task_View_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  TasksIds = 'tasksIds'
}

/** update columns of table "task_view" */
export enum Task_View_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  TasksIds = 'tasksIds'
}

export type Thread_Activity_Aggregate_Bool_Exp = {
  count?: Thread_Activity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Thread_Activity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Thread_Activity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Thread_Activity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "thread_activity" */
export type Thread_Activity_Arr_Rel_Insert_Input = {
  data: Array<Thread_Activity_Insert_Input>;
  /** upsert condition */
  on_conflict?: Thread_Activity_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "thread_activity". All fields are combined with a logical 'AND'. */
export type Thread_Activity_Bool_Exp = {
  _and?: Array<Thread_Activity_Bool_Exp> | null | undefined;
  _not?: Thread_Activity_Bool_Exp | null | undefined;
  _or?: Array<Thread_Activity_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  data?: Jsonb_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  reactions?: Thread_Activity_Reaction_Bool_Exp | null | undefined;
  reactions_aggregate?: Thread_Activity_Reaction_Aggregate_Bool_Exp | null | undefined;
  refDecision?: Decision_Bool_Exp | null | undefined;
  refDecisionId?: Uuid_Comparison_Exp | null | undefined;
  refMeeting?: Meeting_Bool_Exp | null | undefined;
  refMeetingId?: Uuid_Comparison_Exp | null | undefined;
  refTask?: Task_Bool_Exp | null | undefined;
  refTaskId?: Uuid_Comparison_Exp | null | undefined;
  refThread?: Thread_Bool_Exp | null | undefined;
  refThreadId?: Uuid_Comparison_Exp | null | undefined;
  thread?: Thread_Bool_Exp | null | undefined;
  threadId?: Uuid_Comparison_Exp | null | undefined;
  type?: Thread_Activity_Type_Enum_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "thread_activity" */
export enum Thread_Activity_Constraint {
  /** unique or primary key constraint on columns "refMeetingId", "type", "threadId" */
  ThreadActivityActiveUnique = 'thread_activity_active_unique',
  /** unique or primary key constraint on columns "id" */
  ThreadActivityPkey = 'thread_activity_pkey'
}

/** input type for inserting data into table "thread_activity" */
export type Thread_Activity_Insert_Input = {
  archivedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  data?: any;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  reactions?: Thread_Activity_Reaction_Arr_Rel_Insert_Input | null | undefined;
  refDecision?: Decision_Obj_Rel_Insert_Input | null | undefined;
  refDecisionId?: string | null | undefined;
  refMeeting?: Meeting_Obj_Rel_Insert_Input | null | undefined;
  refMeetingId?: string | null | undefined;
  refTask?: Task_Obj_Rel_Insert_Input | null | undefined;
  refTaskId?: string | null | undefined;
  refThread?: Thread_Obj_Rel_Insert_Input | null | undefined;
  refThreadId?: string | null | undefined;
  thread?: Thread_Obj_Rel_Insert_Input | null | undefined;
  threadId?: string | null | undefined;
  type?: Thread_Activity_Type_Enum | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** input type for inserting object relation for remote table "thread_activity" */
export type Thread_Activity_Obj_Rel_Insert_Input = {
  data: Thread_Activity_Insert_Input;
  /** upsert condition */
  on_conflict?: Thread_Activity_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "thread_activity" */
export type Thread_Activity_On_Conflict = {
  constraint: Thread_Activity_Constraint;
  update_columns?: Array<Thread_Activity_Update_Column>;
  where?: Thread_Activity_Bool_Exp | null | undefined;
};

export type Thread_Activity_Reaction_Aggregate_Bool_Exp = {
  count?: Thread_Activity_Reaction_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Thread_Activity_Reaction_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Thread_Activity_Reaction_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Thread_Activity_Reaction_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "thread_activity_reaction" */
export type Thread_Activity_Reaction_Arr_Rel_Insert_Input = {
  data: Array<Thread_Activity_Reaction_Insert_Input>;
  /** upsert condition */
  on_conflict?: Thread_Activity_Reaction_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "thread_activity_reaction". All fields are combined with a logical 'AND'. */
export type Thread_Activity_Reaction_Bool_Exp = {
  _and?: Array<Thread_Activity_Reaction_Bool_Exp> | null | undefined;
  _not?: Thread_Activity_Reaction_Bool_Exp | null | undefined;
  _or?: Array<Thread_Activity_Reaction_Bool_Exp> | null | undefined;
  activity?: Thread_Activity_Bool_Exp | null | undefined;
  activityId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  shortcode?: String_Comparison_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "thread_activity_reaction" */
export enum Thread_Activity_Reaction_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThreadActivityReactionPkey = 'thread_activity_reaction_pkey'
}

/** input type for inserting data into table "thread_activity_reaction" */
export type Thread_Activity_Reaction_Insert_Input = {
  activity?: Thread_Activity_Obj_Rel_Insert_Input | null | undefined;
  activityId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  shortcode?: string | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "thread_activity_reaction" */
export type Thread_Activity_Reaction_On_Conflict = {
  constraint: Thread_Activity_Reaction_Constraint;
  update_columns?: Array<Thread_Activity_Reaction_Update_Column>;
  where?: Thread_Activity_Reaction_Bool_Exp | null | undefined;
};

/** select columns of table "thread_activity_reaction" */
export enum Thread_Activity_Reaction_Select_Column {
  /** column name */
  ActivityId = 'activityId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  Shortcode = 'shortcode',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "thread_activity_reaction" */
export enum Thread_Activity_Reaction_Update_Column {
  /** column name */
  ActivityId = 'activityId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  Shortcode = 'shortcode',
  /** column name */
  UserId = 'userId'
}

/** select columns of table "thread_activity" */
export enum Thread_Activity_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  RefDecisionId = 'refDecisionId',
  /** column name */
  RefMeetingId = 'refMeetingId',
  /** column name */
  RefTaskId = 'refTaskId',
  /** column name */
  RefThreadId = 'refThreadId',
  /** column name */
  ThreadId = 'threadId',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "thread_activity" */
export type Thread_Activity_Set_Input = {
  archivedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  data?: any;
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  refDecisionId?: string | null | undefined;
  refMeetingId?: string | null | undefined;
  refTaskId?: string | null | undefined;
  refThreadId?: string | null | undefined;
  threadId?: string | null | undefined;
  type?: Thread_Activity_Type_Enum | null | undefined;
  userId?: string | null | undefined;
};

export enum Thread_Activity_Type_Enum {
  Decision = 'Decision',
  Meeting = 'Meeting',
  MeetingNote = 'MeetingNote',
  Message = 'Message',
  Poll = 'Poll',
  Proposal = 'Proposal',
  ProposalEvent = 'ProposalEvent',
  Task = 'Task',
  Thread = 'Thread'
}

/** Boolean expression to compare columns of type "thread_activity_type_enum". All fields are combined with logical 'AND'. */
export type Thread_Activity_Type_Enum_Comparison_Exp = {
  _eq?: Thread_Activity_Type_Enum | null | undefined;
  _in?: Array<Thread_Activity_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Thread_Activity_Type_Enum | null | undefined;
  _nin?: Array<Thread_Activity_Type_Enum> | null | undefined;
};

/** update columns of table "thread_activity" */
export enum Thread_Activity_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  RefDecisionId = 'refDecisionId',
  /** column name */
  RefMeetingId = 'refMeetingId',
  /** column name */
  RefTaskId = 'refTaskId',
  /** column name */
  RefThreadId = 'refThreadId',
  /** column name */
  ThreadId = 'threadId',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

export type Thread_Aggregate_Bool_Exp = {
  bool_and?: Thread_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Thread_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Thread_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Thread_Aggregate_Bool_Exp_Bool_And = {
  arguments: Thread_Select_Column_Thread_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Thread_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Thread_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Thread_Select_Column_Thread_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Thread_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Thread_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Thread_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Thread_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "thread" */
export type Thread_Arr_Rel_Insert_Input = {
  data: Array<Thread_Insert_Input>;
  /** upsert condition */
  on_conflict?: Thread_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "thread". All fields are combined with a logical 'AND'. */
export type Thread_Bool_Exp = {
  _and?: Array<Thread_Bool_Exp> | null | undefined;
  _not?: Thread_Bool_Exp | null | undefined;
  _or?: Array<Thread_Bool_Exp> | null | undefined;
  activities?: Thread_Activity_Bool_Exp | null | undefined;
  activities_aggregate?: Thread_Activity_Aggregate_Bool_Exp | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  circle?: Circle_Bool_Exp | null | undefined;
  circleId?: Uuid_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  extra_members?: Thread_Extra_Member_Bool_Exp | null | undefined;
  extra_members_aggregate?: Thread_Extra_Member_Aggregate_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  initiatorMember?: Member_Bool_Exp | null | undefined;
  initiatorMemberId?: Uuid_Comparison_Exp | null | undefined;
  member_status?: Thread_Member_Status_Bool_Exp | null | undefined;
  member_status_aggregate?: Thread_Member_Status_Aggregate_Bool_Exp | null | undefined;
  org?: Org_Bool_Exp | null | undefined;
  orgId?: Uuid_Comparison_Exp | null | undefined;
  pinned?: Boolean_Comparison_Exp | null | undefined;
  private?: Boolean_Comparison_Exp | null | undefined;
  status?: Thread_Status_Enum_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "thread" */
export enum Thread_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThreadPkey = 'thread_pkey'
}

export type Thread_Extra_Member_Aggregate_Bool_Exp = {
  count?: Thread_Extra_Member_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Thread_Extra_Member_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Thread_Extra_Member_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Thread_Extra_Member_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "thread_extra_member" */
export type Thread_Extra_Member_Arr_Rel_Insert_Input = {
  data: Array<Thread_Extra_Member_Insert_Input>;
  /** upsert condition */
  on_conflict?: Thread_Extra_Member_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "thread_extra_member". All fields are combined with a logical 'AND'. */
export type Thread_Extra_Member_Bool_Exp = {
  _and?: Array<Thread_Extra_Member_Bool_Exp> | null | undefined;
  _not?: Thread_Extra_Member_Bool_Exp | null | undefined;
  _or?: Array<Thread_Extra_Member_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  thread?: Thread_Bool_Exp | null | undefined;
  threadId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "thread_extra_member" */
export enum Thread_Extra_Member_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThreadExtraMemberPkey = 'thread_extra_member_pkey',
  /** unique or primary key constraint on columns "memberId", "threadId" */
  ThreadExtraMemberThreadIdMemberIdKey = 'thread_extra_member_threadId_memberId_key'
}

/** input type for inserting data into table "thread_extra_member" */
export type Thread_Extra_Member_Insert_Input = {
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  thread?: Thread_Obj_Rel_Insert_Input | null | undefined;
  threadId?: string | null | undefined;
};

/** on_conflict condition type for table "thread_extra_member" */
export type Thread_Extra_Member_On_Conflict = {
  constraint: Thread_Extra_Member_Constraint;
  update_columns?: Array<Thread_Extra_Member_Update_Column>;
  where?: Thread_Extra_Member_Bool_Exp | null | undefined;
};

/** select columns of table "thread_extra_member" */
export enum Thread_Extra_Member_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  ThreadId = 'threadId'
}

/** input type for updating data in table "thread_extra_member" */
export type Thread_Extra_Member_Set_Input = {
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  threadId?: string | null | undefined;
};

/** update columns of table "thread_extra_member" */
export enum Thread_Extra_Member_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  ThreadId = 'threadId'
}

/** input type for inserting data into table "thread" */
export type Thread_Insert_Input = {
  activities?: Thread_Activity_Arr_Rel_Insert_Input | null | undefined;
  archivedAt?: string | null | undefined;
  circle?: Circle_Obj_Rel_Insert_Input | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  extra_members?: Thread_Extra_Member_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  initiatorMember?: Member_Obj_Rel_Insert_Input | null | undefined;
  initiatorMemberId?: string | null | undefined;
  member_status?: Thread_Member_Status_Arr_Rel_Insert_Input | null | undefined;
  org?: Org_Obj_Rel_Insert_Input | null | undefined;
  orgId?: string | null | undefined;
  pinned?: boolean | null | undefined;
  private?: boolean | null | undefined;
  status?: Thread_Status_Enum | null | undefined;
  title?: string | null | undefined;
};

export type Thread_Member_Status_Aggregate_Bool_Exp = {
  count?: Thread_Member_Status_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Thread_Member_Status_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Thread_Member_Status_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Thread_Member_Status_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "thread_member_status" */
export type Thread_Member_Status_Arr_Rel_Insert_Input = {
  data: Array<Thread_Member_Status_Insert_Input>;
  /** upsert condition */
  on_conflict?: Thread_Member_Status_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "thread_member_status". All fields are combined with a logical 'AND'. */
export type Thread_Member_Status_Bool_Exp = {
  _and?: Array<Thread_Member_Status_Bool_Exp> | null | undefined;
  _not?: Thread_Member_Status_Bool_Exp | null | undefined;
  _or?: Array<Thread_Member_Status_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  lastReadActivityId?: Uuid_Comparison_Exp | null | undefined;
  lastReadDate?: Timestamptz_Comparison_Exp | null | undefined;
  member?: Member_Bool_Exp | null | undefined;
  memberId?: Uuid_Comparison_Exp | null | undefined;
  thread?: Thread_Bool_Exp | null | undefined;
  threadId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "thread_member_status" */
export enum Thread_Member_Status_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThreadMemberStatusPkey = 'thread_member_status_pkey',
  /** unique or primary key constraint on columns "memberId", "threadId" */
  ThreadMemberStatusThreadIdMemberIdKey = 'thread_member_status_threadId_memberId_key'
}

/** input type for inserting data into table "thread_member_status" */
export type Thread_Member_Status_Insert_Input = {
  id?: string | null | undefined;
  lastReadActivityId?: string | null | undefined;
  lastReadDate?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  thread?: Thread_Obj_Rel_Insert_Input | null | undefined;
  threadId?: string | null | undefined;
};

/** on_conflict condition type for table "thread_member_status" */
export type Thread_Member_Status_On_Conflict = {
  constraint: Thread_Member_Status_Constraint;
  update_columns?: Array<Thread_Member_Status_Update_Column>;
  where?: Thread_Member_Status_Bool_Exp | null | undefined;
};

/** select columns of table "thread_member_status" */
export enum Thread_Member_Status_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LastReadActivityId = 'lastReadActivityId',
  /** column name */
  LastReadDate = 'lastReadDate',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  ThreadId = 'threadId'
}

/** update columns of table "thread_member_status" */
export enum Thread_Member_Status_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LastReadActivityId = 'lastReadActivityId',
  /** column name */
  LastReadDate = 'lastReadDate',
  /** column name */
  MemberId = 'memberId',
  /** column name */
  ThreadId = 'threadId'
}

/** input type for inserting object relation for remote table "thread" */
export type Thread_Obj_Rel_Insert_Input = {
  data: Thread_Insert_Input;
  /** upsert condition */
  on_conflict?: Thread_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "thread" */
export type Thread_On_Conflict = {
  constraint: Thread_Constraint;
  update_columns?: Array<Thread_Update_Column>;
  where?: Thread_Bool_Exp | null | undefined;
};

/** input type for inserting data into table "thread_poll_answer" */
export type Thread_Poll_Answer_Insert_Input = {
  activity?: Thread_Activity_Obj_Rel_Insert_Input | null | undefined;
  activityId?: string | null | undefined;
  choicesPoints?: any;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  userId?: string | null | undefined;
};

/** input type for updating data in table "thread_poll_answer" */
export type Thread_Poll_Answer_Set_Input = {
  activityId?: string | null | undefined;
  choicesPoints?: any;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  userId?: string | null | undefined;
};

/** input type for inserting data into table "thread_proposal_vote" */
export type Thread_Proposal_Vote_Insert_Input = {
  activity?: Thread_Activity_Obj_Rel_Insert_Input | null | undefined;
  activityId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  member?: Member_Obj_Rel_Insert_Input | null | undefined;
  memberId?: string | null | undefined;
  userId?: string | null | undefined;
  vote?: string | null | undefined;
};

/** input type for updating data in table "thread_proposal_vote" */
export type Thread_Proposal_Vote_Set_Input = {
  activityId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  memberId?: string | null | undefined;
  userId?: string | null | undefined;
  vote?: string | null | undefined;
};

/** select columns of table "thread" */
export enum Thread_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  InitiatorMemberId = 'initiatorMemberId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Pinned = 'pinned',
  /** column name */
  Private = 'private',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title'
}

/** select "thread_aggregate_bool_exp_bool_and_arguments_columns" columns of table "thread" */
export enum Thread_Select_Column_Thread_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Pinned = 'pinned',
  /** column name */
  Private = 'private'
}

/** select "thread_aggregate_bool_exp_bool_or_arguments_columns" columns of table "thread" */
export enum Thread_Select_Column_Thread_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Pinned = 'pinned',
  /** column name */
  Private = 'private'
}

/** input type for updating data in table "thread" */
export type Thread_Set_Input = {
  archivedAt?: string | null | undefined;
  circleId?: string | null | undefined;
  createdAt?: string | null | undefined;
  id?: string | null | undefined;
  initiatorMemberId?: string | null | undefined;
  orgId?: string | null | undefined;
  pinned?: boolean | null | undefined;
  private?: boolean | null | undefined;
  status?: Thread_Status_Enum | null | undefined;
  title?: string | null | undefined;
};

export enum Thread_Status_Enum {
  Active = 'Active',
  Blocked = 'Blocked',
  Closed = 'Closed',
  Preparation = 'Preparation'
}

/** Boolean expression to compare columns of type "thread_status_enum". All fields are combined with logical 'AND'. */
export type Thread_Status_Enum_Comparison_Exp = {
  _eq?: Thread_Status_Enum | null | undefined;
  _in?: Array<Thread_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Thread_Status_Enum | null | undefined;
  _nin?: Array<Thread_Status_Enum> | null | undefined;
};

/** update columns of table "thread" */
export enum Thread_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CircleId = 'circleId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  InitiatorMemberId = 'initiatorMemberId',
  /** column name */
  OrgId = 'orgId',
  /** column name */
  Pinned = 'pinned',
  /** column name */
  Private = 'private',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title'
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
};

export type User_App_Aggregate_Bool_Exp = {
  count?: User_App_Aggregate_Bool_Exp_Count | null | undefined;
};

export type User_App_Aggregate_Bool_Exp_Count = {
  arguments?: Array<User_App_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: User_App_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "user_app" */
export type User_App_Arr_Rel_Insert_Input = {
  data: Array<User_App_Insert_Input>;
  /** upsert condition */
  on_conflict?: User_App_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "user_app". All fields are combined with a logical 'AND'. */
export type User_App_Bool_Exp = {
  _and?: Array<User_App_Bool_Exp> | null | undefined;
  _not?: User_App_Bool_Exp | null | undefined;
  _or?: Array<User_App_Bool_Exp> | null | undefined;
  archivedAt?: Timestamptz_Comparison_Exp | null | undefined;
  config?: Json_Comparison_Exp | null | undefined;
  createdAt?: Date_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  secretConfig?: Json_Comparison_Exp | null | undefined;
  tmpData?: Json_Comparison_Exp | null | undefined;
  type?: App_Type_Enum_Comparison_Exp | null | undefined;
  user?: Users_Bool_Exp | null | undefined;
  userId?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "user_app" */
export enum User_App_Constraint {
  /** unique or primary key constraint on columns "userId", "type" */
  UserAppActiveUnique = 'user_app_active_unique',
  /** unique or primary key constraint on columns "id" */
  UserAppPkey = 'user_app_pkey'
}

/** input type for inserting data into table "user_app" */
export type User_App_Insert_Input = {
  archivedAt?: string | null | undefined;
  config?: any;
  createdAt?: any;
  id?: string | null | undefined;
  secretConfig?: any;
  tmpData?: any;
  type?: App_Type_Enum | null | undefined;
  user?: Users_Obj_Rel_Insert_Input | null | undefined;
  userId?: string | null | undefined;
};

/** on_conflict condition type for table "user_app" */
export type User_App_On_Conflict = {
  constraint: User_App_Constraint;
  update_columns?: Array<User_App_Update_Column>;
  where?: User_App_Bool_Exp | null | undefined;
};

/** select columns of table "user_app" */
export enum User_App_Select_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Config = 'config',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  SecretConfig = 'secretConfig',
  /** column name */
  TmpData = 'tmpData',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

/** update columns of table "user_app" */
export enum User_App_Update_Column {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Config = 'config',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  SecretConfig = 'secretConfig',
  /** column name */
  TmpData = 'tmpData',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

export type Users_Aggregate_Bool_Exp = {
  bool_and?: Users_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Users_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Users_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "auth.users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "auth.users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: Array<Users_Bool_Exp> | null | undefined;
  _not?: Users_Bool_Exp | null | undefined;
  _or?: Array<Users_Bool_Exp> | null | undefined;
  activeMfaType?: String_Comparison_Exp | null | undefined;
  apps?: User_App_Bool_Exp | null | undefined;
  apps_aggregate?: User_App_Aggregate_Bool_Exp | null | undefined;
  avatarUrl?: String_Comparison_Exp | null | undefined;
  createdAt?: Timestamptz_Comparison_Exp | null | undefined;
  currentChallenge?: String_Comparison_Exp | null | undefined;
  defaultRole?: String_Comparison_Exp | null | undefined;
  defaultRoleByRole?: AuthRoles_Bool_Exp | null | undefined;
  disabled?: Boolean_Comparison_Exp | null | undefined;
  displayName?: String_Comparison_Exp | null | undefined;
  email?: Citext_Comparison_Exp | null | undefined;
  emailVerified?: Boolean_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  isAnonymous?: Boolean_Comparison_Exp | null | undefined;
  lastSeen?: Timestamptz_Comparison_Exp | null | undefined;
  locale?: String_Comparison_Exp | null | undefined;
  members?: Member_Bool_Exp | null | undefined;
  members_aggregate?: Member_Aggregate_Bool_Exp | null | undefined;
  metadata?: Jsonb_Comparison_Exp | null | undefined;
  newEmail?: Citext_Comparison_Exp | null | undefined;
  new_phone_number?: String_Comparison_Exp | null | undefined;
  oauth2AuthRequests?: AuthOauth2AuthRequests_Bool_Exp | null | undefined;
  oauth2AuthRequests_aggregate?: AuthOauth2AuthRequests_Aggregate_Bool_Exp | null | undefined;
  oauth2RefreshTokens?: AuthOauth2RefreshTokens_Bool_Exp | null | undefined;
  oauth2RefreshTokens_aggregate?: AuthOauth2RefreshTokens_Aggregate_Bool_Exp | null | undefined;
  otpHash?: String_Comparison_Exp | null | undefined;
  otpHashExpiresAt?: Timestamptz_Comparison_Exp | null | undefined;
  otpMethodLastUsed?: String_Comparison_Exp | null | undefined;
  otp_attempts?: Smallint_Comparison_Exp | null | undefined;
  passwordHash?: String_Comparison_Exp | null | undefined;
  pending_sms_deanonymize_options?: Jsonb_Comparison_Exp | null | undefined;
  phoneNumber?: String_Comparison_Exp | null | undefined;
  phoneNumberVerified?: Boolean_Comparison_Exp | null | undefined;
  refreshTokens?: AuthRefreshTokens_Bool_Exp | null | undefined;
  refreshTokens_aggregate?: AuthRefreshTokens_Aggregate_Bool_Exp | null | undefined;
  roles?: AuthUserRoles_Bool_Exp | null | undefined;
  roles_aggregate?: AuthUserRoles_Aggregate_Bool_Exp | null | undefined;
  securityKeys?: AuthUserSecurityKeys_Bool_Exp | null | undefined;
  securityKeys_aggregate?: AuthUserSecurityKeys_Aggregate_Bool_Exp | null | undefined;
  ticket?: String_Comparison_Exp | null | undefined;
  ticketExpiresAt?: Timestamptz_Comparison_Exp | null | undefined;
  totpSecret?: String_Comparison_Exp | null | undefined;
  updatedAt?: Timestamptz_Comparison_Exp | null | undefined;
  userProviders?: AuthUserProviders_Bool_Exp | null | undefined;
  userProviders_aggregate?: AuthUserProviders_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "auth.users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "phone_number" */
  UsersPhoneNumberKey = 'users_phone_number_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "auth.users" */
export type Users_Insert_Input = {
  activeMfaType?: string | null | undefined;
  apps?: User_App_Arr_Rel_Insert_Input | null | undefined;
  avatarUrl?: string | null | undefined;
  createdAt?: string | null | undefined;
  currentChallenge?: string | null | undefined;
  defaultRole?: string | null | undefined;
  defaultRoleByRole?: AuthRoles_Obj_Rel_Insert_Input | null | undefined;
  disabled?: boolean | null | undefined;
  displayName?: string | null | undefined;
  email?: string | null | undefined;
  emailVerified?: boolean | null | undefined;
  id?: string | null | undefined;
  isAnonymous?: boolean | null | undefined;
  lastSeen?: string | null | undefined;
  locale?: string | null | undefined;
  members?: Member_Arr_Rel_Insert_Input | null | undefined;
  metadata?: any;
  newEmail?: string | null | undefined;
  new_phone_number?: string | null | undefined;
  oauth2AuthRequests?: AuthOauth2AuthRequests_Arr_Rel_Insert_Input | null | undefined;
  oauth2RefreshTokens?: AuthOauth2RefreshTokens_Arr_Rel_Insert_Input | null | undefined;
  otpHash?: string | null | undefined;
  otpHashExpiresAt?: string | null | undefined;
  otpMethodLastUsed?: string | null | undefined;
  otp_attempts?: number | null | undefined;
  passwordHash?: string | null | undefined;
  pending_sms_deanonymize_options?: any;
  phoneNumber?: string | null | undefined;
  phoneNumberVerified?: boolean | null | undefined;
  refreshTokens?: AuthRefreshTokens_Arr_Rel_Insert_Input | null | undefined;
  roles?: AuthUserRoles_Arr_Rel_Insert_Input | null | undefined;
  securityKeys?: AuthUserSecurityKeys_Arr_Rel_Insert_Input | null | undefined;
  ticket?: string | null | undefined;
  ticketExpiresAt?: string | null | undefined;
  totpSecret?: string | null | undefined;
  updatedAt?: string | null | undefined;
  userProviders?: AuthUserProviders_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "auth.users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "auth.users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: Users_Bool_Exp | null | undefined;
};

/** select columns of table "auth.users" */
export enum Users_Select_Column {
  /** column name */
  ActiveMfaType = 'activeMfaType',
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentChallenge = 'currentChallenge',
  /** column name */
  DefaultRole = 'defaultRole',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  LastSeen = 'lastSeen',
  /** column name */
  Locale = 'locale',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  NewEmail = 'newEmail',
  /** column name */
  NewPhoneNumber = 'new_phone_number',
  /** column name */
  OtpHash = 'otpHash',
  /** column name */
  OtpHashExpiresAt = 'otpHashExpiresAt',
  /** column name */
  OtpMethodLastUsed = 'otpMethodLastUsed',
  /** column name */
  OtpAttempts = 'otp_attempts',
  /** column name */
  PasswordHash = 'passwordHash',
  /** column name */
  PendingSmsDeanonymizeOptions = 'pending_sms_deanonymize_options',
  /** column name */
  PhoneNumber = 'phoneNumber',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified',
  /** column name */
  Ticket = 'ticket',
  /** column name */
  TicketExpiresAt = 'ticketExpiresAt',
  /** column name */
  TotpSecret = 'totpSecret',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** select "users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "auth.users" */
export enum Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Disabled = 'disabled',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified'
}

/** select "users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "auth.users" */
export enum Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Disabled = 'disabled',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified'
}

/** update columns of table "auth.users" */
export enum Users_Update_Column {
  /** column name */
  ActiveMfaType = 'activeMfaType',
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentChallenge = 'currentChallenge',
  /** column name */
  DefaultRole = 'defaultRole',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  LastSeen = 'lastSeen',
  /** column name */
  Locale = 'locale',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  NewEmail = 'newEmail',
  /** column name */
  NewPhoneNumber = 'new_phone_number',
  /** column name */
  OtpHash = 'otpHash',
  /** column name */
  OtpHashExpiresAt = 'otpHashExpiresAt',
  /** column name */
  OtpMethodLastUsed = 'otpMethodLastUsed',
  /** column name */
  OtpAttempts = 'otp_attempts',
  /** column name */
  PasswordHash = 'passwordHash',
  /** column name */
  PendingSmsDeanonymizeOptions = 'pending_sms_deanonymize_options',
  /** column name */
  PhoneNumber = 'phoneNumber',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified',
  /** column name */
  Ticket = 'ticket',
  /** column name */
  TicketExpiresAt = 'ticketExpiresAt',
  /** column name */
  TotpSecret = 'totpSecret',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
};

export type ApiKeyFragment = { id: string, name: string, value: string, createdAt: string };

export type CircleFragment = { id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null };

export type CircleSummaryFragment = { id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null, role: { id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } };

export type CircleLinkFragment = { id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null };

export type CircleMemberFragment = { id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null };

export type DecisionFragment = { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean };

export type LogFragment = { id: string, orgId: string, userId: string, memberId: string, memberName: string, meetingId: string | null, createdAt: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null, cancelMemberId: string | null, cancelMemberName: string | null, canceled: boolean, decisionId: string | null };

export type MeetingSummaryFragment = { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> };

export type MeetingFragment = { createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> };

export type MeetingAttendeeFragment = { id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean };

export type MeetingRecurringFragment = { id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } };

export type MeetingStepFragment = { id: string, meetingId: string, stepConfigId: string, notes: string, type: Meeting_Step_Type_Enum, data: MeetingStepData };

export type MemberFragment = { id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null };

export type MemberSummaryFragment = { id: string, userId: string | null, name: string, picture: string | null };

export type ThreadActivityMemberFragment = { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null };

export type NewsFragment = { id: string | null, createdAt: string | null, decision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null, meeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, thread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, activities: Array<{ id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null };

export type OrgFragment = { id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null };

export type OrgDataFragment = { id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null, org_subscription: { id: string, stripeSubscriptionId: string | null, stripeCustomerId: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum } | null, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null }>, circleMembers: Array<{ id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, circleLinks: Array<{ id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null }>, roles: Array<{ id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, members: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null }> };

export type OrgSubscriptionFragment = { id: string, stripeSubscriptionId: string | null, stripeCustomerId: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum };

export type RoleFragment = { id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null };

export type RoleSummaryFragment = { id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null };

export type RoleAiFragment = { id: string, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string };

export type TaskFragment = { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean };

export type ThreadFragment = { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> };

export type ThreadMemberStatusFragment = { lastReadActivityId: string | null, lastReadDate: string };

export type ThreadWithFirstActivityFragment = { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, activities: Array<{ id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> };

export type ThreadActivityFragment = { id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null };

export type ThreadActivityReactionFragment = { id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null };

export type ThreadExtraMemberFragment = { id: string, threadId: string, memberId: string };

export type UserAppFragment = { id: string, userId: string, type: App_Type_Enum, config: any };

export type UserAppFullFragment = { id: string, userId: string, type: App_Type_Enum, secretConfig: any, config: any, tmpData: any, createdAt: any, user: { metadata: UserMetadata } | null };

export type ApiKeysSubscriptionVariables = Exact<{
  userId: string;
}>;


export type ApiKeysSubscription = { api_key: Array<{ id: string, name: string, value: string, createdAt: string }> };

export type CreateApiKeyMutationVariables = Exact<{
  userId: string;
  name: string;
}>;


export type CreateApiKeyMutation = { insert_api_key_one: { id: string, name: string, value: string, createdAt: string } | null };

export type RenameApiKeyMutationVariables = Exact<{
  id: string;
  name: string;
}>;


export type RenameApiKeyMutation = { update_api_key_by_pk: { id: string, name: string, value: string, createdAt: string } | null };

export type ArchiveApiKeyMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveApiKeyMutation = { update_api_key_by_pk: { id: string } | null };

export type UserAppsSubscriptionVariables = Exact<{
  userId: string;
}>;


export type UserAppsSubscription = { user_app: Array<{ id: string, userId: string, type: App_Type_Enum, config: any }> };

export type ArchiveUserAppMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveUserAppMutation = { update_user_app_by_pk: { id: string } | null };

export type GetCircleQueryVariables = Exact<{
  id: string;
}>;


export type GetCircleQuery = { circle_by_pk: { id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null, role: { id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } } | null };

export type GetPublicCirclesQueryVariables = Exact<{
  orgId: string;
}>;


export type GetPublicCirclesQuery = { circle: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, members: Array<{ id: string, memberId: string }>, invitedCircleLinks: Array<{ id: string, invitedCircle: { id: string } }> }>, role: Array<{ id: string, orgId: string, base: boolean, name: string, purpose: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, member: Array<{ id: string, orgId: string, name: string, picture: string | null }> };

export type GetCirclesStatsQueryVariables = Exact<{
  circlesIds: Array<string> | string;
}>;


export type GetCirclesStatsQuery = { thread_aggregate: { aggregate: { count: number } | null }, meeting_aggregate: { aggregate: { count: number } | null }, meeting_recurring_aggregate: { aggregate: { count: number } | null }, task_aggregate: { aggregate: { count: number } | null }, decision_aggregate: { aggregate: { count: number } | null } };

export type CreateCircleMutationVariables = Exact<{
  orgId: string;
  roleId: string;
  parentId?: string | null | undefined;
}>;


export type CreateCircleMutation = { insert_circle_one: { id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null } | null };

export type InsertCircleMutationVariables = Exact<{
  object: Circle_Insert_Input;
}>;


export type InsertCircleMutation = { insert_circle_one: { id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null } | null };

export type CreateCirclesMutationVariables = Exact<{
  circles: Array<Circle_Insert_Input> | Circle_Insert_Input;
}>;


export type CreateCirclesMutation = { insert_circle: { returning: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null, role: { id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } }> } | null };

export type UpdateCircleMutationVariables = Exact<{
  id: string;
  values: Circle_Set_Input;
}>;


export type UpdateCircleMutation = { update_circle_by_pk: { id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null, role: { name: string }, parent: { role: { name: string } } | null } | null };

export type CreateCircleLinkMutationVariables = Exact<{
  parentId: string;
  circleId: string;
  orgId: string;
}>;


export type CreateCircleLinkMutation = { insert_circle_link_one: { id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null } | null };

export type GetCircleLinkQueryVariables = Exact<{
  id: string;
}>;


export type GetCircleLinkQuery = { circle_link_by_pk: { id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null } | null };

export type InsertCircleLinkMutationVariables = Exact<{
  object: Circle_Link_Insert_Input;
}>;


export type InsertCircleLinkMutation = { insert_circle_link_one: { id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null } | null };

export type UpdateCircleLinkMutationVariables = Exact<{
  id: string;
  values: Circle_Link_Set_Input;
}>;


export type UpdateCircleLinkMutation = { update_circle_link_by_pk: { id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null } | null };

export type ArchiveCircleLinkMutationVariables = Exact<{
  parentId: string;
  circleId: string;
  archivedAt: string;
}>;


export type ArchiveCircleLinkMutation = { update_circle_link: { returning: Array<{ id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null }> } | null };

export type GetCircleMemberQueryVariables = Exact<{
  id: string;
}>;


export type GetCircleMemberQuery = { circle_member_by_pk: { id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null } | null };

export type CreateCircleMemberMutationVariables = Exact<{
  circleId: string;
  memberId: string;
  orgId: string;
}>;


export type CreateCircleMemberMutation = { insert_circle_member_one: { id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null, member: { id: string, name: string }, circle: { role: { id: string, name: string } } } | null };

export type UpdateCircleMemberMutationVariables = Exact<{
  id: string;
  values: Circle_Member_Set_Input;
}>;


export type UpdateCircleMemberMutation = { update_circle_member_by_pk: { id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null } | null };

export type InsertCircleMemberMutationVariables = Exact<{
  object: Circle_Member_Insert_Input;
}>;


export type InsertCircleMemberMutation = { insert_circle_member_one: { id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null } | null };

export type ArchiveCircleMemberMutationVariables = Exact<{
  circleId: string;
  memberId: string;
  archivedAt: string;
}>;


export type ArchiveCircleMemberMutation = { update_circle_member: { returning: Array<{ id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null, member: { id: string, name: string }, circle: { role: { id: string, name: string } } }> } | null };

export type GetDecisionQueryVariables = Exact<{
  id: string;
}>;


export type GetDecisionQuery = { decision_by_pk: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null };

export type DecisionSubscriptionVariables = Exact<{
  id: string;
}>;


export type DecisionSubscription = { decision_by_pk: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null };

export type DecisionThreadsQueryVariables = Exact<{
  decisionId: string;
}>;


export type DecisionThreadsQuery = { thread_activity: Array<{ id: string, thread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } }> };

export type CircleDecisionsSubscriptionVariables = Exact<{
  circleId: string;
  active: boolean;
}>;


export type CircleDecisionsSubscription = { decision: Array<{ id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean }> };

export type CreateDecisionMutationVariables = Exact<{
  values: Decision_Insert_Input;
}>;


export type CreateDecisionMutation = { insert_decision_one: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null };

export type UpdateDecisionMutationVariables = Exact<{
  id: string;
  values: Decision_Set_Input;
}>;


export type UpdateDecisionMutation = { update_decision_by_pk: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null };

export type ArchiveDecisionMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveDecisionMutation = { update_decision_by_pk: { id: string } | null };

export type LastLogsQueryVariables = Exact<{
  orgId: string;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type LastLogsQuery = { log: Array<{ id: string, orgId: string, userId: string, memberId: string, memberName: string, meetingId: string | null, createdAt: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null, cancelMemberId: string | null, cancelMemberName: string | null, canceled: boolean, decisionId: string | null }>, log_aggregate: { aggregate: { count: number } | null } };

export type MeetingLogsSubscriptionVariables = Exact<{
  meetingId: string;
}>;


export type MeetingLogsSubscription = { log: Array<{ id: string, orgId: string, userId: string, memberId: string, memberName: string, meetingId: string | null, createdAt: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null, cancelMemberId: string | null, cancelMemberName: string | null, canceled: boolean, decisionId: string | null }> };

export type DecisionLogsSubscriptionVariables = Exact<{
  decisionId: string;
}>;


export type DecisionLogsSubscription = { log: Array<{ id: string, orgId: string, userId: string, memberId: string, memberName: string, meetingId: string | null, createdAt: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null, cancelMemberId: string | null, cancelMemberName: string | null, canceled: boolean, decisionId: string | null }> };

export type CreateLogMutationVariables = Exact<{
  values: Log_Insert_Input;
}>;


export type CreateLogMutation = { insert_log_one: { id: string, orgId: string, userId: string, memberId: string, memberName: string, meetingId: string | null, createdAt: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null, cancelMemberId: string | null, cancelMemberName: string | null, canceled: boolean, decisionId: string | null } | null };

export type CancelLogMutationVariables = Exact<{
  id: string;
}>;


export type CancelLogMutation = { update_log_by_pk: { id: string, orgId: string, userId: string, memberId: string, memberName: string, meetingId: string | null, createdAt: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null, cancelMemberId: string | null, cancelMemberName: string | null, canceled: boolean, decisionId: string | null } | null };

export type MeetingSubscriptionVariables = Exact<{
  id: string;
}>;


export type MeetingSubscription = { meeting_by_pk: { createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, steps: Array<{ id: string, meetingId: string, stepConfigId: string, notes: string, type: Meeting_Step_Type_Enum, data: MeetingStepData }>, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null };

export type MeetingsByDatesSubscriptionVariables = Exact<{
  orgId: string;
  fromDate: string;
  toDate: string;
  filters: Array<Meeting_Bool_Exp> | Meeting_Bool_Exp;
  recurringFilters: Array<Meeting_Bool_Exp> | Meeting_Bool_Exp;
}>;


export type MeetingsByDatesSubscription = { org_by_pk: { meetings: Array<{ id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> }>, meetings_recurring: Array<{ id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, meetings: Array<{ id: string, recurringDate: string | null }>, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } }> } | null };

export type NextMeetingsSubscriptionVariables = Exact<{
  orgId: string;
  memberId: string;
}>;


export type NextMeetingsSubscription = { meeting: Array<{ id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> }> };

export type CircleMeetingsSubscriptionVariables = Exact<{
  circleId: string;
}>;


export type CircleMeetingsSubscription = { meeting: Array<{ id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> }> };

export type CreateMeetingMutationVariables = Exact<{
  values: Meeting_Insert_Input;
}>;


export type CreateMeetingMutation = { insert_meeting_one: { createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null };

export type UpdateMeetingMutationVariables = Exact<{
  id: string;
  values: Meeting_Set_Input;
}>;


export type UpdateMeetingMutation = { update_meeting_by_pk: { createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null };

export type ArchiveMeetingMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveMeetingMutation = { update_meeting_by_pk: { id: string } | null };

export type CreateMeetingAttendeeMutationVariables = Exact<{
  values: Meeting_Attendee_Insert_Input;
}>;


export type CreateMeetingAttendeeMutation = { insert_meeting_attendee_one: { id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean } | null };

export type UpdateMeetingAttendeeMutationVariables = Exact<{
  id: string;
  values: Meeting_Attendee_Set_Input;
}>;


export type UpdateMeetingAttendeeMutation = { update_meeting_attendee_by_pk: { id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean } | null };

export type DeleteMeetingAttendeeMutationVariables = Exact<{
  id: string;
}>;


export type DeleteMeetingAttendeeMutation = { delete_meeting_attendee_by_pk: { id: string } | null };

export type MeetingRecurringSubscriptionVariables = Exact<{
  id: string;
}>;


export type MeetingRecurringSubscription = { meeting_recurring_by_pk: { id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, meetings: Array<{ id: string, recurringDate: string | null }>, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } } | null };

export type MeetingRecurringsSubscriptionVariables = Exact<{
  where: Meeting_Recurring_Bool_Exp;
}>;


export type MeetingRecurringsSubscription = { meeting_recurring: Array<{ id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } }> };

export type CreateMeetingRecurringMutationVariables = Exact<{
  values: Meeting_Recurring_Insert_Input;
}>;


export type CreateMeetingRecurringMutation = { insert_meeting_recurring_one: { id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } } | null };

export type UpdateMeetingRecurringMutationVariables = Exact<{
  id: string;
  values: Meeting_Recurring_Set_Input;
}>;


export type UpdateMeetingRecurringMutation = { update_meeting_recurring_by_pk: { id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } } | null };

export type ArchiveMeetingRecurringMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveMeetingRecurringMutation = { update_meeting_recurring_by_pk: { id: string } | null };

export type GetMeetingStepsQueryVariables = Exact<{
  meetingId: string;
}>;


export type GetMeetingStepsQuery = { meeting_step: Array<{ id: string, meetingId: string, stepConfigId: string, notes: string, type: Meeting_Step_Type_Enum, data: MeetingStepData }> };

export type GetPrevMeetingStepsQueryVariables = Exact<{
  beforeDate: string;
  circleId: string;
  stepsIds: Array<string> | string;
}>;


export type GetPrevMeetingStepsQuery = { meeting: Array<{ steps: Array<{ id: string, meetingId: string, stepConfigId: string, notes: string, type: Meeting_Step_Type_Enum, data: MeetingStepData }> }> };

export type CreateMeetingStepMutationVariables = Exact<{
  values: Meeting_Step_Insert_Input;
}>;


export type CreateMeetingStepMutation = { insert_meeting_step_one: { id: string, meetingId: string, stepConfigId: string, notes: string, type: Meeting_Step_Type_Enum, data: MeetingStepData } | null };

export type UpdateMeetingStepMutationVariables = Exact<{
  id: string;
  values: Meeting_Step_Set_Input;
}>;


export type UpdateMeetingStepMutation = { update_meeting_step_by_pk: { id: string, meetingId: string, stepConfigId: string, notes: string, type: Meeting_Step_Type_Enum, data: MeetingStepData } | null };

export type DeleteMeetingStepMutationVariables = Exact<{
  id: string;
}>;


export type DeleteMeetingStepMutation = { delete_meeting_step_by_pk: { id: string } | null };

export type MeetingTemplateFragment = { id: string, orgId: string, circleId: string | null, title: string, stepsConfig: Array<MeetingStepConfig> };

export type MeetingTemplatesSubscriptionVariables = Exact<{
  orgId: string;
}>;


export type MeetingTemplatesSubscription = { meeting_template: Array<{ id: string, orgId: string, circleId: string | null, title: string, stepsConfig: Array<MeetingStepConfig> }> };

export type CreateMeetingTemplateMutationVariables = Exact<{
  values: Meeting_Template_Insert_Input;
}>;


export type CreateMeetingTemplateMutation = { insert_meeting_template_one: { id: string, orgId: string, circleId: string | null, title: string, stepsConfig: Array<MeetingStepConfig> } | null };

export type UpdateMeetingTemplateMutationVariables = Exact<{
  id: string;
  values: Meeting_Template_Set_Input;
}>;


export type UpdateMeetingTemplateMutation = { update_meeting_template_by_pk: { id: string, orgId: string, circleId: string | null, title: string, stepsConfig: Array<MeetingStepConfig> } | null };

export type ArchiveMeetingTemplateMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveMeetingTemplateMutation = { update_meeting_template_by_pk: { id: string } | null };

export type GetMemberQueryVariables = Exact<{
  id: string;
}>;


export type GetMemberQuery = { member_by_pk: { id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null } | null };

export type MembersByIdsQueryVariables = Exact<{
  ids: Array<string> | string;
}>;


export type MembersByIdsQuery = { member: Array<{ id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null }> };

export type MembersSubscriptionVariables = Exact<{
  orgId: string;
  active: boolean;
}>;


export type MembersSubscription = { member: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null }> };

export type CurrentMeetingsSubscriptionVariables = Exact<{
  memberId: string;
}>;


export type CurrentMeetingsSubscription = { member_by_pk: { org: { meetings: Array<{ id: string }> } } | null };

export type CreateMemberMutationVariables = Exact<{
  orgId: string;
  name: string;
}>;


export type CreateMemberMutation = { insert_member_one: { id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null } | null };

export type UpdateMemberMutationVariables = Exact<{
  id: string;
  values: Member_Set_Input;
}>;


export type UpdateMemberMutation = { update_member_by_pk: { id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null } | null };

export type LastNewsQueryVariables = Exact<{
  where: News_Bool_Exp;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type LastNewsQuery = { news: Array<{ id: string | null, createdAt: string | null, decision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null, meeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, thread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, activities: Array<{ id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null }>, news_aggregate: { aggregate: { count: number } | null } };

export type OnboardingActivitySubscriptionVariables = Exact<{
  orgId: string;
}>;


export type OnboardingActivitySubscription = { org_by_pk: { id: string, meetings: Array<{ id: string }>, meetings_recurring: Array<{ id: string }>, threads: Array<{ id: string }>, decisions: Array<{ id: string }> } | null };

export type GetOrgQueryVariables = Exact<{
  id: string;
}>;


export type GetOrgQuery = { org_by_pk: { id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null } | null };

export type OrgsSubscriptionVariables = Exact<{
  userId: string;
}>;


export type OrgsSubscription = { member: Array<{ org: { id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null, role: { id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } }> } }> };

export type OrgSubscriptionVariables = Exact<{
  id: string;
}>;


export type OrgSubscription = { org_by_pk: { id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null, org_subscription: { id: string, stripeSubscriptionId: string | null, stripeCustomerId: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum } | null, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null }>, circleMembers: Array<{ id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, circleLinks: Array<{ id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null }>, roles: Array<{ id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, members: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null }> } | null };

export type OrgBySlugSubscriptionVariables = Exact<{
  slug: string;
}>;


export type OrgBySlugSubscription = { org: Array<{ id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null, org_subscription: { id: string, stripeSubscriptionId: string | null, stripeCustomerId: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum } | null, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null }>, circleMembers: Array<{ id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, circleLinks: Array<{ id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null }>, roles: Array<{ id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, members: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null }> }> };

export type UpdateOrgMutationVariables = Exact<{
  id: string;
  values: Org_Set_Input;
}>;


export type UpdateOrgMutation = { update_org_by_pk: { id: string } | null };

export type ThreadProposalVoteFragment = { id: string, activityId: string, userId: string, vote: string, createdAt: string };

export type ThreadProposalVotesSubscriptionVariables = Exact<{
  activityId: string;
}>;


export type ThreadProposalVotesSubscription = { thread_proposal_vote: Array<{ id: string, activityId: string, userId: string, vote: string, createdAt: string }> };

export type CreateThreadProposalVoteMutationVariables = Exact<{
  values: Thread_Proposal_Vote_Insert_Input;
}>;


export type CreateThreadProposalVoteMutation = { insert_thread_proposal_vote_one: { id: string, activityId: string, userId: string, vote: string, createdAt: string } | null };

export type UpdateThreadProposalVoteMutationVariables = Exact<{
  id: string;
  values: Thread_Proposal_Vote_Set_Input;
}>;


export type UpdateThreadProposalVoteMutation = { update_thread_proposal_vote_by_pk: { id: string, activityId: string, userId: string, vote: string, createdAt: string } | null };

export type GetRoleQueryVariables = Exact<{
  id: string;
}>;


export type GetRoleQuery = { role_by_pk: { id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } | null };

export type RoleSubscriptionVariables = Exact<{
  id: string;
}>;


export type RoleSubscription = { role_by_pk: { id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } | null };

export type RolesSubscriptionVariables = Exact<{
  orgId: string;
  active: boolean;
}>;


export type RolesSubscription = { role: Array<{ id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }> };

export type CreateRoleMutationVariables = Exact<{
  values: Role_Insert_Input;
}>;


export type CreateRoleMutation = { insert_role_one: { id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } | null };

export type UpdateRoleMutationVariables = Exact<{
  id: string;
  values: Role_Set_Input;
}>;


export type UpdateRoleMutation = { update_role_by_pk: { id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null } | null };

export type ArchiveRoleMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveRoleMutation = { update_role_by_pk: { id: string, archivedAt: string | null } | null };

export type GetSearchResultsQueryVariables = Exact<{
  membersIds: Array<string> | string;
  circlesIds: Array<string> | string;
  threadsIds: Array<string> | string;
  meetingsIds: Array<string> | string;
  tasksIds: Array<string> | string;
  decisionsIds: Array<string> | string;
}>;


export type GetSearchResultsQuery = { member: Array<{ id: string, name: string, picture: string | null }>, circle: Array<{ id: string, role: { name: string } }>, thread: Array<{ id: string, circleId: string, title: string, createdAt: string }>, meeting: Array<{ id: string, circleId: string, title: string, startDate: string }>, task: Array<{ id: string, circleId: string, title: string, dueDate: string | null }>, decision: Array<{ id: string, circleId: string, title: string, createdAt: string }> };

export type AdminGrowthQueryVariables = Exact<{
  since: string;
}>;


export type AdminGrowthQuery = { org: Array<{ createdAt: string }>, users: Array<{ createdAt: string }>, org_aggregate: { aggregate: { count: number } | null }, usersAggregate: { aggregate: { count: number } | null } };

export type AdminOrgQueryVariables = Exact<{
  id: string;
}>;


export type AdminOrgQuery = { org_by_pk: { id: string, name: string, slug: string | null, createdAt: string, archivedAt: string | null, org_subscription: { id: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum, createdAt: string, stripeCustomerId: string, stripeSubscriptionId: string | null } | null, members: Array<{ id: string, name: string, role: Member_Role_Enum | null, inviteEmail: string | null, user: { id: string, displayName: string, email: string | null, lastSeen: string | null } | null }>, circles_aggregate: { aggregate: { count: number } | null } } | null };

export type AdminOrgsQueryVariables = Exact<{
  limit: number;
  offset: number;
  search: string;
  active: boolean;
}>;


export type AdminOrgsQuery = { org: Array<{ id: string, name: string, slug: string | null, createdAt: string, archivedAt: string | null, org_subscription: { id: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum } | null, members_aggregate: { aggregate: { count: number } | null } }>, org_aggregate: { aggregate: { count: number } | null } };

export type AdminStatsQueryVariables = Exact<{
  dauSince: string;
  mauSince: string;
}>;


export type AdminStatsQuery = { org_aggregate: { aggregate: { count: number } | null }, usersAggregate: { aggregate: { count: number } | null }, dau: { aggregate: { count: number } | null }, mau: { aggregate: { count: number } | null } };

export type AdminUserQueryVariables = Exact<{
  id: string;
}>;


export type AdminUserQuery = { user: { id: string, displayName: string, email: string | null, emailVerified: boolean, avatarUrl: string, locale: string, createdAt: string, lastSeen: string | null, disabled: boolean, members: Array<{ id: string, name: string, role: Member_Role_Enum | null, archivedAt: string | null, org: { id: string, name: string, slug: string | null, archivedAt: string | null, org_subscription: { id: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum } | null } }> } | null };

export type AdminUsersQueryVariables = Exact<{
  limit: number;
  offset: number;
  search: string;
  searchCitext: string;
}>;


export type AdminUsersQuery = { users: Array<{ id: string, displayName: string, email: string | null, avatarUrl: string, createdAt: string, lastSeen: string | null, disabled: boolean, members_aggregate: { aggregate: { count: number } | null } }>, usersAggregate: { aggregate: { count: number } | null } };

export type GetTaskQueryVariables = Exact<{
  id: string;
}>;


export type GetTaskQuery = { task_by_pk: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null };

export type TaskSubscriptionVariables = Exact<{
  id: string;
}>;


export type TaskSubscription = { task_by_pk: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null };

export type TaskThreadsQueryVariables = Exact<{
  taskId: string;
}>;


export type TaskThreadsQuery = { thread_activity: Array<{ id: string, thread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } }> };

export type TasksSubscriptionVariables = Exact<{
  orgId: string;
  filters: Array<Task_Bool_Exp> | Task_Bool_Exp;
  taskViewKey: string;
}>;


export type TasksSubscription = { org_by_pk: { tasks: Array<{ id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean }>, task_views: Array<{ id: string, orgId: string, key: string, tasksIds: Array<string> }> } | null };

export type CreateTaskMutationVariables = Exact<{
  values: Task_Insert_Input;
}>;


export type CreateTaskMutation = { insert_task_one: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null };

export type UpdateTaskMutationVariables = Exact<{
  id: string;
  values: Task_Set_Input;
}>;


export type UpdateTaskMutation = { update_task_by_pk: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null };

export type ArchiveTaskMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveTaskMutation = { update_task_by_pk: { id: string } | null };

export type TaskViewFragment = { id: string, orgId: string, key: string, tasksIds: Array<string> };

export type CreateTaskViewMutationVariables = Exact<{
  orgId: string;
  key: string;
  tasksIds?: any;
}>;


export type CreateTaskViewMutation = { insert_task_view_one: { id: string, orgId: string, key: string, tasksIds: Array<string> } | null };

export type UpdateTaskViewMutationVariables = Exact<{
  orgId: string;
  key: string;
  tasksIds?: any;
}>;


export type UpdateTaskViewMutation = { update_task_view: { returning: Array<{ id: string, orgId: string, key: string, tasksIds: Array<string> }> } | null };

export type GetCircleThreadsIdsQueryVariables = Exact<{
  circleId: string;
}>;


export type GetCircleThreadsIdsQuery = { thread: Array<{ id: string }> };

export type GetThreadQueryVariables = Exact<{
  id: string;
}>;


export type GetThreadQuery = { thread_by_pk: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null };

export type ThreadSubscriptionVariables = Exact<{
  id: string;
  memberId: string;
}>;


export type ThreadSubscription = { thread_by_pk: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, member_status: Array<{ lastReadActivityId: string | null, lastReadDate: string }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null };

export type ThreadsSubscriptionVariables = Exact<{
  filters?: Array<Thread_Bool_Exp> | Thread_Bool_Exp | null | undefined;
  memberId: string;
}>;


export type ThreadsSubscription = { thread: Array<{ id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, lastActivity: Array<{ id: string, createdAt: string }>, member_status: Array<{ lastReadActivityId: string | null, lastReadDate: string }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> }> };

export type CircleThreadsSubscriptionVariables = Exact<{
  circleId: string;
}>;


export type CircleThreadsSubscription = { thread: Array<{ id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> }> };

export type ThreadsWithMeetingNoteSubscriptionVariables = Exact<{
  threadsIds: Array<string> | string;
  meetingId: string;
}>;


export type ThreadsWithMeetingNoteSubscription = { thread: Array<{ id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, activities: Array<{ id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> }> };

export type CreateThreadMutationVariables = Exact<{
  values: Thread_Insert_Input;
}>;


export type CreateThreadMutation = { insert_thread_one: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null };

export type UpdateThreadMutationVariables = Exact<{
  id: string;
  values: Thread_Set_Input;
}>;


export type UpdateThreadMutation = { update_thread_by_pk: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null };

export type ArchiveThreadMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveThreadMutation = { update_thread_by_pk: { id: string } | null };

export type ThreadActivitiesSubscriptionVariables = Exact<{
  id: string;
}>;


export type ThreadActivitiesSubscription = { thread_by_pk: { activities: Array<{ id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null }> } | null };

export type CreateThreadActivityMutationVariables = Exact<{
  values: Thread_Activity_Insert_Input;
}>;


export type CreateThreadActivityMutation = { insert_thread_activity_one: { id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null } | null };

export type UpdateThreadActivityMutationVariables = Exact<{
  id: string;
  values: Thread_Activity_Set_Input;
}>;


export type UpdateThreadActivityMutation = { update_thread_activity_by_pk: { id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null } | null };

export type ArchiveThreadActivityMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveThreadActivityMutation = { update_thread_activity_by_pk: { id: string } | null };

export type CreateThreadActivityReactionMutationVariables = Exact<{
  values: Thread_Activity_Reaction_Insert_Input;
}>;


export type CreateThreadActivityReactionMutation = { insert_thread_activity_reaction_one: { id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null } | null };

export type DeleteThreadActivityReactionMutationVariables = Exact<{
  id: string;
}>;


export type DeleteThreadActivityReactionMutation = { delete_thread_activity_reaction_by_pk: { id: string } | null };

export type CreateThreadExtraMemberMutationVariables = Exact<{
  values: Thread_Extra_Member_Insert_Input;
}>;


export type CreateThreadExtraMemberMutation = { insert_thread_extra_member_one: { id: string, threadId: string, memberId: string } | null };

export type UpdateThreadExtraMemberMutationVariables = Exact<{
  id: string;
  values: Thread_Extra_Member_Set_Input;
}>;


export type UpdateThreadExtraMemberMutation = { update_thread_extra_member_by_pk: { id: string, threadId: string, memberId: string } | null };

export type DeleteThreadExtraMemberMutationVariables = Exact<{
  id: string;
}>;


export type DeleteThreadExtraMemberMutation = { delete_thread_extra_member_by_pk: { id: string } | null };

export type UpsertThreadMemberStatusMutationVariables = Exact<{
  values: Thread_Member_Status_Insert_Input;
}>;


export type UpsertThreadMemberStatusMutation = { insert_thread_member_status_one: { lastReadActivityId: string | null, lastReadDate: string } | null };

export type ThreadPollAnswerFragment = { id: string, activityId: string, userId: string, choicesPoints: Array<number>, createdAt: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null };

export type ThreadPollAnswersSubscriptionVariables = Exact<{
  activityId: string;
}>;


export type ThreadPollAnswersSubscription = { thread_poll_answer: Array<{ id: string, activityId: string, userId: string, choicesPoints: Array<number>, createdAt: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }> };

export type CreateThreadPollAnswerMutationVariables = Exact<{
  values: Thread_Poll_Answer_Insert_Input;
}>;


export type CreateThreadPollAnswerMutation = { insert_thread_poll_answer_one: { id: string, activityId: string, userId: string, choicesPoints: Array<number>, createdAt: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null } | null };

export type UpdateThreadPollAnswerMutationVariables = Exact<{
  id: string;
  values: Thread_Poll_Answer_Set_Input;
}>;


export type UpdateThreadPollAnswerMutation = { update_thread_poll_answer_by_pk: { id: string, activityId: string, userId: string, choicesPoints: Array<number>, createdAt: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null } | null };

export type DeleteThreadPollAnswersMutationVariables = Exact<{
  activityId: string;
}>;


export type DeleteThreadPollAnswersMutation = { delete_thread_poll_answer: { returning: Array<{ id: string }> } | null };

export type AccountDeletionMembersSubscriptionVariables = Exact<{
  userId: string;
}>;


export type AccountDeletionMembersSubscription = { member: Array<{ id: string, role: Member_Role_Enum | null, org: { id: string, name: string, slug: string | null } }> };

export type ChangeDisplayNameMutationVariables = Exact<{
  userId: string;
  displayName: string;
}>;


export type ChangeDisplayNameMutation = { updateUser: { id: string, displayName: string } | null };

export type ChangeLocaleMutationVariables = Exact<{
  userId: string;
  locale: string;
}>;


export type ChangeLocaleMutation = { updateUser: { id: string, locale: string } | null };

export type ChangeMetadataMutationVariables = Exact<{
  userId: string;
  metadata: any;
}>;


export type ChangeMetadataMutation = { updateUser: { id: string, metadata: UserMetadata } | null };

export const ApiKeyFragmentDoc = gql`
    fragment ApiKey on api_key {
  id
  name
  value
  createdAt
}
    `;
export const CircleFragmentDoc = gql`
    fragment Circle on circle {
  id
  orgId
  roleId
  parentId
  archivedAt
}
    `;
export const RoleSummaryFragmentDoc = gql`
    fragment RoleSummary on role {
  id
  base
  name
  singleMember
  parentLink
  colorHue
}
    `;
export const CircleSummaryFragmentDoc = gql`
    fragment CircleSummary on circle {
  ...Circle
  role {
    ...RoleSummary
  }
}
    `;
export const LogFragmentDoc = gql`
    fragment Log on log {
  id
  orgId
  userId
  memberId
  memberName
  meetingId
  createdAt
  display
  changes
  cancelLogId
  cancelMemberId
  cancelMemberName
  canceled
  decisionId
}
    `;
export const MeetingAttendeeFragmentDoc = gql`
    fragment MeetingAttendee on meeting_attendee {
  id
  meetingId
  memberId
  present
  startNotified
}
    `;
export const MeetingSummaryFragmentDoc = gql`
    fragment MeetingSummary on meeting {
  id
  orgId
  circleId
  startDate
  endDate
  ended
  title
  currentStepId
  summary
  private
  meeting_attendees {
    ...MeetingAttendee
  }
}
    `;
export const MeetingFragmentDoc = gql`
    fragment Meeting on meeting {
  ...MeetingSummary
  createdAt
  stepsConfig
  archivedAt
  videoConf
  recurringId
  recurringDate
  invitedReadonly
}
    `;
export const MeetingRecurringFragmentDoc = gql`
    fragment MeetingRecurring on meeting_recurring {
  id
  orgId
  circleId
  circle {
    role {
      name
      colorHue
    }
  }
  scope
  templateId
  template {
    title
    stepsConfig
  }
  rrule
  duration
  videoConf
  private
  invitedReadonly
  createdAt
}
    `;
export const MeetingStepFragmentDoc = gql`
    fragment MeetingStep on meeting_step {
  id
  meetingId
  stepConfigId
  notes
  type
  data
}
    `;
export const MemberSummaryFragmentDoc = gql`
    fragment MemberSummary on member {
  id
  userId
  name
  picture
}
    `;
export const DecisionFragmentDoc = gql`
    fragment Decision on decision {
  id
  orgId
  circleId
  memberId
  title
  description
  archivedAt
  createdAt
  private
}
    `;
export const ThreadExtraMemberFragmentDoc = gql`
    fragment ThreadExtraMember on thread_extra_member {
  id
  threadId
  memberId
}
    `;
export const ThreadFragmentDoc = gql`
    fragment Thread on thread {
  id
  orgId
  circleId
  initiatorMemberId
  title
  createdAt
  archivedAt
  pinned
  status
  private
  extra_members {
    ...ThreadExtraMember
  }
}
    `;
export const ThreadActivityMemberFragmentDoc = gql`
    fragment ThreadActivityMember on member {
  id
  userId
  name
  picture
  archivedAt
}
    `;
export const ThreadActivityReactionFragmentDoc = gql`
    fragment ThreadActivityReaction on thread_activity_reaction {
  id
  userId
  shortcode
  member {
    ...ThreadActivityMember
  }
}
    `;
export const TaskFragmentDoc = gql`
    fragment Task on task {
  id
  orgId
  circleId
  memberId
  title
  description
  archivedAt
  createdAt
  dueDate
  status
  private
}
    `;
export const ThreadActivityFragmentDoc = gql`
    fragment ThreadActivity on thread_activity {
  id
  threadId
  userId
  createdAt
  type
  data
  member {
    ...ThreadActivityMember
  }
  reactions {
    ...ThreadActivityReaction
  }
  refThread {
    ...Thread
  }
  refMeeting {
    ...MeetingSummary
  }
  refTask {
    ...Task
  }
  refDecision {
    ...Decision
  }
}
    `;
export const ThreadWithFirstActivityFragmentDoc = gql`
    fragment ThreadWithFirstActivity on thread {
  ...Thread
  activities(
    where: {type: {_eq: Message}, archivedAt: {_is_null: true}}
    order_by: {createdAt: asc}
    limit: 1
  ) {
    ...ThreadActivity
  }
}
    `;
export const NewsFragmentDoc = gql`
    fragment News on news {
  id
  createdAt
  decision {
    ...Decision
  }
  meeting {
    ...MeetingSummary
  }
  thread {
    ...ThreadWithFirstActivity
  }
}
    `;
export const OrgFragmentDoc = gql`
    fragment Org on org {
  id
  name
  archivedAt
  createdAt
  slug
  shareOrg
  shareMembers
  governanceMode
  defaultGraphView
  defaultGraphFolded
  defaultGraphMembers
  icon
  homeNote
  onboardingOrgType
  onboardingTodo
}
    `;
export const OrgSubscriptionFragmentDoc = gql`
    fragment OrgSubscription on org_subscription {
  id
  stripeSubscriptionId
  stripeCustomerId
  status
  type
}
    `;
export const CircleMemberFragmentDoc = gql`
    fragment CircleMember on circle_member {
  id
  orgId
  circleId
  memberId
  createdAt
  archivedAt
}
    `;
export const CircleLinkFragmentDoc = gql`
    fragment CircleLink on circle_link {
  id
  orgId
  parentId
  circleId
  createdAt
  archivedAt
}
    `;
export const MemberFragmentDoc = gql`
    fragment Member on member {
  id
  orgId
  archivedAt
  name
  description
  pictureFileId
  picture
  userId
  inviteEmail
  inviteDate
  role
}
    `;
export const OrgDataFragmentDoc = gql`
    fragment OrgData on org {
  ...Org
  org_subscription {
    ...OrgSubscription
  }
  circles(where: {archivedAt: {_is_null: true}}) {
    ...Circle
  }
  circleMembers(where: {archivedAt: {_is_null: true}}) {
    ...CircleMember
  }
  circleLinks(where: {archivedAt: {_is_null: true}}) {
    ...CircleLink
  }
  roles(where: {archivedAt: {_is_null: true}}) {
    ...RoleSummary
  }
  members(where: {archivedAt: {_is_null: true}}) {
    ...Member
  }
}
    `;
export const RoleFragmentDoc = gql`
    fragment Role on role {
  id
  orgId
  archivedAt
  base
  name
  purpose
  domain
  accountabilities
  checklist
  indicators
  notes
  singleMember
  parentLink
  colorHue
}
    `;
export const RoleAiFragmentDoc = gql`
    fragment RoleAI on role_ai {
  id
  name
  purpose
  domain
  accountabilities
  checklist
  indicators
  notes
}
    `;
export const ThreadMemberStatusFragmentDoc = gql`
    fragment ThreadMemberStatus on thread_member_status {
  lastReadActivityId
  lastReadDate
}
    `;
export const UserAppFragmentDoc = gql`
    fragment UserApp on user_app {
  id
  userId
  type
  config
}
    `;
export const UserAppFullFragmentDoc = gql`
    fragment UserAppFull on user_app {
  id
  userId
  type
  secretConfig
  config
  tmpData
  createdAt
  user {
    metadata
  }
}
    `;
export const MeetingTemplateFragmentDoc = gql`
    fragment MeetingTemplate on meeting_template {
  id
  orgId
  circleId
  title
  stepsConfig
}
    `;
export const ThreadProposalVoteFragmentDoc = gql`
    fragment ThreadProposalVote on thread_proposal_vote {
  id
  activityId
  userId
  vote
  createdAt
}
    `;
export const TaskViewFragmentDoc = gql`
    fragment TaskView on task_view {
  id
  orgId
  key
  tasksIds
}
    `;
export const ThreadPollAnswerFragmentDoc = gql`
    fragment ThreadPollAnswer on thread_poll_answer {
  id
  activityId
  userId
  choicesPoints
  createdAt
  member {
    ...ThreadActivityMember
  }
}
    `;
export const ApiKeysDocument = gql`
    subscription apiKeys($userId: uuid!) {
  api_key(where: {userId: {_eq: $userId}, archivedAt: {_is_null: true}}) {
    ...ApiKey
  }
}
    ${ApiKeyFragmentDoc}`;

/**
 * __useApiKeysSubscription__
 *
 * To run a query within a React component, call `useApiKeysSubscription` and pass it any options that fit your needs.
 * When your component renders, `useApiKeysSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApiKeysSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useApiKeysSubscription(baseOptions: Apollo.SubscriptionHookOptions<ApiKeysSubscription, ApiKeysSubscriptionVariables> & ({ variables: ApiKeysSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ApiKeysSubscription, ApiKeysSubscriptionVariables>(ApiKeysDocument, options);
      }
export type ApiKeysSubscriptionHookResult = ReturnType<typeof useApiKeysSubscription>;
export type ApiKeysSubscriptionResult = Apollo.SubscriptionResult<ApiKeysSubscription>;
export const CreateApiKeyDocument = gql`
    mutation createApiKey($userId: uuid!, $name: String!) {
  insert_api_key_one(object: {userId: $userId, name: $name}) {
    ...ApiKey
  }
}
    ${ApiKeyFragmentDoc}`;
export type CreateApiKeyMutationFn = Apollo.MutationFunction<CreateApiKeyMutation, CreateApiKeyMutationVariables>;

/**
 * __useCreateApiKeyMutation__
 *
 * To run a mutation, you first call `useCreateApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApiKeyMutation, { data, loading, error }] = useCreateApiKeyMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<CreateApiKeyMutation, CreateApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApiKeyMutation, CreateApiKeyMutationVariables>(CreateApiKeyDocument, options);
      }
export type CreateApiKeyMutationHookResult = ReturnType<typeof useCreateApiKeyMutation>;
export type CreateApiKeyMutationResult = Apollo.MutationResult<CreateApiKeyMutation>;
export type CreateApiKeyMutationOptions = Apollo.BaseMutationOptions<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const RenameApiKeyDocument = gql`
    mutation renameApiKey($id: uuid!, $name: String!) {
  update_api_key_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
    ...ApiKey
  }
}
    ${ApiKeyFragmentDoc}`;
export type RenameApiKeyMutationFn = Apollo.MutationFunction<RenameApiKeyMutation, RenameApiKeyMutationVariables>;

/**
 * __useRenameApiKeyMutation__
 *
 * To run a mutation, you first call `useRenameApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameApiKeyMutation, { data, loading, error }] = useRenameApiKeyMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useRenameApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<RenameApiKeyMutation, RenameApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameApiKeyMutation, RenameApiKeyMutationVariables>(RenameApiKeyDocument, options);
      }
export type RenameApiKeyMutationHookResult = ReturnType<typeof useRenameApiKeyMutation>;
export type RenameApiKeyMutationResult = Apollo.MutationResult<RenameApiKeyMutation>;
export type RenameApiKeyMutationOptions = Apollo.BaseMutationOptions<RenameApiKeyMutation, RenameApiKeyMutationVariables>;
export const ArchiveApiKeyDocument = gql`
    mutation archiveApiKey($id: uuid!, $archivedAt: timestamptz!) {
  update_api_key_by_pk(pk_columns: {id: $id}, _set: {archivedAt: $archivedAt}) {
    id
  }
}
    `;
export type ArchiveApiKeyMutationFn = Apollo.MutationFunction<ArchiveApiKeyMutation, ArchiveApiKeyMutationVariables>;

/**
 * __useArchiveApiKeyMutation__
 *
 * To run a mutation, you first call `useArchiveApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveApiKeyMutation, { data, loading, error }] = useArchiveApiKeyMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveApiKeyMutation, ArchiveApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveApiKeyMutation, ArchiveApiKeyMutationVariables>(ArchiveApiKeyDocument, options);
      }
export type ArchiveApiKeyMutationHookResult = ReturnType<typeof useArchiveApiKeyMutation>;
export type ArchiveApiKeyMutationResult = Apollo.MutationResult<ArchiveApiKeyMutation>;
export type ArchiveApiKeyMutationOptions = Apollo.BaseMutationOptions<ArchiveApiKeyMutation, ArchiveApiKeyMutationVariables>;
export const UserAppsDocument = gql`
    subscription userApps($userId: uuid!) {
  user_app(where: {userId: {_eq: $userId}, archivedAt: {_is_null: true}}) {
    ...UserApp
  }
}
    ${UserAppFragmentDoc}`;

/**
 * __useUserAppsSubscription__
 *
 * To run a query within a React component, call `useUserAppsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserAppsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAppsSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserAppsSubscription(baseOptions: Apollo.SubscriptionHookOptions<UserAppsSubscription, UserAppsSubscriptionVariables> & ({ variables: UserAppsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserAppsSubscription, UserAppsSubscriptionVariables>(UserAppsDocument, options);
      }
export type UserAppsSubscriptionHookResult = ReturnType<typeof useUserAppsSubscription>;
export type UserAppsSubscriptionResult = Apollo.SubscriptionResult<UserAppsSubscription>;
export const ArchiveUserAppDocument = gql`
    mutation archiveUserApp($id: uuid!, $archivedAt: timestamptz!) {
  update_user_app_by_pk(pk_columns: {id: $id}, _set: {archivedAt: $archivedAt}) {
    id
  }
}
    `;
export type ArchiveUserAppMutationFn = Apollo.MutationFunction<ArchiveUserAppMutation, ArchiveUserAppMutationVariables>;

/**
 * __useArchiveUserAppMutation__
 *
 * To run a mutation, you first call `useArchiveUserAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveUserAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveUserAppMutation, { data, loading, error }] = useArchiveUserAppMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveUserAppMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveUserAppMutation, ArchiveUserAppMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveUserAppMutation, ArchiveUserAppMutationVariables>(ArchiveUserAppDocument, options);
      }
export type ArchiveUserAppMutationHookResult = ReturnType<typeof useArchiveUserAppMutation>;
export type ArchiveUserAppMutationResult = Apollo.MutationResult<ArchiveUserAppMutation>;
export type ArchiveUserAppMutationOptions = Apollo.BaseMutationOptions<ArchiveUserAppMutation, ArchiveUserAppMutationVariables>;
export const GetCircleDocument = gql`
    query getCircle($id: uuid!) {
  circle_by_pk(id: $id) {
    ...Circle
    role {
      ...RoleSummary
    }
  }
}
    ${CircleFragmentDoc}
${RoleSummaryFragmentDoc}`;

/**
 * __useGetCircleQuery__
 *
 * To run a query within a React component, call `useGetCircleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCircleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCircleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCircleQuery(baseOptions: Apollo.QueryHookOptions<GetCircleQuery, GetCircleQueryVariables> & ({ variables: GetCircleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCircleQuery, GetCircleQueryVariables>(GetCircleDocument, options);
      }
export function useGetCircleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCircleQuery, GetCircleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCircleQuery, GetCircleQueryVariables>(GetCircleDocument, options);
        }
// @ts-ignore
export function useGetCircleSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCircleQuery, GetCircleQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleQuery, GetCircleQueryVariables>;
export function useGetCircleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleQuery, GetCircleQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleQuery | undefined, GetCircleQueryVariables>;
export function useGetCircleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleQuery, GetCircleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCircleQuery, GetCircleQueryVariables>(GetCircleDocument, options);
        }
export type GetCircleQueryHookResult = ReturnType<typeof useGetCircleQuery>;
export type GetCircleLazyQueryHookResult = ReturnType<typeof useGetCircleLazyQuery>;
export type GetCircleSuspenseQueryHookResult = ReturnType<typeof useGetCircleSuspenseQuery>;
export type GetCircleQueryResult = Apollo.QueryResult<GetCircleQuery, GetCircleQueryVariables>;
export function refetchGetCircleQuery(variables: GetCircleQueryVariables) {
      return { query: GetCircleDocument, variables: variables }
    }
export const GetPublicCirclesDocument = gql`
    query getPublicCircles($orgId: uuid!) {
  circle(where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: true}}) {
    id
    orgId
    roleId
    parentId
    members(where: {archivedAt: {_is_null: true}}) {
      id
      memberId
    }
    invitedCircleLinks(where: {archivedAt: {_is_null: true}}) {
      id
      invitedCircle {
        id
      }
    }
  }
  role(where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: true}}) {
    id
    orgId
    base
    name
    purpose
    singleMember
    parentLink
    colorHue
  }
  member(where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: true}}) {
    id
    orgId
    name
    picture
  }
}
    `;

/**
 * __useGetPublicCirclesQuery__
 *
 * To run a query within a React component, call `useGetPublicCirclesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicCirclesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicCirclesQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useGetPublicCirclesQuery(baseOptions: Apollo.QueryHookOptions<GetPublicCirclesQuery, GetPublicCirclesQueryVariables> & ({ variables: GetPublicCirclesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>(GetPublicCirclesDocument, options);
      }
export function useGetPublicCirclesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>(GetPublicCirclesDocument, options);
        }
// @ts-ignore
export function useGetPublicCirclesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>): Apollo.UseSuspenseQueryResult<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>;
export function useGetPublicCirclesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>): Apollo.UseSuspenseQueryResult<GetPublicCirclesQuery | undefined, GetPublicCirclesQueryVariables>;
export function useGetPublicCirclesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>(GetPublicCirclesDocument, options);
        }
export type GetPublicCirclesQueryHookResult = ReturnType<typeof useGetPublicCirclesQuery>;
export type GetPublicCirclesLazyQueryHookResult = ReturnType<typeof useGetPublicCirclesLazyQuery>;
export type GetPublicCirclesSuspenseQueryHookResult = ReturnType<typeof useGetPublicCirclesSuspenseQuery>;
export type GetPublicCirclesQueryResult = Apollo.QueryResult<GetPublicCirclesQuery, GetPublicCirclesQueryVariables>;
export function refetchGetPublicCirclesQuery(variables: GetPublicCirclesQueryVariables) {
      return { query: GetPublicCirclesDocument, variables: variables }
    }
export const GetCirclesStatsDocument = gql`
    query getCirclesStats($circlesIds: [uuid!]!) {
  thread_aggregate(
    where: {circleId: {_in: $circlesIds}, archivedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
  meeting_aggregate(
    where: {circleId: {_in: $circlesIds}, archivedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
  meeting_recurring_aggregate(
    where: {circleId: {_in: $circlesIds}, archivedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
  task_aggregate(
    where: {circleId: {_in: $circlesIds}, archivedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
  decision_aggregate(
    where: {circleId: {_in: $circlesIds}, archivedAt: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useGetCirclesStatsQuery__
 *
 * To run a query within a React component, call `useGetCirclesStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCirclesStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCirclesStatsQuery({
 *   variables: {
 *      circlesIds: // value for 'circlesIds'
 *   },
 * });
 */
export function useGetCirclesStatsQuery(baseOptions: Apollo.QueryHookOptions<GetCirclesStatsQuery, GetCirclesStatsQueryVariables> & ({ variables: GetCirclesStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>(GetCirclesStatsDocument, options);
      }
export function useGetCirclesStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>(GetCirclesStatsDocument, options);
        }
// @ts-ignore
export function useGetCirclesStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>;
export function useGetCirclesStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCirclesStatsQuery | undefined, GetCirclesStatsQueryVariables>;
export function useGetCirclesStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>(GetCirclesStatsDocument, options);
        }
export type GetCirclesStatsQueryHookResult = ReturnType<typeof useGetCirclesStatsQuery>;
export type GetCirclesStatsLazyQueryHookResult = ReturnType<typeof useGetCirclesStatsLazyQuery>;
export type GetCirclesStatsSuspenseQueryHookResult = ReturnType<typeof useGetCirclesStatsSuspenseQuery>;
export type GetCirclesStatsQueryResult = Apollo.QueryResult<GetCirclesStatsQuery, GetCirclesStatsQueryVariables>;
export function refetchGetCirclesStatsQuery(variables: GetCirclesStatsQueryVariables) {
      return { query: GetCirclesStatsDocument, variables: variables }
    }
export const CreateCircleDocument = gql`
    mutation createCircle($orgId: uuid!, $roleId: uuid!, $parentId: uuid) {
  insert_circle_one(object: {orgId: $orgId, roleId: $roleId, parentId: $parentId}) {
    ...Circle
  }
}
    ${CircleFragmentDoc}`;
export type CreateCircleMutationFn = Apollo.MutationFunction<CreateCircleMutation, CreateCircleMutationVariables>;

/**
 * __useCreateCircleMutation__
 *
 * To run a mutation, you first call `useCreateCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCircleMutation, { data, loading, error }] = useCreateCircleMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      roleId: // value for 'roleId'
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useCreateCircleMutation(baseOptions?: Apollo.MutationHookOptions<CreateCircleMutation, CreateCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCircleMutation, CreateCircleMutationVariables>(CreateCircleDocument, options);
      }
export type CreateCircleMutationHookResult = ReturnType<typeof useCreateCircleMutation>;
export type CreateCircleMutationResult = Apollo.MutationResult<CreateCircleMutation>;
export type CreateCircleMutationOptions = Apollo.BaseMutationOptions<CreateCircleMutation, CreateCircleMutationVariables>;
export const InsertCircleDocument = gql`
    mutation insertCircle($object: circle_insert_input!) {
  insert_circle_one(object: $object) {
    ...Circle
  }
}
    ${CircleFragmentDoc}`;
export type InsertCircleMutationFn = Apollo.MutationFunction<InsertCircleMutation, InsertCircleMutationVariables>;

/**
 * __useInsertCircleMutation__
 *
 * To run a mutation, you first call `useInsertCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertCircleMutation, { data, loading, error }] = useInsertCircleMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertCircleMutation(baseOptions?: Apollo.MutationHookOptions<InsertCircleMutation, InsertCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertCircleMutation, InsertCircleMutationVariables>(InsertCircleDocument, options);
      }
export type InsertCircleMutationHookResult = ReturnType<typeof useInsertCircleMutation>;
export type InsertCircleMutationResult = Apollo.MutationResult<InsertCircleMutation>;
export type InsertCircleMutationOptions = Apollo.BaseMutationOptions<InsertCircleMutation, InsertCircleMutationVariables>;
export const CreateCirclesDocument = gql`
    mutation createCircles($circles: [circle_insert_input!]!) {
  insert_circle(objects: $circles) {
    returning {
      ...Circle
      role {
        ...Role
      }
    }
  }
}
    ${CircleFragmentDoc}
${RoleFragmentDoc}`;
export type CreateCirclesMutationFn = Apollo.MutationFunction<CreateCirclesMutation, CreateCirclesMutationVariables>;

/**
 * __useCreateCirclesMutation__
 *
 * To run a mutation, you first call `useCreateCirclesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCirclesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCirclesMutation, { data, loading, error }] = useCreateCirclesMutation({
 *   variables: {
 *      circles: // value for 'circles'
 *   },
 * });
 */
export function useCreateCirclesMutation(baseOptions?: Apollo.MutationHookOptions<CreateCirclesMutation, CreateCirclesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCirclesMutation, CreateCirclesMutationVariables>(CreateCirclesDocument, options);
      }
export type CreateCirclesMutationHookResult = ReturnType<typeof useCreateCirclesMutation>;
export type CreateCirclesMutationResult = Apollo.MutationResult<CreateCirclesMutation>;
export type CreateCirclesMutationOptions = Apollo.BaseMutationOptions<CreateCirclesMutation, CreateCirclesMutationVariables>;
export const UpdateCircleDocument = gql`
    mutation updateCircle($id: uuid!, $values: circle_set_input!) {
  update_circle_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Circle
    role {
      name
    }
    parent {
      role {
        name
      }
    }
  }
}
    ${CircleFragmentDoc}`;
export type UpdateCircleMutationFn = Apollo.MutationFunction<UpdateCircleMutation, UpdateCircleMutationVariables>;

/**
 * __useUpdateCircleMutation__
 *
 * To run a mutation, you first call `useUpdateCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCircleMutation, { data, loading, error }] = useUpdateCircleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateCircleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCircleMutation, UpdateCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCircleMutation, UpdateCircleMutationVariables>(UpdateCircleDocument, options);
      }
export type UpdateCircleMutationHookResult = ReturnType<typeof useUpdateCircleMutation>;
export type UpdateCircleMutationResult = Apollo.MutationResult<UpdateCircleMutation>;
export type UpdateCircleMutationOptions = Apollo.BaseMutationOptions<UpdateCircleMutation, UpdateCircleMutationVariables>;
export const CreateCircleLinkDocument = gql`
    mutation createCircleLink($parentId: uuid!, $circleId: uuid!, $orgId: uuid!) {
  insert_circle_link_one(
    object: {circleId: $circleId, parentId: $parentId, orgId: $orgId}
  ) {
    ...CircleLink
  }
}
    ${CircleLinkFragmentDoc}`;
export type CreateCircleLinkMutationFn = Apollo.MutationFunction<CreateCircleLinkMutation, CreateCircleLinkMutationVariables>;

/**
 * __useCreateCircleLinkMutation__
 *
 * To run a mutation, you first call `useCreateCircleLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCircleLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCircleLinkMutation, { data, loading, error }] = useCreateCircleLinkMutation({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      circleId: // value for 'circleId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useCreateCircleLinkMutation(baseOptions?: Apollo.MutationHookOptions<CreateCircleLinkMutation, CreateCircleLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCircleLinkMutation, CreateCircleLinkMutationVariables>(CreateCircleLinkDocument, options);
      }
export type CreateCircleLinkMutationHookResult = ReturnType<typeof useCreateCircleLinkMutation>;
export type CreateCircleLinkMutationResult = Apollo.MutationResult<CreateCircleLinkMutation>;
export type CreateCircleLinkMutationOptions = Apollo.BaseMutationOptions<CreateCircleLinkMutation, CreateCircleLinkMutationVariables>;
export const GetCircleLinkDocument = gql`
    query getCircleLink($id: uuid!) {
  circle_link_by_pk(id: $id) {
    ...CircleLink
  }
}
    ${CircleLinkFragmentDoc}`;

/**
 * __useGetCircleLinkQuery__
 *
 * To run a query within a React component, call `useGetCircleLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCircleLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCircleLinkQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCircleLinkQuery(baseOptions: Apollo.QueryHookOptions<GetCircleLinkQuery, GetCircleLinkQueryVariables> & ({ variables: GetCircleLinkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCircleLinkQuery, GetCircleLinkQueryVariables>(GetCircleLinkDocument, options);
      }
export function useGetCircleLinkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCircleLinkQuery, GetCircleLinkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCircleLinkQuery, GetCircleLinkQueryVariables>(GetCircleLinkDocument, options);
        }
// @ts-ignore
export function useGetCircleLinkSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCircleLinkQuery, GetCircleLinkQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleLinkQuery, GetCircleLinkQueryVariables>;
export function useGetCircleLinkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleLinkQuery, GetCircleLinkQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleLinkQuery | undefined, GetCircleLinkQueryVariables>;
export function useGetCircleLinkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleLinkQuery, GetCircleLinkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCircleLinkQuery, GetCircleLinkQueryVariables>(GetCircleLinkDocument, options);
        }
export type GetCircleLinkQueryHookResult = ReturnType<typeof useGetCircleLinkQuery>;
export type GetCircleLinkLazyQueryHookResult = ReturnType<typeof useGetCircleLinkLazyQuery>;
export type GetCircleLinkSuspenseQueryHookResult = ReturnType<typeof useGetCircleLinkSuspenseQuery>;
export type GetCircleLinkQueryResult = Apollo.QueryResult<GetCircleLinkQuery, GetCircleLinkQueryVariables>;
export function refetchGetCircleLinkQuery(variables: GetCircleLinkQueryVariables) {
      return { query: GetCircleLinkDocument, variables: variables }
    }
export const InsertCircleLinkDocument = gql`
    mutation insertCircleLink($object: circle_link_insert_input!) {
  insert_circle_link_one(object: $object) {
    ...CircleLink
  }
}
    ${CircleLinkFragmentDoc}`;
export type InsertCircleLinkMutationFn = Apollo.MutationFunction<InsertCircleLinkMutation, InsertCircleLinkMutationVariables>;

/**
 * __useInsertCircleLinkMutation__
 *
 * To run a mutation, you first call `useInsertCircleLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertCircleLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertCircleLinkMutation, { data, loading, error }] = useInsertCircleLinkMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertCircleLinkMutation(baseOptions?: Apollo.MutationHookOptions<InsertCircleLinkMutation, InsertCircleLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertCircleLinkMutation, InsertCircleLinkMutationVariables>(InsertCircleLinkDocument, options);
      }
export type InsertCircleLinkMutationHookResult = ReturnType<typeof useInsertCircleLinkMutation>;
export type InsertCircleLinkMutationResult = Apollo.MutationResult<InsertCircleLinkMutation>;
export type InsertCircleLinkMutationOptions = Apollo.BaseMutationOptions<InsertCircleLinkMutation, InsertCircleLinkMutationVariables>;
export const UpdateCircleLinkDocument = gql`
    mutation updateCircleLink($id: uuid!, $values: circle_link_set_input!) {
  update_circle_link_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...CircleLink
  }
}
    ${CircleLinkFragmentDoc}`;
export type UpdateCircleLinkMutationFn = Apollo.MutationFunction<UpdateCircleLinkMutation, UpdateCircleLinkMutationVariables>;

/**
 * __useUpdateCircleLinkMutation__
 *
 * To run a mutation, you first call `useUpdateCircleLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCircleLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCircleLinkMutation, { data, loading, error }] = useUpdateCircleLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateCircleLinkMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCircleLinkMutation, UpdateCircleLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCircleLinkMutation, UpdateCircleLinkMutationVariables>(UpdateCircleLinkDocument, options);
      }
export type UpdateCircleLinkMutationHookResult = ReturnType<typeof useUpdateCircleLinkMutation>;
export type UpdateCircleLinkMutationResult = Apollo.MutationResult<UpdateCircleLinkMutation>;
export type UpdateCircleLinkMutationOptions = Apollo.BaseMutationOptions<UpdateCircleLinkMutation, UpdateCircleLinkMutationVariables>;
export const ArchiveCircleLinkDocument = gql`
    mutation archiveCircleLink($parentId: uuid!, $circleId: uuid!, $archivedAt: timestamptz!) {
  update_circle_link(
    where: {parentId: {_eq: $parentId}, circleId: {_eq: $circleId}, archivedAt: {_is_null: true}}
    _set: {archivedAt: $archivedAt}
  ) {
    returning {
      ...CircleLink
    }
  }
}
    ${CircleLinkFragmentDoc}`;
export type ArchiveCircleLinkMutationFn = Apollo.MutationFunction<ArchiveCircleLinkMutation, ArchiveCircleLinkMutationVariables>;

/**
 * __useArchiveCircleLinkMutation__
 *
 * To run a mutation, you first call `useArchiveCircleLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveCircleLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveCircleLinkMutation, { data, loading, error }] = useArchiveCircleLinkMutation({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      circleId: // value for 'circleId'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveCircleLinkMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveCircleLinkMutation, ArchiveCircleLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveCircleLinkMutation, ArchiveCircleLinkMutationVariables>(ArchiveCircleLinkDocument, options);
      }
export type ArchiveCircleLinkMutationHookResult = ReturnType<typeof useArchiveCircleLinkMutation>;
export type ArchiveCircleLinkMutationResult = Apollo.MutationResult<ArchiveCircleLinkMutation>;
export type ArchiveCircleLinkMutationOptions = Apollo.BaseMutationOptions<ArchiveCircleLinkMutation, ArchiveCircleLinkMutationVariables>;
export const GetCircleMemberDocument = gql`
    query getCircleMember($id: uuid!) {
  circle_member_by_pk(id: $id) {
    ...CircleMember
  }
}
    ${CircleMemberFragmentDoc}`;

/**
 * __useGetCircleMemberQuery__
 *
 * To run a query within a React component, call `useGetCircleMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCircleMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCircleMemberQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCircleMemberQuery(baseOptions: Apollo.QueryHookOptions<GetCircleMemberQuery, GetCircleMemberQueryVariables> & ({ variables: GetCircleMemberQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCircleMemberQuery, GetCircleMemberQueryVariables>(GetCircleMemberDocument, options);
      }
export function useGetCircleMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCircleMemberQuery, GetCircleMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCircleMemberQuery, GetCircleMemberQueryVariables>(GetCircleMemberDocument, options);
        }
// @ts-ignore
export function useGetCircleMemberSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCircleMemberQuery, GetCircleMemberQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleMemberQuery, GetCircleMemberQueryVariables>;
export function useGetCircleMemberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleMemberQuery, GetCircleMemberQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleMemberQuery | undefined, GetCircleMemberQueryVariables>;
export function useGetCircleMemberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleMemberQuery, GetCircleMemberQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCircleMemberQuery, GetCircleMemberQueryVariables>(GetCircleMemberDocument, options);
        }
export type GetCircleMemberQueryHookResult = ReturnType<typeof useGetCircleMemberQuery>;
export type GetCircleMemberLazyQueryHookResult = ReturnType<typeof useGetCircleMemberLazyQuery>;
export type GetCircleMemberSuspenseQueryHookResult = ReturnType<typeof useGetCircleMemberSuspenseQuery>;
export type GetCircleMemberQueryResult = Apollo.QueryResult<GetCircleMemberQuery, GetCircleMemberQueryVariables>;
export function refetchGetCircleMemberQuery(variables: GetCircleMemberQueryVariables) {
      return { query: GetCircleMemberDocument, variables: variables }
    }
export const CreateCircleMemberDocument = gql`
    mutation createCircleMember($circleId: uuid!, $memberId: uuid!, $orgId: uuid!) {
  insert_circle_member_one(
    object: {circleId: $circleId, memberId: $memberId, orgId: $orgId}
  ) {
    ...CircleMember
    member {
      id
      name
    }
    circle {
      role {
        id
        name
      }
    }
  }
}
    ${CircleMemberFragmentDoc}`;
export type CreateCircleMemberMutationFn = Apollo.MutationFunction<CreateCircleMemberMutation, CreateCircleMemberMutationVariables>;

/**
 * __useCreateCircleMemberMutation__
 *
 * To run a mutation, you first call `useCreateCircleMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCircleMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCircleMemberMutation, { data, loading, error }] = useCreateCircleMemberMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      memberId: // value for 'memberId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useCreateCircleMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateCircleMemberMutation, CreateCircleMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCircleMemberMutation, CreateCircleMemberMutationVariables>(CreateCircleMemberDocument, options);
      }
export type CreateCircleMemberMutationHookResult = ReturnType<typeof useCreateCircleMemberMutation>;
export type CreateCircleMemberMutationResult = Apollo.MutationResult<CreateCircleMemberMutation>;
export type CreateCircleMemberMutationOptions = Apollo.BaseMutationOptions<CreateCircleMemberMutation, CreateCircleMemberMutationVariables>;
export const UpdateCircleMemberDocument = gql`
    mutation updateCircleMember($id: uuid!, $values: circle_member_set_input!) {
  update_circle_member_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...CircleMember
  }
}
    ${CircleMemberFragmentDoc}`;
export type UpdateCircleMemberMutationFn = Apollo.MutationFunction<UpdateCircleMemberMutation, UpdateCircleMemberMutationVariables>;

/**
 * __useUpdateCircleMemberMutation__
 *
 * To run a mutation, you first call `useUpdateCircleMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCircleMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCircleMemberMutation, { data, loading, error }] = useUpdateCircleMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateCircleMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCircleMemberMutation, UpdateCircleMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCircleMemberMutation, UpdateCircleMemberMutationVariables>(UpdateCircleMemberDocument, options);
      }
export type UpdateCircleMemberMutationHookResult = ReturnType<typeof useUpdateCircleMemberMutation>;
export type UpdateCircleMemberMutationResult = Apollo.MutationResult<UpdateCircleMemberMutation>;
export type UpdateCircleMemberMutationOptions = Apollo.BaseMutationOptions<UpdateCircleMemberMutation, UpdateCircleMemberMutationVariables>;
export const InsertCircleMemberDocument = gql`
    mutation insertCircleMember($object: circle_member_insert_input!) {
  insert_circle_member_one(object: $object) {
    ...CircleMember
  }
}
    ${CircleMemberFragmentDoc}`;
export type InsertCircleMemberMutationFn = Apollo.MutationFunction<InsertCircleMemberMutation, InsertCircleMemberMutationVariables>;

/**
 * __useInsertCircleMemberMutation__
 *
 * To run a mutation, you first call `useInsertCircleMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertCircleMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertCircleMemberMutation, { data, loading, error }] = useInsertCircleMemberMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertCircleMemberMutation(baseOptions?: Apollo.MutationHookOptions<InsertCircleMemberMutation, InsertCircleMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertCircleMemberMutation, InsertCircleMemberMutationVariables>(InsertCircleMemberDocument, options);
      }
export type InsertCircleMemberMutationHookResult = ReturnType<typeof useInsertCircleMemberMutation>;
export type InsertCircleMemberMutationResult = Apollo.MutationResult<InsertCircleMemberMutation>;
export type InsertCircleMemberMutationOptions = Apollo.BaseMutationOptions<InsertCircleMemberMutation, InsertCircleMemberMutationVariables>;
export const ArchiveCircleMemberDocument = gql`
    mutation archiveCircleMember($circleId: uuid!, $memberId: uuid!, $archivedAt: timestamptz!) {
  update_circle_member(
    where: {circleId: {_eq: $circleId}, memberId: {_eq: $memberId}, archivedAt: {_is_null: true}}
    _set: {archivedAt: $archivedAt}
  ) {
    returning {
      ...CircleMember
      member {
        id
        name
      }
      circle {
        role {
          id
          name
        }
      }
    }
  }
}
    ${CircleMemberFragmentDoc}`;
export type ArchiveCircleMemberMutationFn = Apollo.MutationFunction<ArchiveCircleMemberMutation, ArchiveCircleMemberMutationVariables>;

/**
 * __useArchiveCircleMemberMutation__
 *
 * To run a mutation, you first call `useArchiveCircleMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveCircleMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveCircleMemberMutation, { data, loading, error }] = useArchiveCircleMemberMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      memberId: // value for 'memberId'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveCircleMemberMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveCircleMemberMutation, ArchiveCircleMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveCircleMemberMutation, ArchiveCircleMemberMutationVariables>(ArchiveCircleMemberDocument, options);
      }
export type ArchiveCircleMemberMutationHookResult = ReturnType<typeof useArchiveCircleMemberMutation>;
export type ArchiveCircleMemberMutationResult = Apollo.MutationResult<ArchiveCircleMemberMutation>;
export type ArchiveCircleMemberMutationOptions = Apollo.BaseMutationOptions<ArchiveCircleMemberMutation, ArchiveCircleMemberMutationVariables>;
export const GetDecisionDocument = gql`
    query getDecision($id: uuid!) {
  decision_by_pk(id: $id) {
    ...Decision
  }
}
    ${DecisionFragmentDoc}`;

/**
 * __useGetDecisionQuery__
 *
 * To run a query within a React component, call `useGetDecisionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDecisionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDecisionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDecisionQuery(baseOptions: Apollo.QueryHookOptions<GetDecisionQuery, GetDecisionQueryVariables> & ({ variables: GetDecisionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDecisionQuery, GetDecisionQueryVariables>(GetDecisionDocument, options);
      }
export function useGetDecisionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDecisionQuery, GetDecisionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDecisionQuery, GetDecisionQueryVariables>(GetDecisionDocument, options);
        }
// @ts-ignore
export function useGetDecisionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDecisionQuery, GetDecisionQueryVariables>): Apollo.UseSuspenseQueryResult<GetDecisionQuery, GetDecisionQueryVariables>;
export function useGetDecisionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDecisionQuery, GetDecisionQueryVariables>): Apollo.UseSuspenseQueryResult<GetDecisionQuery | undefined, GetDecisionQueryVariables>;
export function useGetDecisionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDecisionQuery, GetDecisionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDecisionQuery, GetDecisionQueryVariables>(GetDecisionDocument, options);
        }
export type GetDecisionQueryHookResult = ReturnType<typeof useGetDecisionQuery>;
export type GetDecisionLazyQueryHookResult = ReturnType<typeof useGetDecisionLazyQuery>;
export type GetDecisionSuspenseQueryHookResult = ReturnType<typeof useGetDecisionSuspenseQuery>;
export type GetDecisionQueryResult = Apollo.QueryResult<GetDecisionQuery, GetDecisionQueryVariables>;
export function refetchGetDecisionQuery(variables: GetDecisionQueryVariables) {
      return { query: GetDecisionDocument, variables: variables }
    }
export const DecisionDocument = gql`
    subscription decision($id: uuid!) {
  decision_by_pk(id: $id) {
    ...Decision
  }
}
    ${DecisionFragmentDoc}`;

/**
 * __useDecisionSubscription__
 *
 * To run a query within a React component, call `useDecisionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDecisionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecisionSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDecisionSubscription(baseOptions: Apollo.SubscriptionHookOptions<DecisionSubscription, DecisionSubscriptionVariables> & ({ variables: DecisionSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<DecisionSubscription, DecisionSubscriptionVariables>(DecisionDocument, options);
      }
export type DecisionSubscriptionHookResult = ReturnType<typeof useDecisionSubscription>;
export type DecisionSubscriptionResult = Apollo.SubscriptionResult<DecisionSubscription>;
export const DecisionThreadsDocument = gql`
    query decisionThreads($decisionId: uuid!) {
  thread_activity(
    where: {refDecisionId: {_eq: $decisionId}, archivedAt: {_is_null: true}}
    order_by: {createdAt: asc}
  ) {
    id
    thread {
      ...Thread
    }
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}`;

/**
 * __useDecisionThreadsQuery__
 *
 * To run a query within a React component, call `useDecisionThreadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecisionThreadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecisionThreadsQuery({
 *   variables: {
 *      decisionId: // value for 'decisionId'
 *   },
 * });
 */
export function useDecisionThreadsQuery(baseOptions: Apollo.QueryHookOptions<DecisionThreadsQuery, DecisionThreadsQueryVariables> & ({ variables: DecisionThreadsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DecisionThreadsQuery, DecisionThreadsQueryVariables>(DecisionThreadsDocument, options);
      }
export function useDecisionThreadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DecisionThreadsQuery, DecisionThreadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DecisionThreadsQuery, DecisionThreadsQueryVariables>(DecisionThreadsDocument, options);
        }
// @ts-ignore
export function useDecisionThreadsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DecisionThreadsQuery, DecisionThreadsQueryVariables>): Apollo.UseSuspenseQueryResult<DecisionThreadsQuery, DecisionThreadsQueryVariables>;
export function useDecisionThreadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DecisionThreadsQuery, DecisionThreadsQueryVariables>): Apollo.UseSuspenseQueryResult<DecisionThreadsQuery | undefined, DecisionThreadsQueryVariables>;
export function useDecisionThreadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DecisionThreadsQuery, DecisionThreadsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DecisionThreadsQuery, DecisionThreadsQueryVariables>(DecisionThreadsDocument, options);
        }
export type DecisionThreadsQueryHookResult = ReturnType<typeof useDecisionThreadsQuery>;
export type DecisionThreadsLazyQueryHookResult = ReturnType<typeof useDecisionThreadsLazyQuery>;
export type DecisionThreadsSuspenseQueryHookResult = ReturnType<typeof useDecisionThreadsSuspenseQuery>;
export type DecisionThreadsQueryResult = Apollo.QueryResult<DecisionThreadsQuery, DecisionThreadsQueryVariables>;
export function refetchDecisionThreadsQuery(variables: DecisionThreadsQueryVariables) {
      return { query: DecisionThreadsDocument, variables: variables }
    }
export const CircleDecisionsDocument = gql`
    subscription circleDecisions($circleId: uuid!, $active: Boolean!) {
  decision(
    where: {circleId: {_eq: $circleId}, archivedAt: {_is_null: $active}}
    order_by: {createdAt: desc}
  ) {
    ...Decision
  }
}
    ${DecisionFragmentDoc}`;

/**
 * __useCircleDecisionsSubscription__
 *
 * To run a query within a React component, call `useCircleDecisionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCircleDecisionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCircleDecisionsSubscription({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useCircleDecisionsSubscription(baseOptions: Apollo.SubscriptionHookOptions<CircleDecisionsSubscription, CircleDecisionsSubscriptionVariables> & ({ variables: CircleDecisionsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CircleDecisionsSubscription, CircleDecisionsSubscriptionVariables>(CircleDecisionsDocument, options);
      }
export type CircleDecisionsSubscriptionHookResult = ReturnType<typeof useCircleDecisionsSubscription>;
export type CircleDecisionsSubscriptionResult = Apollo.SubscriptionResult<CircleDecisionsSubscription>;
export const CreateDecisionDocument = gql`
    mutation createDecision($values: decision_insert_input!) {
  insert_decision_one(object: $values) {
    ...Decision
  }
}
    ${DecisionFragmentDoc}`;
export type CreateDecisionMutationFn = Apollo.MutationFunction<CreateDecisionMutation, CreateDecisionMutationVariables>;

/**
 * __useCreateDecisionMutation__
 *
 * To run a mutation, you first call `useCreateDecisionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDecisionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDecisionMutation, { data, loading, error }] = useCreateDecisionMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateDecisionMutation(baseOptions?: Apollo.MutationHookOptions<CreateDecisionMutation, CreateDecisionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDecisionMutation, CreateDecisionMutationVariables>(CreateDecisionDocument, options);
      }
export type CreateDecisionMutationHookResult = ReturnType<typeof useCreateDecisionMutation>;
export type CreateDecisionMutationResult = Apollo.MutationResult<CreateDecisionMutation>;
export type CreateDecisionMutationOptions = Apollo.BaseMutationOptions<CreateDecisionMutation, CreateDecisionMutationVariables>;
export const UpdateDecisionDocument = gql`
    mutation updateDecision($id: uuid!, $values: decision_set_input!) {
  update_decision_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Decision
  }
}
    ${DecisionFragmentDoc}`;
export type UpdateDecisionMutationFn = Apollo.MutationFunction<UpdateDecisionMutation, UpdateDecisionMutationVariables>;

/**
 * __useUpdateDecisionMutation__
 *
 * To run a mutation, you first call `useUpdateDecisionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDecisionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDecisionMutation, { data, loading, error }] = useUpdateDecisionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateDecisionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDecisionMutation, UpdateDecisionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDecisionMutation, UpdateDecisionMutationVariables>(UpdateDecisionDocument, options);
      }
export type UpdateDecisionMutationHookResult = ReturnType<typeof useUpdateDecisionMutation>;
export type UpdateDecisionMutationResult = Apollo.MutationResult<UpdateDecisionMutation>;
export type UpdateDecisionMutationOptions = Apollo.BaseMutationOptions<UpdateDecisionMutation, UpdateDecisionMutationVariables>;
export const ArchiveDecisionDocument = gql`
    mutation archiveDecision($id: uuid!, $archivedAt: timestamptz!) {
  update_decision_by_pk(pk_columns: {id: $id}, _set: {archivedAt: $archivedAt}) {
    id
  }
}
    `;
export type ArchiveDecisionMutationFn = Apollo.MutationFunction<ArchiveDecisionMutation, ArchiveDecisionMutationVariables>;

/**
 * __useArchiveDecisionMutation__
 *
 * To run a mutation, you first call `useArchiveDecisionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveDecisionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveDecisionMutation, { data, loading, error }] = useArchiveDecisionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveDecisionMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveDecisionMutation, ArchiveDecisionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveDecisionMutation, ArchiveDecisionMutationVariables>(ArchiveDecisionDocument, options);
      }
export type ArchiveDecisionMutationHookResult = ReturnType<typeof useArchiveDecisionMutation>;
export type ArchiveDecisionMutationResult = Apollo.MutationResult<ArchiveDecisionMutation>;
export type ArchiveDecisionMutationOptions = Apollo.BaseMutationOptions<ArchiveDecisionMutation, ArchiveDecisionMutationVariables>;
export const LastLogsDocument = gql`
    query lastLogs($orgId: uuid!, $limit: Int, $offset: Int) {
  log(
    where: {orgId: {_eq: $orgId}}
    order_by: {createdAt: desc}
    limit: $limit
    offset: $offset
  ) {
    ...Log
  }
  log_aggregate(where: {orgId: {_eq: $orgId}}) {
    aggregate {
      count
    }
  }
}
    ${LogFragmentDoc}`;

/**
 * __useLastLogsQuery__
 *
 * To run a query within a React component, call `useLastLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLastLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastLogsQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useLastLogsQuery(baseOptions: Apollo.QueryHookOptions<LastLogsQuery, LastLogsQueryVariables> & ({ variables: LastLogsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LastLogsQuery, LastLogsQueryVariables>(LastLogsDocument, options);
      }
export function useLastLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LastLogsQuery, LastLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LastLogsQuery, LastLogsQueryVariables>(LastLogsDocument, options);
        }
// @ts-ignore
export function useLastLogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LastLogsQuery, LastLogsQueryVariables>): Apollo.UseSuspenseQueryResult<LastLogsQuery, LastLogsQueryVariables>;
export function useLastLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LastLogsQuery, LastLogsQueryVariables>): Apollo.UseSuspenseQueryResult<LastLogsQuery | undefined, LastLogsQueryVariables>;
export function useLastLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LastLogsQuery, LastLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LastLogsQuery, LastLogsQueryVariables>(LastLogsDocument, options);
        }
export type LastLogsQueryHookResult = ReturnType<typeof useLastLogsQuery>;
export type LastLogsLazyQueryHookResult = ReturnType<typeof useLastLogsLazyQuery>;
export type LastLogsSuspenseQueryHookResult = ReturnType<typeof useLastLogsSuspenseQuery>;
export type LastLogsQueryResult = Apollo.QueryResult<LastLogsQuery, LastLogsQueryVariables>;
export function refetchLastLogsQuery(variables: LastLogsQueryVariables) {
      return { query: LastLogsDocument, variables: variables }
    }
export const MeetingLogsDocument = gql`
    subscription meetingLogs($meetingId: uuid!) {
  log(where: {meetingId: {_eq: $meetingId}}, order_by: {createdAt: asc}) {
    ...Log
  }
}
    ${LogFragmentDoc}`;

/**
 * __useMeetingLogsSubscription__
 *
 * To run a query within a React component, call `useMeetingLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeetingLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeetingLogsSubscription({
 *   variables: {
 *      meetingId: // value for 'meetingId'
 *   },
 * });
 */
export function useMeetingLogsSubscription(baseOptions: Apollo.SubscriptionHookOptions<MeetingLogsSubscription, MeetingLogsSubscriptionVariables> & ({ variables: MeetingLogsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeetingLogsSubscription, MeetingLogsSubscriptionVariables>(MeetingLogsDocument, options);
      }
export type MeetingLogsSubscriptionHookResult = ReturnType<typeof useMeetingLogsSubscription>;
export type MeetingLogsSubscriptionResult = Apollo.SubscriptionResult<MeetingLogsSubscription>;
export const DecisionLogsDocument = gql`
    subscription decisionLogs($decisionId: uuid!) {
  log(where: {decisionId: {_eq: $decisionId}}, order_by: {createdAt: asc}) {
    ...Log
  }
}
    ${LogFragmentDoc}`;

/**
 * __useDecisionLogsSubscription__
 *
 * To run a query within a React component, call `useDecisionLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDecisionLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecisionLogsSubscription({
 *   variables: {
 *      decisionId: // value for 'decisionId'
 *   },
 * });
 */
export function useDecisionLogsSubscription(baseOptions: Apollo.SubscriptionHookOptions<DecisionLogsSubscription, DecisionLogsSubscriptionVariables> & ({ variables: DecisionLogsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<DecisionLogsSubscription, DecisionLogsSubscriptionVariables>(DecisionLogsDocument, options);
      }
export type DecisionLogsSubscriptionHookResult = ReturnType<typeof useDecisionLogsSubscription>;
export type DecisionLogsSubscriptionResult = Apollo.SubscriptionResult<DecisionLogsSubscription>;
export const CreateLogDocument = gql`
    mutation createLog($values: log_insert_input!) {
  insert_log_one(object: $values) {
    ...Log
  }
}
    ${LogFragmentDoc}`;
export type CreateLogMutationFn = Apollo.MutationFunction<CreateLogMutation, CreateLogMutationVariables>;

/**
 * __useCreateLogMutation__
 *
 * To run a mutation, you first call `useCreateLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLogMutation, { data, loading, error }] = useCreateLogMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateLogMutation(baseOptions?: Apollo.MutationHookOptions<CreateLogMutation, CreateLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLogMutation, CreateLogMutationVariables>(CreateLogDocument, options);
      }
export type CreateLogMutationHookResult = ReturnType<typeof useCreateLogMutation>;
export type CreateLogMutationResult = Apollo.MutationResult<CreateLogMutation>;
export type CreateLogMutationOptions = Apollo.BaseMutationOptions<CreateLogMutation, CreateLogMutationVariables>;
export const CancelLogDocument = gql`
    mutation cancelLog($id: uuid!) {
  update_log_by_pk(pk_columns: {id: $id}, _set: {canceled: true}) {
    ...Log
  }
}
    ${LogFragmentDoc}`;
export type CancelLogMutationFn = Apollo.MutationFunction<CancelLogMutation, CancelLogMutationVariables>;

/**
 * __useCancelLogMutation__
 *
 * To run a mutation, you first call `useCancelLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelLogMutation, { data, loading, error }] = useCancelLogMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelLogMutation(baseOptions?: Apollo.MutationHookOptions<CancelLogMutation, CancelLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelLogMutation, CancelLogMutationVariables>(CancelLogDocument, options);
      }
export type CancelLogMutationHookResult = ReturnType<typeof useCancelLogMutation>;
export type CancelLogMutationResult = Apollo.MutationResult<CancelLogMutation>;
export type CancelLogMutationOptions = Apollo.BaseMutationOptions<CancelLogMutation, CancelLogMutationVariables>;
export const MeetingDocument = gql`
    subscription meeting($id: uuid!) {
  meeting_by_pk(id: $id) {
    ...Meeting
    steps {
      ...MeetingStep
    }
  }
}
    ${MeetingFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${MeetingStepFragmentDoc}`;

/**
 * __useMeetingSubscription__
 *
 * To run a query within a React component, call `useMeetingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeetingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeetingSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMeetingSubscription(baseOptions: Apollo.SubscriptionHookOptions<MeetingSubscription, MeetingSubscriptionVariables> & ({ variables: MeetingSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeetingSubscription, MeetingSubscriptionVariables>(MeetingDocument, options);
      }
export type MeetingSubscriptionHookResult = ReturnType<typeof useMeetingSubscription>;
export type MeetingSubscriptionResult = Apollo.SubscriptionResult<MeetingSubscription>;
export const MeetingsByDatesDocument = gql`
    subscription meetingsByDates($orgId: uuid!, $fromDate: timestamptz!, $toDate: timestamptz!, $filters: [meeting_bool_exp!]!, $recurringFilters: [meeting_bool_exp!]!) {
  org_by_pk(id: $orgId) {
    meetings(where: {startDate: {_gte: $fromDate, _lt: $toDate}, _and: $filters}) {
      ...MeetingSummary
    }
    meetings_recurring(where: {archivedAt: {_is_null: true}}) {
      ...MeetingRecurring
      meetings(
        where: {recurringDate: {_gte: $fromDate, _lt: $toDate}, _and: $recurringFilters}
      ) {
        id
        recurringDate
      }
    }
  }
}
    ${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${MeetingRecurringFragmentDoc}`;

/**
 * __useMeetingsByDatesSubscription__
 *
 * To run a query within a React component, call `useMeetingsByDatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeetingsByDatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeetingsByDatesSubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      fromDate: // value for 'fromDate'
 *      toDate: // value for 'toDate'
 *      filters: // value for 'filters'
 *      recurringFilters: // value for 'recurringFilters'
 *   },
 * });
 */
export function useMeetingsByDatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<MeetingsByDatesSubscription, MeetingsByDatesSubscriptionVariables> & ({ variables: MeetingsByDatesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeetingsByDatesSubscription, MeetingsByDatesSubscriptionVariables>(MeetingsByDatesDocument, options);
      }
export type MeetingsByDatesSubscriptionHookResult = ReturnType<typeof useMeetingsByDatesSubscription>;
export type MeetingsByDatesSubscriptionResult = Apollo.SubscriptionResult<MeetingsByDatesSubscription>;
export const NextMeetingsDocument = gql`
    subscription nextMeetings($orgId: uuid!, $memberId: uuid!) {
  meeting(
    where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: true}, endDate: {_gt: "now()"}, meeting_attendees: {memberId: {_eq: $memberId}}}
    order_by: {startDate: asc}
  ) {
    ...MeetingSummary
  }
}
    ${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}`;

/**
 * __useNextMeetingsSubscription__
 *
 * To run a query within a React component, call `useNextMeetingsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNextMeetingsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNextMeetingsSubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useNextMeetingsSubscription(baseOptions: Apollo.SubscriptionHookOptions<NextMeetingsSubscription, NextMeetingsSubscriptionVariables> & ({ variables: NextMeetingsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NextMeetingsSubscription, NextMeetingsSubscriptionVariables>(NextMeetingsDocument, options);
      }
export type NextMeetingsSubscriptionHookResult = ReturnType<typeof useNextMeetingsSubscription>;
export type NextMeetingsSubscriptionResult = Apollo.SubscriptionResult<NextMeetingsSubscription>;
export const CircleMeetingsDocument = gql`
    subscription circleMeetings($circleId: uuid!) {
  meeting(
    where: {circleId: {_eq: $circleId}, archivedAt: {_is_null: true}}
    order_by: {startDate: desc}
  ) {
    ...MeetingSummary
  }
}
    ${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}`;

/**
 * __useCircleMeetingsSubscription__
 *
 * To run a query within a React component, call `useCircleMeetingsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCircleMeetingsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCircleMeetingsSubscription({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useCircleMeetingsSubscription(baseOptions: Apollo.SubscriptionHookOptions<CircleMeetingsSubscription, CircleMeetingsSubscriptionVariables> & ({ variables: CircleMeetingsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CircleMeetingsSubscription, CircleMeetingsSubscriptionVariables>(CircleMeetingsDocument, options);
      }
export type CircleMeetingsSubscriptionHookResult = ReturnType<typeof useCircleMeetingsSubscription>;
export type CircleMeetingsSubscriptionResult = Apollo.SubscriptionResult<CircleMeetingsSubscription>;
export const CreateMeetingDocument = gql`
    mutation createMeeting($values: meeting_insert_input!) {
  insert_meeting_one(object: $values) {
    ...Meeting
  }
}
    ${MeetingFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}`;
export type CreateMeetingMutationFn = Apollo.MutationFunction<CreateMeetingMutation, CreateMeetingMutationVariables>;

/**
 * __useCreateMeetingMutation__
 *
 * To run a mutation, you first call `useCreateMeetingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeetingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeetingMutation, { data, loading, error }] = useCreateMeetingMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateMeetingMutation(baseOptions?: Apollo.MutationHookOptions<CreateMeetingMutation, CreateMeetingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMeetingMutation, CreateMeetingMutationVariables>(CreateMeetingDocument, options);
      }
export type CreateMeetingMutationHookResult = ReturnType<typeof useCreateMeetingMutation>;
export type CreateMeetingMutationResult = Apollo.MutationResult<CreateMeetingMutation>;
export type CreateMeetingMutationOptions = Apollo.BaseMutationOptions<CreateMeetingMutation, CreateMeetingMutationVariables>;
export const UpdateMeetingDocument = gql`
    mutation updateMeeting($id: uuid!, $values: meeting_set_input!) {
  update_meeting_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Meeting
  }
}
    ${MeetingFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}`;
export type UpdateMeetingMutationFn = Apollo.MutationFunction<UpdateMeetingMutation, UpdateMeetingMutationVariables>;

/**
 * __useUpdateMeetingMutation__
 *
 * To run a mutation, you first call `useUpdateMeetingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeetingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeetingMutation, { data, loading, error }] = useUpdateMeetingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateMeetingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeetingMutation, UpdateMeetingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeetingMutation, UpdateMeetingMutationVariables>(UpdateMeetingDocument, options);
      }
export type UpdateMeetingMutationHookResult = ReturnType<typeof useUpdateMeetingMutation>;
export type UpdateMeetingMutationResult = Apollo.MutationResult<UpdateMeetingMutation>;
export type UpdateMeetingMutationOptions = Apollo.BaseMutationOptions<UpdateMeetingMutation, UpdateMeetingMutationVariables>;
export const ArchiveMeetingDocument = gql`
    mutation archiveMeeting($id: uuid!, $archivedAt: timestamptz!) {
  update_meeting_by_pk(
    pk_columns: {id: $id}
    _set: {archivedAt: $archivedAt, currentStepId: null}
  ) {
    id
  }
}
    `;
export type ArchiveMeetingMutationFn = Apollo.MutationFunction<ArchiveMeetingMutation, ArchiveMeetingMutationVariables>;

/**
 * __useArchiveMeetingMutation__
 *
 * To run a mutation, you first call `useArchiveMeetingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveMeetingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveMeetingMutation, { data, loading, error }] = useArchiveMeetingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveMeetingMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveMeetingMutation, ArchiveMeetingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveMeetingMutation, ArchiveMeetingMutationVariables>(ArchiveMeetingDocument, options);
      }
export type ArchiveMeetingMutationHookResult = ReturnType<typeof useArchiveMeetingMutation>;
export type ArchiveMeetingMutationResult = Apollo.MutationResult<ArchiveMeetingMutation>;
export type ArchiveMeetingMutationOptions = Apollo.BaseMutationOptions<ArchiveMeetingMutation, ArchiveMeetingMutationVariables>;
export const CreateMeetingAttendeeDocument = gql`
    mutation createMeetingAttendee($values: meeting_attendee_insert_input!) {
  insert_meeting_attendee_one(object: $values) {
    ...MeetingAttendee
  }
}
    ${MeetingAttendeeFragmentDoc}`;
export type CreateMeetingAttendeeMutationFn = Apollo.MutationFunction<CreateMeetingAttendeeMutation, CreateMeetingAttendeeMutationVariables>;

/**
 * __useCreateMeetingAttendeeMutation__
 *
 * To run a mutation, you first call `useCreateMeetingAttendeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeetingAttendeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeetingAttendeeMutation, { data, loading, error }] = useCreateMeetingAttendeeMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateMeetingAttendeeMutation(baseOptions?: Apollo.MutationHookOptions<CreateMeetingAttendeeMutation, CreateMeetingAttendeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMeetingAttendeeMutation, CreateMeetingAttendeeMutationVariables>(CreateMeetingAttendeeDocument, options);
      }
export type CreateMeetingAttendeeMutationHookResult = ReturnType<typeof useCreateMeetingAttendeeMutation>;
export type CreateMeetingAttendeeMutationResult = Apollo.MutationResult<CreateMeetingAttendeeMutation>;
export type CreateMeetingAttendeeMutationOptions = Apollo.BaseMutationOptions<CreateMeetingAttendeeMutation, CreateMeetingAttendeeMutationVariables>;
export const UpdateMeetingAttendeeDocument = gql`
    mutation updateMeetingAttendee($id: uuid!, $values: meeting_attendee_set_input!) {
  update_meeting_attendee_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...MeetingAttendee
  }
}
    ${MeetingAttendeeFragmentDoc}`;
export type UpdateMeetingAttendeeMutationFn = Apollo.MutationFunction<UpdateMeetingAttendeeMutation, UpdateMeetingAttendeeMutationVariables>;

/**
 * __useUpdateMeetingAttendeeMutation__
 *
 * To run a mutation, you first call `useUpdateMeetingAttendeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeetingAttendeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeetingAttendeeMutation, { data, loading, error }] = useUpdateMeetingAttendeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateMeetingAttendeeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeetingAttendeeMutation, UpdateMeetingAttendeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeetingAttendeeMutation, UpdateMeetingAttendeeMutationVariables>(UpdateMeetingAttendeeDocument, options);
      }
export type UpdateMeetingAttendeeMutationHookResult = ReturnType<typeof useUpdateMeetingAttendeeMutation>;
export type UpdateMeetingAttendeeMutationResult = Apollo.MutationResult<UpdateMeetingAttendeeMutation>;
export type UpdateMeetingAttendeeMutationOptions = Apollo.BaseMutationOptions<UpdateMeetingAttendeeMutation, UpdateMeetingAttendeeMutationVariables>;
export const DeleteMeetingAttendeeDocument = gql`
    mutation deleteMeetingAttendee($id: uuid!) {
  delete_meeting_attendee_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteMeetingAttendeeMutationFn = Apollo.MutationFunction<DeleteMeetingAttendeeMutation, DeleteMeetingAttendeeMutationVariables>;

/**
 * __useDeleteMeetingAttendeeMutation__
 *
 * To run a mutation, you first call `useDeleteMeetingAttendeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMeetingAttendeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMeetingAttendeeMutation, { data, loading, error }] = useDeleteMeetingAttendeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMeetingAttendeeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMeetingAttendeeMutation, DeleteMeetingAttendeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMeetingAttendeeMutation, DeleteMeetingAttendeeMutationVariables>(DeleteMeetingAttendeeDocument, options);
      }
export type DeleteMeetingAttendeeMutationHookResult = ReturnType<typeof useDeleteMeetingAttendeeMutation>;
export type DeleteMeetingAttendeeMutationResult = Apollo.MutationResult<DeleteMeetingAttendeeMutation>;
export type DeleteMeetingAttendeeMutationOptions = Apollo.BaseMutationOptions<DeleteMeetingAttendeeMutation, DeleteMeetingAttendeeMutationVariables>;
export const MeetingRecurringDocument = gql`
    subscription meetingRecurring($id: uuid!) {
  meeting_recurring_by_pk(id: $id) {
    ...MeetingRecurring
    meetings {
      id
      recurringDate
    }
  }
}
    ${MeetingRecurringFragmentDoc}`;

/**
 * __useMeetingRecurringSubscription__
 *
 * To run a query within a React component, call `useMeetingRecurringSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeetingRecurringSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeetingRecurringSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMeetingRecurringSubscription(baseOptions: Apollo.SubscriptionHookOptions<MeetingRecurringSubscription, MeetingRecurringSubscriptionVariables> & ({ variables: MeetingRecurringSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeetingRecurringSubscription, MeetingRecurringSubscriptionVariables>(MeetingRecurringDocument, options);
      }
export type MeetingRecurringSubscriptionHookResult = ReturnType<typeof useMeetingRecurringSubscription>;
export type MeetingRecurringSubscriptionResult = Apollo.SubscriptionResult<MeetingRecurringSubscription>;
export const MeetingRecurringsDocument = gql`
    subscription meetingRecurrings($where: meeting_recurring_bool_exp!) {
  meeting_recurring(where: $where, order_by: {template: {title: asc}}) {
    ...MeetingRecurring
  }
}
    ${MeetingRecurringFragmentDoc}`;

/**
 * __useMeetingRecurringsSubscription__
 *
 * To run a query within a React component, call `useMeetingRecurringsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeetingRecurringsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeetingRecurringsSubscription({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useMeetingRecurringsSubscription(baseOptions: Apollo.SubscriptionHookOptions<MeetingRecurringsSubscription, MeetingRecurringsSubscriptionVariables> & ({ variables: MeetingRecurringsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeetingRecurringsSubscription, MeetingRecurringsSubscriptionVariables>(MeetingRecurringsDocument, options);
      }
export type MeetingRecurringsSubscriptionHookResult = ReturnType<typeof useMeetingRecurringsSubscription>;
export type MeetingRecurringsSubscriptionResult = Apollo.SubscriptionResult<MeetingRecurringsSubscription>;
export const CreateMeetingRecurringDocument = gql`
    mutation createMeetingRecurring($values: meeting_recurring_insert_input!) {
  insert_meeting_recurring_one(object: $values) {
    ...MeetingRecurring
  }
}
    ${MeetingRecurringFragmentDoc}`;
export type CreateMeetingRecurringMutationFn = Apollo.MutationFunction<CreateMeetingRecurringMutation, CreateMeetingRecurringMutationVariables>;

/**
 * __useCreateMeetingRecurringMutation__
 *
 * To run a mutation, you first call `useCreateMeetingRecurringMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeetingRecurringMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeetingRecurringMutation, { data, loading, error }] = useCreateMeetingRecurringMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateMeetingRecurringMutation(baseOptions?: Apollo.MutationHookOptions<CreateMeetingRecurringMutation, CreateMeetingRecurringMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMeetingRecurringMutation, CreateMeetingRecurringMutationVariables>(CreateMeetingRecurringDocument, options);
      }
export type CreateMeetingRecurringMutationHookResult = ReturnType<typeof useCreateMeetingRecurringMutation>;
export type CreateMeetingRecurringMutationResult = Apollo.MutationResult<CreateMeetingRecurringMutation>;
export type CreateMeetingRecurringMutationOptions = Apollo.BaseMutationOptions<CreateMeetingRecurringMutation, CreateMeetingRecurringMutationVariables>;
export const UpdateMeetingRecurringDocument = gql`
    mutation updateMeetingRecurring($id: uuid!, $values: meeting_recurring_set_input!) {
  update_meeting_recurring_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...MeetingRecurring
  }
}
    ${MeetingRecurringFragmentDoc}`;
export type UpdateMeetingRecurringMutationFn = Apollo.MutationFunction<UpdateMeetingRecurringMutation, UpdateMeetingRecurringMutationVariables>;

/**
 * __useUpdateMeetingRecurringMutation__
 *
 * To run a mutation, you first call `useUpdateMeetingRecurringMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeetingRecurringMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeetingRecurringMutation, { data, loading, error }] = useUpdateMeetingRecurringMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateMeetingRecurringMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeetingRecurringMutation, UpdateMeetingRecurringMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeetingRecurringMutation, UpdateMeetingRecurringMutationVariables>(UpdateMeetingRecurringDocument, options);
      }
export type UpdateMeetingRecurringMutationHookResult = ReturnType<typeof useUpdateMeetingRecurringMutation>;
export type UpdateMeetingRecurringMutationResult = Apollo.MutationResult<UpdateMeetingRecurringMutation>;
export type UpdateMeetingRecurringMutationOptions = Apollo.BaseMutationOptions<UpdateMeetingRecurringMutation, UpdateMeetingRecurringMutationVariables>;
export const ArchiveMeetingRecurringDocument = gql`
    mutation archiveMeetingRecurring($id: uuid!, $archivedAt: timestamptz!) {
  update_meeting_recurring_by_pk(
    pk_columns: {id: $id}
    _set: {archivedAt: $archivedAt}
  ) {
    id
  }
}
    `;
export type ArchiveMeetingRecurringMutationFn = Apollo.MutationFunction<ArchiveMeetingRecurringMutation, ArchiveMeetingRecurringMutationVariables>;

/**
 * __useArchiveMeetingRecurringMutation__
 *
 * To run a mutation, you first call `useArchiveMeetingRecurringMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveMeetingRecurringMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveMeetingRecurringMutation, { data, loading, error }] = useArchiveMeetingRecurringMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveMeetingRecurringMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveMeetingRecurringMutation, ArchiveMeetingRecurringMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveMeetingRecurringMutation, ArchiveMeetingRecurringMutationVariables>(ArchiveMeetingRecurringDocument, options);
      }
export type ArchiveMeetingRecurringMutationHookResult = ReturnType<typeof useArchiveMeetingRecurringMutation>;
export type ArchiveMeetingRecurringMutationResult = Apollo.MutationResult<ArchiveMeetingRecurringMutation>;
export type ArchiveMeetingRecurringMutationOptions = Apollo.BaseMutationOptions<ArchiveMeetingRecurringMutation, ArchiveMeetingRecurringMutationVariables>;
export const GetMeetingStepsDocument = gql`
    query getMeetingSteps($meetingId: uuid!) {
  meeting_step(where: {meetingId: {_eq: $meetingId}}) {
    ...MeetingStep
  }
}
    ${MeetingStepFragmentDoc}`;

/**
 * __useGetMeetingStepsQuery__
 *
 * To run a query within a React component, call `useGetMeetingStepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeetingStepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeetingStepsQuery({
 *   variables: {
 *      meetingId: // value for 'meetingId'
 *   },
 * });
 */
export function useGetMeetingStepsQuery(baseOptions: Apollo.QueryHookOptions<GetMeetingStepsQuery, GetMeetingStepsQueryVariables> & ({ variables: GetMeetingStepsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>(GetMeetingStepsDocument, options);
      }
export function useGetMeetingStepsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>(GetMeetingStepsDocument, options);
        }
// @ts-ignore
export function useGetMeetingStepsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>;
export function useGetMeetingStepsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeetingStepsQuery | undefined, GetMeetingStepsQueryVariables>;
export function useGetMeetingStepsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>(GetMeetingStepsDocument, options);
        }
export type GetMeetingStepsQueryHookResult = ReturnType<typeof useGetMeetingStepsQuery>;
export type GetMeetingStepsLazyQueryHookResult = ReturnType<typeof useGetMeetingStepsLazyQuery>;
export type GetMeetingStepsSuspenseQueryHookResult = ReturnType<typeof useGetMeetingStepsSuspenseQuery>;
export type GetMeetingStepsQueryResult = Apollo.QueryResult<GetMeetingStepsQuery, GetMeetingStepsQueryVariables>;
export function refetchGetMeetingStepsQuery(variables: GetMeetingStepsQueryVariables) {
      return { query: GetMeetingStepsDocument, variables: variables }
    }
export const GetPrevMeetingStepsDocument = gql`
    query getPrevMeetingSteps($beforeDate: timestamptz!, $circleId: uuid!, $stepsIds: [String!]!) {
  meeting(
    where: {startDate: {_lt: $beforeDate}, archivedAt: {_is_null: true}, circleId: {_eq: $circleId}, steps: {stepConfigId: {_in: $stepsIds}}}
    order_by: {startDate: desc}
    limit: 1
  ) {
    steps(where: {stepConfigId: {_in: $stepsIds}}) {
      ...MeetingStep
    }
  }
}
    ${MeetingStepFragmentDoc}`;

/**
 * __useGetPrevMeetingStepsQuery__
 *
 * To run a query within a React component, call `useGetPrevMeetingStepsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPrevMeetingStepsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPrevMeetingStepsQuery({
 *   variables: {
 *      beforeDate: // value for 'beforeDate'
 *      circleId: // value for 'circleId'
 *      stepsIds: // value for 'stepsIds'
 *   },
 * });
 */
export function useGetPrevMeetingStepsQuery(baseOptions: Apollo.QueryHookOptions<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables> & ({ variables: GetPrevMeetingStepsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>(GetPrevMeetingStepsDocument, options);
      }
export function useGetPrevMeetingStepsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>(GetPrevMeetingStepsDocument, options);
        }
// @ts-ignore
export function useGetPrevMeetingStepsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>;
export function useGetPrevMeetingStepsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>): Apollo.UseSuspenseQueryResult<GetPrevMeetingStepsQuery | undefined, GetPrevMeetingStepsQueryVariables>;
export function useGetPrevMeetingStepsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>(GetPrevMeetingStepsDocument, options);
        }
export type GetPrevMeetingStepsQueryHookResult = ReturnType<typeof useGetPrevMeetingStepsQuery>;
export type GetPrevMeetingStepsLazyQueryHookResult = ReturnType<typeof useGetPrevMeetingStepsLazyQuery>;
export type GetPrevMeetingStepsSuspenseQueryHookResult = ReturnType<typeof useGetPrevMeetingStepsSuspenseQuery>;
export type GetPrevMeetingStepsQueryResult = Apollo.QueryResult<GetPrevMeetingStepsQuery, GetPrevMeetingStepsQueryVariables>;
export function refetchGetPrevMeetingStepsQuery(variables: GetPrevMeetingStepsQueryVariables) {
      return { query: GetPrevMeetingStepsDocument, variables: variables }
    }
export const CreateMeetingStepDocument = gql`
    mutation createMeetingStep($values: meeting_step_insert_input!) {
  insert_meeting_step_one(object: $values) {
    ...MeetingStep
  }
}
    ${MeetingStepFragmentDoc}`;
export type CreateMeetingStepMutationFn = Apollo.MutationFunction<CreateMeetingStepMutation, CreateMeetingStepMutationVariables>;

/**
 * __useCreateMeetingStepMutation__
 *
 * To run a mutation, you first call `useCreateMeetingStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeetingStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeetingStepMutation, { data, loading, error }] = useCreateMeetingStepMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateMeetingStepMutation(baseOptions?: Apollo.MutationHookOptions<CreateMeetingStepMutation, CreateMeetingStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMeetingStepMutation, CreateMeetingStepMutationVariables>(CreateMeetingStepDocument, options);
      }
export type CreateMeetingStepMutationHookResult = ReturnType<typeof useCreateMeetingStepMutation>;
export type CreateMeetingStepMutationResult = Apollo.MutationResult<CreateMeetingStepMutation>;
export type CreateMeetingStepMutationOptions = Apollo.BaseMutationOptions<CreateMeetingStepMutation, CreateMeetingStepMutationVariables>;
export const UpdateMeetingStepDocument = gql`
    mutation updateMeetingStep($id: uuid!, $values: meeting_step_set_input!) {
  update_meeting_step_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...MeetingStep
  }
}
    ${MeetingStepFragmentDoc}`;
export type UpdateMeetingStepMutationFn = Apollo.MutationFunction<UpdateMeetingStepMutation, UpdateMeetingStepMutationVariables>;

/**
 * __useUpdateMeetingStepMutation__
 *
 * To run a mutation, you first call `useUpdateMeetingStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeetingStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeetingStepMutation, { data, loading, error }] = useUpdateMeetingStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateMeetingStepMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeetingStepMutation, UpdateMeetingStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeetingStepMutation, UpdateMeetingStepMutationVariables>(UpdateMeetingStepDocument, options);
      }
export type UpdateMeetingStepMutationHookResult = ReturnType<typeof useUpdateMeetingStepMutation>;
export type UpdateMeetingStepMutationResult = Apollo.MutationResult<UpdateMeetingStepMutation>;
export type UpdateMeetingStepMutationOptions = Apollo.BaseMutationOptions<UpdateMeetingStepMutation, UpdateMeetingStepMutationVariables>;
export const DeleteMeetingStepDocument = gql`
    mutation deleteMeetingStep($id: uuid!) {
  delete_meeting_step_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteMeetingStepMutationFn = Apollo.MutationFunction<DeleteMeetingStepMutation, DeleteMeetingStepMutationVariables>;

/**
 * __useDeleteMeetingStepMutation__
 *
 * To run a mutation, you first call `useDeleteMeetingStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMeetingStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMeetingStepMutation, { data, loading, error }] = useDeleteMeetingStepMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMeetingStepMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMeetingStepMutation, DeleteMeetingStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMeetingStepMutation, DeleteMeetingStepMutationVariables>(DeleteMeetingStepDocument, options);
      }
export type DeleteMeetingStepMutationHookResult = ReturnType<typeof useDeleteMeetingStepMutation>;
export type DeleteMeetingStepMutationResult = Apollo.MutationResult<DeleteMeetingStepMutation>;
export type DeleteMeetingStepMutationOptions = Apollo.BaseMutationOptions<DeleteMeetingStepMutation, DeleteMeetingStepMutationVariables>;
export const MeetingTemplatesDocument = gql`
    subscription meetingTemplates($orgId: uuid!) {
  meeting_template(
    where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: true}}
    order_by: {title: asc}
  ) {
    ...MeetingTemplate
  }
}
    ${MeetingTemplateFragmentDoc}`;

/**
 * __useMeetingTemplatesSubscription__
 *
 * To run a query within a React component, call `useMeetingTemplatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMeetingTemplatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeetingTemplatesSubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useMeetingTemplatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<MeetingTemplatesSubscription, MeetingTemplatesSubscriptionVariables> & ({ variables: MeetingTemplatesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MeetingTemplatesSubscription, MeetingTemplatesSubscriptionVariables>(MeetingTemplatesDocument, options);
      }
export type MeetingTemplatesSubscriptionHookResult = ReturnType<typeof useMeetingTemplatesSubscription>;
export type MeetingTemplatesSubscriptionResult = Apollo.SubscriptionResult<MeetingTemplatesSubscription>;
export const CreateMeetingTemplateDocument = gql`
    mutation createMeetingTemplate($values: meeting_template_insert_input!) {
  insert_meeting_template_one(object: $values) {
    ...MeetingTemplate
  }
}
    ${MeetingTemplateFragmentDoc}`;
export type CreateMeetingTemplateMutationFn = Apollo.MutationFunction<CreateMeetingTemplateMutation, CreateMeetingTemplateMutationVariables>;

/**
 * __useCreateMeetingTemplateMutation__
 *
 * To run a mutation, you first call `useCreateMeetingTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeetingTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeetingTemplateMutation, { data, loading, error }] = useCreateMeetingTemplateMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateMeetingTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMeetingTemplateMutation, CreateMeetingTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMeetingTemplateMutation, CreateMeetingTemplateMutationVariables>(CreateMeetingTemplateDocument, options);
      }
export type CreateMeetingTemplateMutationHookResult = ReturnType<typeof useCreateMeetingTemplateMutation>;
export type CreateMeetingTemplateMutationResult = Apollo.MutationResult<CreateMeetingTemplateMutation>;
export type CreateMeetingTemplateMutationOptions = Apollo.BaseMutationOptions<CreateMeetingTemplateMutation, CreateMeetingTemplateMutationVariables>;
export const UpdateMeetingTemplateDocument = gql`
    mutation updateMeetingTemplate($id: uuid!, $values: meeting_template_set_input!) {
  update_meeting_template_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...MeetingTemplate
  }
}
    ${MeetingTemplateFragmentDoc}`;
export type UpdateMeetingTemplateMutationFn = Apollo.MutationFunction<UpdateMeetingTemplateMutation, UpdateMeetingTemplateMutationVariables>;

/**
 * __useUpdateMeetingTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateMeetingTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeetingTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeetingTemplateMutation, { data, loading, error }] = useUpdateMeetingTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateMeetingTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeetingTemplateMutation, UpdateMeetingTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeetingTemplateMutation, UpdateMeetingTemplateMutationVariables>(UpdateMeetingTemplateDocument, options);
      }
export type UpdateMeetingTemplateMutationHookResult = ReturnType<typeof useUpdateMeetingTemplateMutation>;
export type UpdateMeetingTemplateMutationResult = Apollo.MutationResult<UpdateMeetingTemplateMutation>;
export type UpdateMeetingTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateMeetingTemplateMutation, UpdateMeetingTemplateMutationVariables>;
export const ArchiveMeetingTemplateDocument = gql`
    mutation archiveMeetingTemplate($id: uuid!, $archivedAt: timestamptz!) {
  update_meeting_template_by_pk(
    pk_columns: {id: $id}
    _set: {archivedAt: $archivedAt}
  ) {
    id
  }
}
    `;
export type ArchiveMeetingTemplateMutationFn = Apollo.MutationFunction<ArchiveMeetingTemplateMutation, ArchiveMeetingTemplateMutationVariables>;

/**
 * __useArchiveMeetingTemplateMutation__
 *
 * To run a mutation, you first call `useArchiveMeetingTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveMeetingTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveMeetingTemplateMutation, { data, loading, error }] = useArchiveMeetingTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveMeetingTemplateMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveMeetingTemplateMutation, ArchiveMeetingTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveMeetingTemplateMutation, ArchiveMeetingTemplateMutationVariables>(ArchiveMeetingTemplateDocument, options);
      }
export type ArchiveMeetingTemplateMutationHookResult = ReturnType<typeof useArchiveMeetingTemplateMutation>;
export type ArchiveMeetingTemplateMutationResult = Apollo.MutationResult<ArchiveMeetingTemplateMutation>;
export type ArchiveMeetingTemplateMutationOptions = Apollo.BaseMutationOptions<ArchiveMeetingTemplateMutation, ArchiveMeetingTemplateMutationVariables>;
export const GetMemberDocument = gql`
    query getMember($id: uuid!) {
  member_by_pk(id: $id) {
    ...Member
  }
}
    ${MemberFragmentDoc}`;

/**
 * __useGetMemberQuery__
 *
 * To run a query within a React component, call `useGetMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMemberQuery(baseOptions: Apollo.QueryHookOptions<GetMemberQuery, GetMemberQueryVariables> & ({ variables: GetMemberQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberQuery, GetMemberQueryVariables>(GetMemberDocument, options);
      }
export function useGetMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberQuery, GetMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberQuery, GetMemberQueryVariables>(GetMemberDocument, options);
        }
// @ts-ignore
export function useGetMemberSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMemberQuery, GetMemberQueryVariables>): Apollo.UseSuspenseQueryResult<GetMemberQuery, GetMemberQueryVariables>;
export function useGetMemberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMemberQuery, GetMemberQueryVariables>): Apollo.UseSuspenseQueryResult<GetMemberQuery | undefined, GetMemberQueryVariables>;
export function useGetMemberSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMemberQuery, GetMemberQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMemberQuery, GetMemberQueryVariables>(GetMemberDocument, options);
        }
export type GetMemberQueryHookResult = ReturnType<typeof useGetMemberQuery>;
export type GetMemberLazyQueryHookResult = ReturnType<typeof useGetMemberLazyQuery>;
export type GetMemberSuspenseQueryHookResult = ReturnType<typeof useGetMemberSuspenseQuery>;
export type GetMemberQueryResult = Apollo.QueryResult<GetMemberQuery, GetMemberQueryVariables>;
export function refetchGetMemberQuery(variables: GetMemberQueryVariables) {
      return { query: GetMemberDocument, variables: variables }
    }
export const MembersByIdsDocument = gql`
    query membersByIds($ids: [uuid!]!) {
  member(where: {id: {_in: $ids}}) {
    ...ThreadActivityMember
  }
}
    ${ThreadActivityMemberFragmentDoc}`;

/**
 * __useMembersByIdsQuery__
 *
 * To run a query within a React component, call `useMembersByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMembersByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMembersByIdsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useMembersByIdsQuery(baseOptions: Apollo.QueryHookOptions<MembersByIdsQuery, MembersByIdsQueryVariables> & ({ variables: MembersByIdsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MembersByIdsQuery, MembersByIdsQueryVariables>(MembersByIdsDocument, options);
      }
export function useMembersByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MembersByIdsQuery, MembersByIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MembersByIdsQuery, MembersByIdsQueryVariables>(MembersByIdsDocument, options);
        }
// @ts-ignore
export function useMembersByIdsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MembersByIdsQuery, MembersByIdsQueryVariables>): Apollo.UseSuspenseQueryResult<MembersByIdsQuery, MembersByIdsQueryVariables>;
export function useMembersByIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MembersByIdsQuery, MembersByIdsQueryVariables>): Apollo.UseSuspenseQueryResult<MembersByIdsQuery | undefined, MembersByIdsQueryVariables>;
export function useMembersByIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MembersByIdsQuery, MembersByIdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MembersByIdsQuery, MembersByIdsQueryVariables>(MembersByIdsDocument, options);
        }
export type MembersByIdsQueryHookResult = ReturnType<typeof useMembersByIdsQuery>;
export type MembersByIdsLazyQueryHookResult = ReturnType<typeof useMembersByIdsLazyQuery>;
export type MembersByIdsSuspenseQueryHookResult = ReturnType<typeof useMembersByIdsSuspenseQuery>;
export type MembersByIdsQueryResult = Apollo.QueryResult<MembersByIdsQuery, MembersByIdsQueryVariables>;
export function refetchMembersByIdsQuery(variables: MembersByIdsQueryVariables) {
      return { query: MembersByIdsDocument, variables: variables }
    }
export const MembersDocument = gql`
    subscription members($orgId: uuid!, $active: Boolean!) {
  member(
    where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: $active}}
    order_by: {name: asc}
  ) {
    ...Member
  }
}
    ${MemberFragmentDoc}`;

/**
 * __useMembersSubscription__
 *
 * To run a query within a React component, call `useMembersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMembersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMembersSubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useMembersSubscription(baseOptions: Apollo.SubscriptionHookOptions<MembersSubscription, MembersSubscriptionVariables> & ({ variables: MembersSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MembersSubscription, MembersSubscriptionVariables>(MembersDocument, options);
      }
export type MembersSubscriptionHookResult = ReturnType<typeof useMembersSubscription>;
export type MembersSubscriptionResult = Apollo.SubscriptionResult<MembersSubscription>;
export const CurrentMeetingsDocument = gql`
    subscription currentMeetings($memberId: uuid!) {
  member_by_pk(id: $memberId) {
    org {
      meetings(
        where: {currentStepId: {_is_null: false}, ended: {_eq: false}, archivedAt: {_is_null: true}, meeting_attendees: {memberId: {_eq: $memberId}}}
      ) {
        id
      }
    }
  }
}
    `;

/**
 * __useCurrentMeetingsSubscription__
 *
 * To run a query within a React component, call `useCurrentMeetingsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCurrentMeetingsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentMeetingsSubscription({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCurrentMeetingsSubscription(baseOptions: Apollo.SubscriptionHookOptions<CurrentMeetingsSubscription, CurrentMeetingsSubscriptionVariables> & ({ variables: CurrentMeetingsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CurrentMeetingsSubscription, CurrentMeetingsSubscriptionVariables>(CurrentMeetingsDocument, options);
      }
export type CurrentMeetingsSubscriptionHookResult = ReturnType<typeof useCurrentMeetingsSubscription>;
export type CurrentMeetingsSubscriptionResult = Apollo.SubscriptionResult<CurrentMeetingsSubscription>;
export const CreateMemberDocument = gql`
    mutation createMember($orgId: uuid!, $name: String!) {
  insert_member_one(object: {orgId: $orgId, name: $name}) {
    ...Member
  }
}
    ${MemberFragmentDoc}`;
export type CreateMemberMutationFn = Apollo.MutationFunction<CreateMemberMutation, CreateMemberMutationVariables>;

/**
 * __useCreateMemberMutation__
 *
 * To run a mutation, you first call `useCreateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMemberMutation, { data, loading, error }] = useCreateMemberMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateMemberMutation, CreateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMemberMutation, CreateMemberMutationVariables>(CreateMemberDocument, options);
      }
export type CreateMemberMutationHookResult = ReturnType<typeof useCreateMemberMutation>;
export type CreateMemberMutationResult = Apollo.MutationResult<CreateMemberMutation>;
export type CreateMemberMutationOptions = Apollo.BaseMutationOptions<CreateMemberMutation, CreateMemberMutationVariables>;
export const UpdateMemberDocument = gql`
    mutation updateMember($id: uuid!, $values: member_set_input!) {
  update_member_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Member
  }
}
    ${MemberFragmentDoc}`;
export type UpdateMemberMutationFn = Apollo.MutationFunction<UpdateMemberMutation, UpdateMemberMutationVariables>;

/**
 * __useUpdateMemberMutation__
 *
 * To run a mutation, you first call `useUpdateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMemberMutation, { data, loading, error }] = useUpdateMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMemberMutation, UpdateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMemberMutation, UpdateMemberMutationVariables>(UpdateMemberDocument, options);
      }
export type UpdateMemberMutationHookResult = ReturnType<typeof useUpdateMemberMutation>;
export type UpdateMemberMutationResult = Apollo.MutationResult<UpdateMemberMutation>;
export type UpdateMemberMutationOptions = Apollo.BaseMutationOptions<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const LastNewsDocument = gql`
    query lastNews($where: news_bool_exp!, $limit: Int, $offset: Int) {
  news(where: $where, order_by: {createdAt: desc}, limit: $limit, offset: $offset) {
    ...News
  }
  news_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    ${NewsFragmentDoc}
${DecisionFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${ThreadWithFirstActivityFragmentDoc}
${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${ThreadActivityFragmentDoc}
${ThreadActivityMemberFragmentDoc}
${ThreadActivityReactionFragmentDoc}
${TaskFragmentDoc}`;

/**
 * __useLastNewsQuery__
 *
 * To run a query within a React component, call `useLastNewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLastNewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastNewsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useLastNewsQuery(baseOptions: Apollo.QueryHookOptions<LastNewsQuery, LastNewsQueryVariables> & ({ variables: LastNewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LastNewsQuery, LastNewsQueryVariables>(LastNewsDocument, options);
      }
export function useLastNewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LastNewsQuery, LastNewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LastNewsQuery, LastNewsQueryVariables>(LastNewsDocument, options);
        }
// @ts-ignore
export function useLastNewsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LastNewsQuery, LastNewsQueryVariables>): Apollo.UseSuspenseQueryResult<LastNewsQuery, LastNewsQueryVariables>;
export function useLastNewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LastNewsQuery, LastNewsQueryVariables>): Apollo.UseSuspenseQueryResult<LastNewsQuery | undefined, LastNewsQueryVariables>;
export function useLastNewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LastNewsQuery, LastNewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LastNewsQuery, LastNewsQueryVariables>(LastNewsDocument, options);
        }
export type LastNewsQueryHookResult = ReturnType<typeof useLastNewsQuery>;
export type LastNewsLazyQueryHookResult = ReturnType<typeof useLastNewsLazyQuery>;
export type LastNewsSuspenseQueryHookResult = ReturnType<typeof useLastNewsSuspenseQuery>;
export type LastNewsQueryResult = Apollo.QueryResult<LastNewsQuery, LastNewsQueryVariables>;
export function refetchLastNewsQuery(variables: LastNewsQueryVariables) {
      return { query: LastNewsDocument, variables: variables }
    }
export const OnboardingActivityDocument = gql`
    subscription onboardingActivity($orgId: uuid!) {
  org_by_pk(id: $orgId) {
    id
    meetings(where: {ended: {_eq: true}, archivedAt: {_is_null: true}}, limit: 1) {
      id
    }
    meetings_recurring(where: {archivedAt: {_is_null: true}}, limit: 1) {
      id
    }
    threads(where: {archivedAt: {_is_null: true}}, limit: 1) {
      id
    }
    decisions(where: {archivedAt: {_is_null: true}}, limit: 1) {
      id
    }
  }
}
    `;

/**
 * __useOnboardingActivitySubscription__
 *
 * To run a query within a React component, call `useOnboardingActivitySubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnboardingActivitySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnboardingActivitySubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useOnboardingActivitySubscription(baseOptions: Apollo.SubscriptionHookOptions<OnboardingActivitySubscription, OnboardingActivitySubscriptionVariables> & ({ variables: OnboardingActivitySubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnboardingActivitySubscription, OnboardingActivitySubscriptionVariables>(OnboardingActivityDocument, options);
      }
export type OnboardingActivitySubscriptionHookResult = ReturnType<typeof useOnboardingActivitySubscription>;
export type OnboardingActivitySubscriptionResult = Apollo.SubscriptionResult<OnboardingActivitySubscription>;
export const GetOrgDocument = gql`
    query getOrg($id: uuid!) {
  org_by_pk(id: $id) {
    ...Org
  }
}
    ${OrgFragmentDoc}`;

/**
 * __useGetOrgQuery__
 *
 * To run a query within a React component, call `useGetOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrgQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOrgQuery(baseOptions: Apollo.QueryHookOptions<GetOrgQuery, GetOrgQueryVariables> & ({ variables: GetOrgQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrgQuery, GetOrgQueryVariables>(GetOrgDocument, options);
      }
export function useGetOrgLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrgQuery, GetOrgQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrgQuery, GetOrgQueryVariables>(GetOrgDocument, options);
        }
// @ts-ignore
export function useGetOrgSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOrgQuery, GetOrgQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrgQuery, GetOrgQueryVariables>;
export function useGetOrgSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrgQuery, GetOrgQueryVariables>): Apollo.UseSuspenseQueryResult<GetOrgQuery | undefined, GetOrgQueryVariables>;
export function useGetOrgSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrgQuery, GetOrgQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrgQuery, GetOrgQueryVariables>(GetOrgDocument, options);
        }
export type GetOrgQueryHookResult = ReturnType<typeof useGetOrgQuery>;
export type GetOrgLazyQueryHookResult = ReturnType<typeof useGetOrgLazyQuery>;
export type GetOrgSuspenseQueryHookResult = ReturnType<typeof useGetOrgSuspenseQuery>;
export type GetOrgQueryResult = Apollo.QueryResult<GetOrgQuery, GetOrgQueryVariables>;
export function refetchGetOrgQuery(variables: GetOrgQueryVariables) {
      return { query: GetOrgDocument, variables: variables }
    }
export const OrgsDocument = gql`
    subscription orgs($userId: uuid!) {
  member(
    where: {userId: {_eq: $userId}, archivedAt: {_is_null: true}, org: {archivedAt: {_is_null: true}}}
  ) {
    org {
      ...Org
      circles(
        where: {parentId: {_is_null: true}, archivedAt: {_is_null: true}}
        limit: 1
      ) {
        ...CircleSummary
      }
    }
  }
}
    ${OrgFragmentDoc}
${CircleSummaryFragmentDoc}
${CircleFragmentDoc}
${RoleSummaryFragmentDoc}`;

/**
 * __useOrgsSubscription__
 *
 * To run a query within a React component, call `useOrgsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOrgsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgsSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useOrgsSubscription(baseOptions: Apollo.SubscriptionHookOptions<OrgsSubscription, OrgsSubscriptionVariables> & ({ variables: OrgsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OrgsSubscription, OrgsSubscriptionVariables>(OrgsDocument, options);
      }
export type OrgsSubscriptionHookResult = ReturnType<typeof useOrgsSubscription>;
export type OrgsSubscriptionResult = Apollo.SubscriptionResult<OrgsSubscription>;
export const OrgDocument = gql`
    subscription org($id: uuid!) {
  org_by_pk(id: $id) {
    ...OrgData
  }
}
    ${OrgDataFragmentDoc}
${OrgFragmentDoc}
${OrgSubscriptionFragmentDoc}
${CircleFragmentDoc}
${CircleMemberFragmentDoc}
${CircleLinkFragmentDoc}
${RoleSummaryFragmentDoc}
${MemberFragmentDoc}`;

/**
 * __useOrgSubscription__
 *
 * To run a query within a React component, call `useOrgSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOrgSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrgSubscription(baseOptions: Apollo.SubscriptionHookOptions<OrgSubscription, OrgSubscriptionVariables> & ({ variables: OrgSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OrgSubscription, OrgSubscriptionVariables>(OrgDocument, options);
      }
export type OrgSubscriptionHookResult = ReturnType<typeof useOrgSubscription>;
export type OrgSubscriptionResult = Apollo.SubscriptionResult<OrgSubscription>;
export const OrgBySlugDocument = gql`
    subscription orgBySlug($slug: String!) {
  org(where: {slug: {_eq: $slug}}, limit: 1) {
    ...OrgData
  }
}
    ${OrgDataFragmentDoc}
${OrgFragmentDoc}
${OrgSubscriptionFragmentDoc}
${CircleFragmentDoc}
${CircleMemberFragmentDoc}
${CircleLinkFragmentDoc}
${RoleSummaryFragmentDoc}
${MemberFragmentDoc}`;

/**
 * __useOrgBySlugSubscription__
 *
 * To run a query within a React component, call `useOrgBySlugSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOrgBySlugSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgBySlugSubscription({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useOrgBySlugSubscription(baseOptions: Apollo.SubscriptionHookOptions<OrgBySlugSubscription, OrgBySlugSubscriptionVariables> & ({ variables: OrgBySlugSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OrgBySlugSubscription, OrgBySlugSubscriptionVariables>(OrgBySlugDocument, options);
      }
export type OrgBySlugSubscriptionHookResult = ReturnType<typeof useOrgBySlugSubscription>;
export type OrgBySlugSubscriptionResult = Apollo.SubscriptionResult<OrgBySlugSubscription>;
export const UpdateOrgDocument = gql`
    mutation updateOrg($id: uuid!, $values: org_set_input!) {
  update_org_by_pk(pk_columns: {id: $id}, _set: $values) {
    id
  }
}
    `;
export type UpdateOrgMutationFn = Apollo.MutationFunction<UpdateOrgMutation, UpdateOrgMutationVariables>;

/**
 * __useUpdateOrgMutation__
 *
 * To run a mutation, you first call `useUpdateOrgMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrgMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrgMutation, { data, loading, error }] = useUpdateOrgMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateOrgMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrgMutation, UpdateOrgMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrgMutation, UpdateOrgMutationVariables>(UpdateOrgDocument, options);
      }
export type UpdateOrgMutationHookResult = ReturnType<typeof useUpdateOrgMutation>;
export type UpdateOrgMutationResult = Apollo.MutationResult<UpdateOrgMutation>;
export type UpdateOrgMutationOptions = Apollo.BaseMutationOptions<UpdateOrgMutation, UpdateOrgMutationVariables>;
export const ThreadProposalVotesDocument = gql`
    subscription threadProposalVotes($activityId: uuid!) {
  thread_proposal_vote(where: {activityId: {_eq: $activityId}}) {
    ...ThreadProposalVote
  }
}
    ${ThreadProposalVoteFragmentDoc}`;

/**
 * __useThreadProposalVotesSubscription__
 *
 * To run a query within a React component, call `useThreadProposalVotesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadProposalVotesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadProposalVotesSubscription({
 *   variables: {
 *      activityId: // value for 'activityId'
 *   },
 * });
 */
export function useThreadProposalVotesSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadProposalVotesSubscription, ThreadProposalVotesSubscriptionVariables> & ({ variables: ThreadProposalVotesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadProposalVotesSubscription, ThreadProposalVotesSubscriptionVariables>(ThreadProposalVotesDocument, options);
      }
export type ThreadProposalVotesSubscriptionHookResult = ReturnType<typeof useThreadProposalVotesSubscription>;
export type ThreadProposalVotesSubscriptionResult = Apollo.SubscriptionResult<ThreadProposalVotesSubscription>;
export const CreateThreadProposalVoteDocument = gql`
    mutation createThreadProposalVote($values: thread_proposal_vote_insert_input!) {
  insert_thread_proposal_vote_one(object: $values) {
    ...ThreadProposalVote
  }
}
    ${ThreadProposalVoteFragmentDoc}`;
export type CreateThreadProposalVoteMutationFn = Apollo.MutationFunction<CreateThreadProposalVoteMutation, CreateThreadProposalVoteMutationVariables>;

/**
 * __useCreateThreadProposalVoteMutation__
 *
 * To run a mutation, you first call `useCreateThreadProposalVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadProposalVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadProposalVoteMutation, { data, loading, error }] = useCreateThreadProposalVoteMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateThreadProposalVoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadProposalVoteMutation, CreateThreadProposalVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadProposalVoteMutation, CreateThreadProposalVoteMutationVariables>(CreateThreadProposalVoteDocument, options);
      }
export type CreateThreadProposalVoteMutationHookResult = ReturnType<typeof useCreateThreadProposalVoteMutation>;
export type CreateThreadProposalVoteMutationResult = Apollo.MutationResult<CreateThreadProposalVoteMutation>;
export type CreateThreadProposalVoteMutationOptions = Apollo.BaseMutationOptions<CreateThreadProposalVoteMutation, CreateThreadProposalVoteMutationVariables>;
export const UpdateThreadProposalVoteDocument = gql`
    mutation updateThreadProposalVote($id: uuid!, $values: thread_proposal_vote_set_input!) {
  update_thread_proposal_vote_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...ThreadProposalVote
  }
}
    ${ThreadProposalVoteFragmentDoc}`;
export type UpdateThreadProposalVoteMutationFn = Apollo.MutationFunction<UpdateThreadProposalVoteMutation, UpdateThreadProposalVoteMutationVariables>;

/**
 * __useUpdateThreadProposalVoteMutation__
 *
 * To run a mutation, you first call `useUpdateThreadProposalVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadProposalVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadProposalVoteMutation, { data, loading, error }] = useUpdateThreadProposalVoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateThreadProposalVoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadProposalVoteMutation, UpdateThreadProposalVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadProposalVoteMutation, UpdateThreadProposalVoteMutationVariables>(UpdateThreadProposalVoteDocument, options);
      }
export type UpdateThreadProposalVoteMutationHookResult = ReturnType<typeof useUpdateThreadProposalVoteMutation>;
export type UpdateThreadProposalVoteMutationResult = Apollo.MutationResult<UpdateThreadProposalVoteMutation>;
export type UpdateThreadProposalVoteMutationOptions = Apollo.BaseMutationOptions<UpdateThreadProposalVoteMutation, UpdateThreadProposalVoteMutationVariables>;
export const GetRoleDocument = gql`
    query getRole($id: uuid!) {
  role_by_pk(id: $id) {
    ...Role
  }
}
    ${RoleFragmentDoc}`;

/**
 * __useGetRoleQuery__
 *
 * To run a query within a React component, call `useGetRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRoleQuery(baseOptions: Apollo.QueryHookOptions<GetRoleQuery, GetRoleQueryVariables> & ({ variables: GetRoleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
      }
export function useGetRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
        }
// @ts-ignore
export function useGetRoleSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>): Apollo.UseSuspenseQueryResult<GetRoleQuery, GetRoleQueryVariables>;
export function useGetRoleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>): Apollo.UseSuspenseQueryResult<GetRoleQuery | undefined, GetRoleQueryVariables>;
export function useGetRoleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoleQuery, GetRoleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoleQuery, GetRoleQueryVariables>(GetRoleDocument, options);
        }
export type GetRoleQueryHookResult = ReturnType<typeof useGetRoleQuery>;
export type GetRoleLazyQueryHookResult = ReturnType<typeof useGetRoleLazyQuery>;
export type GetRoleSuspenseQueryHookResult = ReturnType<typeof useGetRoleSuspenseQuery>;
export type GetRoleQueryResult = Apollo.QueryResult<GetRoleQuery, GetRoleQueryVariables>;
export function refetchGetRoleQuery(variables: GetRoleQueryVariables) {
      return { query: GetRoleDocument, variables: variables }
    }
export const RoleDocument = gql`
    subscription role($id: uuid!) {
  role_by_pk(id: $id) {
    ...Role
  }
}
    ${RoleFragmentDoc}`;

/**
 * __useRoleSubscription__
 *
 * To run a query within a React component, call `useRoleSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRoleSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoleSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRoleSubscription(baseOptions: Apollo.SubscriptionHookOptions<RoleSubscription, RoleSubscriptionVariables> & ({ variables: RoleSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RoleSubscription, RoleSubscriptionVariables>(RoleDocument, options);
      }
export type RoleSubscriptionHookResult = ReturnType<typeof useRoleSubscription>;
export type RoleSubscriptionResult = Apollo.SubscriptionResult<RoleSubscription>;
export const RolesDocument = gql`
    subscription roles($orgId: uuid!, $active: Boolean!) {
  role(
    where: {orgId: {_eq: $orgId}, archivedAt: {_is_null: $active}}
    order_by: {name: asc}
  ) {
    ...Role
  }
}
    ${RoleFragmentDoc}`;

/**
 * __useRolesSubscription__
 *
 * To run a query within a React component, call `useRolesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRolesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRolesSubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useRolesSubscription(baseOptions: Apollo.SubscriptionHookOptions<RolesSubscription, RolesSubscriptionVariables> & ({ variables: RolesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RolesSubscription, RolesSubscriptionVariables>(RolesDocument, options);
      }
export type RolesSubscriptionHookResult = ReturnType<typeof useRolesSubscription>;
export type RolesSubscriptionResult = Apollo.SubscriptionResult<RolesSubscription>;
export const CreateRoleDocument = gql`
    mutation createRole($values: role_insert_input!) {
  insert_role_one(object: $values) {
    ...Role
  }
}
    ${RoleFragmentDoc}`;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation updateRole($id: uuid!, $values: role_set_input!) {
  update_role_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Role
  }
}
    ${RoleFragmentDoc}`;
export type UpdateRoleMutationFn = Apollo.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const ArchiveRoleDocument = gql`
    mutation archiveRole($id: uuid!, $archivedAt: timestamptz!) {
  update_role_by_pk(pk_columns: {id: $id}, _set: {archivedAt: $archivedAt}) {
    id
    archivedAt
  }
}
    `;
export type ArchiveRoleMutationFn = Apollo.MutationFunction<ArchiveRoleMutation, ArchiveRoleMutationVariables>;

/**
 * __useArchiveRoleMutation__
 *
 * To run a mutation, you first call `useArchiveRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveRoleMutation, { data, loading, error }] = useArchiveRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveRoleMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveRoleMutation, ArchiveRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveRoleMutation, ArchiveRoleMutationVariables>(ArchiveRoleDocument, options);
      }
export type ArchiveRoleMutationHookResult = ReturnType<typeof useArchiveRoleMutation>;
export type ArchiveRoleMutationResult = Apollo.MutationResult<ArchiveRoleMutation>;
export type ArchiveRoleMutationOptions = Apollo.BaseMutationOptions<ArchiveRoleMutation, ArchiveRoleMutationVariables>;
export const GetSearchResultsDocument = gql`
    query getSearchResults($membersIds: [uuid!]!, $circlesIds: [uuid!]!, $threadsIds: [uuid!]!, $meetingsIds: [uuid!]!, $tasksIds: [uuid!]!, $decisionsIds: [uuid!]!) {
  member(where: {id: {_in: $membersIds}}) {
    id
    name
    picture
  }
  circle(where: {id: {_in: $circlesIds}}) {
    id
    role {
      name
    }
  }
  thread(where: {id: {_in: $threadsIds}}) {
    id
    circleId
    title
    createdAt
  }
  meeting(where: {id: {_in: $meetingsIds}}) {
    id
    circleId
    title
    startDate
  }
  task(where: {id: {_in: $tasksIds}}) {
    id
    circleId
    title
    dueDate
  }
  decision(where: {id: {_in: $decisionsIds}}) {
    id
    circleId
    title
    createdAt
  }
}
    `;

/**
 * __useGetSearchResultsQuery__
 *
 * To run a query within a React component, call `useGetSearchResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchResultsQuery({
 *   variables: {
 *      membersIds: // value for 'membersIds'
 *      circlesIds: // value for 'circlesIds'
 *      threadsIds: // value for 'threadsIds'
 *      meetingsIds: // value for 'meetingsIds'
 *      tasksIds: // value for 'tasksIds'
 *      decisionsIds: // value for 'decisionsIds'
 *   },
 * });
 */
export function useGetSearchResultsQuery(baseOptions: Apollo.QueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables> & ({ variables: GetSearchResultsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
      }
export function useGetSearchResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
        }
// @ts-ignore
export function useGetSearchResultsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSearchResultsQuery, GetSearchResultsQueryVariables>;
export function useGetSearchResultsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>): Apollo.UseSuspenseQueryResult<GetSearchResultsQuery | undefined, GetSearchResultsQueryVariables>;
export function useGetSearchResultsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
        }
export type GetSearchResultsQueryHookResult = ReturnType<typeof useGetSearchResultsQuery>;
export type GetSearchResultsLazyQueryHookResult = ReturnType<typeof useGetSearchResultsLazyQuery>;
export type GetSearchResultsSuspenseQueryHookResult = ReturnType<typeof useGetSearchResultsSuspenseQuery>;
export type GetSearchResultsQueryResult = Apollo.QueryResult<GetSearchResultsQuery, GetSearchResultsQueryVariables>;
export function refetchGetSearchResultsQuery(variables: GetSearchResultsQueryVariables) {
      return { query: GetSearchResultsDocument, variables: variables }
    }
export const AdminGrowthDocument = gql`
    query AdminGrowth($since: timestamptz!) {
  org(
    where: {createdAt: {_gte: $since}, archivedAt: {_is_null: true}}
    order_by: {createdAt: asc}
  ) {
    createdAt
  }
  users(where: {createdAt: {_gte: $since}}, order_by: {createdAt: asc}) {
    createdAt
  }
  org_aggregate(where: {createdAt: {_lt: $since}, archivedAt: {_is_null: true}}) {
    aggregate {
      count
    }
  }
  usersAggregate(where: {createdAt: {_lt: $since}}) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useAdminGrowthQuery__
 *
 * To run a query within a React component, call `useAdminGrowthQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminGrowthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminGrowthQuery({
 *   variables: {
 *      since: // value for 'since'
 *   },
 * });
 */
export function useAdminGrowthQuery(baseOptions: Apollo.QueryHookOptions<AdminGrowthQuery, AdminGrowthQueryVariables> & ({ variables: AdminGrowthQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminGrowthQuery, AdminGrowthQueryVariables>(AdminGrowthDocument, options);
      }
export function useAdminGrowthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminGrowthQuery, AdminGrowthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminGrowthQuery, AdminGrowthQueryVariables>(AdminGrowthDocument, options);
        }
// @ts-ignore
export function useAdminGrowthSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminGrowthQuery, AdminGrowthQueryVariables>): Apollo.UseSuspenseQueryResult<AdminGrowthQuery, AdminGrowthQueryVariables>;
export function useAdminGrowthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminGrowthQuery, AdminGrowthQueryVariables>): Apollo.UseSuspenseQueryResult<AdminGrowthQuery | undefined, AdminGrowthQueryVariables>;
export function useAdminGrowthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminGrowthQuery, AdminGrowthQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminGrowthQuery, AdminGrowthQueryVariables>(AdminGrowthDocument, options);
        }
export type AdminGrowthQueryHookResult = ReturnType<typeof useAdminGrowthQuery>;
export type AdminGrowthLazyQueryHookResult = ReturnType<typeof useAdminGrowthLazyQuery>;
export type AdminGrowthSuspenseQueryHookResult = ReturnType<typeof useAdminGrowthSuspenseQuery>;
export type AdminGrowthQueryResult = Apollo.QueryResult<AdminGrowthQuery, AdminGrowthQueryVariables>;
export function refetchAdminGrowthQuery(variables: AdminGrowthQueryVariables) {
      return { query: AdminGrowthDocument, variables: variables }
    }
export const AdminOrgDocument = gql`
    query AdminOrg($id: uuid!) {
  org_by_pk(id: $id) {
    id
    name
    slug
    createdAt
    archivedAt
    org_subscription {
      id
      status
      type
      createdAt
      stripeCustomerId
      stripeSubscriptionId
    }
    members(where: {archivedAt: {_is_null: true}}, order_by: {name: asc}) {
      id
      name
      role
      inviteEmail
      user {
        id
        displayName
        email
        lastSeen
      }
    }
    circles_aggregate(where: {archivedAt: {_is_null: true}}) {
      aggregate {
        count
      }
    }
  }
}
    `;

/**
 * __useAdminOrgQuery__
 *
 * To run a query within a React component, call `useAdminOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOrgQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminOrgQuery(baseOptions: Apollo.QueryHookOptions<AdminOrgQuery, AdminOrgQueryVariables> & ({ variables: AdminOrgQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminOrgQuery, AdminOrgQueryVariables>(AdminOrgDocument, options);
      }
export function useAdminOrgLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminOrgQuery, AdminOrgQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminOrgQuery, AdminOrgQueryVariables>(AdminOrgDocument, options);
        }
// @ts-ignore
export function useAdminOrgSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminOrgQuery, AdminOrgQueryVariables>): Apollo.UseSuspenseQueryResult<AdminOrgQuery, AdminOrgQueryVariables>;
export function useAdminOrgSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminOrgQuery, AdminOrgQueryVariables>): Apollo.UseSuspenseQueryResult<AdminOrgQuery | undefined, AdminOrgQueryVariables>;
export function useAdminOrgSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminOrgQuery, AdminOrgQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminOrgQuery, AdminOrgQueryVariables>(AdminOrgDocument, options);
        }
export type AdminOrgQueryHookResult = ReturnType<typeof useAdminOrgQuery>;
export type AdminOrgLazyQueryHookResult = ReturnType<typeof useAdminOrgLazyQuery>;
export type AdminOrgSuspenseQueryHookResult = ReturnType<typeof useAdminOrgSuspenseQuery>;
export type AdminOrgQueryResult = Apollo.QueryResult<AdminOrgQuery, AdminOrgQueryVariables>;
export function refetchAdminOrgQuery(variables: AdminOrgQueryVariables) {
      return { query: AdminOrgDocument, variables: variables }
    }
export const AdminOrgsDocument = gql`
    query AdminOrgs($limit: Int!, $offset: Int!, $search: String!, $active: Boolean!) {
  org(
    limit: $limit
    offset: $offset
    where: {name: {_ilike: $search}, archivedAt: {_is_null: $active}}
    order_by: {createdAt: desc}
  ) {
    id
    name
    slug
    createdAt
    archivedAt
    org_subscription {
      id
      status
      type
    }
    members_aggregate {
      aggregate {
        count
      }
    }
  }
  org_aggregate(where: {name: {_ilike: $search}, archivedAt: {_is_null: $active}}) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useAdminOrgsQuery__
 *
 * To run a query within a React component, call `useAdminOrgsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOrgsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOrgsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      search: // value for 'search'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useAdminOrgsQuery(baseOptions: Apollo.QueryHookOptions<AdminOrgsQuery, AdminOrgsQueryVariables> & ({ variables: AdminOrgsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminOrgsQuery, AdminOrgsQueryVariables>(AdminOrgsDocument, options);
      }
export function useAdminOrgsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminOrgsQuery, AdminOrgsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminOrgsQuery, AdminOrgsQueryVariables>(AdminOrgsDocument, options);
        }
// @ts-ignore
export function useAdminOrgsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminOrgsQuery, AdminOrgsQueryVariables>): Apollo.UseSuspenseQueryResult<AdminOrgsQuery, AdminOrgsQueryVariables>;
export function useAdminOrgsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminOrgsQuery, AdminOrgsQueryVariables>): Apollo.UseSuspenseQueryResult<AdminOrgsQuery | undefined, AdminOrgsQueryVariables>;
export function useAdminOrgsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminOrgsQuery, AdminOrgsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminOrgsQuery, AdminOrgsQueryVariables>(AdminOrgsDocument, options);
        }
export type AdminOrgsQueryHookResult = ReturnType<typeof useAdminOrgsQuery>;
export type AdminOrgsLazyQueryHookResult = ReturnType<typeof useAdminOrgsLazyQuery>;
export type AdminOrgsSuspenseQueryHookResult = ReturnType<typeof useAdminOrgsSuspenseQuery>;
export type AdminOrgsQueryResult = Apollo.QueryResult<AdminOrgsQuery, AdminOrgsQueryVariables>;
export function refetchAdminOrgsQuery(variables: AdminOrgsQueryVariables) {
      return { query: AdminOrgsDocument, variables: variables }
    }
export const AdminStatsDocument = gql`
    query AdminStats($dauSince: timestamptz!, $mauSince: timestamptz!) {
  org_aggregate(where: {archivedAt: {_is_null: true}}) {
    aggregate {
      count
    }
  }
  usersAggregate {
    aggregate {
      count
    }
  }
  dau: usersAggregate(where: {lastSeen: {_gte: $dauSince}}) {
    aggregate {
      count
    }
  }
  mau: usersAggregate(where: {lastSeen: {_gte: $mauSince}}) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useAdminStatsQuery__
 *
 * To run a query within a React component, call `useAdminStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminStatsQuery({
 *   variables: {
 *      dauSince: // value for 'dauSince'
 *      mauSince: // value for 'mauSince'
 *   },
 * });
 */
export function useAdminStatsQuery(baseOptions: Apollo.QueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables> & ({ variables: AdminStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminStatsQuery, AdminStatsQueryVariables>(AdminStatsDocument, options);
      }
export function useAdminStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminStatsQuery, AdminStatsQueryVariables>(AdminStatsDocument, options);
        }
// @ts-ignore
export function useAdminStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>): Apollo.UseSuspenseQueryResult<AdminStatsQuery, AdminStatsQueryVariables>;
export function useAdminStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>): Apollo.UseSuspenseQueryResult<AdminStatsQuery | undefined, AdminStatsQueryVariables>;
export function useAdminStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminStatsQuery, AdminStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminStatsQuery, AdminStatsQueryVariables>(AdminStatsDocument, options);
        }
export type AdminStatsQueryHookResult = ReturnType<typeof useAdminStatsQuery>;
export type AdminStatsLazyQueryHookResult = ReturnType<typeof useAdminStatsLazyQuery>;
export type AdminStatsSuspenseQueryHookResult = ReturnType<typeof useAdminStatsSuspenseQuery>;
export type AdminStatsQueryResult = Apollo.QueryResult<AdminStatsQuery, AdminStatsQueryVariables>;
export function refetchAdminStatsQuery(variables: AdminStatsQueryVariables) {
      return { query: AdminStatsDocument, variables: variables }
    }
export const AdminUserDocument = gql`
    query AdminUser($id: uuid!) {
  user(id: $id) {
    id
    displayName
    email
    emailVerified
    avatarUrl
    locale
    createdAt
    lastSeen
    disabled
    members(order_by: {createdAt: desc}) {
      id
      name
      role
      archivedAt
      org {
        id
        name
        slug
        archivedAt
        org_subscription {
          id
          status
          type
        }
      }
    }
  }
}
    `;

/**
 * __useAdminUserQuery__
 *
 * To run a query within a React component, call `useAdminUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminUserQuery(baseOptions: Apollo.QueryHookOptions<AdminUserQuery, AdminUserQueryVariables> & ({ variables: AdminUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminUserQuery, AdminUserQueryVariables>(AdminUserDocument, options);
      }
export function useAdminUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminUserQuery, AdminUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminUserQuery, AdminUserQueryVariables>(AdminUserDocument, options);
        }
// @ts-ignore
export function useAdminUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminUserQuery, AdminUserQueryVariables>): Apollo.UseSuspenseQueryResult<AdminUserQuery, AdminUserQueryVariables>;
export function useAdminUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminUserQuery, AdminUserQueryVariables>): Apollo.UseSuspenseQueryResult<AdminUserQuery | undefined, AdminUserQueryVariables>;
export function useAdminUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminUserQuery, AdminUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminUserQuery, AdminUserQueryVariables>(AdminUserDocument, options);
        }
export type AdminUserQueryHookResult = ReturnType<typeof useAdminUserQuery>;
export type AdminUserLazyQueryHookResult = ReturnType<typeof useAdminUserLazyQuery>;
export type AdminUserSuspenseQueryHookResult = ReturnType<typeof useAdminUserSuspenseQuery>;
export type AdminUserQueryResult = Apollo.QueryResult<AdminUserQuery, AdminUserQueryVariables>;
export function refetchAdminUserQuery(variables: AdminUserQueryVariables) {
      return { query: AdminUserDocument, variables: variables }
    }
export const AdminUsersDocument = gql`
    query AdminUsers($limit: Int!, $offset: Int!, $search: String!, $searchCitext: citext!) {
  users(
    limit: $limit
    offset: $offset
    where: {_or: [{displayName: {_ilike: $search}}, {email: {_ilike: $searchCitext}}]}
    order_by: {createdAt: desc}
  ) {
    id
    displayName
    email
    avatarUrl
    createdAt
    lastSeen
    disabled
    members_aggregate {
      aggregate {
        count
      }
    }
  }
  usersAggregate(
    where: {_or: [{displayName: {_ilike: $search}}, {email: {_ilike: $searchCitext}}]}
  ) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useAdminUsersQuery__
 *
 * To run a query within a React component, call `useAdminUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      search: // value for 'search'
 *      searchCitext: // value for 'searchCitext'
 *   },
 * });
 */
export function useAdminUsersQuery(baseOptions: Apollo.QueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables> & ({ variables: AdminUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options);
      }
export function useAdminUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options);
        }
// @ts-ignore
export function useAdminUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>): Apollo.UseSuspenseQueryResult<AdminUsersQuery, AdminUsersQueryVariables>;
export function useAdminUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>): Apollo.UseSuspenseQueryResult<AdminUsersQuery | undefined, AdminUsersQueryVariables>;
export function useAdminUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options);
        }
export type AdminUsersQueryHookResult = ReturnType<typeof useAdminUsersQuery>;
export type AdminUsersLazyQueryHookResult = ReturnType<typeof useAdminUsersLazyQuery>;
export type AdminUsersSuspenseQueryHookResult = ReturnType<typeof useAdminUsersSuspenseQuery>;
export type AdminUsersQueryResult = Apollo.QueryResult<AdminUsersQuery, AdminUsersQueryVariables>;
export function refetchAdminUsersQuery(variables: AdminUsersQueryVariables) {
      return { query: AdminUsersDocument, variables: variables }
    }
export const GetTaskDocument = gql`
    query getTask($id: uuid!) {
  task_by_pk(id: $id) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useGetTaskQuery__
 *
 * To run a query within a React component, call `useGetTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTaskQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTaskQuery(baseOptions: Apollo.QueryHookOptions<GetTaskQuery, GetTaskQueryVariables> & ({ variables: GetTaskQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTaskQuery, GetTaskQueryVariables>(GetTaskDocument, options);
      }
export function useGetTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTaskQuery, GetTaskQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTaskQuery, GetTaskQueryVariables>(GetTaskDocument, options);
        }
// @ts-ignore
export function useGetTaskSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTaskQuery, GetTaskQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaskQuery, GetTaskQueryVariables>;
export function useGetTaskSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskQuery, GetTaskQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaskQuery | undefined, GetTaskQueryVariables>;
export function useGetTaskSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskQuery, GetTaskQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTaskQuery, GetTaskQueryVariables>(GetTaskDocument, options);
        }
export type GetTaskQueryHookResult = ReturnType<typeof useGetTaskQuery>;
export type GetTaskLazyQueryHookResult = ReturnType<typeof useGetTaskLazyQuery>;
export type GetTaskSuspenseQueryHookResult = ReturnType<typeof useGetTaskSuspenseQuery>;
export type GetTaskQueryResult = Apollo.QueryResult<GetTaskQuery, GetTaskQueryVariables>;
export function refetchGetTaskQuery(variables: GetTaskQueryVariables) {
      return { query: GetTaskDocument, variables: variables }
    }
export const TaskDocument = gql`
    subscription task($id: uuid!) {
  task_by_pk(id: $id) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useTaskSubscription__
 *
 * To run a query within a React component, call `useTaskSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTaskSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaskSubscription(baseOptions: Apollo.SubscriptionHookOptions<TaskSubscription, TaskSubscriptionVariables> & ({ variables: TaskSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TaskSubscription, TaskSubscriptionVariables>(TaskDocument, options);
      }
export type TaskSubscriptionHookResult = ReturnType<typeof useTaskSubscription>;
export type TaskSubscriptionResult = Apollo.SubscriptionResult<TaskSubscription>;
export const TaskThreadsDocument = gql`
    query taskThreads($taskId: uuid!) {
  thread_activity(
    where: {refTaskId: {_eq: $taskId}, archivedAt: {_is_null: true}}
    order_by: {createdAt: asc}
  ) {
    id
    thread {
      ...Thread
    }
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}`;

/**
 * __useTaskThreadsQuery__
 *
 * To run a query within a React component, call `useTaskThreadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskThreadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskThreadsQuery({
 *   variables: {
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useTaskThreadsQuery(baseOptions: Apollo.QueryHookOptions<TaskThreadsQuery, TaskThreadsQueryVariables> & ({ variables: TaskThreadsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TaskThreadsQuery, TaskThreadsQueryVariables>(TaskThreadsDocument, options);
      }
export function useTaskThreadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskThreadsQuery, TaskThreadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TaskThreadsQuery, TaskThreadsQueryVariables>(TaskThreadsDocument, options);
        }
// @ts-ignore
export function useTaskThreadsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TaskThreadsQuery, TaskThreadsQueryVariables>): Apollo.UseSuspenseQueryResult<TaskThreadsQuery, TaskThreadsQueryVariables>;
export function useTaskThreadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TaskThreadsQuery, TaskThreadsQueryVariables>): Apollo.UseSuspenseQueryResult<TaskThreadsQuery | undefined, TaskThreadsQueryVariables>;
export function useTaskThreadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TaskThreadsQuery, TaskThreadsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TaskThreadsQuery, TaskThreadsQueryVariables>(TaskThreadsDocument, options);
        }
export type TaskThreadsQueryHookResult = ReturnType<typeof useTaskThreadsQuery>;
export type TaskThreadsLazyQueryHookResult = ReturnType<typeof useTaskThreadsLazyQuery>;
export type TaskThreadsSuspenseQueryHookResult = ReturnType<typeof useTaskThreadsSuspenseQuery>;
export type TaskThreadsQueryResult = Apollo.QueryResult<TaskThreadsQuery, TaskThreadsQueryVariables>;
export function refetchTaskThreadsQuery(variables: TaskThreadsQueryVariables) {
      return { query: TaskThreadsDocument, variables: variables }
    }
export const TasksDocument = gql`
    subscription tasks($orgId: uuid!, $filters: [task_bool_exp!]!, $taskViewKey: String!) {
  org_by_pk(id: $orgId) {
    tasks(where: {_and: $filters}) {
      ...Task
    }
    task_views(where: {key: {_eq: $taskViewKey}}) {
      ...TaskView
    }
  }
}
    ${TaskFragmentDoc}
${TaskViewFragmentDoc}`;

/**
 * __useTasksSubscription__
 *
 * To run a query within a React component, call `useTasksSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTasksSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTasksSubscription({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      filters: // value for 'filters'
 *      taskViewKey: // value for 'taskViewKey'
 *   },
 * });
 */
export function useTasksSubscription(baseOptions: Apollo.SubscriptionHookOptions<TasksSubscription, TasksSubscriptionVariables> & ({ variables: TasksSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TasksSubscription, TasksSubscriptionVariables>(TasksDocument, options);
      }
export type TasksSubscriptionHookResult = ReturnType<typeof useTasksSubscription>;
export type TasksSubscriptionResult = Apollo.SubscriptionResult<TasksSubscription>;
export const CreateTaskDocument = gql`
    mutation createTask($values: task_insert_input!) {
  insert_task_one(object: $values) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation updateTask($id: uuid!, $values: task_set_input!) {
  update_task_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const ArchiveTaskDocument = gql`
    mutation archiveTask($id: uuid!, $archivedAt: timestamptz!) {
  update_task_by_pk(pk_columns: {id: $id}, _set: {archivedAt: $archivedAt}) {
    id
  }
}
    `;
export type ArchiveTaskMutationFn = Apollo.MutationFunction<ArchiveTaskMutation, ArchiveTaskMutationVariables>;

/**
 * __useArchiveTaskMutation__
 *
 * To run a mutation, you first call `useArchiveTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveTaskMutation, { data, loading, error }] = useArchiveTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveTaskMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveTaskMutation, ArchiveTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveTaskMutation, ArchiveTaskMutationVariables>(ArchiveTaskDocument, options);
      }
export type ArchiveTaskMutationHookResult = ReturnType<typeof useArchiveTaskMutation>;
export type ArchiveTaskMutationResult = Apollo.MutationResult<ArchiveTaskMutation>;
export type ArchiveTaskMutationOptions = Apollo.BaseMutationOptions<ArchiveTaskMutation, ArchiveTaskMutationVariables>;
export const CreateTaskViewDocument = gql`
    mutation createTaskView($orgId: uuid!, $key: String!, $tasksIds: json) {
  insert_task_view_one(object: {orgId: $orgId, key: $key, tasksIds: $tasksIds}) {
    ...TaskView
  }
}
    ${TaskViewFragmentDoc}`;
export type CreateTaskViewMutationFn = Apollo.MutationFunction<CreateTaskViewMutation, CreateTaskViewMutationVariables>;

/**
 * __useCreateTaskViewMutation__
 *
 * To run a mutation, you first call `useCreateTaskViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskViewMutation, { data, loading, error }] = useCreateTaskViewMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      key: // value for 'key'
 *      tasksIds: // value for 'tasksIds'
 *   },
 * });
 */
export function useCreateTaskViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskViewMutation, CreateTaskViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskViewMutation, CreateTaskViewMutationVariables>(CreateTaskViewDocument, options);
      }
export type CreateTaskViewMutationHookResult = ReturnType<typeof useCreateTaskViewMutation>;
export type CreateTaskViewMutationResult = Apollo.MutationResult<CreateTaskViewMutation>;
export type CreateTaskViewMutationOptions = Apollo.BaseMutationOptions<CreateTaskViewMutation, CreateTaskViewMutationVariables>;
export const UpdateTaskViewDocument = gql`
    mutation updateTaskView($orgId: uuid!, $key: String!, $tasksIds: json) {
  update_task_view(
    where: {orgId: {_eq: $orgId}, key: {_eq: $key}}
    _set: {tasksIds: $tasksIds}
  ) {
    returning {
      ...TaskView
    }
  }
}
    ${TaskViewFragmentDoc}`;
export type UpdateTaskViewMutationFn = Apollo.MutationFunction<UpdateTaskViewMutation, UpdateTaskViewMutationVariables>;

/**
 * __useUpdateTaskViewMutation__
 *
 * To run a mutation, you first call `useUpdateTaskViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskViewMutation, { data, loading, error }] = useUpdateTaskViewMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      key: // value for 'key'
 *      tasksIds: // value for 'tasksIds'
 *   },
 * });
 */
export function useUpdateTaskViewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskViewMutation, UpdateTaskViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskViewMutation, UpdateTaskViewMutationVariables>(UpdateTaskViewDocument, options);
      }
export type UpdateTaskViewMutationHookResult = ReturnType<typeof useUpdateTaskViewMutation>;
export type UpdateTaskViewMutationResult = Apollo.MutationResult<UpdateTaskViewMutation>;
export type UpdateTaskViewMutationOptions = Apollo.BaseMutationOptions<UpdateTaskViewMutation, UpdateTaskViewMutationVariables>;
export const GetCircleThreadsIdsDocument = gql`
    query getCircleThreadsIds($circleId: uuid!) {
  thread(
    where: {circleId: {_eq: $circleId}, status: {_neq: Closed}, archivedAt: {_is_null: true}}
  ) {
    id
  }
}
    `;

/**
 * __useGetCircleThreadsIdsQuery__
 *
 * To run a query within a React component, call `useGetCircleThreadsIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCircleThreadsIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCircleThreadsIdsQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useGetCircleThreadsIdsQuery(baseOptions: Apollo.QueryHookOptions<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables> & ({ variables: GetCircleThreadsIdsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>(GetCircleThreadsIdsDocument, options);
      }
export function useGetCircleThreadsIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>(GetCircleThreadsIdsDocument, options);
        }
// @ts-ignore
export function useGetCircleThreadsIdsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>;
export function useGetCircleThreadsIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>): Apollo.UseSuspenseQueryResult<GetCircleThreadsIdsQuery | undefined, GetCircleThreadsIdsQueryVariables>;
export function useGetCircleThreadsIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>(GetCircleThreadsIdsDocument, options);
        }
export type GetCircleThreadsIdsQueryHookResult = ReturnType<typeof useGetCircleThreadsIdsQuery>;
export type GetCircleThreadsIdsLazyQueryHookResult = ReturnType<typeof useGetCircleThreadsIdsLazyQuery>;
export type GetCircleThreadsIdsSuspenseQueryHookResult = ReturnType<typeof useGetCircleThreadsIdsSuspenseQuery>;
export type GetCircleThreadsIdsQueryResult = Apollo.QueryResult<GetCircleThreadsIdsQuery, GetCircleThreadsIdsQueryVariables>;
export function refetchGetCircleThreadsIdsQuery(variables: GetCircleThreadsIdsQueryVariables) {
      return { query: GetCircleThreadsIdsDocument, variables: variables }
    }
export const GetThreadDocument = gql`
    query getThread($id: uuid!) {
  thread_by_pk(id: $id) {
    ...Thread
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}`;

/**
 * __useGetThreadQuery__
 *
 * To run a query within a React component, call `useGetThreadQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetThreadQuery(baseOptions: Apollo.QueryHookOptions<GetThreadQuery, GetThreadQueryVariables> & ({ variables: GetThreadQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadQuery, GetThreadQueryVariables>(GetThreadDocument, options);
      }
export function useGetThreadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadQuery, GetThreadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadQuery, GetThreadQueryVariables>(GetThreadDocument, options);
        }
// @ts-ignore
export function useGetThreadSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetThreadQuery, GetThreadQueryVariables>): Apollo.UseSuspenseQueryResult<GetThreadQuery, GetThreadQueryVariables>;
export function useGetThreadSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetThreadQuery, GetThreadQueryVariables>): Apollo.UseSuspenseQueryResult<GetThreadQuery | undefined, GetThreadQueryVariables>;
export function useGetThreadSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetThreadQuery, GetThreadQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetThreadQuery, GetThreadQueryVariables>(GetThreadDocument, options);
        }
export type GetThreadQueryHookResult = ReturnType<typeof useGetThreadQuery>;
export type GetThreadLazyQueryHookResult = ReturnType<typeof useGetThreadLazyQuery>;
export type GetThreadSuspenseQueryHookResult = ReturnType<typeof useGetThreadSuspenseQuery>;
export type GetThreadQueryResult = Apollo.QueryResult<GetThreadQuery, GetThreadQueryVariables>;
export function refetchGetThreadQuery(variables: GetThreadQueryVariables) {
      return { query: GetThreadDocument, variables: variables }
    }
export const ThreadDocument = gql`
    subscription thread($id: uuid!, $memberId: uuid!) {
  thread_by_pk(id: $id) {
    ...Thread
    member_status(where: {memberId: {_eq: $memberId}}, limit: 1) {
      ...ThreadMemberStatus
    }
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${ThreadMemberStatusFragmentDoc}`;

/**
 * __useThreadSubscription__
 *
 * To run a query within a React component, call `useThreadSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadSubscription({
 *   variables: {
 *      id: // value for 'id'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useThreadSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadSubscription, ThreadSubscriptionVariables> & ({ variables: ThreadSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadSubscription, ThreadSubscriptionVariables>(ThreadDocument, options);
      }
export type ThreadSubscriptionHookResult = ReturnType<typeof useThreadSubscription>;
export type ThreadSubscriptionResult = Apollo.SubscriptionResult<ThreadSubscription>;
export const ThreadsDocument = gql`
    subscription threads($filters: [thread_bool_exp!], $memberId: uuid!) {
  thread(where: {_and: $filters}) {
    ...Thread
    lastActivity: activities(
      where: {archivedAt: {_is_null: true}}
      order_by: {createdAt: desc}
      limit: 1
    ) {
      id
      createdAt
    }
    member_status(where: {memberId: {_eq: $memberId}}, limit: 1) {
      ...ThreadMemberStatus
    }
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${ThreadMemberStatusFragmentDoc}`;

/**
 * __useThreadsSubscription__
 *
 * To run a query within a React component, call `useThreadsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadsSubscription({
 *   variables: {
 *      filters: // value for 'filters'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useThreadsSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadsSubscription, ThreadsSubscriptionVariables> & ({ variables: ThreadsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadsSubscription, ThreadsSubscriptionVariables>(ThreadsDocument, options);
      }
export type ThreadsSubscriptionHookResult = ReturnType<typeof useThreadsSubscription>;
export type ThreadsSubscriptionResult = Apollo.SubscriptionResult<ThreadsSubscription>;
export const CircleThreadsDocument = gql`
    subscription circleThreads($circleId: uuid!) {
  thread(
    where: {circleId: {_eq: $circleId}, status: {_neq: Closed}, archivedAt: {_is_null: true}}
  ) {
    ...Thread
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}`;

/**
 * __useCircleThreadsSubscription__
 *
 * To run a query within a React component, call `useCircleThreadsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCircleThreadsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCircleThreadsSubscription({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useCircleThreadsSubscription(baseOptions: Apollo.SubscriptionHookOptions<CircleThreadsSubscription, CircleThreadsSubscriptionVariables> & ({ variables: CircleThreadsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CircleThreadsSubscription, CircleThreadsSubscriptionVariables>(CircleThreadsDocument, options);
      }
export type CircleThreadsSubscriptionHookResult = ReturnType<typeof useCircleThreadsSubscription>;
export type CircleThreadsSubscriptionResult = Apollo.SubscriptionResult<CircleThreadsSubscription>;
export const ThreadsWithMeetingNoteDocument = gql`
    subscription threadsWithMeetingNote($threadsIds: [uuid!]!, $meetingId: uuid!) {
  thread(where: {id: {_in: $threadsIds}}) {
    ...Thread
    activities(
      where: {_and: {type: {_eq: MeetingNote}, refMeetingId: {_eq: $meetingId}}, archivedAt: {_is_null: true}}
    ) {
      ...ThreadActivity
    }
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${ThreadActivityFragmentDoc}
${ThreadActivityMemberFragmentDoc}
${ThreadActivityReactionFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${TaskFragmentDoc}
${DecisionFragmentDoc}`;

/**
 * __useThreadsWithMeetingNoteSubscription__
 *
 * To run a query within a React component, call `useThreadsWithMeetingNoteSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadsWithMeetingNoteSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadsWithMeetingNoteSubscription({
 *   variables: {
 *      threadsIds: // value for 'threadsIds'
 *      meetingId: // value for 'meetingId'
 *   },
 * });
 */
export function useThreadsWithMeetingNoteSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadsWithMeetingNoteSubscription, ThreadsWithMeetingNoteSubscriptionVariables> & ({ variables: ThreadsWithMeetingNoteSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadsWithMeetingNoteSubscription, ThreadsWithMeetingNoteSubscriptionVariables>(ThreadsWithMeetingNoteDocument, options);
      }
export type ThreadsWithMeetingNoteSubscriptionHookResult = ReturnType<typeof useThreadsWithMeetingNoteSubscription>;
export type ThreadsWithMeetingNoteSubscriptionResult = Apollo.SubscriptionResult<ThreadsWithMeetingNoteSubscription>;
export const CreateThreadDocument = gql`
    mutation createThread($values: thread_insert_input!) {
  insert_thread_one(object: $values) {
    ...Thread
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}`;
export type CreateThreadMutationFn = Apollo.MutationFunction<CreateThreadMutation, CreateThreadMutationVariables>;

/**
 * __useCreateThreadMutation__
 *
 * To run a mutation, you first call `useCreateThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadMutation, { data, loading, error }] = useCreateThreadMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateThreadMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadMutation, CreateThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadMutation, CreateThreadMutationVariables>(CreateThreadDocument, options);
      }
export type CreateThreadMutationHookResult = ReturnType<typeof useCreateThreadMutation>;
export type CreateThreadMutationResult = Apollo.MutationResult<CreateThreadMutation>;
export type CreateThreadMutationOptions = Apollo.BaseMutationOptions<CreateThreadMutation, CreateThreadMutationVariables>;
export const UpdateThreadDocument = gql`
    mutation updateThread($id: uuid!, $values: thread_set_input!) {
  update_thread_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...Thread
  }
}
    ${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}`;
export type UpdateThreadMutationFn = Apollo.MutationFunction<UpdateThreadMutation, UpdateThreadMutationVariables>;

/**
 * __useUpdateThreadMutation__
 *
 * To run a mutation, you first call `useUpdateThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadMutation, { data, loading, error }] = useUpdateThreadMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateThreadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadMutation, UpdateThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadMutation, UpdateThreadMutationVariables>(UpdateThreadDocument, options);
      }
export type UpdateThreadMutationHookResult = ReturnType<typeof useUpdateThreadMutation>;
export type UpdateThreadMutationResult = Apollo.MutationResult<UpdateThreadMutation>;
export type UpdateThreadMutationOptions = Apollo.BaseMutationOptions<UpdateThreadMutation, UpdateThreadMutationVariables>;
export const ArchiveThreadDocument = gql`
    mutation archiveThread($id: uuid!, $archivedAt: timestamptz!) {
  update_thread_by_pk(pk_columns: {id: $id}, _set: {archivedAt: $archivedAt}) {
    id
  }
}
    `;
export type ArchiveThreadMutationFn = Apollo.MutationFunction<ArchiveThreadMutation, ArchiveThreadMutationVariables>;

/**
 * __useArchiveThreadMutation__
 *
 * To run a mutation, you first call `useArchiveThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveThreadMutation, { data, loading, error }] = useArchiveThreadMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveThreadMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveThreadMutation, ArchiveThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveThreadMutation, ArchiveThreadMutationVariables>(ArchiveThreadDocument, options);
      }
export type ArchiveThreadMutationHookResult = ReturnType<typeof useArchiveThreadMutation>;
export type ArchiveThreadMutationResult = Apollo.MutationResult<ArchiveThreadMutation>;
export type ArchiveThreadMutationOptions = Apollo.BaseMutationOptions<ArchiveThreadMutation, ArchiveThreadMutationVariables>;
export const ThreadActivitiesDocument = gql`
    subscription threadActivities($id: uuid!) {
  thread_by_pk(id: $id) {
    activities(where: {archivedAt: {_is_null: true}}) {
      ...ThreadActivity
    }
  }
}
    ${ThreadActivityFragmentDoc}
${ThreadActivityMemberFragmentDoc}
${ThreadActivityReactionFragmentDoc}
${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${TaskFragmentDoc}
${DecisionFragmentDoc}`;

/**
 * __useThreadActivitiesSubscription__
 *
 * To run a query within a React component, call `useThreadActivitiesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadActivitiesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadActivitiesSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useThreadActivitiesSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadActivitiesSubscription, ThreadActivitiesSubscriptionVariables> & ({ variables: ThreadActivitiesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadActivitiesSubscription, ThreadActivitiesSubscriptionVariables>(ThreadActivitiesDocument, options);
      }
export type ThreadActivitiesSubscriptionHookResult = ReturnType<typeof useThreadActivitiesSubscription>;
export type ThreadActivitiesSubscriptionResult = Apollo.SubscriptionResult<ThreadActivitiesSubscription>;
export const CreateThreadActivityDocument = gql`
    mutation createThreadActivity($values: thread_activity_insert_input!) {
  insert_thread_activity_one(object: $values) {
    ...ThreadActivity
  }
}
    ${ThreadActivityFragmentDoc}
${ThreadActivityMemberFragmentDoc}
${ThreadActivityReactionFragmentDoc}
${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${TaskFragmentDoc}
${DecisionFragmentDoc}`;
export type CreateThreadActivityMutationFn = Apollo.MutationFunction<CreateThreadActivityMutation, CreateThreadActivityMutationVariables>;

/**
 * __useCreateThreadActivityMutation__
 *
 * To run a mutation, you first call `useCreateThreadActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadActivityMutation, { data, loading, error }] = useCreateThreadActivityMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateThreadActivityMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadActivityMutation, CreateThreadActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadActivityMutation, CreateThreadActivityMutationVariables>(CreateThreadActivityDocument, options);
      }
export type CreateThreadActivityMutationHookResult = ReturnType<typeof useCreateThreadActivityMutation>;
export type CreateThreadActivityMutationResult = Apollo.MutationResult<CreateThreadActivityMutation>;
export type CreateThreadActivityMutationOptions = Apollo.BaseMutationOptions<CreateThreadActivityMutation, CreateThreadActivityMutationVariables>;
export const UpdateThreadActivityDocument = gql`
    mutation updateThreadActivity($id: uuid!, $values: thread_activity_set_input!) {
  update_thread_activity_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...ThreadActivity
  }
}
    ${ThreadActivityFragmentDoc}
${ThreadActivityMemberFragmentDoc}
${ThreadActivityReactionFragmentDoc}
${ThreadFragmentDoc}
${ThreadExtraMemberFragmentDoc}
${MeetingSummaryFragmentDoc}
${MeetingAttendeeFragmentDoc}
${TaskFragmentDoc}
${DecisionFragmentDoc}`;
export type UpdateThreadActivityMutationFn = Apollo.MutationFunction<UpdateThreadActivityMutation, UpdateThreadActivityMutationVariables>;

/**
 * __useUpdateThreadActivityMutation__
 *
 * To run a mutation, you first call `useUpdateThreadActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadActivityMutation, { data, loading, error }] = useUpdateThreadActivityMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateThreadActivityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadActivityMutation, UpdateThreadActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadActivityMutation, UpdateThreadActivityMutationVariables>(UpdateThreadActivityDocument, options);
      }
export type UpdateThreadActivityMutationHookResult = ReturnType<typeof useUpdateThreadActivityMutation>;
export type UpdateThreadActivityMutationResult = Apollo.MutationResult<UpdateThreadActivityMutation>;
export type UpdateThreadActivityMutationOptions = Apollo.BaseMutationOptions<UpdateThreadActivityMutation, UpdateThreadActivityMutationVariables>;
export const ArchiveThreadActivityDocument = gql`
    mutation archiveThreadActivity($id: uuid!, $archivedAt: timestamptz!) {
  update_thread_activity_by_pk(
    pk_columns: {id: $id}
    _set: {archivedAt: $archivedAt}
  ) {
    id
  }
}
    `;
export type ArchiveThreadActivityMutationFn = Apollo.MutationFunction<ArchiveThreadActivityMutation, ArchiveThreadActivityMutationVariables>;

/**
 * __useArchiveThreadActivityMutation__
 *
 * To run a mutation, you first call `useArchiveThreadActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveThreadActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveThreadActivityMutation, { data, loading, error }] = useArchiveThreadActivityMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archivedAt: // value for 'archivedAt'
 *   },
 * });
 */
export function useArchiveThreadActivityMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveThreadActivityMutation, ArchiveThreadActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveThreadActivityMutation, ArchiveThreadActivityMutationVariables>(ArchiveThreadActivityDocument, options);
      }
export type ArchiveThreadActivityMutationHookResult = ReturnType<typeof useArchiveThreadActivityMutation>;
export type ArchiveThreadActivityMutationResult = Apollo.MutationResult<ArchiveThreadActivityMutation>;
export type ArchiveThreadActivityMutationOptions = Apollo.BaseMutationOptions<ArchiveThreadActivityMutation, ArchiveThreadActivityMutationVariables>;
export const CreateThreadActivityReactionDocument = gql`
    mutation createThreadActivityReaction($values: thread_activity_reaction_insert_input!) {
  insert_thread_activity_reaction_one(object: $values) {
    ...ThreadActivityReaction
  }
}
    ${ThreadActivityReactionFragmentDoc}
${ThreadActivityMemberFragmentDoc}`;
export type CreateThreadActivityReactionMutationFn = Apollo.MutationFunction<CreateThreadActivityReactionMutation, CreateThreadActivityReactionMutationVariables>;

/**
 * __useCreateThreadActivityReactionMutation__
 *
 * To run a mutation, you first call `useCreateThreadActivityReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadActivityReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadActivityReactionMutation, { data, loading, error }] = useCreateThreadActivityReactionMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateThreadActivityReactionMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadActivityReactionMutation, CreateThreadActivityReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadActivityReactionMutation, CreateThreadActivityReactionMutationVariables>(CreateThreadActivityReactionDocument, options);
      }
export type CreateThreadActivityReactionMutationHookResult = ReturnType<typeof useCreateThreadActivityReactionMutation>;
export type CreateThreadActivityReactionMutationResult = Apollo.MutationResult<CreateThreadActivityReactionMutation>;
export type CreateThreadActivityReactionMutationOptions = Apollo.BaseMutationOptions<CreateThreadActivityReactionMutation, CreateThreadActivityReactionMutationVariables>;
export const DeleteThreadActivityReactionDocument = gql`
    mutation deleteThreadActivityReaction($id: uuid!) {
  delete_thread_activity_reaction_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteThreadActivityReactionMutationFn = Apollo.MutationFunction<DeleteThreadActivityReactionMutation, DeleteThreadActivityReactionMutationVariables>;

/**
 * __useDeleteThreadActivityReactionMutation__
 *
 * To run a mutation, you first call `useDeleteThreadActivityReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThreadActivityReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThreadActivityReactionMutation, { data, loading, error }] = useDeleteThreadActivityReactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteThreadActivityReactionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThreadActivityReactionMutation, DeleteThreadActivityReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThreadActivityReactionMutation, DeleteThreadActivityReactionMutationVariables>(DeleteThreadActivityReactionDocument, options);
      }
export type DeleteThreadActivityReactionMutationHookResult = ReturnType<typeof useDeleteThreadActivityReactionMutation>;
export type DeleteThreadActivityReactionMutationResult = Apollo.MutationResult<DeleteThreadActivityReactionMutation>;
export type DeleteThreadActivityReactionMutationOptions = Apollo.BaseMutationOptions<DeleteThreadActivityReactionMutation, DeleteThreadActivityReactionMutationVariables>;
export const CreateThreadExtraMemberDocument = gql`
    mutation createThreadExtraMember($values: thread_extra_member_insert_input!) {
  insert_thread_extra_member_one(object: $values) {
    ...ThreadExtraMember
  }
}
    ${ThreadExtraMemberFragmentDoc}`;
export type CreateThreadExtraMemberMutationFn = Apollo.MutationFunction<CreateThreadExtraMemberMutation, CreateThreadExtraMemberMutationVariables>;

/**
 * __useCreateThreadExtraMemberMutation__
 *
 * To run a mutation, you first call `useCreateThreadExtraMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadExtraMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadExtraMemberMutation, { data, loading, error }] = useCreateThreadExtraMemberMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateThreadExtraMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadExtraMemberMutation, CreateThreadExtraMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadExtraMemberMutation, CreateThreadExtraMemberMutationVariables>(CreateThreadExtraMemberDocument, options);
      }
export type CreateThreadExtraMemberMutationHookResult = ReturnType<typeof useCreateThreadExtraMemberMutation>;
export type CreateThreadExtraMemberMutationResult = Apollo.MutationResult<CreateThreadExtraMemberMutation>;
export type CreateThreadExtraMemberMutationOptions = Apollo.BaseMutationOptions<CreateThreadExtraMemberMutation, CreateThreadExtraMemberMutationVariables>;
export const UpdateThreadExtraMemberDocument = gql`
    mutation updateThreadExtraMember($id: uuid!, $values: thread_extra_member_set_input!) {
  update_thread_extra_member_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...ThreadExtraMember
  }
}
    ${ThreadExtraMemberFragmentDoc}`;
export type UpdateThreadExtraMemberMutationFn = Apollo.MutationFunction<UpdateThreadExtraMemberMutation, UpdateThreadExtraMemberMutationVariables>;

/**
 * __useUpdateThreadExtraMemberMutation__
 *
 * To run a mutation, you first call `useUpdateThreadExtraMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadExtraMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadExtraMemberMutation, { data, loading, error }] = useUpdateThreadExtraMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateThreadExtraMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadExtraMemberMutation, UpdateThreadExtraMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadExtraMemberMutation, UpdateThreadExtraMemberMutationVariables>(UpdateThreadExtraMemberDocument, options);
      }
export type UpdateThreadExtraMemberMutationHookResult = ReturnType<typeof useUpdateThreadExtraMemberMutation>;
export type UpdateThreadExtraMemberMutationResult = Apollo.MutationResult<UpdateThreadExtraMemberMutation>;
export type UpdateThreadExtraMemberMutationOptions = Apollo.BaseMutationOptions<UpdateThreadExtraMemberMutation, UpdateThreadExtraMemberMutationVariables>;
export const DeleteThreadExtraMemberDocument = gql`
    mutation deleteThreadExtraMember($id: uuid!) {
  delete_thread_extra_member_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteThreadExtraMemberMutationFn = Apollo.MutationFunction<DeleteThreadExtraMemberMutation, DeleteThreadExtraMemberMutationVariables>;

/**
 * __useDeleteThreadExtraMemberMutation__
 *
 * To run a mutation, you first call `useDeleteThreadExtraMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThreadExtraMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThreadExtraMemberMutation, { data, loading, error }] = useDeleteThreadExtraMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteThreadExtraMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThreadExtraMemberMutation, DeleteThreadExtraMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThreadExtraMemberMutation, DeleteThreadExtraMemberMutationVariables>(DeleteThreadExtraMemberDocument, options);
      }
export type DeleteThreadExtraMemberMutationHookResult = ReturnType<typeof useDeleteThreadExtraMemberMutation>;
export type DeleteThreadExtraMemberMutationResult = Apollo.MutationResult<DeleteThreadExtraMemberMutation>;
export type DeleteThreadExtraMemberMutationOptions = Apollo.BaseMutationOptions<DeleteThreadExtraMemberMutation, DeleteThreadExtraMemberMutationVariables>;
export const UpsertThreadMemberStatusDocument = gql`
    mutation upsertThreadMemberStatus($values: thread_member_status_insert_input!) {
  insert_thread_member_status_one(
    object: $values
    on_conflict: {constraint: thread_member_status_threadId_memberId_key, update_columns: [lastReadActivityId, lastReadDate]}
  ) {
    ...ThreadMemberStatus
  }
}
    ${ThreadMemberStatusFragmentDoc}`;
export type UpsertThreadMemberStatusMutationFn = Apollo.MutationFunction<UpsertThreadMemberStatusMutation, UpsertThreadMemberStatusMutationVariables>;

/**
 * __useUpsertThreadMemberStatusMutation__
 *
 * To run a mutation, you first call `useUpsertThreadMemberStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertThreadMemberStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertThreadMemberStatusMutation, { data, loading, error }] = useUpsertThreadMemberStatusMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpsertThreadMemberStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpsertThreadMemberStatusMutation, UpsertThreadMemberStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertThreadMemberStatusMutation, UpsertThreadMemberStatusMutationVariables>(UpsertThreadMemberStatusDocument, options);
      }
export type UpsertThreadMemberStatusMutationHookResult = ReturnType<typeof useUpsertThreadMemberStatusMutation>;
export type UpsertThreadMemberStatusMutationResult = Apollo.MutationResult<UpsertThreadMemberStatusMutation>;
export type UpsertThreadMemberStatusMutationOptions = Apollo.BaseMutationOptions<UpsertThreadMemberStatusMutation, UpsertThreadMemberStatusMutationVariables>;
export const ThreadPollAnswersDocument = gql`
    subscription threadPollAnswers($activityId: uuid!) {
  thread_poll_answer(where: {activityId: {_eq: $activityId}}) {
    ...ThreadPollAnswer
  }
}
    ${ThreadPollAnswerFragmentDoc}
${ThreadActivityMemberFragmentDoc}`;

/**
 * __useThreadPollAnswersSubscription__
 *
 * To run a query within a React component, call `useThreadPollAnswersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadPollAnswersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadPollAnswersSubscription({
 *   variables: {
 *      activityId: // value for 'activityId'
 *   },
 * });
 */
export function useThreadPollAnswersSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadPollAnswersSubscription, ThreadPollAnswersSubscriptionVariables> & ({ variables: ThreadPollAnswersSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadPollAnswersSubscription, ThreadPollAnswersSubscriptionVariables>(ThreadPollAnswersDocument, options);
      }
export type ThreadPollAnswersSubscriptionHookResult = ReturnType<typeof useThreadPollAnswersSubscription>;
export type ThreadPollAnswersSubscriptionResult = Apollo.SubscriptionResult<ThreadPollAnswersSubscription>;
export const CreateThreadPollAnswerDocument = gql`
    mutation createThreadPollAnswer($values: thread_poll_answer_insert_input!) {
  insert_thread_poll_answer_one(object: $values) {
    ...ThreadPollAnswer
  }
}
    ${ThreadPollAnswerFragmentDoc}
${ThreadActivityMemberFragmentDoc}`;
export type CreateThreadPollAnswerMutationFn = Apollo.MutationFunction<CreateThreadPollAnswerMutation, CreateThreadPollAnswerMutationVariables>;

/**
 * __useCreateThreadPollAnswerMutation__
 *
 * To run a mutation, you first call `useCreateThreadPollAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadPollAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadPollAnswerMutation, { data, loading, error }] = useCreateThreadPollAnswerMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCreateThreadPollAnswerMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadPollAnswerMutation, CreateThreadPollAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadPollAnswerMutation, CreateThreadPollAnswerMutationVariables>(CreateThreadPollAnswerDocument, options);
      }
export type CreateThreadPollAnswerMutationHookResult = ReturnType<typeof useCreateThreadPollAnswerMutation>;
export type CreateThreadPollAnswerMutationResult = Apollo.MutationResult<CreateThreadPollAnswerMutation>;
export type CreateThreadPollAnswerMutationOptions = Apollo.BaseMutationOptions<CreateThreadPollAnswerMutation, CreateThreadPollAnswerMutationVariables>;
export const UpdateThreadPollAnswerDocument = gql`
    mutation updateThreadPollAnswer($id: uuid!, $values: thread_poll_answer_set_input!) {
  update_thread_poll_answer_by_pk(pk_columns: {id: $id}, _set: $values) {
    ...ThreadPollAnswer
  }
}
    ${ThreadPollAnswerFragmentDoc}
${ThreadActivityMemberFragmentDoc}`;
export type UpdateThreadPollAnswerMutationFn = Apollo.MutationFunction<UpdateThreadPollAnswerMutation, UpdateThreadPollAnswerMutationVariables>;

/**
 * __useUpdateThreadPollAnswerMutation__
 *
 * To run a mutation, you first call `useUpdateThreadPollAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadPollAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadPollAnswerMutation, { data, loading, error }] = useUpdateThreadPollAnswerMutation({
 *   variables: {
 *      id: // value for 'id'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUpdateThreadPollAnswerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadPollAnswerMutation, UpdateThreadPollAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadPollAnswerMutation, UpdateThreadPollAnswerMutationVariables>(UpdateThreadPollAnswerDocument, options);
      }
export type UpdateThreadPollAnswerMutationHookResult = ReturnType<typeof useUpdateThreadPollAnswerMutation>;
export type UpdateThreadPollAnswerMutationResult = Apollo.MutationResult<UpdateThreadPollAnswerMutation>;
export type UpdateThreadPollAnswerMutationOptions = Apollo.BaseMutationOptions<UpdateThreadPollAnswerMutation, UpdateThreadPollAnswerMutationVariables>;
export const DeleteThreadPollAnswersDocument = gql`
    mutation deleteThreadPollAnswers($activityId: uuid!) {
  delete_thread_poll_answer(where: {activityId: {_eq: $activityId}}) {
    returning {
      id
    }
  }
}
    `;
export type DeleteThreadPollAnswersMutationFn = Apollo.MutationFunction<DeleteThreadPollAnswersMutation, DeleteThreadPollAnswersMutationVariables>;

/**
 * __useDeleteThreadPollAnswersMutation__
 *
 * To run a mutation, you first call `useDeleteThreadPollAnswersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThreadPollAnswersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThreadPollAnswersMutation, { data, loading, error }] = useDeleteThreadPollAnswersMutation({
 *   variables: {
 *      activityId: // value for 'activityId'
 *   },
 * });
 */
export function useDeleteThreadPollAnswersMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThreadPollAnswersMutation, DeleteThreadPollAnswersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThreadPollAnswersMutation, DeleteThreadPollAnswersMutationVariables>(DeleteThreadPollAnswersDocument, options);
      }
export type DeleteThreadPollAnswersMutationHookResult = ReturnType<typeof useDeleteThreadPollAnswersMutation>;
export type DeleteThreadPollAnswersMutationResult = Apollo.MutationResult<DeleteThreadPollAnswersMutation>;
export type DeleteThreadPollAnswersMutationOptions = Apollo.BaseMutationOptions<DeleteThreadPollAnswersMutation, DeleteThreadPollAnswersMutationVariables>;
export const AccountDeletionMembersDocument = gql`
    subscription AccountDeletionMembers($userId: uuid!) {
  member(
    where: {userId: {_eq: $userId}, archivedAt: {_is_null: true}, org: {archivedAt: {_is_null: true}}}
    order_by: {org: {name: asc}}
  ) {
    id
    role
    org {
      id
      name
      slug
    }
  }
}
    `;

/**
 * __useAccountDeletionMembersSubscription__
 *
 * To run a query within a React component, call `useAccountDeletionMembersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAccountDeletionMembersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountDeletionMembersSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAccountDeletionMembersSubscription(baseOptions: Apollo.SubscriptionHookOptions<AccountDeletionMembersSubscription, AccountDeletionMembersSubscriptionVariables> & ({ variables: AccountDeletionMembersSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<AccountDeletionMembersSubscription, AccountDeletionMembersSubscriptionVariables>(AccountDeletionMembersDocument, options);
      }
export type AccountDeletionMembersSubscriptionHookResult = ReturnType<typeof useAccountDeletionMembersSubscription>;
export type AccountDeletionMembersSubscriptionResult = Apollo.SubscriptionResult<AccountDeletionMembersSubscription>;
export const ChangeDisplayNameDocument = gql`
    mutation changeDisplayName($userId: uuid!, $displayName: String!) {
  updateUser(pk_columns: {id: $userId}, _set: {displayName: $displayName}) {
    id
    displayName
  }
}
    `;
export type ChangeDisplayNameMutationFn = Apollo.MutationFunction<ChangeDisplayNameMutation, ChangeDisplayNameMutationVariables>;

/**
 * __useChangeDisplayNameMutation__
 *
 * To run a mutation, you first call `useChangeDisplayNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeDisplayNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeDisplayNameMutation, { data, loading, error }] = useChangeDisplayNameMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      displayName: // value for 'displayName'
 *   },
 * });
 */
export function useChangeDisplayNameMutation(baseOptions?: Apollo.MutationHookOptions<ChangeDisplayNameMutation, ChangeDisplayNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeDisplayNameMutation, ChangeDisplayNameMutationVariables>(ChangeDisplayNameDocument, options);
      }
export type ChangeDisplayNameMutationHookResult = ReturnType<typeof useChangeDisplayNameMutation>;
export type ChangeDisplayNameMutationResult = Apollo.MutationResult<ChangeDisplayNameMutation>;
export type ChangeDisplayNameMutationOptions = Apollo.BaseMutationOptions<ChangeDisplayNameMutation, ChangeDisplayNameMutationVariables>;
export const ChangeLocaleDocument = gql`
    mutation changeLocale($userId: uuid!, $locale: String!) {
  updateUser(pk_columns: {id: $userId}, _set: {locale: $locale}) {
    id
    locale
  }
}
    `;
export type ChangeLocaleMutationFn = Apollo.MutationFunction<ChangeLocaleMutation, ChangeLocaleMutationVariables>;

/**
 * __useChangeLocaleMutation__
 *
 * To run a mutation, you first call `useChangeLocaleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeLocaleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeLocaleMutation, { data, loading, error }] = useChangeLocaleMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      locale: // value for 'locale'
 *   },
 * });
 */
export function useChangeLocaleMutation(baseOptions?: Apollo.MutationHookOptions<ChangeLocaleMutation, ChangeLocaleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeLocaleMutation, ChangeLocaleMutationVariables>(ChangeLocaleDocument, options);
      }
export type ChangeLocaleMutationHookResult = ReturnType<typeof useChangeLocaleMutation>;
export type ChangeLocaleMutationResult = Apollo.MutationResult<ChangeLocaleMutation>;
export type ChangeLocaleMutationOptions = Apollo.BaseMutationOptions<ChangeLocaleMutation, ChangeLocaleMutationVariables>;
export const ChangeMetadataDocument = gql`
    mutation changeMetadata($userId: uuid!, $metadata: jsonb!) {
  updateUser(pk_columns: {id: $userId}, _set: {metadata: $metadata}) {
    id
    metadata
  }
}
    `;
export type ChangeMetadataMutationFn = Apollo.MutationFunction<ChangeMetadataMutation, ChangeMetadataMutationVariables>;

/**
 * __useChangeMetadataMutation__
 *
 * To run a mutation, you first call `useChangeMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeMetadataMutation, { data, loading, error }] = useChangeMetadataMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      metadata: // value for 'metadata'
 *   },
 * });
 */
export function useChangeMetadataMutation(baseOptions?: Apollo.MutationHookOptions<ChangeMetadataMutation, ChangeMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeMetadataMutation, ChangeMetadataMutationVariables>(ChangeMetadataDocument, options);
      }
export type ChangeMetadataMutationHookResult = ReturnType<typeof useChangeMetadataMutation>;
export type ChangeMetadataMutationResult = Apollo.MutationResult<ChangeMetadataMutation>;
export type ChangeMetadataMutationOptions = Apollo.BaseMutationOptions<ChangeMetadataMutation, ChangeMetadataMutationVariables>;