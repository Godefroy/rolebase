/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import { MeetingStepConfig, VideoConf } from '@rolebase/shared/model/meeting'
import { MeetingStepData } from '@rolebase/shared/model/meeting_step'
import { ParticipantsScope } from '@rolebase/shared/model/participants'
import { LogDisplay, EntitiesChanges } from '@rolebase/shared/model/log'
import { UserMetadata } from '@rolebase/shared/model/user'

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

/** input type for inserting data into table "role_ai" */
export type Role_Ai_Insert_Input = {
  accountabilities?: string | null | undefined;
  checklist?: string | null | undefined;
  domain?: string | null | undefined;
  id?: string | null | undefined;
  indicators?: string | null | undefined;
  lang?: string | null | undefined;
  name?: string | null | undefined;
  notes?: string | null | undefined;
  purpose?: string | null | undefined;
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

/** input type for updating data in table "user_app" */
export type User_App_Set_Input = {
  archivedAt?: string | null | undefined;
  config?: any;
  createdAt?: any;
  id?: string | null | undefined;
  secretConfig?: any;
  tmpData?: any;
  type?: App_Type_Enum | null | undefined;
  userId?: string | null | undefined;
};

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

export type GetMeetingContentQueryVariables = Exact<{
  meetingId: string;
}>;


export type GetMeetingContentQuery = { meeting_by_pk: { orgId: string, title: string, stepsConfig: Array<MeetingStepConfig>, circle: { role: { name: string } }, steps: Array<{ stepConfigId: string, type: Meeting_Step_Type_Enum, data: MeetingStepData, notes: string }> } | null };

export type GetThreadsWithMeetingNotesQueryVariables = Exact<{
  meetingId: string;
  threadsIds: Array<string> | string;
}>;


export type GetThreadsWithMeetingNotesQuery = { thread: Array<{ title: string, activities: Array<{ type: Thread_Activity_Type_Enum, data: any }> }> };

export type GetRoleAiQueryVariables = Exact<{
  name: string;
  lang: string;
}>;


export type GetRoleAiQuery = { role_ai: Array<{ id: string, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string }> };

export type InsertRoleAiMutationVariables = Exact<{
  role: Role_Ai_Insert_Input;
}>;


export type InsertRoleAiMutation = { insert_role_ai_one: { id: string, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string } | null };

export type UpdateUserAppMutationVariables = Exact<{
  id: string;
  values: User_App_Set_Input;
}>;


export type UpdateUserAppMutation = { update_user_app_by_pk: { id: string } | null };

export type ArchiveUserAppMutationVariables = Exact<{
  id: string;
  archivedAt: string;
}>;


export type ArchiveUserAppMutation = { update_user_app: { affected_rows: number } | null };

export type GetUserAppQueryVariables = Exact<{
  id: string;
}>;


export type GetUserAppQuery = { user_app_by_pk: { id: string, userId: string, type: App_Type_Enum, secretConfig: any, config: any, tmpData: any, createdAt: any, user: { metadata: UserMetadata } | null } | null };

export type GetUserForAppNotificationQueryVariables = Exact<{
  userId: string;
}>;


export type GetUserForAppNotificationQuery = { users: Array<{ id: string, email: string | null, displayName: string, locale: string }> };

export type GetOrgMeetingsForCalendarAppQueryVariables = Exact<{
  orgId: string;
  userId: string;
  afterDate: string;
}>;


export type GetOrgMeetingsForCalendarAppQuery = { org_by_pk: { id: string, name: string, slug: string | null, members: Array<{ id: string, name: string }>, meetings: Array<{ createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, circle: { role: { name: string } }, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> }>, meetings_recurring: Array<{ id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, meetings: Array<{ recurringDate: string | null }>, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } }> } | null };

export type GetMeetingForCalendarAppQueryVariables = Exact<{
  meetingId: string;
  userId: string;
}>;


export type GetMeetingForCalendarAppQuery = { meeting_by_pk: { createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, circle: { role: { name: string } }, org: { id: string, name: string, slug: string | null, members: Array<{ id: string, name: string }> }, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null };

export type GetMeetingRecurringForCalendarAppQueryVariables = Exact<{
  meetingId: string;
  userId: string;
}>;


export type GetMeetingRecurringForCalendarAppQuery = { meeting_recurring_by_pk: { id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, meetings: Array<{ recurringDate: string | null }>, org: { id: string, name: string, slug: string | null, members: Array<{ id: string, name: string }>, meetings: Array<{ recurringDate: string | null }> }, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } } | null };

export type CreateMeetingForCalendarAppMutationVariables = Exact<{
  meeting: Meeting_Insert_Input;
}>;


export type CreateMeetingForCalendarAppMutation = { insert_meeting_one: { id: string } | null };

export type UpdateMeetingForCalendarAppMutationVariables = Exact<{
  meetingId: string;
  values: Meeting_Set_Input;
}>;


export type UpdateMeetingForCalendarAppMutation = { update_meeting_by_pk: { id: string } | null };

export type DeleteMeetingForCalendarAppMutationVariables = Exact<{
  meetingId: string;
}>;


export type DeleteMeetingForCalendarAppMutation = { delete_meeting_by_pk: { id: string } | null };

export type CreateUserAppMutationVariables = Exact<{
  values: User_App_Insert_Input;
}>;


export type CreateUserAppMutation = { insert_user_app_one: { id: string } | null };

export type GetCircleOrgForArchiveQueryVariables = Exact<{
  id: string;
}>;


export type GetCircleOrgForArchiveQuery = { circle_by_pk: { id: string, orgId: string, parentId: string | null, archivedAt: string | null } | null };

export type GetCircleOrgForRestoreQueryVariables = Exact<{
  id: string;
}>;


export type GetCircleOrgForRestoreQuery = { circle_by_pk: { id: string, orgId: string, parentId: string | null, archivedAt: string | null } | null };

export type RestoreCircleCascadeMutationVariables = Exact<{
  circlesIds: Array<string> | string;
  rolesIds: Array<string> | string;
  archivedAt: string;
}>;


export type RestoreCircleCascadeMutation = { update_circle: { affected_rows: number } | null, update_role: { affected_rows: number } | null, update_circle_member: { affected_rows: number } | null, update_circle_link: { affected_rows: number } | null, update_meeting: { affected_rows: number } | null, update_thread: { affected_rows: number } | null, update_task: { affected_rows: number } | null, update_decision: { affected_rows: number } | null, update_meeting_recurring: { affected_rows: number } | null };

export type InsertCircleArchiveLogMutationVariables = Exact<{
  values: Log_Insert_Input;
}>;


export type InsertCircleArchiveLogMutation = { insert_log_one: { id: string } | null };

export type CancelCircleArchiveLogMutationVariables = Exact<{
  id: string;
}>;


export type CancelCircleArchiveLogMutation = { update_log_by_pk: { id: string } | null };

export type GetCircleArchiveLogsInRangeQueryVariables = Exact<{
  orgId: string;
  from: string;
  to: string;
}>;


export type GetCircleArchiveLogsInRangeQuery = { log: Array<{ id: string, memberId: string, memberName: string, display: LogDisplay, changes: EntitiesChanges, cancelLogId: string | null }> };

export type ArchiveCircleCascadeMutationVariables = Exact<{
  circlesIds: Array<string> | string;
  rolesIds: Array<string> | string;
  archivedAt: string;
}>;


export type ArchiveCircleCascadeMutation = { update_circle: { returning: Array<{ archivedAt: string | null }> } | null, update_role: { affected_rows: number } | null, update_circle_member: { affected_rows: number } | null, update_circle_link: { affected_rows: number } | null, update_meeting: { affected_rows: number } | null, update_thread: { affected_rows: number } | null, update_task: { affected_rows: number } | null, update_decision: { affected_rows: number } | null, update_meeting_recurring: { affected_rows: number } | null };

export type GetRecurringMeetingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecurringMeetingsQuery = { meeting_recurring: Array<{ id: string, rrule: string, meetings: Array<{ recurringDate: string | null }> }> };

export type GetRecurringMeetingQueryVariables = Exact<{
  id: string;
}>;


export type GetRecurringMeetingQuery = { meeting_recurring_by_pk: { orgId: string, circleId: string, scope: ParticipantsScope, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, template: { title: string, stepsConfig: Array<MeetingStepConfig> } } | null };

export type CreateMeetingMutationVariables = Exact<{
  meeting: Meeting_Insert_Input;
}>;


export type CreateMeetingMutation = { insert_meeting_one: { id: string } | null };

export type EndOldMeetingsMutationVariables = Exact<{
  before: string;
}>;


export type EndOldMeetingsMutation = { update_meeting: { returning: Array<{ id: string }> } | null };

export type GetExpiredArchivedOrgsQueryVariables = Exact<{
  before: string;
  failedIds: Array<string> | string;
  limit: number;
}>;


export type GetExpiredArchivedOrgsQuery = { org: Array<{ id: string, name: string }> };

export type GetPendingInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPendingInvitationsQuery = { member: Array<{ id: string, name: string, inviteDate: string | null, inviteEmail: string | null, org: { id: string, name: string, members: Array<{ id: string, name: string, picture: string | null, user: { locale: string } | null }>, joinedMembers: Array<{ user: { email: string | null } | null }> } }> };

export type GetProposalsForCronQueryVariables = Exact<{
  type: Thread_Activity_Type_Enum;
}>;


export type GetProposalsForCronQuery = { thread_activity: Array<{ id: string, data: any }> };

export type GetUsersForDigestQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersForDigestQuery = { users: Array<{ id: string, createdAt: string, displayName: string, email: string | null, locale: string, metadata: UserMetadata }> };

export type GetUserDigestDataQueryVariables = Exact<{
  userId: string;
  date: string;
}>;


export type GetUserDigestDataQuery = { user: { metadata: UserMetadata } | null, member: Array<{ id: string, org: { id: string, name: string, archivedAt: string | null, createdAt: string, slug: string | null, shareOrg: boolean, shareMembers: boolean, governanceMode: Governance_Mode_Enum, defaultGraphView: CirclesGraphViews, defaultGraphFolded: boolean, defaultGraphMembers: boolean, icon: string | null, homeNote: string | null, onboardingOrgType: string | null, onboardingTodo: string | null, threads: Array<{ id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, circle: { id: string, role: { name: string, colorHue: number | null } }, activities: Array<{ id: string, threadId: string, userId: string, createdAt: string, type: Thread_Activity_Type_Enum, data: any, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null, reactions: Array<{ id: string, userId: string, shortcode: string, member: { id: string, userId: string | null, name: string, picture: string | null, archivedAt: string | null } | null }>, refThread: { id: string, orgId: string, circleId: string, initiatorMemberId: string, title: string, createdAt: string, archivedAt: string | null, pinned: boolean, status: Thread_Status_Enum, private: boolean, extra_members: Array<{ id: string, threadId: string, memberId: string }> } | null, refMeeting: { id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, refTask: { id: string, orgId: string, circleId: string, memberId: string | null, title: string, description: string, archivedAt: string | null, createdAt: string, dueDate: string | null, status: Task_Status_Enum, private: boolean } | null, refDecision: { id: string, orgId: string, circleId: string, memberId: string, title: string, description: string, archivedAt: string | null, createdAt: string, private: boolean } | null }>, extra_members: Array<{ id: string, threadId: string, memberId: string }> }>, meetings: Array<{ id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, circle: { id: string, role: { name: string, colorHue: number | null } }, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> }> } }> };

export type GetUsersWithoutOrgQueryVariables = Exact<{
  from: string;
  to: string;
}>;


export type GetUsersWithoutOrgQuery = { users: Array<{ id: string, email: string | null, displayName: string, locale: string, metadata: UserMetadata }> };

export type GetOrgsWithoutSetupQueryVariables = Exact<{
  from: string;
  to: string;
}>;


export type GetOrgsWithoutSetupQuery = { org: Array<{ id: string, name: string, slug: string | null, members: Array<{ user: { id: string, email: string | null, displayName: string, locale: string, metadata: UserMetadata } | null }> }> };

export type GetOrgsWithoutInviteQueryVariables = Exact<{
  from: string;
  to: string;
}>;


export type GetOrgsWithoutInviteQuery = { org: Array<{ id: string, name: string, slug: string | null, members_aggregate: { aggregate: { count: number } | null }, members: Array<{ user: { id: string, email: string | null, displayName: string, locale: string, metadata: UserMetadata } | null }> }> };

export type GetOrgForDeletionQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgForDeletionQuery = { org_by_pk: { id: string, name: string, slug: string | null } | null };

export type GetOrgsDeletionCountsQueryVariables = Exact<{
  orgIds: Array<string> | string;
}>;


export type GetOrgsDeletionCountsQuery = { members: { aggregate: { count: number } | null }, users: { aggregate: { count: number } | null }, roles: { aggregate: { count: number } | null }, circles: { aggregate: { count: number } | null }, meetings: { aggregate: { count: number } | null }, threads: { aggregate: { count: number } | null }, messages: { aggregate: { count: number } | null }, tasks: { aggregate: { count: number } | null }, decisions: { aggregate: { count: number } | null }, logs: { aggregate: { count: number } | null } };

export type GetOrgsSubscriptionsForDeletionQueryVariables = Exact<{
  orgIds: Array<string> | string;
}>;


export type GetOrgsSubscriptionsForDeletionQuery = { org_subscription: Array<{ orgId: string, type: Subscription_Plan_Type_Enum, status: Subscription_Payment_Status_Enum, stripeSubscriptionId: string | null }> };

export type GetOrgsFilesForDeletionQueryVariables = Exact<{
  orgIds: Array<string> | string;
}>;


export type GetOrgsFilesForDeletionQuery = { org: Array<{ iconFileId: string | null, homeNote: string | null }>, member: Array<{ pictureFileId: string | null, description: string }>, org_file: Array<{ fileId: string }>, thread_activity: Array<{ data: any }>, meeting_step: Array<{ notes: string }>, meeting: Array<{ summary: string }>, task: Array<{ description: string }>, decision: Array<{ description: string }>, role: Array<{ purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string }> };

export type GetUnsharedFilesForDeletionQueryVariables = Exact<{
  orgIds: Array<string> | string;
  fileIds: Array<string> | string;
}>;


export type GetUnsharedFilesForDeletionQuery = { files: Array<{ id: string }> };

export type DeleteOrgsMutationVariables = Exact<{
  orgIds: Array<string> | string;
}>;


export type DeleteOrgsMutation = { delete_thread_activity: { affected_rows: number } | null, delete_task: { affected_rows: number } | null, delete_decision: { affected_rows: number } | null, delete_org_file: { affected_rows: number } | null, delete_org_subscription: { affected_rows: number } | null, delete_org: { affected_rows: number } | null };

export type GetUserForDeletionQueryVariables = Exact<{
  userId: string;
}>;


export type GetUserForDeletionQuery = { user: { id: string, email: string | null, displayName: string } | null };

export type GetMembersForUserDeletionQueryVariables = Exact<{
  where: Member_Bool_Exp;
}>;


export type GetMembersForUserDeletionQuery = { member: Array<{ id: string, orgId: string, userId: string | null, name: string, role: Member_Role_Enum | null, archivedAt: string | null, org: { name: string, slug: string | null, archivedAt: string | null } }> };

export type GetOrgSharingForUserDeletionQueryVariables = Exact<{
  orgId: string;
  userId: string;
  memberIds: Array<string> | string;
}>;


export type GetOrgSharingForUserDeletionQuery = { others: { aggregate: { count: number } | null }, owners: { aggregate: { count: number } | null }, logs: { aggregate: { count: number } | null }, messages: { aggregate: { count: number } | null } };

export type GetSharedContentForUserDeletionQueryVariables = Exact<{
  userId: string;
  deletedOrgIds: Array<string> | string;
}>;


export type GetSharedContentForUserDeletionQuery = { messages: { aggregate: { count: number } | null }, reactions: { aggregate: { count: number } | null }, votes: { aggregate: { count: number } | null }, pollAnswers: { aggregate: { count: number } | null }, logs: { aggregate: { count: number } | null } };

export type GetAccountDataForUserDeletionQueryVariables = Exact<{
  userId: string;
}>;


export type GetAccountDataForUserDeletionQuery = { apiKeys: { aggregate: { count: number } | null }, apps: { aggregate: { count: number } | null } };

export type GetUploadedFilesForUserDeletionQueryVariables = Exact<{
  userId: string;
  deletedOrgIds: Array<string> | string;
}>;


export type GetUploadedFilesForUserDeletionQuery = { files: Array<{ id: string }> };

export type EraseAccountForUserDeletionMutationVariables = Exact<{
  userId: string;
  sharedMemberIds: Array<string> | string;
}>;


export type EraseAccountForUserDeletionMutation = { update_member: { affected_rows: number } | null, delete_user_app: { affected_rows: number } | null, delete_api_key: { affected_rows: number } | null, deleteAuthRefreshTokens: { affected_rows: number } | null, deleteAuthUserProviders: { affected_rows: number } | null, deleteAuthUserSecurityKeys: { affected_rows: number } | null, deleteAuthOauth2AuthRequests: { affected_rows: number } | null, deleteAuthOauth2RefreshTokens: { affected_rows: number } | null, updateFiles: { affected_rows: number } | null, updateUser: { id: string } | null };

export type DeleteUserForUserDeletionMutationVariables = Exact<{
  userId: string;
}>;


export type DeleteUserForUserDeletionMutation = { deleteUser: { id: string } | null };

export type GetOrgMeetingsForIcalQueryVariables = Exact<{
  orgId: string;
  memberId?: string | null | undefined;
}>;


export type GetOrgMeetingsForIcalQuery = { org_by_pk: { id: string, name: string, slug: string | null, meetings: Array<{ createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, circle: { role: { name: string } }, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> }>, meetings_recurring: Array<{ id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, meetings: Array<{ recurringDate: string | null }>, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } }> } | null };

export type CheckOrgUserQueryVariables = Exact<{
  orgId: string;
  userId: string;
}>;


export type CheckOrgUserQuery = { org_by_pk: { members: Array<{ id: string }> } | null, user: { email: string | null, metadata: UserMetadata } | null, member: Array<{ id: string }> };

export type GetOrgNameQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgNameQuery = { org_by_pk: { name: string } | null };

export type GetUserVerifiedEmailQueryVariables = Exact<{
  userId: string;
}>;


export type GetUserVerifiedEmailQuery = { user: { email: string | null, emailVerified: boolean } | null };

export type GetUserPendingInvitationsQueryVariables = Exact<{
  emails: Array<string> | string;
  userId: string;
}>;


export type GetUserPendingInvitationsQuery = { member: Array<{ id: string, orgId: string, inviteDate: string | null, org: { name: string } }> };

export type GetOrgAndMemberQueryVariables = Exact<{
  orgId: string;
  userId: string;
}>;


export type GetOrgAndMemberQuery = { org_by_pk: { id: string, name: string, members: Array<{ id: string, name: string, picture: string | null, user: { locale: string } | null }> } | null };

export type GetOwnMemberToLeaveOrgQueryVariables = Exact<{
  orgId: string;
  userId: string;
}>;


export type GetOwnMemberToLeaveOrgQuery = { member: Array<{ id: string, orgId: string, userId: string | null, role: Member_Role_Enum | null }> };

export type GetMemberQueryVariables = Exact<{
  id: string;
}>;


export type GetMemberQuery = { member_by_pk: { id: string, orgId: string, userId: string | null, name: string, role: Member_Role_Enum | null, inviteDate: string | null, inviteEmail: string | null } | null };

export type UpdateMemberMutationVariables = Exact<{
  id: string;
  values: Member_Set_Input;
}>;


export type UpdateMemberMutation = { update_member_by_pk: { id: string } | null };

export type GetOrgSubscriptionStripeStatusQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionStripeStatusQuery = { org_subscription: Array<{ id: string, stripeSubscriptionId: string | null, status: Subscription_Payment_Status_Enum }> };

export type ArchiveOrgMutationVariables = Exact<{
  orgId: string;
  archivedAt: string;
}>;


export type ArchiveOrgMutation = { update_org_by_pk: { id: string } | null };

export type GetUserQueryVariables = Exact<{
  id: string;
}>;


export type GetUserQuery = { user: { id: string, displayName: string, email: string | null } | null };

export type CreateOrgMutationVariables = Exact<{
  name: string;
  slug: string;
  userId: string;
  memberName: string;
}>;


export type CreateOrgMutation = { insert_org_one: { id: string } | null };

export type CreateRoleMutationVariables = Exact<{
  orgId: string;
  name: string;
}>;


export type CreateRoleMutation = { insert_role_one: { id: string } | null };

export type CreateCircleMutationVariables = Exact<{
  orgId: string;
  roleId: string;
}>;


export type CreateCircleMutation = { insert_circle_one: { id: string } | null };

export type UpdateOrgIconMutationVariables = Exact<{
  id: string;
  icon: string;
  iconFileId: string;
}>;


export type UpdateOrgIconMutation = { update_org_by_pk: { id: string } | null };

export type GetOrgExportDataQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgExportDataQuery = { org_by_pk: { id: string, name: string, members: Array<{ id: string, name: string, inviteEmail: string | null, role: Member_Role_Enum | null, description: string, archivedAt: string | null }>, roles: Array<{ id: string, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, base: boolean, archivedAt: string | null }>, circles: Array<{ id: string, roleId: string, parentId: string | null, archivedAt: string | null }>, decisions: Array<{ id: string, title: string, description: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, tasks: Array<{ id: string, title: string, description: string, circleId: string, memberId: string | null, status: Task_Status_Enum, dueDate: string | null, createdAt: string, archivedAt: string | null }>, threads: Array<{ id: string, title: string, circleId: string, initiatorMemberId: string, status: Thread_Status_Enum, createdAt: string, archivedAt: string | null }>, meetings: Array<{ id: string, title: string, circleId: string, startDate: string, endDate: string, ended: boolean, summary: string, recurringId: string | null, createdAt: string, archivedAt: string | null }>, meetings_recurring: Array<{ id: string, circleId: string, rrule: string, duration: number, scope: ParticipantsScope, createdAt: string }>, meeting_templates: Array<{ id: string, circleId: string | null, title: string, stepsConfig: Array<MeetingStepConfig> }> } | null, circle_member: Array<{ id: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, circle_link: Array<{ id: string, circleId: string, parentId: string, createdAt: string }>, thread_activity: Array<{ id: string, threadId: string, type: Thread_Activity_Type_Enum, data: any, userId: string, createdAt: string, refThreadId: string | null, refTaskId: string | null, refDecisionId: string | null, refMeetingId: string | null }>, thread_extra_member: Array<{ id: string, threadId: string, memberId: string }>, thread_poll_answer: Array<{ id: string, activityId: string, userId: string, choicesPoints: Array<number>, createdAt: string }>, thread_activity_reaction: Array<{ id: string, activityId: string, userId: string, shortcode: string, createdAt: string }>, meeting_step: Array<{ id: string, meetingId: string, type: Meeting_Step_Type_Enum, stepConfigId: string, data: MeetingStepData, notes: string }>, meeting_attendee: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> };

export type GetPublicDataQueryVariables = Exact<{
  orgId: string;
}>;


export type GetPublicDataQuery = { org_by_pk: { archivedAt: string | null, shareOrg: boolean, shareMembers: boolean, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, members: Array<{ id: string, memberId: string }>, invitedCircleLinks: Array<{ id: string, invitedCircle: { id: string } }> }>, roles: Array<{ id: string, orgId: string, base: boolean, name: string, purpose: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, members: Array<{ id: string, orgId: string, name: string, picture: string | null }> } | null };

export type GetUserImportQueryVariables = Exact<{
  id: string;
}>;


export type GetUserImportQuery = { user: { id: string, email: string | null, displayName: string } | null };

export type CreateOrgImportMutationVariables = Exact<{
  name: string;
}>;


export type CreateOrgImportMutation = { insert_org_one: { id: string } | null };

export type CreateMembersImportMutationVariables = Exact<{
  members: Array<Member_Insert_Input> | Member_Insert_Input;
}>;


export type CreateMembersImportMutation = { insert_member: { returning: Array<{ id: string, inviteEmail: string | null }> } | null };

export type CreateRolesImportMutationVariables = Exact<{
  roles: Array<Role_Insert_Input> | Role_Insert_Input;
}>;


export type CreateRolesImportMutation = { insert_role: { returning: Array<{ id: string, orgId: string, archivedAt: string | null, base: boolean, name: string, purpose: string, domain: string, accountabilities: string, checklist: string, indicators: string, notes: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }> } | null };

export type CreateCirclesImportMutationVariables = Exact<{
  circles: Array<Circle_Insert_Input> | Circle_Insert_Input;
}>;


export type CreateCirclesImportMutation = { insert_circle: { returning: Array<{ id: string }> } | null };

export type CreateCirclesMembersImportMutationVariables = Exact<{
  circleMembers: Array<Circle_Member_Insert_Input> | Circle_Member_Insert_Input;
}>;


export type CreateCirclesMembersImportMutation = { insert_circle_member: { returning: Array<{ id: string }> } | null };

export type CreateDecisionsImportMutationVariables = Exact<{
  decisions: Array<Decision_Insert_Input> | Decision_Insert_Input;
}>;


export type CreateDecisionsImportMutation = { insert_decision: { returning: Array<{ id: string }> } | null };

export type CreateTasksImportMutationVariables = Exact<{
  tasks: Array<Task_Insert_Input> | Task_Insert_Input;
}>;


export type CreateTasksImportMutation = { insert_task: { returning: Array<{ id: string }> } | null };

export type GetFileByNameQueryVariables = Exact<{
  name: string;
}>;


export type GetFileByNameQuery = { files: Array<{ id: string }> };

export type GetOrgBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type GetOrgBySlugQuery = { org: Array<{ id: string }> };

export type GetOrgDataQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgDataQuery = { org_by_pk: { governanceMode: Governance_Mode_Enum, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null }>, circleMembers: Array<{ id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, circleLinks: Array<{ id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null }>, roles: Array<{ id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, members: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null }> } | null };

export type GetOrgDataWithArchivedQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgDataWithArchivedQuery = { org_by_pk: { governanceMode: Governance_Mode_Enum, circles: Array<{ id: string, orgId: string, roleId: string, parentId: string | null, archivedAt: string | null }>, circleMembers: Array<{ id: string, orgId: string, circleId: string, memberId: string, createdAt: string, archivedAt: string | null }>, circleLinks: Array<{ id: string, orgId: string, parentId: string, circleId: string, createdAt: string, archivedAt: string | null }>, roles: Array<{ id: string, base: boolean, name: string, singleMember: boolean, parentLink: boolean, colorHue: number | null }>, members: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null }> } | null };

export type SetGovernanceModeMutationVariables = Exact<{
  id: string;
  governanceMode: Governance_Mode_Enum;
}>;


export type SetGovernanceModeMutation = { update_org_by_pk: { id: string } | null };

export type UpdateOrgSlugMutationVariables = Exact<{
  id: string;
  slug: string;
}>;


export type UpdateOrgSlugMutation = { update_org_by_pk: { id: string } | null };

export type GetOrgSubscriptionDetailsQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionDetailsQuery = { org_subscription: Array<{ id: string, stripeSubscriptionId: string | null, stripeCustomerId: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum }> };

export type GetOrgSubscriptionStripeIdsQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionStripeIdsQuery = { org_subscription: Array<{ id: string, stripeSubscriptionId: string | null, stripeCustomerId: string }> };

export type UpdateOrgSubscriptionStatusByStripeSubIdMutationVariables = Exact<{
  stripeSubscriptionId: string;
  status: Subscription_Payment_Status_Enum;
}>;


export type UpdateOrgSubscriptionStatusByStripeSubIdMutation = { update_org_subscription: { returning: Array<{ id: string }> } | null };

export type UpdateActiveMembersToMembersMutationVariables = Exact<{
  ids?: Array<string> | string | null | undefined;
}>;


export type UpdateActiveMembersToMembersMutation = { update_member_many: Array<{ returning: Array<{ id: string }> } | null> | null };

export type GetOrgMembersWithRolesFromSubscriptionIdQueryVariables = Exact<{
  subscriptionId: string;
}>;


export type GetOrgMembersWithRolesFromSubscriptionIdQuery = { org: Array<{ id: string, members: Array<{ id: string, userId: string | null, role: Member_Role_Enum | null }> }> };

export type GetUserEmailQueryVariables = Exact<{
  id: string;
}>;


export type GetUserEmailQuery = { user: { id: string, email: string | null } | null };

export type GetOrgIdQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgIdQuery = { org_by_pk: { id: string, name: string, members: Array<{ id: string, userId: string | null }> } | null };

export type CreateOrgSubscriptionMutationVariables = Exact<{
  orgId: string;
  customerId: string;
  subscriptionId: string;
  type: Subscription_Plan_Type_Enum;
}>;


export type CreateOrgSubscriptionMutation = { insert_org_subscription_one: { id: string } | null };

export type UpdateOrgSubscriptionStripeSubIdMutationVariables = Exact<{
  orgId: string;
  stripeSubscriptionId: string;
  type: Subscription_Plan_Type_Enum;
}>;


export type UpdateOrgSubscriptionStripeSubIdMutation = { update_org_subscription: { returning: Array<{ id: string }> } | null };

export type GetOrgSubscriptionStatusQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionStatusQuery = { org_subscription: Array<{ id: string, status: Subscription_Payment_Status_Enum, stripeCustomerId: string, stripeSubscriptionId: string | null, type: Subscription_Plan_Type_Enum }> };

export type GetOrgSubscriptionStripeIdQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionStripeIdQuery = { org_subscription: Array<{ id: string, stripeSubscriptionId: string | null, status: Subscription_Payment_Status_Enum }> };

export type GetOrgSubscriptionStripeCustomerIdQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionStripeCustomerIdQuery = { org_subscription: Array<{ id: string, stripeCustomerId: string }> };

export type GetOrgSubscriptionAndActiveMembersQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgSubscriptionAndActiveMembersQuery = { org_by_pk: { org_subscription: { id: string, stripeSubscriptionId: string | null, stripeCustomerId: string, status: Subscription_Payment_Status_Enum, type: Subscription_Plan_Type_Enum } | null, active_members: { aggregate: { count: number } | null }, invited_members: { aggregate: { count: number } | null } } | null };

export type GetAllParticipantsForRecomputeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllParticipantsForRecomputeQuery = { circle_participant: Array<{ circleId: string | null, memberId: string | null }> };

export type GetOrgParticipantsForRecomputeQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgParticipantsForRecomputeQuery = { circle_participant: Array<{ circleId: string | null, memberId: string | null }> };

export type GetOrgIdForRecomputeQueryVariables = Exact<{
  circleId: string;
}>;


export type GetOrgIdForRecomputeQuery = { circle_by_pk: { orgId: string } | null };

export type ReplaceParticipantsForRecomputeMutationVariables = Exact<{
  participants: Array<Circle_Participant_Cache_Insert_Input> | Circle_Participant_Cache_Insert_Input;
  deleteWhere: Circle_Participant_Cache_Bool_Exp;
}>;


export type ReplaceParticipantsForRecomputeMutation = { delete_circle_participant_cache: { returning: Array<{ id: string }> } | null, insert_circle_participant_cache: { returning: Array<{ id: string }> } | null };

export type GetProposalForResolutionQueryVariables = Exact<{
  id: string;
}>;


export type GetProposalForResolutionQuery = { thread_activity_by_pk: { id: string, userId: string, threadId: string, type: Thread_Activity_Type_Enum, data: any, thread: { id: string, orgId: string, circleId: string, extra_members: Array<{ memberId: string, member: { id: string, userId: string | null } }> } } | null };

export type GetProposalVotesForResolutionQueryVariables = Exact<{
  activityId: string;
}>;


export type GetProposalVotesForResolutionQuery = { thread_proposal_vote: Array<{ userId: string, vote: string, memberId: string | null }> };

export type InsertProposalDecisionMutationVariables = Exact<{
  values: Decision_Insert_Input;
}>;


export type InsertProposalDecisionMutation = { insert_decision_one: { id: string } | null };

export type InsertProposalLogMutationVariables = Exact<{
  values: Log_Insert_Input;
}>;


export type InsertProposalLogMutation = { insert_log_one: { id: string } | null };

export type UpdateProposalActivityMutationVariables = Exact<{
  id: string;
  data: any;
}>;


export type UpdateProposalActivityMutation = { update_thread_activity_by_pk: { id: string } | null };

export type InsertProposalEventActivityMutationVariables = Exact<{
  values: Thread_Activity_Insert_Input;
}>;


export type InsertProposalEventActivityMutation = { insert_thread_activity_one: { id: string } | null };

export type GetResolutionCircleQueryVariables = Exact<{
  id: string;
}>;


export type GetResolutionCircleQuery = { circle_by_pk: { id: string } | null };

export type InsertResolutionCircleMutationVariables = Exact<{
  object: Circle_Insert_Input;
}>;


export type InsertResolutionCircleMutation = { insert_circle_one: { id: string } | null };

export type UpdateResolutionCircleMutationVariables = Exact<{
  id: string;
  values: Circle_Set_Input;
}>;


export type UpdateResolutionCircleMutation = { update_circle_by_pk: { id: string } | null };

export type GetResolutionRoleQueryVariables = Exact<{
  id: string;
}>;


export type GetResolutionRoleQuery = { role_by_pk: { id: string } | null };

export type InsertResolutionRoleMutationVariables = Exact<{
  values: Role_Insert_Input;
}>;


export type InsertResolutionRoleMutation = { insert_role_one: { id: string } | null };

export type UpdateResolutionRoleMutationVariables = Exact<{
  id: string;
  values: Role_Set_Input;
}>;


export type UpdateResolutionRoleMutation = { update_role_by_pk: { id: string } | null };

export type GetResolutionCircleMemberQueryVariables = Exact<{
  id: string;
}>;


export type GetResolutionCircleMemberQuery = { circle_member_by_pk: { id: string } | null };

export type InsertResolutionCircleMemberMutationVariables = Exact<{
  object: Circle_Member_Insert_Input;
}>;


export type InsertResolutionCircleMemberMutation = { insert_circle_member_one: { id: string } | null };

export type UpdateResolutionCircleMemberMutationVariables = Exact<{
  id: string;
  values: Circle_Member_Set_Input;
}>;


export type UpdateResolutionCircleMemberMutation = { update_circle_member_by_pk: { id: string } | null };

export type GetResolutionCircleLinkQueryVariables = Exact<{
  id: string;
}>;


export type GetResolutionCircleLinkQuery = { circle_link_by_pk: { id: string } | null };

export type InsertResolutionCircleLinkMutationVariables = Exact<{
  object: Circle_Link_Insert_Input;
}>;


export type InsertResolutionCircleLinkMutation = { insert_circle_link_one: { id: string } | null };

export type UpdateResolutionCircleLinkMutationVariables = Exact<{
  id: string;
  values: Circle_Link_Set_Input;
}>;


export type UpdateResolutionCircleLinkMutation = { update_circle_link_by_pk: { id: string } | null };

export type GetUserForImpersonationQueryVariables = Exact<{
  id: string;
}>;


export type GetUserForImpersonationQuery = { user: { id: string, email: string | null, disabled: boolean } | null };

export type CreateImpersonationPatMutationVariables = Exact<{
  userId: string;
  refreshTokenHash: string;
  expiresAt: string;
  metadata: any;
}>;


export type CreateImpersonationPatMutation = { insertAuthRefreshToken: { id: string } | null };

export type RestoreOrgMutationVariables = Exact<{
  orgId: string;
}>;


export type RestoreOrgMutation = { update_org_by_pk: { id: string } | null };

export type SetUserDisabledMutationVariables = Exact<{
  userId: string;
  disabled: boolean;
}>;


export type SetUserDisabledMutation = { updateUser: { id: string } | null };

export type CircleSearchFragment = { id: string, orgId: string, role: { name: string } };

export type GetCircleForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetCircleForSearchQuery = { circle_by_pk: { id: string, orgId: string, role: { name: string } } | null };

export type GetCirclesForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCirclesForSearchQuery = { circle: Array<{ id: string, orgId: string, role: { name: string } }> };

export type DecisionSearchFragment = { id: string, orgId: string, title: string, createdAt: string };

export type GetDecisionForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetDecisionForSearchQuery = { decision_by_pk: { id: string, orgId: string, title: string, createdAt: string } | null };

export type GetDecisionsForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDecisionsForSearchQuery = { decision: Array<{ id: string, orgId: string, title: string, createdAt: string }> };

export type MeetingSearchFragment = { id: string, orgId: string, title: string, summary: string, createdAt: string, startDate: string, circle: { role: { name: string } }, steps: Array<{ notes: string }> };

export type GetMeetingForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetMeetingForSearchQuery = { meeting_by_pk: { id: string, orgId: string, title: string, summary: string, createdAt: string, startDate: string, circle: { role: { name: string } }, steps: Array<{ notes: string }> } | null };

export type GetMeetingsForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeetingsForSearchQuery = { meeting: Array<{ id: string, orgId: string, title: string, summary: string, createdAt: string, startDate: string, circle: { role: { name: string } }, steps: Array<{ notes: string }> }> };

export type GetMeetingDataForSearchQueryVariables = Exact<{
  meetingId: string;
}>;


export type GetMeetingDataForSearchQuery = { meeting_by_pk: { org: { id: string, slug: string | null }, circle: { role: { name: string } }, meeting_attendees: Array<{ id: string, present: boolean | null, startNotified: boolean, member: { id: string, name: string, archivedAt: string | null, user: { email: string | null, locale: string, metadata: UserMetadata, apps: Array<{ id: string, userId: string, type: App_Type_Enum, secretConfig: any, config: any, tmpData: any, createdAt: any, user: { metadata: UserMetadata } | null }> } | null } }> } | null };

export type ResetLastUpdateSourceMutationVariables = Exact<{
  id: string;
}>;


export type ResetLastUpdateSourceMutation = { update_meeting_by_pk: { id: string } | null };

export type UpdateAttendeesStartNotifiedMutationVariables = Exact<{
  ids: Array<string> | string;
}>;


export type UpdateAttendeesStartNotifiedMutation = { update_meeting_attendee: { returning: Array<{ id: string }> } | null };

export type GetMeetingAttendeeForSearchQueryVariables = Exact<{
  meetingId: string;
  memberId: string;
}>;


export type GetMeetingAttendeeForSearchQuery = { meeting_by_pk: { createdAt: string, stepsConfig: Array<MeetingStepConfig>, archivedAt: string | null, videoConf: VideoConf | null, recurringId: string | null, recurringDate: string | null, invitedReadonly: boolean, id: string, orgId: string, circleId: string, startDate: string, endDate: string, ended: boolean, title: string, currentStepId: string | null, summary: string, private: boolean, org: { id: string, slug: string | null }, circle: { role: { name: string } }, meeting_attendees: Array<{ id: string, meetingId: string, memberId: string, present: boolean | null, startNotified: boolean }> } | null, member_by_pk: { id: string, name: string, archivedAt: string | null, user: { email: string | null, locale: string, metadata: UserMetadata, apps: Array<{ id: string, userId: string, type: App_Type_Enum, secretConfig: any, config: any, tmpData: any, createdAt: any, user: { metadata: UserMetadata } | null }> } | null } | null };

export type UpdateAttendeeStartNotifiedMutationVariables = Exact<{
  id: string;
}>;


export type UpdateAttendeeStartNotifiedMutation = { update_meeting_attendee_by_pk: { id: string } | null };

export type GetMeetingRecurringDataForSearchQueryVariables = Exact<{
  meetingId: string;
  orgId: string;
}>;


export type GetMeetingRecurringDataForSearchQuery = { meeting_recurring_by_pk: { id: string, orgId: string, circleId: string, scope: ParticipantsScope, templateId: string, rrule: string, duration: number, videoConf: any, private: boolean, invitedReadonly: boolean, createdAt: string, meetings: Array<{ id: string, recurringDate: string | null }>, circle: { role: { name: string, colorHue: number | null } }, template: { title: string, stepsConfig: Array<MeetingStepConfig> } } | null, org_by_pk: { id: string, slug: string | null, members: Array<{ id: string, orgId: string, archivedAt: string | null, name: string, description: string, pictureFileId: string | null, picture: string | null, userId: string | null, inviteEmail: string | null, inviteDate: string | null, role: Member_Role_Enum | null, user: { apps: Array<{ id: string, userId: string, type: App_Type_Enum, secretConfig: any, config: any, tmpData: any, createdAt: any, user: { metadata: UserMetadata } | null }> } | null }> } | null };

export type MemberSearchFragment = { id: string, orgId: string, name: string, description: string, picture: string | null };

export type GetMemberForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetMemberForSearchQuery = { member_by_pk: { id: string, orgId: string, name: string, description: string, picture: string | null } | null };

export type GetMembersForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMembersForSearchQuery = { member: Array<{ id: string, orgId: string, name: string, description: string, picture: string | null }> };

export type GetRoleCirclesForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetRoleCirclesForSearchQuery = { circle: Array<{ id: string, orgId: string, role: { name: string } }> };

export type TaskSearchFragment = { id: string, orgId: string, title: string, createdAt: string };

export type GetTaskForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetTaskForSearchQuery = { task_by_pk: { id: string, orgId: string, title: string, createdAt: string } | null };

export type GetTasksForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTasksForSearchQuery = { task: Array<{ id: string, orgId: string, title: string, createdAt: string }> };

export type ThreadSearchFragment = { id: string, orgId: string, title: string, createdAt: string, activities: Array<{ type: Thread_Activity_Type_Enum, data: any }> };

export type GetThreadForSearchQueryVariables = Exact<{
  id: string;
}>;


export type GetThreadForSearchQuery = { thread_by_pk: { id: string, orgId: string, title: string, createdAt: string, activities: Array<{ type: Thread_Activity_Type_Enum, data: any }> } | null };

export type GetThreadsForSearchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetThreadsForSearchQuery = { thread: Array<{ id: string, orgId: string, title: string, createdAt: string, activities: Array<{ type: Thread_Activity_Type_Enum, data: any }> }> };

export type GetBouncedAccountQueryVariables = Exact<{
  email: string;
  createdAfter: string;
}>;


export type GetBouncedAccountQuery = { users: Array<{ id: string }> };

export type UpdateUserMetadataMutationVariables = Exact<{
  userId: string;
  metadata: any;
}>;


export type UpdateUserMetadataMutation = { updateUser: { id: string } | null };

export type GetOrgMembersQueryVariables = Exact<{
  orgId: string;
}>;


export type GetOrgMembersQuery = { org_by_pk: { id: string, members: Array<{ id: string }> } | null };

export type GetUserRoleInOrgQueryVariables = Exact<{
  orgId: string;
  userId: string;
}>;


export type GetUserRoleInOrgQuery = { org_by_pk: { members: Array<{ role: Member_Role_Enum | null }> } | null };

export type GetApiKeyUserIdQueryVariables = Exact<{
  value: string;
}>;


export type GetApiKeyUserIdQuery = { api_key: Array<{ id: string, userId: string }> };

export type UpdateApiKeyLastUsedMutationVariables = Exact<{
  id: string;
  lastUsedAt: string;
}>;


export type UpdateApiKeyLastUsedMutation = { update_api_key_by_pk: { id: string } | null };

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

export const CircleSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CircleSearchFragment, unknown>;
export const DecisionSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DecisionSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<DecisionSearchFragment, unknown>;
export const MeetingSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}}]}}]} as unknown as DocumentNode<MeetingSearchFragment, unknown>;
export const MemberSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MemberSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]} as unknown as DocumentNode<MemberSearchFragment, unknown>;
export const TaskSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<TaskSearchFragment, unknown>;
export const ThreadSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<ThreadSearchFragment, unknown>;
export const ApiKeyFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ApiKey"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"api_key"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ApiKeyFragment, unknown>;
export const CircleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Circle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]} as unknown as DocumentNode<CircleFragment, unknown>;
export const RoleSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]} as unknown as DocumentNode<RoleSummaryFragment, unknown>;
export const CircleSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Circle"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Circle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]} as unknown as DocumentNode<CircleSummaryFragment, unknown>;
export const LogFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Log"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"log"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"memberName"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"changes"}},{"kind":"Field","name":{"kind":"Name","value":"cancelLogId"}},{"kind":"Field","name":{"kind":"Name","value":"cancelMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"cancelMemberName"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"decisionId"}}]}}]} as unknown as DocumentNode<LogFragment, unknown>;
export const MeetingAttendeeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}}]} as unknown as DocumentNode<MeetingAttendeeFragment, unknown>;
export const MeetingSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}}]} as unknown as DocumentNode<MeetingSummaryFragment, unknown>;
export const MeetingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Meeting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"recurringId"}},{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}}]} as unknown as DocumentNode<MeetingFragment, unknown>;
export const MeetingRecurringFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingRecurring"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_recurring"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<MeetingRecurringFragment, unknown>;
export const MeetingStepFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingStep"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_step"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"stepConfigId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]} as unknown as DocumentNode<MeetingStepFragment, unknown>;
export const MemberSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MemberSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]} as unknown as DocumentNode<MemberSummaryFragment, unknown>;
export const DecisionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Decision"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}}]} as unknown as DocumentNode<DecisionFragment, unknown>;
export const ThreadExtraMemberFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadExtraMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_extra_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}}]} as unknown as DocumentNode<ThreadExtraMemberFragment, unknown>;
export const ThreadFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"initiatorMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"extra_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadExtraMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadExtraMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_extra_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}}]} as unknown as DocumentNode<ThreadFragment, unknown>;
export const ThreadActivityMemberFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]} as unknown as DocumentNode<ThreadActivityMemberFragment, unknown>;
export const ThreadActivityReactionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityReaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_reaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shortcode"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]} as unknown as DocumentNode<ThreadActivityReactionFragment, unknown>;
export const TaskFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}}]} as unknown as DocumentNode<TaskFragment, unknown>;
export const ThreadActivityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityReaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refThread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refMeeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refDecision"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Decision"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadExtraMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_extra_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityReaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_reaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shortcode"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"initiatorMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"extra_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadExtraMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Decision"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}}]} as unknown as DocumentNode<ThreadActivityFragment, unknown>;
export const ThreadWithFirstActivityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadWithFirstActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"Message"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivity"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadExtraMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_extra_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityReaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_reaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shortcode"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"initiatorMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"extra_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadExtraMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Decision"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityReaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refThread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refMeeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refDecision"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Decision"}}]}}]}}]} as unknown as DocumentNode<ThreadWithFirstActivityFragment, unknown>;
export const NewsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"News"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"news"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"decision"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Decision"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadWithFirstActivity"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadExtraMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_extra_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"initiatorMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"extra_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadExtraMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityReaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_reaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shortcode"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Decision"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityReaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refThread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refMeeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refDecision"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Decision"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadWithFirstActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"Message"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivity"}}]}}]}}]} as unknown as DocumentNode<NewsFragment, unknown>;
export const OrgFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Org"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"shareOrg"}},{"kind":"Field","name":{"kind":"Name","value":"shareMembers"}},{"kind":"Field","name":{"kind":"Name","value":"governanceMode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphView"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphFolded"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphMembers"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"homeNote"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingOrgType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingTodo"}}]}}]} as unknown as DocumentNode<OrgFragment, unknown>;
export const OrgSubscriptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org_subscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<OrgSubscriptionFragment, unknown>;
export const CircleMemberFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]} as unknown as DocumentNode<CircleMemberFragment, unknown>;
export const CircleLinkFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleLink"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_link"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]} as unknown as DocumentNode<CircleLinkFragment, unknown>;
export const MemberFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pictureFileId"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<MemberFragment, unknown>;
export const OrgDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Org"}},{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgSubscription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Circle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circleMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circleLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleLink"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Member"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Org"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"shareOrg"}},{"kind":"Field","name":{"kind":"Name","value":"shareMembers"}},{"kind":"Field","name":{"kind":"Name","value":"governanceMode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphView"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphFolded"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphMembers"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"homeNote"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingOrgType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingTodo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org_subscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Circle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleLink"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_link"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pictureFileId"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<OrgDataFragment, unknown>;
export const RoleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]} as unknown as DocumentNode<RoleFragment, unknown>;
export const RoleAiFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleAI"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role_ai"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<RoleAiFragment, unknown>;
export const ThreadMemberStatusFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadMemberStatus"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_member_status"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastReadActivityId"}},{"kind":"Field","name":{"kind":"Name","value":"lastReadDate"}}]}}]} as unknown as DocumentNode<ThreadMemberStatusFragment, unknown>;
export const UserAppFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserApp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"user_app"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]} as unknown as DocumentNode<UserAppFragment, unknown>;
export const UserAppFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAppFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"user_app"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"secretConfig"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"tmpData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<UserAppFullFragment, unknown>;
export const GetMeetingContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeetingContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stepConfigId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeetingContentQuery, GetMeetingContentQueryVariables>;
export const GetThreadsWithMeetingNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThreadsWithMeetingNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"threadsIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"threadsIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"MeetingNote"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"refMeetingId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<GetThreadsWithMeetingNotesQuery, GetThreadsWithMeetingNotesQueryVariables>;
export const GetRoleAiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRoleAI"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role_ai"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"lang"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lang"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleAI"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleAI"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role_ai"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<GetRoleAiQuery, GetRoleAiQueryVariables>;
export const InsertRoleAiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertRoleAI"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"role_ai_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_role_ai_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleAI"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleAI"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role_ai"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]} as unknown as DocumentNode<InsertRoleAiMutation, InsertRoleAiMutationVariables>;
export const UpdateUserAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"user_app_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_user_app_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserAppMutation, UpdateUserAppMutationVariables>;
export const ArchiveUserAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"archiveUserApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_user_app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<ArchiveUserAppMutation, ArchiveUserAppMutationVariables>;
export const GetUserAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_app_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAppFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAppFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"user_app"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"secretConfig"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"tmpData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetUserAppQuery, GetUserAppQueryVariables>;
export const GetUserForAppNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserForAppNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]} as unknown as DocumentNode<GetUserForAppNotificationQuery, GetUserForAppNotificationQueryVariables>;
export const GetOrgMeetingsForCalendarAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgMeetingsForCalendarApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"meeting_attendees"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"member"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Meeting"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings_recurring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Meeting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"recurringId"}},{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingRecurring"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_recurring"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetOrgMeetingsForCalendarAppQuery, GetOrgMeetingsForCalendarAppQueryVariables>;
export const GetMeetingForCalendarAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeetingForCalendarApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Meeting"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Meeting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"recurringId"}},{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}}]}}]} as unknown as DocumentNode<GetMeetingForCalendarAppQuery, GetMeetingForCalendarAppQueryVariables>;
export const GetMeetingRecurringForCalendarAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeetingRecurringForCalendarApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_recurring_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingRecurring"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_recurring"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetMeetingRecurringForCalendarAppQuery, GetMeetingRecurringForCalendarAppQueryVariables>;
export const CreateMeetingForCalendarAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMeetingForCalendarApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meeting"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_meeting_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meeting"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMeetingForCalendarAppMutation, CreateMeetingForCalendarAppMutationVariables>;
export const UpdateMeetingForCalendarAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMeetingForCalendarApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateMeetingForCalendarAppMutation, UpdateMeetingForCalendarAppMutationVariables>;
export const DeleteMeetingForCalendarAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMeetingForCalendarApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteMeetingForCalendarAppMutation, DeleteMeetingForCalendarAppMutationVariables>;
export const CreateUserAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUserApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"user_app_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_user_app_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserAppMutation, CreateUserAppMutationVariables>;
export const GetCircleOrgForArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCircleOrgForArchive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]} as unknown as DocumentNode<GetCircleOrgForArchiveQuery, GetCircleOrgForArchiveQueryVariables>;
export const GetCircleOrgForRestoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCircleOrgForRestore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]} as unknown as DocumentNode<GetCircleOrgForRestoreQuery, GetCircleOrgForRestoreQueryVariables>;
export const RestoreCircleCascadeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restoreCircleCascade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rolesIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_circle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rolesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_circle_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_circle_link"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"parentId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_meeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_thread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_decision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_meeting_recurring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<RestoreCircleCascadeMutation, RestoreCircleCascadeMutationVariables>;
export const InsertCircleArchiveLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertCircleArchiveLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"log_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_log_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertCircleArchiveLogMutation, InsertCircleArchiveLogMutationVariables>;
export const CancelCircleArchiveLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cancelCircleArchiveLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_log_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"canceled"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CancelCircleArchiveLogMutation, CancelCircleArchiveLogMutationVariables>;
export const GetCircleArchiveLogsInRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCircleArchiveLogsInRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"canceled"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"memberName"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"changes"}},{"kind":"Field","name":{"kind":"Name","value":"cancelLogId"}}]}}]}}]} as unknown as DocumentNode<GetCircleArchiveLogsInRangeQuery, GetCircleArchiveLogsInRangeQueryVariables>;
export const ArchiveCircleCascadeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"archiveCircleCascade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rolesIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_circle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rolesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_circle_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_circle_link"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"parentId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_meeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"currentStepId"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_thread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_decision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_meeting_recurring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circlesIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<ArchiveCircleCascadeMutation, ArchiveCircleCascadeMutationVariables>;
export const GetRecurringMeetingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecurringMeetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_recurring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"recurringDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"StringValue","value":"now()","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetRecurringMeetingsQuery, GetRecurringMeetingsQueryVariables>;
export const GetRecurringMeetingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecurringMeeting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_recurring_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}}]}}]}}]} as unknown as DocumentNode<GetRecurringMeetingQuery, GetRecurringMeetingQueryVariables>;
export const CreateMeetingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMeeting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meeting"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_meeting_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meeting"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMeetingMutation, CreateMeetingMutationVariables>;
export const EndOldMeetingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"endOldMeetings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_meeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"ended"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"currentStepId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ended"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"currentStepId"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EndOldMeetingsMutation, EndOldMeetingsMutationVariables>;
export const GetExpiredArchivedOrgsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExpiredArchivedOrgs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"failedIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"failedIds"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetExpiredArchivedOrgsQuery, GetExpiredArchivedOrgsQueryVariables>;
export const GetPendingInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPendingInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"Owner"},{"kind":"EnumValue","value":"Admin"}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"joinedMembers"},"name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPendingInvitationsQuery, GetPendingInvitationsQueryVariables>;
export const GetProposalsForCronDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProposalsForCron"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_type_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thread_activity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_contains"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"inProgress","block":false}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetProposalsForCronQuery, GetProposalsForCronQueryVariables>;
export const GetUsersForDigestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersForDigest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"disabled"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetUsersForDigestQuery, GetUsersForDigestQueryVariables>;
export const GetUserDigestDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserDigestData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"org"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Org"}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"activities"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}}]}}]}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participants"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"member"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"extra_members"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"member"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}]}}]}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"ended"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"private"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participants"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"member"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meeting_attendees"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"member"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}]}}]}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadExtraMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_extra_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivityReaction"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_reaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shortcode"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"initiatorMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"extra_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadExtraMember"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Task"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Decision"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"private"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Org"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"shareOrg"}},{"kind":"Field","name":{"kind":"Name","value":"shareMembers"}},{"kind":"Field","name":{"kind":"Name","value":"governanceMode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphView"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphFolded"}},{"kind":"Field","name":{"kind":"Name","value":"defaultGraphMembers"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"homeNote"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingOrgType"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingTodo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadActivityReaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refThread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refMeeting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Task"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refDecision"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Decision"}}]}}]}}]} as unknown as DocumentNode<GetUserDigestDataQuery, GetUserDigestDataQueryVariables>;
export const GetUsersWithoutOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersWithoutOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"disabled"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"emailVerified"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"members"},"value":{"kind":"ObjectValue","fields":[]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetUsersWithoutOrgQuery, GetUsersWithoutOrgQueryVariables>;
export const GetOrgsWithoutSetupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgsWithoutSetup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"onboardingTodo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"roles"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"base"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"Owner"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgsWithoutSetupQuery, GetOrgsWithoutSetupQueryVariables>;
export const GetOrgsWithoutInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgsWithoutInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"onboardingTodo"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"roles"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"base"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"members"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"inviteDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"members_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"Owner"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgsWithoutInviteQuery, GetOrgsWithoutInviteQueryVariables>;
export const GetOrgForDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgForDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetOrgForDeletionQuery, GetOrgForDeletionQueryVariables>;
export const GetOrgsDeletionCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgsDeletionCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"members"},"name":{"kind":"Name","value":"member_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"users"},"name":{"kind":"Name","value":"member_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"role_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"circles"},"name":{"kind":"Name","value":"circle_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"meetings"},"name":{"kind":"Name","value":"meeting_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"threads"},"name":{"kind":"Name","value":"thread_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"messages"},"name":{"kind":"Name","value":"thread_activity_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"tasks"},"name":{"kind":"Name","value":"task_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"decisions"},"name":{"kind":"Name","value":"decision_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"logs"},"name":{"kind":"Name","value":"log_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgsDeletionCountsQuery, GetOrgsDeletionCountsQueryVariables>;
export const GetOrgsSubscriptionsForDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgsSubscriptionsForDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}}]}}]}}]} as unknown as DocumentNode<GetOrgsSubscriptionsForDeletionQuery, GetOrgsSubscriptionsForDeletionQueryVariables>;
export const GetOrgsFilesForDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgsFilesForDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iconFileId"}},{"kind":"Field","name":{"kind":"Name","value":"homeNote"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pictureFileId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"org_file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread_activity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting_step"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meeting"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<GetOrgsFilesForDeletionQuery, GetOrgsFilesForDeletionQueryVariables>;
export const GetUnsharedFilesForDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUnsharedFilesForDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgs"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"members"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}]}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetUnsharedFilesForDeletionQuery, GetUnsharedFilesForDeletionQueryVariables>;
export const DeleteOrgsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteOrgs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_thread_activity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_decision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_org_file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteOrgsMutation, DeleteOrgsMutationVariables>;
export const GetUserForDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserForDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GetUserForDeletionQuery, GetUserForDeletionQueryVariables>;
export const GetMembersForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMembersForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"member_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetMembersForUserDeletionQuery, GetMembersForUserDeletionQueryVariables>;
export const GetOrgSharingForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSharingForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"others"},"name":{"kind":"Name","value":"member_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"inviteEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"owners"},"name":{"kind":"Name","value":"member_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"Owner"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"logs"},"name":{"kind":"Name","value":"log_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_neq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"messages"},"name":{"kind":"Name","value":"thread_activity_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_neq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgSharingForUserDeletionQuery, GetOrgSharingForUserDeletionQueryVariables>;
export const GetSharedContentForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSharedContentForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"messages"},"name":{"kind":"Name","value":"thread_activity_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"reactions"},"name":{"kind":"Name","value":"thread_activity_reaction_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"votes"},"name":{"kind":"Name","value":"thread_proposal_vote_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pollAnswers"},"name":{"kind":"Name","value":"thread_poll_answer_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"logs"},"name":{"kind":"Name","value":"log_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSharedContentForUserDeletionQuery, GetSharedContentForUserDeletionQueryVariables>;
export const GetAccountDataForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountDataForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"apiKeys"},"name":{"kind":"Name","value":"api_key_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"apps"},"name":{"kind":"Name","value":"user_app_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountDataForUserDeletionQuery, GetAccountDataForUserDeletionQueryVariables>;
export const GetUploadedFilesForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUploadedFilesForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uploadedByUserId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgs"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"members"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletedOrgIds"}}}]}}]}}]}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetUploadedFilesForUserDeletionQuery, GetUploadedFilesForUserDeletionQueryVariables>;
export const EraseAccountForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eraseAccountForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sharedMemberIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sharedMemberIds"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteEmail"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteDate"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_user_app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_api_key"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deleteAuthRefreshTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deleteAuthUserProviders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deleteAuthUserSecurityKeys"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deleteAuthOauth2AuthRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deleteAuthOauth2RefreshTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uploadedByUserId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uploadedByUserId"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"newEmail"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"phoneNumber"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"displayName"},"value":{"kind":"StringValue","value":"Deleted user","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"StringValue","value":"","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"otpHash"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"totpSecret"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"activeMfaType"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"ticket"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"currentChallenge"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastSeen"},"value":{"kind":"NullValue"}},{"kind":"ObjectField","name":{"kind":"Name","value":"emailVerified"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"phoneNumberVerified"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"disabled"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EraseAccountForUserDeletionMutation, EraseAccountForUserDeletionMutationVariables>;
export const DeleteUserForUserDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUserForUserDeletion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserForUserDeletionMutation, DeleteUserForUserDeletionMutationVariables>;
export const GetOrgMeetingsForIcalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgMeetingsForIcal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"meeting_attendees"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"memberId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Meeting"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings_recurring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Meeting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"recurringId"}},{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingRecurring"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_recurring"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetOrgMeetingsForIcalQuery, GetOrgMeetingsForIcalQueryVariables>;
export const CheckOrgUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkOrgUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CheckOrgUserQuery, CheckOrgUserQueryVariables>;
export const GetOrgNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetOrgNameQuery, GetOrgNameQueryVariables>;
export const GetUserVerifiedEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserVerifiedEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}}]}}]}}]} as unknown as DocumentNode<GetUserVerifiedEmailQuery, GetUserVerifiedEmailQueryVariables>;
export const GetUserPendingInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserPendingInvitations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emails"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emails"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"inviteDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"org"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"members"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserPendingInvitationsQuery, GetUserPendingInvitationsQueryVariables>;
export const GetOrgAndMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgAndMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgAndMemberQuery, GetOrgAndMemberQueryVariables>;
export const GetOwnMemberToLeaveOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOwnMemberToLeaveOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetOwnMemberToLeaveOrgQuery, GetOwnMemberToLeaveOrgQueryVariables>;
export const GetMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}}]}}]}}]} as unknown as DocumentNode<GetMemberQuery, GetMemberQueryVariables>;
export const UpdateMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"member_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_member_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const GetOrgSubscriptionStripeStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionStripeStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionStripeStatusQuery, GetOrgSubscriptionStripeStatusQueryVariables>;
export const ArchiveOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"archiveOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archivedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ArchiveOrgMutation, ArchiveOrgMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const CreateOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_org_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"members"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"Owner"}}]}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateOrgMutation, CreateOrgMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_role_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateCircleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCircle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_circle_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCircleMutation, CreateCircleMutationVariables>;
export const UpdateOrgIconDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrgIcon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"icon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"iconFileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"icon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"icon"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"iconFileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"iconFileId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateOrgIconMutation, UpdateOrgIconMutationVariables>;
export const GetOrgExportDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgExportData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"threads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"initiatorMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"recurringId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meetings_recurring"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting_templates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"circle_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circle_link"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"hostCircle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread_activity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"refThreadId"}},{"kind":"Field","name":{"kind":"Name","value":"refTaskId"}},{"kind":"Field","name":{"kind":"Name","value":"refDecisionId"}},{"kind":"Field","name":{"kind":"Name","value":"refMeetingId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread_extra_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread_poll_answer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"choicesPoints"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread_activity_reaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"thread"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shortcode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting_step"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meeting"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"stepConfigId"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meeting"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}}]}}]} as unknown as DocumentNode<GetOrgExportDataQuery, GetOrgExportDataQueryVariables>;
export const GetPublicDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublicData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"shareOrg"}},{"kind":"Field","name":{"kind":"Name","value":"shareMembers"}},{"kind":"Field","name":{"kind":"Name","value":"circles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitedCircleLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invitedCircle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]}}]}}]} as unknown as DocumentNode<GetPublicDataQuery, GetPublicDataQueryVariables>;
export const GetUserImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GetUserImportQuery, GetUserImportQueryVariables>;
export const CreateOrgImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOrgImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_org_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateOrgImportMutation, CreateOrgImportMutationVariables>;
export const CreateMembersImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMembersImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"members"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"member_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"members"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}}]}}]}}]}}]} as unknown as DocumentNode<CreateMembersImportMutation, CreateMembersImportMutationVariables>;
export const CreateRolesImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRolesImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"role_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Role"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"purpose"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"accountabilities"}},{"kind":"Field","name":{"kind":"Name","value":"checklist"}},{"kind":"Field","name":{"kind":"Name","value":"indicators"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]} as unknown as DocumentNode<CreateRolesImportMutation, CreateRolesImportMutationVariables>;
export const CreateCirclesImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCirclesImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"circles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_circle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circles"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCirclesImportMutation, CreateCirclesImportMutationVariables>;
export const CreateCirclesMembersImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCirclesMembersImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"circleMembers"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_circle_member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circleMembers"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCirclesMembersImportMutation, CreateCirclesMembersImportMutationVariables>;
export const CreateDecisionsImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDecisionsImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"decisions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"decision_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_decision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"decisions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDecisionsImportMutation, CreateDecisionsImportMutationVariables>;
export const CreateTasksImportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTasksImport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tasks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"task_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tasks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTasksImportMutation, CreateTasksImportMutationVariables>;
export const GetFileByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFileByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetFileByNameQuery, GetFileByNameQueryVariables>;
export const GetOrgBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetOrgBySlugQuery, GetOrgBySlugQueryVariables>;
export const GetOrgDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"governanceMode"}},{"kind":"Field","name":{"kind":"Name","value":"circles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Circle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circleMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circleLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleLink"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Member"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Circle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleLink"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_link"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pictureFileId"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetOrgDataQuery, GetOrgDataQueryVariables>;
export const GetOrgDataWithArchivedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgDataWithArchived"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"governanceMode"}},{"kind":"Field","name":{"kind":"Name","value":"circles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Circle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circleMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circleLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleLink"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Member"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Circle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleMember"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleLink"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle_link"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"base"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"singleMember"}},{"kind":"Field","name":{"kind":"Name","value":"parentLink"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pictureFileId"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetOrgDataWithArchivedQuery, GetOrgDataWithArchivedQueryVariables>;
export const SetGovernanceModeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setGovernanceMode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"governanceMode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"governance_mode_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"governanceMode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"governanceMode"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetGovernanceModeMutation, SetGovernanceModeMutationVariables>;
export const UpdateOrgSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrgSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateOrgSlugMutation, UpdateOrgSlugMutationVariables>;
export const GetOrgSubscriptionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionDetailsQuery, GetOrgSubscriptionDetailsQueryVariables>;
export const GetOrgSubscriptionStripeIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionStripeIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}}]}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionStripeIdsQuery, GetOrgSubscriptionStripeIdsQueryVariables>;
export const UpdateOrgSubscriptionStatusByStripeSubIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrgSubscriptionStatusByStripeSubId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripeSubscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"subscription_payment_status_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stripeSubscriptionId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripeSubscriptionId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrgSubscriptionStatusByStripeSubIdMutation, UpdateOrgSubscriptionStatusByStripeSubIdMutationVariables>;
export const UpdateActiveMembersToMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateActiveMembersToMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_member_many"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updates"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"NullValue"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateActiveMembersToMembersMutation, UpdateActiveMembersToMembersMutationVariables>;
export const GetOrgMembersWithRolesFromSubscriptionIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgMembersWithRolesFromSubscriptionId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org_subscription"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stripeSubscriptionId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgMembersWithRolesFromSubscriptionIdQuery, GetOrgMembersWithRolesFromSubscriptionIdQueryVariables>;
export const GetUserEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetUserEmailQuery, GetUserEmailQueryVariables>;
export const GetOrgIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgIdQuery, GetOrgIdQueryVariables>;
export const CreateOrgSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOrgSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"subscription_plan_type_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_org_subscription_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stripeCustomerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stripeSubscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateOrgSubscriptionMutation, CreateOrgSubscriptionMutationVariables>;
export const UpdateOrgSubscriptionStripeSubIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrgSubscriptionStripeSubId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stripeSubscriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"subscription_plan_type_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stripeSubscriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stripeSubscriptionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrgSubscriptionStripeSubIdMutation, UpdateOrgSubscriptionStripeSubIdMutationVariables>;
export const GetOrgSubscriptionStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionStatusQuery, GetOrgSubscriptionStatusQueryVariables>;
export const GetOrgSubscriptionStripeIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionStripeId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionStripeIdQuery, GetOrgSubscriptionStripeIdQueryVariables>;
export const GetOrgSubscriptionStripeCustomerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionStripeCustomerId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}}]}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionStripeCustomerIdQuery, GetOrgSubscriptionStripeCustomerIdQueryVariables>;
export const GetOrgSubscriptionAndActiveMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgSubscriptionAndActiveMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgSubscription"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"active_members"},"name":{"kind":"Name","value":"members_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"invited_members"},"name":{"kind":"Name","value":"members_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"inviteEmail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgSubscription"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"org_subscription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stripeSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"stripeCustomerId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GetOrgSubscriptionAndActiveMembersQuery, GetOrgSubscriptionAndActiveMembersQueryVariables>;
export const GetAllParticipantsForRecomputeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllParticipantsForRecompute"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_participant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}}]}}]} as unknown as DocumentNode<GetAllParticipantsForRecomputeQuery, GetAllParticipantsForRecomputeQueryVariables>;
export const GetOrgParticipantsForRecomputeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgParticipantsForRecompute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_participant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"circle"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orgId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}}]}}]} as unknown as DocumentNode<GetOrgParticipantsForRecomputeQuery, GetOrgParticipantsForRecomputeQueryVariables>;
export const GetOrgIdForRecomputeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgIdForRecompute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"circleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"circleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgId"}}]}}]}}]} as unknown as DocumentNode<GetOrgIdForRecomputeQuery, GetOrgIdForRecomputeQueryVariables>;
export const ReplaceParticipantsForRecomputeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"replaceParticipantsForRecompute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participants"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_participant_cache_insert_input"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteWhere"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_participant_cache_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_circle_participant_cache"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteWhere"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_circle_participant_cache"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participants"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ReplaceParticipantsForRecomputeMutation, ReplaceParticipantsForRecomputeMutationVariables>;
export const GetProposalForResolutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProposalForResolution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thread_activity_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"threadId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"extra_members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProposalForResolutionQuery, GetProposalForResolutionQueryVariables>;
export const GetProposalVotesForResolutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProposalVotesForResolution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thread_proposal_vote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"activityId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activityId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"vote"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}}]}}]}}]} as unknown as DocumentNode<GetProposalVotesForResolutionQuery, GetProposalVotesForResolutionQueryVariables>;
export const InsertProposalDecisionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertProposalDecision"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"decision_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_decision_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertProposalDecisionMutation, InsertProposalDecisionMutationVariables>;
export const InsertProposalLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertProposalLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"log_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_log_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertProposalLogMutation, InsertProposalLogMutationVariables>;
export const UpdateProposalActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateProposalActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_thread_activity_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProposalActivityMutation, UpdateProposalActivityMutationVariables>;
export const InsertProposalEventActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertProposalEventActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"thread_activity_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_thread_activity_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertProposalEventActivityMutation, InsertProposalEventActivityMutationVariables>;
export const GetResolutionCircleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getResolutionCircle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetResolutionCircleQuery, GetResolutionCircleQueryVariables>;
export const InsertResolutionCircleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertResolutionCircle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_circle_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertResolutionCircleMutation, InsertResolutionCircleMutationVariables>;
export const UpdateResolutionCircleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateResolutionCircle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_circle_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateResolutionCircleMutation, UpdateResolutionCircleMutationVariables>;
export const GetResolutionRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getResolutionRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetResolutionRoleQuery, GetResolutionRoleQueryVariables>;
export const InsertResolutionRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertResolutionRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"role_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_role_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertResolutionRoleMutation, InsertResolutionRoleMutationVariables>;
export const UpdateResolutionRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateResolutionRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"role_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_role_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateResolutionRoleMutation, UpdateResolutionRoleMutationVariables>;
export const GetResolutionCircleMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getResolutionCircleMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_member_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetResolutionCircleMemberQuery, GetResolutionCircleMemberQueryVariables>;
export const InsertResolutionCircleMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertResolutionCircleMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_circle_member_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertResolutionCircleMemberMutation, InsertResolutionCircleMemberMutationVariables>;
export const UpdateResolutionCircleMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateResolutionCircleMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_member_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_circle_member_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateResolutionCircleMemberMutation, UpdateResolutionCircleMemberMutationVariables>;
export const GetResolutionCircleLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getResolutionCircleLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_link_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetResolutionCircleLinkQuery, GetResolutionCircleLinkQueryVariables>;
export const InsertResolutionCircleLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertResolutionCircleLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_link_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_circle_link_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertResolutionCircleLinkMutation, InsertResolutionCircleLinkMutationVariables>;
export const UpdateResolutionCircleLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateResolutionCircleLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"circle_link_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_circle_link_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateResolutionCircleLinkMutation, UpdateResolutionCircleLinkMutationVariables>;
export const GetUserForImpersonationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserForImpersonation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}}]}}]}}]} as unknown as DocumentNode<GetUserForImpersonationQuery, GetUserForImpersonationQueryVariables>;
export const CreateImpersonationPatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createImpersonationPat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshTokenHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expiresAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertAuthRefreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"pat"}},{"kind":"ObjectField","name":{"kind":"Name","value":"refreshTokenHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshTokenHash"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"expiresAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expiresAt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateImpersonationPatMutation, CreateImpersonationPatMutationVariables>;
export const RestoreOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restoreOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RestoreOrgMutation, RestoreOrgMutationVariables>;
export const SetUserDisabledDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setUserDisabled"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"disabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disabled"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetUserDisabledMutation, SetUserDisabledMutationVariables>;
export const GetCircleForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCircleForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCircleForSearchQuery, GetCircleForSearchQueryVariables>;
export const GetCirclesForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCirclesForSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCirclesForSearchQuery, GetCirclesForSearchQueryVariables>;
export const GetDecisionForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDecisionForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decision_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DecisionSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DecisionSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetDecisionForSearchQuery, GetDecisionForSearchQueryVariables>;
export const GetDecisionsForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDecisionsForSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decision"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DecisionSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DecisionSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"decision"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetDecisionsForSearchQuery, GetDecisionsForSearchQueryVariables>;
export const GetMeetingForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeetingForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}}]}}]} as unknown as DocumentNode<GetMeetingForSearchQuery, GetMeetingForSearchQueryVariables>;
export const GetMeetingsForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeetingsForSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}}]}}]} as unknown as DocumentNode<GetMeetingsForSearchQuery, GetMeetingsForSearchQueryVariables>;
export const GetMeetingDataForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeetingDataForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"apps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAppFull"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAppFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"user_app"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"secretConfig"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"tmpData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetMeetingDataForSearchQuery, GetMeetingDataForSearchQueryVariables>;
export const ResetLastUpdateSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetLastUpdateSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lastUpdateSource"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ResetLastUpdateSourceMutation, ResetLastUpdateSourceMutationVariables>;
export const UpdateAttendeesStartNotifiedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAttendeesStartNotified"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_meeting_attendee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startNotified"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAttendeesStartNotifiedMutation, UpdateAttendeesStartNotifiedMutationVariables>;
export const GetMeetingAttendeeForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeetingAttendeeForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Meeting"}},{"kind":"Field","name":{"kind":"Name","value":"org"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"apps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAppFull"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingAttendee"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingId"}},{"kind":"Field","name":{"kind":"Name","value":"memberId"}},{"kind":"Field","name":{"kind":"Name","value":"present"}},{"kind":"Field","name":{"kind":"Name","value":"startNotified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"ended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentStepId"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"meeting_attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingAttendee"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Meeting"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"recurringId"}},{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAppFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"user_app"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"secretConfig"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"tmpData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetMeetingAttendeeForSearchQuery, GetMeetingAttendeeForSearchQueryVariables>;
export const UpdateAttendeeStartNotifiedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAttendeeStartNotified"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_meeting_attendee_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startNotified"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateAttendeeStartNotifiedMutation, UpdateAttendeeStartNotifiedMutationVariables>;
export const GetMeetingRecurringDataForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeetingRecurringDataForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meeting_recurring_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"meetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recurringDate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Member"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAppFull"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingRecurring"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"meeting_recurring"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"circleId"}},{"kind":"Field","name":{"kind":"Name","value":"circle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colorHue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stepsConfig"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rrule"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"videoConf"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"invitedReadonly"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pictureFileId"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"inviteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviteDate"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAppFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"user_app"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"secretConfig"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"tmpData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetMeetingRecurringDataForSearchQuery, GetMeetingRecurringDataForSearchQueryVariables>;
export const GetMemberForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMemberForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MemberSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MemberSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]} as unknown as DocumentNode<GetMemberForSearchQuery, GetMemberForSearchQueryVariables>;
export const GetMembersForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembersForSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MemberSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MemberSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]} as unknown as DocumentNode<GetMembersForSearchQuery, GetMembersForSearchQueryVariables>;
export const GetRoleCirclesForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoleCirclesForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"circle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"roleId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CircleSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CircleSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"circle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetRoleCirclesForSearchQuery, GetRoleCirclesForSearchQueryVariables>;
export const GetTaskForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaskForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetTaskForSearchQuery, GetTaskForSearchQueryVariables>;
export const GetTasksForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTasksForSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetTasksForSearchQuery, GetTasksForSearchQueryVariables>;
export const GetThreadForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetThreadForSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thread_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetThreadForSearchQuery, GetThreadForSearchQueryVariables>;
export const GetThreadsForSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetThreadsForSearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ThreadSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ThreadSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"thread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orgId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<GetThreadsForSearchQuery, GetThreadsForSearchQueryVariables>;
export const GetBouncedAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBouncedAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"citext"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdAfter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"emailVerified"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastSeen"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdAfter"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetBouncedAccountQuery, GetBouncedAccountQueryVariables>;
export const UpdateUserMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMetadataMutation, UpdateUserMetadataMutationVariables>;
export const GetOrgMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrgMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"Owner"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrgMembersQuery, GetOrgMembersQueryVariables>;
export const GetUserRoleInOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserRoleInOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserRoleInOrgQuery, GetUserRoleInOrgQueryVariables>;
export const GetApiKeyUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getApiKeyUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"api_key"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"archivedAt"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetApiKeyUserIdQuery, GetApiKeyUserIdQueryVariables>;
export const UpdateApiKeyLastUsedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateApiKeyLastUsed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastUsedAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_api_key_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lastUsedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastUsedAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateApiKeyLastUsedMutation, UpdateApiKeyLastUsedMutationVariables>;

import { print } from 'graphql'

// Add query source to GetMeetingContentDocument
if (GetMeetingContentDocument) {
  Object.assign(GetMeetingContentDocument, {
    loc: { source: { body: print(GetMeetingContentDocument) } }
  });
}

// Add query source to GetThreadsWithMeetingNotesDocument
if (GetThreadsWithMeetingNotesDocument) {
  Object.assign(GetThreadsWithMeetingNotesDocument, {
    loc: { source: { body: print(GetThreadsWithMeetingNotesDocument) } }
  });
}

// Add query source to GetRoleAiDocument
if (GetRoleAiDocument) {
  Object.assign(GetRoleAiDocument, {
    loc: { source: { body: print(GetRoleAiDocument) } }
  });
}

// Add query source to InsertRoleAiDocument
if (InsertRoleAiDocument) {
  Object.assign(InsertRoleAiDocument, {
    loc: { source: { body: print(InsertRoleAiDocument) } }
  });
}

// Add query source to UpdateUserAppDocument
if (UpdateUserAppDocument) {
  Object.assign(UpdateUserAppDocument, {
    loc: { source: { body: print(UpdateUserAppDocument) } }
  });
}

// Add query source to ArchiveUserAppDocument
if (ArchiveUserAppDocument) {
  Object.assign(ArchiveUserAppDocument, {
    loc: { source: { body: print(ArchiveUserAppDocument) } }
  });
}

// Add query source to GetUserAppDocument
if (GetUserAppDocument) {
  Object.assign(GetUserAppDocument, {
    loc: { source: { body: print(GetUserAppDocument) } }
  });
}

// Add query source to GetUserForAppNotificationDocument
if (GetUserForAppNotificationDocument) {
  Object.assign(GetUserForAppNotificationDocument, {
    loc: { source: { body: print(GetUserForAppNotificationDocument) } }
  });
}

// Add query source to GetOrgMeetingsForCalendarAppDocument
if (GetOrgMeetingsForCalendarAppDocument) {
  Object.assign(GetOrgMeetingsForCalendarAppDocument, {
    loc: { source: { body: print(GetOrgMeetingsForCalendarAppDocument) } }
  });
}

// Add query source to GetMeetingForCalendarAppDocument
if (GetMeetingForCalendarAppDocument) {
  Object.assign(GetMeetingForCalendarAppDocument, {
    loc: { source: { body: print(GetMeetingForCalendarAppDocument) } }
  });
}

// Add query source to GetMeetingRecurringForCalendarAppDocument
if (GetMeetingRecurringForCalendarAppDocument) {
  Object.assign(GetMeetingRecurringForCalendarAppDocument, {
    loc: { source: { body: print(GetMeetingRecurringForCalendarAppDocument) } }
  });
}

// Add query source to CreateMeetingForCalendarAppDocument
if (CreateMeetingForCalendarAppDocument) {
  Object.assign(CreateMeetingForCalendarAppDocument, {
    loc: { source: { body: print(CreateMeetingForCalendarAppDocument) } }
  });
}

// Add query source to UpdateMeetingForCalendarAppDocument
if (UpdateMeetingForCalendarAppDocument) {
  Object.assign(UpdateMeetingForCalendarAppDocument, {
    loc: { source: { body: print(UpdateMeetingForCalendarAppDocument) } }
  });
}

// Add query source to DeleteMeetingForCalendarAppDocument
if (DeleteMeetingForCalendarAppDocument) {
  Object.assign(DeleteMeetingForCalendarAppDocument, {
    loc: { source: { body: print(DeleteMeetingForCalendarAppDocument) } }
  });
}

// Add query source to CreateUserAppDocument
if (CreateUserAppDocument) {
  Object.assign(CreateUserAppDocument, {
    loc: { source: { body: print(CreateUserAppDocument) } }
  });
}

// Add query source to GetCircleOrgForArchiveDocument
if (GetCircleOrgForArchiveDocument) {
  Object.assign(GetCircleOrgForArchiveDocument, {
    loc: { source: { body: print(GetCircleOrgForArchiveDocument) } }
  });
}

// Add query source to GetCircleOrgForRestoreDocument
if (GetCircleOrgForRestoreDocument) {
  Object.assign(GetCircleOrgForRestoreDocument, {
    loc: { source: { body: print(GetCircleOrgForRestoreDocument) } }
  });
}

// Add query source to RestoreCircleCascadeDocument
if (RestoreCircleCascadeDocument) {
  Object.assign(RestoreCircleCascadeDocument, {
    loc: { source: { body: print(RestoreCircleCascadeDocument) } }
  });
}

// Add query source to InsertCircleArchiveLogDocument
if (InsertCircleArchiveLogDocument) {
  Object.assign(InsertCircleArchiveLogDocument, {
    loc: { source: { body: print(InsertCircleArchiveLogDocument) } }
  });
}

// Add query source to CancelCircleArchiveLogDocument
if (CancelCircleArchiveLogDocument) {
  Object.assign(CancelCircleArchiveLogDocument, {
    loc: { source: { body: print(CancelCircleArchiveLogDocument) } }
  });
}

// Add query source to GetCircleArchiveLogsInRangeDocument
if (GetCircleArchiveLogsInRangeDocument) {
  Object.assign(GetCircleArchiveLogsInRangeDocument, {
    loc: { source: { body: print(GetCircleArchiveLogsInRangeDocument) } }
  });
}

// Add query source to ArchiveCircleCascadeDocument
if (ArchiveCircleCascadeDocument) {
  Object.assign(ArchiveCircleCascadeDocument, {
    loc: { source: { body: print(ArchiveCircleCascadeDocument) } }
  });
}

// Add query source to GetRecurringMeetingsDocument
if (GetRecurringMeetingsDocument) {
  Object.assign(GetRecurringMeetingsDocument, {
    loc: { source: { body: print(GetRecurringMeetingsDocument) } }
  });
}

// Add query source to GetRecurringMeetingDocument
if (GetRecurringMeetingDocument) {
  Object.assign(GetRecurringMeetingDocument, {
    loc: { source: { body: print(GetRecurringMeetingDocument) } }
  });
}

// Add query source to CreateMeetingDocument
if (CreateMeetingDocument) {
  Object.assign(CreateMeetingDocument, {
    loc: { source: { body: print(CreateMeetingDocument) } }
  });
}

// Add query source to EndOldMeetingsDocument
if (EndOldMeetingsDocument) {
  Object.assign(EndOldMeetingsDocument, {
    loc: { source: { body: print(EndOldMeetingsDocument) } }
  });
}

// Add query source to GetExpiredArchivedOrgsDocument
if (GetExpiredArchivedOrgsDocument) {
  Object.assign(GetExpiredArchivedOrgsDocument, {
    loc: { source: { body: print(GetExpiredArchivedOrgsDocument) } }
  });
}

// Add query source to GetPendingInvitationsDocument
if (GetPendingInvitationsDocument) {
  Object.assign(GetPendingInvitationsDocument, {
    loc: { source: { body: print(GetPendingInvitationsDocument) } }
  });
}

// Add query source to GetProposalsForCronDocument
if (GetProposalsForCronDocument) {
  Object.assign(GetProposalsForCronDocument, {
    loc: { source: { body: print(GetProposalsForCronDocument) } }
  });
}

// Add query source to GetUsersForDigestDocument
if (GetUsersForDigestDocument) {
  Object.assign(GetUsersForDigestDocument, {
    loc: { source: { body: print(GetUsersForDigestDocument) } }
  });
}

// Add query source to GetUserDigestDataDocument
if (GetUserDigestDataDocument) {
  Object.assign(GetUserDigestDataDocument, {
    loc: { source: { body: print(GetUserDigestDataDocument) } }
  });
}

// Add query source to GetUsersWithoutOrgDocument
if (GetUsersWithoutOrgDocument) {
  Object.assign(GetUsersWithoutOrgDocument, {
    loc: { source: { body: print(GetUsersWithoutOrgDocument) } }
  });
}

// Add query source to GetOrgsWithoutSetupDocument
if (GetOrgsWithoutSetupDocument) {
  Object.assign(GetOrgsWithoutSetupDocument, {
    loc: { source: { body: print(GetOrgsWithoutSetupDocument) } }
  });
}

// Add query source to GetOrgsWithoutInviteDocument
if (GetOrgsWithoutInviteDocument) {
  Object.assign(GetOrgsWithoutInviteDocument, {
    loc: { source: { body: print(GetOrgsWithoutInviteDocument) } }
  });
}

// Add query source to GetOrgForDeletionDocument
if (GetOrgForDeletionDocument) {
  Object.assign(GetOrgForDeletionDocument, {
    loc: { source: { body: print(GetOrgForDeletionDocument) } }
  });
}

// Add query source to GetOrgsDeletionCountsDocument
if (GetOrgsDeletionCountsDocument) {
  Object.assign(GetOrgsDeletionCountsDocument, {
    loc: { source: { body: print(GetOrgsDeletionCountsDocument) } }
  });
}

// Add query source to GetOrgsSubscriptionsForDeletionDocument
if (GetOrgsSubscriptionsForDeletionDocument) {
  Object.assign(GetOrgsSubscriptionsForDeletionDocument, {
    loc: { source: { body: print(GetOrgsSubscriptionsForDeletionDocument) } }
  });
}

// Add query source to GetOrgsFilesForDeletionDocument
if (GetOrgsFilesForDeletionDocument) {
  Object.assign(GetOrgsFilesForDeletionDocument, {
    loc: { source: { body: print(GetOrgsFilesForDeletionDocument) } }
  });
}

// Add query source to GetUnsharedFilesForDeletionDocument
if (GetUnsharedFilesForDeletionDocument) {
  Object.assign(GetUnsharedFilesForDeletionDocument, {
    loc: { source: { body: print(GetUnsharedFilesForDeletionDocument) } }
  });
}

// Add query source to DeleteOrgsDocument
if (DeleteOrgsDocument) {
  Object.assign(DeleteOrgsDocument, {
    loc: { source: { body: print(DeleteOrgsDocument) } }
  });
}

// Add query source to GetUserForDeletionDocument
if (GetUserForDeletionDocument) {
  Object.assign(GetUserForDeletionDocument, {
    loc: { source: { body: print(GetUserForDeletionDocument) } }
  });
}

// Add query source to GetMembersForUserDeletionDocument
if (GetMembersForUserDeletionDocument) {
  Object.assign(GetMembersForUserDeletionDocument, {
    loc: { source: { body: print(GetMembersForUserDeletionDocument) } }
  });
}

// Add query source to GetOrgSharingForUserDeletionDocument
if (GetOrgSharingForUserDeletionDocument) {
  Object.assign(GetOrgSharingForUserDeletionDocument, {
    loc: { source: { body: print(GetOrgSharingForUserDeletionDocument) } }
  });
}

// Add query source to GetSharedContentForUserDeletionDocument
if (GetSharedContentForUserDeletionDocument) {
  Object.assign(GetSharedContentForUserDeletionDocument, {
    loc: { source: { body: print(GetSharedContentForUserDeletionDocument) } }
  });
}

// Add query source to GetAccountDataForUserDeletionDocument
if (GetAccountDataForUserDeletionDocument) {
  Object.assign(GetAccountDataForUserDeletionDocument, {
    loc: { source: { body: print(GetAccountDataForUserDeletionDocument) } }
  });
}

// Add query source to GetUploadedFilesForUserDeletionDocument
if (GetUploadedFilesForUserDeletionDocument) {
  Object.assign(GetUploadedFilesForUserDeletionDocument, {
    loc: { source: { body: print(GetUploadedFilesForUserDeletionDocument) } }
  });
}

// Add query source to EraseAccountForUserDeletionDocument
if (EraseAccountForUserDeletionDocument) {
  Object.assign(EraseAccountForUserDeletionDocument, {
    loc: { source: { body: print(EraseAccountForUserDeletionDocument) } }
  });
}

// Add query source to DeleteUserForUserDeletionDocument
if (DeleteUserForUserDeletionDocument) {
  Object.assign(DeleteUserForUserDeletionDocument, {
    loc: { source: { body: print(DeleteUserForUserDeletionDocument) } }
  });
}

// Add query source to GetOrgMeetingsForIcalDocument
if (GetOrgMeetingsForIcalDocument) {
  Object.assign(GetOrgMeetingsForIcalDocument, {
    loc: { source: { body: print(GetOrgMeetingsForIcalDocument) } }
  });
}

// Add query source to CheckOrgUserDocument
if (CheckOrgUserDocument) {
  Object.assign(CheckOrgUserDocument, {
    loc: { source: { body: print(CheckOrgUserDocument) } }
  });
}

// Add query source to GetOrgNameDocument
if (GetOrgNameDocument) {
  Object.assign(GetOrgNameDocument, {
    loc: { source: { body: print(GetOrgNameDocument) } }
  });
}

// Add query source to GetUserVerifiedEmailDocument
if (GetUserVerifiedEmailDocument) {
  Object.assign(GetUserVerifiedEmailDocument, {
    loc: { source: { body: print(GetUserVerifiedEmailDocument) } }
  });
}

// Add query source to GetUserPendingInvitationsDocument
if (GetUserPendingInvitationsDocument) {
  Object.assign(GetUserPendingInvitationsDocument, {
    loc: { source: { body: print(GetUserPendingInvitationsDocument) } }
  });
}

// Add query source to GetOrgAndMemberDocument
if (GetOrgAndMemberDocument) {
  Object.assign(GetOrgAndMemberDocument, {
    loc: { source: { body: print(GetOrgAndMemberDocument) } }
  });
}

// Add query source to GetOwnMemberToLeaveOrgDocument
if (GetOwnMemberToLeaveOrgDocument) {
  Object.assign(GetOwnMemberToLeaveOrgDocument, {
    loc: { source: { body: print(GetOwnMemberToLeaveOrgDocument) } }
  });
}

// Add query source to GetMemberDocument
if (GetMemberDocument) {
  Object.assign(GetMemberDocument, {
    loc: { source: { body: print(GetMemberDocument) } }
  });
}

// Add query source to UpdateMemberDocument
if (UpdateMemberDocument) {
  Object.assign(UpdateMemberDocument, {
    loc: { source: { body: print(UpdateMemberDocument) } }
  });
}

// Add query source to GetOrgSubscriptionStripeStatusDocument
if (GetOrgSubscriptionStripeStatusDocument) {
  Object.assign(GetOrgSubscriptionStripeStatusDocument, {
    loc: { source: { body: print(GetOrgSubscriptionStripeStatusDocument) } }
  });
}

// Add query source to ArchiveOrgDocument
if (ArchiveOrgDocument) {
  Object.assign(ArchiveOrgDocument, {
    loc: { source: { body: print(ArchiveOrgDocument) } }
  });
}

// Add query source to GetUserDocument
if (GetUserDocument) {
  Object.assign(GetUserDocument, {
    loc: { source: { body: print(GetUserDocument) } }
  });
}

// Add query source to CreateOrgDocument
if (CreateOrgDocument) {
  Object.assign(CreateOrgDocument, {
    loc: { source: { body: print(CreateOrgDocument) } }
  });
}

// Add query source to CreateRoleDocument
if (CreateRoleDocument) {
  Object.assign(CreateRoleDocument, {
    loc: { source: { body: print(CreateRoleDocument) } }
  });
}

// Add query source to CreateCircleDocument
if (CreateCircleDocument) {
  Object.assign(CreateCircleDocument, {
    loc: { source: { body: print(CreateCircleDocument) } }
  });
}

// Add query source to UpdateOrgIconDocument
if (UpdateOrgIconDocument) {
  Object.assign(UpdateOrgIconDocument, {
    loc: { source: { body: print(UpdateOrgIconDocument) } }
  });
}

// Add query source to GetOrgExportDataDocument
if (GetOrgExportDataDocument) {
  Object.assign(GetOrgExportDataDocument, {
    loc: { source: { body: print(GetOrgExportDataDocument) } }
  });
}

// Add query source to GetPublicDataDocument
if (GetPublicDataDocument) {
  Object.assign(GetPublicDataDocument, {
    loc: { source: { body: print(GetPublicDataDocument) } }
  });
}

// Add query source to GetUserImportDocument
if (GetUserImportDocument) {
  Object.assign(GetUserImportDocument, {
    loc: { source: { body: print(GetUserImportDocument) } }
  });
}

// Add query source to CreateOrgImportDocument
if (CreateOrgImportDocument) {
  Object.assign(CreateOrgImportDocument, {
    loc: { source: { body: print(CreateOrgImportDocument) } }
  });
}

// Add query source to CreateMembersImportDocument
if (CreateMembersImportDocument) {
  Object.assign(CreateMembersImportDocument, {
    loc: { source: { body: print(CreateMembersImportDocument) } }
  });
}

// Add query source to CreateRolesImportDocument
if (CreateRolesImportDocument) {
  Object.assign(CreateRolesImportDocument, {
    loc: { source: { body: print(CreateRolesImportDocument) } }
  });
}

// Add query source to CreateCirclesImportDocument
if (CreateCirclesImportDocument) {
  Object.assign(CreateCirclesImportDocument, {
    loc: { source: { body: print(CreateCirclesImportDocument) } }
  });
}

// Add query source to CreateCirclesMembersImportDocument
if (CreateCirclesMembersImportDocument) {
  Object.assign(CreateCirclesMembersImportDocument, {
    loc: { source: { body: print(CreateCirclesMembersImportDocument) } }
  });
}

// Add query source to CreateDecisionsImportDocument
if (CreateDecisionsImportDocument) {
  Object.assign(CreateDecisionsImportDocument, {
    loc: { source: { body: print(CreateDecisionsImportDocument) } }
  });
}

// Add query source to CreateTasksImportDocument
if (CreateTasksImportDocument) {
  Object.assign(CreateTasksImportDocument, {
    loc: { source: { body: print(CreateTasksImportDocument) } }
  });
}

// Add query source to GetFileByNameDocument
if (GetFileByNameDocument) {
  Object.assign(GetFileByNameDocument, {
    loc: { source: { body: print(GetFileByNameDocument) } }
  });
}

// Add query source to GetOrgBySlugDocument
if (GetOrgBySlugDocument) {
  Object.assign(GetOrgBySlugDocument, {
    loc: { source: { body: print(GetOrgBySlugDocument) } }
  });
}

// Add query source to GetOrgDataDocument
if (GetOrgDataDocument) {
  Object.assign(GetOrgDataDocument, {
    loc: { source: { body: print(GetOrgDataDocument) } }
  });
}

// Add query source to GetOrgDataWithArchivedDocument
if (GetOrgDataWithArchivedDocument) {
  Object.assign(GetOrgDataWithArchivedDocument, {
    loc: { source: { body: print(GetOrgDataWithArchivedDocument) } }
  });
}

// Add query source to SetGovernanceModeDocument
if (SetGovernanceModeDocument) {
  Object.assign(SetGovernanceModeDocument, {
    loc: { source: { body: print(SetGovernanceModeDocument) } }
  });
}

// Add query source to UpdateOrgSlugDocument
if (UpdateOrgSlugDocument) {
  Object.assign(UpdateOrgSlugDocument, {
    loc: { source: { body: print(UpdateOrgSlugDocument) } }
  });
}

// Add query source to GetOrgSubscriptionDetailsDocument
if (GetOrgSubscriptionDetailsDocument) {
  Object.assign(GetOrgSubscriptionDetailsDocument, {
    loc: { source: { body: print(GetOrgSubscriptionDetailsDocument) } }
  });
}

// Add query source to GetOrgSubscriptionStripeIdsDocument
if (GetOrgSubscriptionStripeIdsDocument) {
  Object.assign(GetOrgSubscriptionStripeIdsDocument, {
    loc: { source: { body: print(GetOrgSubscriptionStripeIdsDocument) } }
  });
}

// Add query source to UpdateOrgSubscriptionStatusByStripeSubIdDocument
if (UpdateOrgSubscriptionStatusByStripeSubIdDocument) {
  Object.assign(UpdateOrgSubscriptionStatusByStripeSubIdDocument, {
    loc: { source: { body: print(UpdateOrgSubscriptionStatusByStripeSubIdDocument) } }
  });
}

// Add query source to UpdateActiveMembersToMembersDocument
if (UpdateActiveMembersToMembersDocument) {
  Object.assign(UpdateActiveMembersToMembersDocument, {
    loc: { source: { body: print(UpdateActiveMembersToMembersDocument) } }
  });
}

// Add query source to GetOrgMembersWithRolesFromSubscriptionIdDocument
if (GetOrgMembersWithRolesFromSubscriptionIdDocument) {
  Object.assign(GetOrgMembersWithRolesFromSubscriptionIdDocument, {
    loc: { source: { body: print(GetOrgMembersWithRolesFromSubscriptionIdDocument) } }
  });
}

// Add query source to GetUserEmailDocument
if (GetUserEmailDocument) {
  Object.assign(GetUserEmailDocument, {
    loc: { source: { body: print(GetUserEmailDocument) } }
  });
}

// Add query source to GetOrgIdDocument
if (GetOrgIdDocument) {
  Object.assign(GetOrgIdDocument, {
    loc: { source: { body: print(GetOrgIdDocument) } }
  });
}

// Add query source to CreateOrgSubscriptionDocument
if (CreateOrgSubscriptionDocument) {
  Object.assign(CreateOrgSubscriptionDocument, {
    loc: { source: { body: print(CreateOrgSubscriptionDocument) } }
  });
}

// Add query source to UpdateOrgSubscriptionStripeSubIdDocument
if (UpdateOrgSubscriptionStripeSubIdDocument) {
  Object.assign(UpdateOrgSubscriptionStripeSubIdDocument, {
    loc: { source: { body: print(UpdateOrgSubscriptionStripeSubIdDocument) } }
  });
}

// Add query source to GetOrgSubscriptionStatusDocument
if (GetOrgSubscriptionStatusDocument) {
  Object.assign(GetOrgSubscriptionStatusDocument, {
    loc: { source: { body: print(GetOrgSubscriptionStatusDocument) } }
  });
}

// Add query source to GetOrgSubscriptionStripeIdDocument
if (GetOrgSubscriptionStripeIdDocument) {
  Object.assign(GetOrgSubscriptionStripeIdDocument, {
    loc: { source: { body: print(GetOrgSubscriptionStripeIdDocument) } }
  });
}

// Add query source to GetOrgSubscriptionStripeCustomerIdDocument
if (GetOrgSubscriptionStripeCustomerIdDocument) {
  Object.assign(GetOrgSubscriptionStripeCustomerIdDocument, {
    loc: { source: { body: print(GetOrgSubscriptionStripeCustomerIdDocument) } }
  });
}

// Add query source to GetOrgSubscriptionAndActiveMembersDocument
if (GetOrgSubscriptionAndActiveMembersDocument) {
  Object.assign(GetOrgSubscriptionAndActiveMembersDocument, {
    loc: { source: { body: print(GetOrgSubscriptionAndActiveMembersDocument) } }
  });
}

// Add query source to GetAllParticipantsForRecomputeDocument
if (GetAllParticipantsForRecomputeDocument) {
  Object.assign(GetAllParticipantsForRecomputeDocument, {
    loc: { source: { body: print(GetAllParticipantsForRecomputeDocument) } }
  });
}

// Add query source to GetOrgParticipantsForRecomputeDocument
if (GetOrgParticipantsForRecomputeDocument) {
  Object.assign(GetOrgParticipantsForRecomputeDocument, {
    loc: { source: { body: print(GetOrgParticipantsForRecomputeDocument) } }
  });
}

// Add query source to GetOrgIdForRecomputeDocument
if (GetOrgIdForRecomputeDocument) {
  Object.assign(GetOrgIdForRecomputeDocument, {
    loc: { source: { body: print(GetOrgIdForRecomputeDocument) } }
  });
}

// Add query source to ReplaceParticipantsForRecomputeDocument
if (ReplaceParticipantsForRecomputeDocument) {
  Object.assign(ReplaceParticipantsForRecomputeDocument, {
    loc: { source: { body: print(ReplaceParticipantsForRecomputeDocument) } }
  });
}

// Add query source to GetProposalForResolutionDocument
if (GetProposalForResolutionDocument) {
  Object.assign(GetProposalForResolutionDocument, {
    loc: { source: { body: print(GetProposalForResolutionDocument) } }
  });
}

// Add query source to GetProposalVotesForResolutionDocument
if (GetProposalVotesForResolutionDocument) {
  Object.assign(GetProposalVotesForResolutionDocument, {
    loc: { source: { body: print(GetProposalVotesForResolutionDocument) } }
  });
}

// Add query source to InsertProposalDecisionDocument
if (InsertProposalDecisionDocument) {
  Object.assign(InsertProposalDecisionDocument, {
    loc: { source: { body: print(InsertProposalDecisionDocument) } }
  });
}

// Add query source to InsertProposalLogDocument
if (InsertProposalLogDocument) {
  Object.assign(InsertProposalLogDocument, {
    loc: { source: { body: print(InsertProposalLogDocument) } }
  });
}

// Add query source to UpdateProposalActivityDocument
if (UpdateProposalActivityDocument) {
  Object.assign(UpdateProposalActivityDocument, {
    loc: { source: { body: print(UpdateProposalActivityDocument) } }
  });
}

// Add query source to InsertProposalEventActivityDocument
if (InsertProposalEventActivityDocument) {
  Object.assign(InsertProposalEventActivityDocument, {
    loc: { source: { body: print(InsertProposalEventActivityDocument) } }
  });
}

// Add query source to GetResolutionCircleDocument
if (GetResolutionCircleDocument) {
  Object.assign(GetResolutionCircleDocument, {
    loc: { source: { body: print(GetResolutionCircleDocument) } }
  });
}

// Add query source to InsertResolutionCircleDocument
if (InsertResolutionCircleDocument) {
  Object.assign(InsertResolutionCircleDocument, {
    loc: { source: { body: print(InsertResolutionCircleDocument) } }
  });
}

// Add query source to UpdateResolutionCircleDocument
if (UpdateResolutionCircleDocument) {
  Object.assign(UpdateResolutionCircleDocument, {
    loc: { source: { body: print(UpdateResolutionCircleDocument) } }
  });
}

// Add query source to GetResolutionRoleDocument
if (GetResolutionRoleDocument) {
  Object.assign(GetResolutionRoleDocument, {
    loc: { source: { body: print(GetResolutionRoleDocument) } }
  });
}

// Add query source to InsertResolutionRoleDocument
if (InsertResolutionRoleDocument) {
  Object.assign(InsertResolutionRoleDocument, {
    loc: { source: { body: print(InsertResolutionRoleDocument) } }
  });
}

// Add query source to UpdateResolutionRoleDocument
if (UpdateResolutionRoleDocument) {
  Object.assign(UpdateResolutionRoleDocument, {
    loc: { source: { body: print(UpdateResolutionRoleDocument) } }
  });
}

// Add query source to GetResolutionCircleMemberDocument
if (GetResolutionCircleMemberDocument) {
  Object.assign(GetResolutionCircleMemberDocument, {
    loc: { source: { body: print(GetResolutionCircleMemberDocument) } }
  });
}

// Add query source to InsertResolutionCircleMemberDocument
if (InsertResolutionCircleMemberDocument) {
  Object.assign(InsertResolutionCircleMemberDocument, {
    loc: { source: { body: print(InsertResolutionCircleMemberDocument) } }
  });
}

// Add query source to UpdateResolutionCircleMemberDocument
if (UpdateResolutionCircleMemberDocument) {
  Object.assign(UpdateResolutionCircleMemberDocument, {
    loc: { source: { body: print(UpdateResolutionCircleMemberDocument) } }
  });
}

// Add query source to GetResolutionCircleLinkDocument
if (GetResolutionCircleLinkDocument) {
  Object.assign(GetResolutionCircleLinkDocument, {
    loc: { source: { body: print(GetResolutionCircleLinkDocument) } }
  });
}

// Add query source to InsertResolutionCircleLinkDocument
if (InsertResolutionCircleLinkDocument) {
  Object.assign(InsertResolutionCircleLinkDocument, {
    loc: { source: { body: print(InsertResolutionCircleLinkDocument) } }
  });
}

// Add query source to UpdateResolutionCircleLinkDocument
if (UpdateResolutionCircleLinkDocument) {
  Object.assign(UpdateResolutionCircleLinkDocument, {
    loc: { source: { body: print(UpdateResolutionCircleLinkDocument) } }
  });
}

// Add query source to GetUserForImpersonationDocument
if (GetUserForImpersonationDocument) {
  Object.assign(GetUserForImpersonationDocument, {
    loc: { source: { body: print(GetUserForImpersonationDocument) } }
  });
}

// Add query source to CreateImpersonationPatDocument
if (CreateImpersonationPatDocument) {
  Object.assign(CreateImpersonationPatDocument, {
    loc: { source: { body: print(CreateImpersonationPatDocument) } }
  });
}

// Add query source to RestoreOrgDocument
if (RestoreOrgDocument) {
  Object.assign(RestoreOrgDocument, {
    loc: { source: { body: print(RestoreOrgDocument) } }
  });
}

// Add query source to SetUserDisabledDocument
if (SetUserDisabledDocument) {
  Object.assign(SetUserDisabledDocument, {
    loc: { source: { body: print(SetUserDisabledDocument) } }
  });
}

// Add query source to GetCircleForSearchDocument
if (GetCircleForSearchDocument) {
  Object.assign(GetCircleForSearchDocument, {
    loc: { source: { body: print(GetCircleForSearchDocument) } }
  });
}

// Add query source to GetCirclesForSearchDocument
if (GetCirclesForSearchDocument) {
  Object.assign(GetCirclesForSearchDocument, {
    loc: { source: { body: print(GetCirclesForSearchDocument) } }
  });
}

// Add query source to GetDecisionForSearchDocument
if (GetDecisionForSearchDocument) {
  Object.assign(GetDecisionForSearchDocument, {
    loc: { source: { body: print(GetDecisionForSearchDocument) } }
  });
}

// Add query source to GetDecisionsForSearchDocument
if (GetDecisionsForSearchDocument) {
  Object.assign(GetDecisionsForSearchDocument, {
    loc: { source: { body: print(GetDecisionsForSearchDocument) } }
  });
}

// Add query source to GetMeetingForSearchDocument
if (GetMeetingForSearchDocument) {
  Object.assign(GetMeetingForSearchDocument, {
    loc: { source: { body: print(GetMeetingForSearchDocument) } }
  });
}

// Add query source to GetMeetingsForSearchDocument
if (GetMeetingsForSearchDocument) {
  Object.assign(GetMeetingsForSearchDocument, {
    loc: { source: { body: print(GetMeetingsForSearchDocument) } }
  });
}

// Add query source to GetMeetingDataForSearchDocument
if (GetMeetingDataForSearchDocument) {
  Object.assign(GetMeetingDataForSearchDocument, {
    loc: { source: { body: print(GetMeetingDataForSearchDocument) } }
  });
}

// Add query source to ResetLastUpdateSourceDocument
if (ResetLastUpdateSourceDocument) {
  Object.assign(ResetLastUpdateSourceDocument, {
    loc: { source: { body: print(ResetLastUpdateSourceDocument) } }
  });
}

// Add query source to UpdateAttendeesStartNotifiedDocument
if (UpdateAttendeesStartNotifiedDocument) {
  Object.assign(UpdateAttendeesStartNotifiedDocument, {
    loc: { source: { body: print(UpdateAttendeesStartNotifiedDocument) } }
  });
}

// Add query source to GetMeetingAttendeeForSearchDocument
if (GetMeetingAttendeeForSearchDocument) {
  Object.assign(GetMeetingAttendeeForSearchDocument, {
    loc: { source: { body: print(GetMeetingAttendeeForSearchDocument) } }
  });
}

// Add query source to UpdateAttendeeStartNotifiedDocument
if (UpdateAttendeeStartNotifiedDocument) {
  Object.assign(UpdateAttendeeStartNotifiedDocument, {
    loc: { source: { body: print(UpdateAttendeeStartNotifiedDocument) } }
  });
}

// Add query source to GetMeetingRecurringDataForSearchDocument
if (GetMeetingRecurringDataForSearchDocument) {
  Object.assign(GetMeetingRecurringDataForSearchDocument, {
    loc: { source: { body: print(GetMeetingRecurringDataForSearchDocument) } }
  });
}

// Add query source to GetMemberForSearchDocument
if (GetMemberForSearchDocument) {
  Object.assign(GetMemberForSearchDocument, {
    loc: { source: { body: print(GetMemberForSearchDocument) } }
  });
}

// Add query source to GetMembersForSearchDocument
if (GetMembersForSearchDocument) {
  Object.assign(GetMembersForSearchDocument, {
    loc: { source: { body: print(GetMembersForSearchDocument) } }
  });
}

// Add query source to GetRoleCirclesForSearchDocument
if (GetRoleCirclesForSearchDocument) {
  Object.assign(GetRoleCirclesForSearchDocument, {
    loc: { source: { body: print(GetRoleCirclesForSearchDocument) } }
  });
}

// Add query source to GetTaskForSearchDocument
if (GetTaskForSearchDocument) {
  Object.assign(GetTaskForSearchDocument, {
    loc: { source: { body: print(GetTaskForSearchDocument) } }
  });
}

// Add query source to GetTasksForSearchDocument
if (GetTasksForSearchDocument) {
  Object.assign(GetTasksForSearchDocument, {
    loc: { source: { body: print(GetTasksForSearchDocument) } }
  });
}

// Add query source to GetThreadForSearchDocument
if (GetThreadForSearchDocument) {
  Object.assign(GetThreadForSearchDocument, {
    loc: { source: { body: print(GetThreadForSearchDocument) } }
  });
}

// Add query source to GetThreadsForSearchDocument
if (GetThreadsForSearchDocument) {
  Object.assign(GetThreadsForSearchDocument, {
    loc: { source: { body: print(GetThreadsForSearchDocument) } }
  });
}

// Add query source to GetBouncedAccountDocument
if (GetBouncedAccountDocument) {
  Object.assign(GetBouncedAccountDocument, {
    loc: { source: { body: print(GetBouncedAccountDocument) } }
  });
}

// Add query source to UpdateUserMetadataDocument
if (UpdateUserMetadataDocument) {
  Object.assign(UpdateUserMetadataDocument, {
    loc: { source: { body: print(UpdateUserMetadataDocument) } }
  });
}

// Add query source to GetOrgMembersDocument
if (GetOrgMembersDocument) {
  Object.assign(GetOrgMembersDocument, {
    loc: { source: { body: print(GetOrgMembersDocument) } }
  });
}

// Add query source to GetUserRoleInOrgDocument
if (GetUserRoleInOrgDocument) {
  Object.assign(GetUserRoleInOrgDocument, {
    loc: { source: { body: print(GetUserRoleInOrgDocument) } }
  });
}

// Add query source to GetApiKeyUserIdDocument
if (GetApiKeyUserIdDocument) {
  Object.assign(GetApiKeyUserIdDocument, {
    loc: { source: { body: print(GetApiKeyUserIdDocument) } }
  });
}

// Add query source to UpdateApiKeyLastUsedDocument
if (UpdateApiKeyLastUsedDocument) {
  Object.assign(UpdateApiKeyLastUsedDocument, {
    loc: { source: { body: print(UpdateApiKeyLastUsedDocument) } }
  });
}
