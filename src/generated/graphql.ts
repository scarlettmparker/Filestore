/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Long: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  personId: Scalars['ID']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  remoteUsers?: Maybe<Array<RemoteUser>>;
  status: AccountStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type AddTorrentInput = {
  bucket: Scalars['String']['input'];
  magnet?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  torrentFileBase64?: InputMaybe<Scalars['String']['input']>;
};

export type AddTorrentResponse = {
  __typename?: 'AddTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export type AuthResult = {
  __typename?: 'AuthResult';
  accountId: Scalars['ID']['output'];
  personId: Scalars['ID']['output'];
  token: Scalars['String']['output'];
};

export type Bucket = {
  __typename?: 'Bucket';
  created?: Maybe<Scalars['String']['output']>;
  globalAliases?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  localAliases?: Maybe<Array<Scalars['String']['output']>>;
};

export type BucketKeyInput = {
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type CancelTorrentResponse = {
  __typename?: 'CancelTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export type CreateIpWhitelistEntryResponse = {
  __typename?: 'CreateIpWhitelistEntryResponse';
  entry: IpWhitelistEntry;
  message: Scalars['String']['output'];
};

export type DeleteFileResponse = {
  __typename?: 'DeleteFileResponse';
  key: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type DeleteIpWhitelistEntryResponse = {
  __typename?: 'DeleteIpWhitelistEntryResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeleteKeyResponse = {
  __typename?: 'DeleteKeyResponse';
  key: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export enum DeviceStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Suspended = 'SUSPENDED'
}

export type ExpireTailscaleDeviceResponse = {
  __typename?: 'ExpireTailscaleDeviceResponse';
  device: TailscaleDevice;
  message: Scalars['String']['output'];
};

export type File = {
  __typename?: 'File';
  key: Scalars['String']['output'];
  lastModified?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type FilestoreMutations = {
  __typename?: 'FilestoreMutations';
  addTorrent: AddTorrentResponse;
  cancelTorrent: CancelTorrentResponse;
  deleteFile: DeleteFileResponse;
  deleteKey: DeleteKeyResponse;
  getPresignedDownloadUrl: GetPresignedDownloadUrlResponse;
  getPresignedUploadUrl: GetPresignedUploadUrlResponse;
  getPresignedUploadUrls: GetPresignedUploadUrlsResponse;
  pauseTorrent: PauseTorrentResponse;
  putKey: PutKeyResponse;
  renameKey: RenameKeyResponse;
  resumeTorrent: ResumeTorrentResponse;
};


export type FilestoreMutationsAddTorrentArgs = {
  input: AddTorrentInput;
};


export type FilestoreMutationsCancelTorrentArgs = {
  jobId: Scalars['String']['input'];
};


export type FilestoreMutationsDeleteFileArgs = {
  input: BucketKeyInput;
};


export type FilestoreMutationsDeleteKeyArgs = {
  input: BucketKeyInput;
};


export type FilestoreMutationsGetPresignedDownloadUrlArgs = {
  input: BucketKeyInput;
};


export type FilestoreMutationsGetPresignedUploadUrlArgs = {
  input: PresignInput;
};


export type FilestoreMutationsGetPresignedUploadUrlsArgs = {
  input: Array<PresignInput>;
};


export type FilestoreMutationsPauseTorrentArgs = {
  jobId: Scalars['String']['input'];
};


export type FilestoreMutationsPutKeyArgs = {
  input: PutKeyInput;
};


export type FilestoreMutationsRenameKeyArgs = {
  input: RenameKeyInput;
};


export type FilestoreMutationsResumeTorrentArgs = {
  jobId: Scalars['String']['input'];
};

export type FilestoreQueries = {
  __typename?: 'FilestoreQueries';
  health?: Maybe<Scalars['String']['output']>;
  listBuckets?: Maybe<Array<Bucket>>;
  listImages?: Maybe<Array<KeyDetail>>;
  listKeys?: Maybe<Array<KeyEntry>>;
  locate?: Maybe<KeyDetail>;
  locateImage?: Maybe<KeyDetail>;
  searchTorrents: Array<TorrentSearchResult>;
  torrentJob?: Maybe<TorrentJob>;
  torrentJobs?: Maybe<Array<TorrentJob>>;
};


export type FilestoreQueriesListImagesArgs = {
  bucket: Scalars['String']['input'];
};


export type FilestoreQueriesListKeysArgs = {
  bucket: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
};


export type FilestoreQueriesLocateArgs = {
  bucket: Scalars['String']['input'];
  keyPath: Scalars['String']['input'];
};


export type FilestoreQueriesLocateImageArgs = {
  bucket: Scalars['String']['input'];
  keyPath: Scalars['String']['input'];
};


export type FilestoreQueriesSearchTorrentsArgs = {
  query: Scalars['String']['input'];
};


export type FilestoreQueriesTorrentJobArgs = {
  jobId: Scalars['String']['input'];
};


export type FilestoreQueriesTorrentJobsArgs = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TorrentJobStatus>;
};

/** A single filter applied to a paginated query. */
export type FilterInput = {
  field: Scalars['String']['input'];
  operator: FilterOperator;
  value: Scalars['String']['input'];
};

/** Operators for FilterInput. */
export enum FilterOperator {
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  In = 'IN',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  Matches = 'MATCHES',
  NotEquals = 'NOT_EQUALS',
  StartsWith = 'STARTS_WITH'
}

export type GaiaMutations = {
  __typename?: 'GaiaMutations';
  createIpWhitelistEntry: CreateIpWhitelistEntryResponse;
  deleteIpWhitelistEntry: DeleteIpWhitelistEntryResponse;
  expireTailscaleDevice: ExpireTailscaleDeviceResponse;
  login?: Maybe<AuthResult>;
  suspendAccount: SuspendAccountResponse;
  unsuspendAccount: UnsuspendAccountResponse;
  updateIpWhitelistEntry: UpdateIpWhitelistEntryResponse;
};


export type GaiaMutationsCreateIpWhitelistEntryArgs = {
  input: IpWhitelistEntryInput;
};


export type GaiaMutationsDeleteIpWhitelistEntryArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsExpireTailscaleDeviceArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsLoginArgs = {
  input: LoginInput;
};


export type GaiaMutationsSuspendAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsUnsuspendAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsUpdateIpWhitelistEntryArgs = {
  id: Scalars['ID']['input'];
  input: IpWhitelistEntryInput;
};

export type GaiaQueries = {
  __typename?: 'GaiaQueries';
  account?: Maybe<Account>;
  accounts: PagedAccounts;
  ipWhitelistEntries: Array<IpWhitelistEntry>;
  myRoles: Array<Scalars['String']['output']>;
  propertySet?: Maybe<Scalars['JSON']['output']>;
  tailscaleDevice?: Maybe<TailscaleDevice>;
  tailscaleDevices: Array<TailscaleDevice>;
};


export type GaiaQueriesAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaQueriesAccountsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type GaiaQueriesPropertySetArgs = {
  entry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};


export type GaiaQueriesTailscaleDeviceArgs = {
  id: Scalars['ID']['input'];
};

export type GetPresignedDownloadUrlResponse = {
  __typename?: 'GetPresignedDownloadUrlResponse';
  message: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type GetPresignedUploadUrlResponse = {
  __typename?: 'GetPresignedUploadUrlResponse';
  message: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type GetPresignedUploadUrlsResponse = {
  __typename?: 'GetPresignedUploadUrlsResponse';
  message: Scalars['String']['output'];
  urls: Array<Scalars['String']['output']>;
};

export type IpWhitelistEntry = {
  __typename?: 'IpWhitelistEntry';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  immutable: Scalars['Boolean']['output'];
  pattern: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IpWhitelistEntryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  immutable?: InputMaybe<Scalars['Boolean']['input']>;
  pattern: Scalars['String']['input'];
};

export type KeyDetail = {
  __typename?: 'KeyDetail';
  archivedAt?: Maybe<Scalars['String']['output']>;
  bucket: Scalars['String']['output'];
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  keyPath: Scalars['String']['output'];
  lastUpdatedAt?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type KeyEntry = {
  __typename?: 'KeyEntry';
  description?: Maybe<Scalars['String']['output']>;
  isDirectory: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  lastModified?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  torrent?: Maybe<TorrentDownload>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type MagnetDetail = {
  __typename?: 'MagnetDetail';
  comment?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  files?: Maybe<Array<TorrentFile>>;
  id: Scalars['String']['output'];
  infoHash: Scalars['String']['output'];
  infoHashVersion?: Maybe<Scalars['String']['output']>;
  isPrivate: Scalars['Boolean']['output'];
  pieceCount?: Maybe<Scalars['Int']['output']>;
  pieceLength?: Maybe<Scalars['Long']['output']>;
  sourceUri?: Maybe<Scalars['String']['output']>;
  totalSize: Scalars['Long']['output'];
  trackers?: Maybe<Array<Scalars['String']['output']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  filestoreMutations: FilestoreMutations;
  gaiaMutations: GaiaMutations;
};

/** Generic page metadata for a paged list. */
export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PagedAccounts = {
  __typename?: 'PagedAccounts';
  items: Array<Account>;
  pageInfo: PageInfo;
};

/** Generic pagination, sort, and filter input. */
export type PaginationInput = {
  filters?: InputMaybe<Array<FilterInput>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDir?: InputMaybe<SortDirection>;
};

export type PauseTorrentResponse = {
  __typename?: 'PauseTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export type PresignInput = {
  bucket: Scalars['String']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type PutKeyInput = {
  bucket: Scalars['String']['input'];
  key?: InputMaybe<Scalars['String']['input']>;
};

export type PutKeyResponse = {
  __typename?: 'PutKeyResponse';
  key: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  filestoreQueries: FilestoreQueries;
  gaiaQueries: GaiaQueries;
};

/** A user identity on a remote provider. */
export type RemoteUser = {
  __typename?: 'RemoteUser';
  id: Scalars['String']['output'];
  type: RemoteUserType;
};

export type RemoteUserInput = {
  id: Scalars['String']['input'];
  type: RemoteUserType;
};

export enum RemoteUserType {
  Discord = 'DISCORD'
}

export type RenameKeyInput = {
  bucket: Scalars['String']['input'];
  merge: Scalars['Boolean']['input'];
  sourceKey: Scalars['String']['input'];
  targetKey: Scalars['String']['input'];
};

export type RenameKeyResponse = {
  __typename?: 'RenameKeyResponse';
  conflicts: Array<Scalars['String']['output']>;
  hasConflicts: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ResumeTorrentResponse = {
  __typename?: 'ResumeTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SuspendAccountResponse = {
  __typename?: 'SuspendAccountResponse';
  account: Account;
  message: Scalars['String']['output'];
};

export type TailscaleDevice = {
  __typename?: 'TailscaleDevice';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  headscaleId: Scalars['Long']['output'];
  id: Scalars['ID']['output'];
  ipv4?: Maybe<Scalars['String']['output']>;
  lastSeen?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  online: Scalars['Boolean']['output'];
  status: DeviceStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TorrentDownload = {
  __typename?: 'TorrentDownload';
  downloadRateBps?: Maybe<Scalars['Int']['output']>;
  downloadedBytes?: Maybe<Scalars['Long']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  etaSeconds?: Maybe<Scalars['Int']['output']>;
  jobId: Scalars['String']['output'];
  magnetDetailId?: Maybe<Scalars['String']['output']>;
  peersConnected?: Maybe<Scalars['Int']['output']>;
  progress: Scalars['Float']['output'];
  status: TorrentJobStatus;
  totalBytes?: Maybe<Scalars['Long']['output']>;
};

export type TorrentFile = {
  __typename?: 'TorrentFile';
  indexInTorrent: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  size: Scalars['Long']['output'];
};

export type TorrentJob = {
  __typename?: 'TorrentJob';
  bucket: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  downloadRateBps?: Maybe<Scalars['Int']['output']>;
  downloadedBytes: Scalars['Long']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  etaSeconds?: Maybe<Scalars['Long']['output']>;
  id: Scalars['String']['output'];
  infoHash: Scalars['String']['output'];
  magnetDetail?: Maybe<MagnetDetail>;
  peersConnected?: Maybe<Scalars['Int']['output']>;
  progress: Scalars['Float']['output'];
  seedsConnected?: Maybe<Scalars['Int']['output']>;
  sourceType: Scalars['String']['output'];
  status: TorrentJobStatus;
  targetKeyPath: Scalars['String']['output'];
  totalBytes: Scalars['Long']['output'];
  uploadRateBps?: Maybe<Scalars['Int']['output']>;
  uploadedBytes: Scalars['Long']['output'];
};

export enum TorrentJobStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Downloading = 'DOWNLOADING',
  Failed = 'FAILED',
  Metadata = 'METADATA',
  Paused = 'PAUSED',
  Queued = 'QUEUED',
  Transcoding = 'TRANSCODING',
  Uploading = 'UPLOADING'
}

export type TorrentSearchResult = {
  __typename?: 'TorrentSearchResult';
  leechers: Scalars['Int']['output'];
  magnet: Scalars['String']['output'];
  name: Scalars['String']['output'];
  publishDate?: Maybe<Scalars['String']['output']>;
  seeders: Scalars['Int']['output'];
  size: Scalars['String']['output'];
  sizeBytes: Scalars['Long']['output'];
};

export type UnsuspendAccountResponse = {
  __typename?: 'UnsuspendAccountResponse';
  account: Account;
  message: Scalars['String']['output'];
};

export type UpdateIpWhitelistEntryResponse = {
  __typename?: 'UpdateIpWhitelistEntryResponse';
  entry: IpWhitelistEntry;
  message: Scalars['String']['output'];
};

export enum VoteValue {
  Down = 'DOWN',
  Up = 'UP'
}

export type AddTorrentMutationVariables = Exact<{
  input: AddTorrentInput;
}>;


export type AddTorrentMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', addTorrent: { __typename?: 'AddTorrentResponse', message: string, job: { __typename?: 'TorrentJob', id: string, bucket: string, targetKeyPath: string, sourceType: string, status: TorrentJobStatus, infoHash: string, totalBytes: any, downloadedBytes: any, uploadedBytes: any, progress: number, downloadRateBps?: number | null, uploadRateBps?: number | null, peersConnected?: number | null, seedsConnected?: number | null, etaSeconds?: any | null, errorMessage?: string | null, createdAt?: string | null, completedAt?: string | null, magnetDetail?: { __typename?: 'MagnetDetail', id: string, infoHash: string, infoHashVersion?: string | null, displayName: string, sourceUri?: string | null, totalSize: any, comment?: string | null, createdBy?: string | null, pieceLength?: any | null, pieceCount?: number | null, isPrivate: boolean, trackers?: Array<string> | null, files?: Array<{ __typename?: 'TorrentFile', indexInTorrent: number, path: string, size: any }> | null } | null } } } };

export type CancelTorrentMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type CancelTorrentMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', cancelTorrent: { __typename?: 'CancelTorrentResponse', message: string, job: { __typename?: 'TorrentJob', id: string, bucket: string, targetKeyPath: string, sourceType: string, status: TorrentJobStatus, infoHash: string, totalBytes: any, downloadedBytes: any, uploadedBytes: any, progress: number, downloadRateBps?: number | null, uploadRateBps?: number | null, peersConnected?: number | null, seedsConnected?: number | null, etaSeconds?: any | null, errorMessage?: string | null, createdAt?: string | null, completedAt?: string | null, magnetDetail?: { __typename?: 'MagnetDetail', id: string, infoHash: string, infoHashVersion?: string | null, displayName: string, sourceUri?: string | null, totalSize: any, comment?: string | null, createdBy?: string | null, pieceLength?: any | null, pieceCount?: number | null, isPrivate: boolean, trackers?: Array<string> | null, files?: Array<{ __typename?: 'TorrentFile', indexInTorrent: number, path: string, size: any }> | null } | null } } } };

export type DeleteFileMutationVariables = Exact<{
  input: BucketKeyInput;
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', deleteFile: { __typename?: 'DeleteFileResponse', message: string, key: string } } };

export type DeleteKeyMutationVariables = Exact<{
  input: BucketKeyInput;
}>;


export type DeleteKeyMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', deleteKey: { __typename?: 'DeleteKeyResponse', message: string, key: string } } };

export type ExpireTailscaleDeviceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ExpireTailscaleDeviceMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', expireTailscaleDevice: { __typename?: 'ExpireTailscaleDeviceResponse', message: string, device: { __typename?: 'TailscaleDevice', id: string, headscaleId: any, name: string, ipv4?: string | null, status: DeviceStatus, online: boolean, expiredAt?: any | null, lastSeen?: string | null, createdAt?: any | null, updatedAt?: any | null } } } };

export type AccountQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AccountQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', account?: { __typename?: 'Account', id: string, username: string, personId: string, status: AccountStatus, provider?: string | null, createdAt?: any | null, updatedAt?: any | null, remoteUsers?: Array<{ __typename?: 'RemoteUser', type: RemoteUserType, id: string }> | null } | null } };

export type AccountsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type AccountsQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', accounts: { __typename?: 'PagedAccounts', items: Array<{ __typename?: 'Account', id: string, username: string, personId: string, status: AccountStatus, provider?: string | null, createdAt?: any | null, updatedAt?: any | null, remoteUsers?: Array<{ __typename?: 'RemoteUser', type: RemoteUserType, id: string }> | null }>, pageInfo: { __typename?: 'PageInfo', page: number, size: number, totalPages: number, totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type CreateIpWhitelistEntryMutationVariables = Exact<{
  input: IpWhitelistEntryInput;
}>;


export type CreateIpWhitelistEntryMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', createIpWhitelistEntry: { __typename?: 'CreateIpWhitelistEntryResponse', message: string, entry: { __typename?: 'IpWhitelistEntry', id: string, pattern: string, description?: string | null, enabled: boolean, immutable: boolean, createdAt?: any | null, updatedAt?: any | null } } } };

export type DeleteIpWhitelistEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteIpWhitelistEntryMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', deleteIpWhitelistEntry: { __typename?: 'DeleteIpWhitelistEntryResponse', message: string, id: string } } };

export type IpWhitelistEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type IpWhitelistEntriesQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', ipWhitelistEntries: Array<{ __typename?: 'IpWhitelistEntry', id: string, pattern: string, description?: string | null, enabled: boolean, immutable: boolean, createdAt?: any | null, updatedAt?: any | null }> } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', login?: { __typename?: 'AuthResult', token: string } | null } };

export type MyRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyRolesQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', myRoles: Array<string> } };

export type SuspendAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SuspendAccountMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', suspendAccount: { __typename?: 'SuspendAccountResponse', message: string, account: { __typename?: 'Account', id: string, username: string, personId: string, status: AccountStatus, provider?: string | null, createdAt?: any | null, updatedAt?: any | null, remoteUsers?: Array<{ __typename?: 'RemoteUser', type: RemoteUserType, id: string }> | null } } } };

export type UnsuspendAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnsuspendAccountMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', unsuspendAccount: { __typename?: 'UnsuspendAccountResponse', message: string, account: { __typename?: 'Account', id: string, username: string, personId: string, status: AccountStatus, provider?: string | null, createdAt?: any | null, updatedAt?: any | null, remoteUsers?: Array<{ __typename?: 'RemoteUser', type: RemoteUserType, id: string }> | null } } } };

export type UpdateIpWhitelistEntryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: IpWhitelistEntryInput;
}>;


export type UpdateIpWhitelistEntryMutation = { __typename?: 'Mutation', gaiaMutations: { __typename?: 'GaiaMutations', updateIpWhitelistEntry: { __typename?: 'UpdateIpWhitelistEntryResponse', message: string, entry: { __typename?: 'IpWhitelistEntry', id: string, pattern: string, description?: string | null, enabled: boolean, immutable: boolean, createdAt?: any | null, updatedAt?: any | null } } } };

export type GetPresignedDownloadUrlMutationVariables = Exact<{
  input: BucketKeyInput;
}>;


export type GetPresignedDownloadUrlMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', getPresignedDownloadUrl: { __typename?: 'GetPresignedDownloadUrlResponse', message: string, url: string } } };

export type GetPresignedUploadUrlMutationVariables = Exact<{
  input: PresignInput;
}>;


export type GetPresignedUploadUrlMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', getPresignedUploadUrl: { __typename?: 'GetPresignedUploadUrlResponse', message: string, url: string } } };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', health?: string | null } };

export type ListBucketsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBucketsQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', listBuckets?: Array<{ __typename?: 'Bucket', id: string, created?: string | null, globalAliases?: Array<string> | null, localAliases?: Array<string> | null }> | null } };

export type ListKeysQueryVariables = Exact<{
  bucket: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListKeysQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', listKeys?: Array<{ __typename?: 'KeyEntry', key: string, isDirectory: boolean, size?: number | null, lastModified?: string | null, name?: string | null, description?: string | null, torrent?: { __typename?: 'TorrentDownload', jobId: string, status: TorrentJobStatus, progress: number, magnetDetailId?: string | null, downloadRateBps?: number | null, etaSeconds?: number | null, peersConnected?: number | null, errorMessage?: string | null } | null }> | null } };

export type LocateKeyDetailQueryVariables = Exact<{
  bucket: Scalars['String']['input'];
  keyPath: Scalars['String']['input'];
}>;


export type LocateKeyDetailQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', locate?: { __typename?: 'KeyDetail', id: string, bucket: string, keyPath: string, name?: string | null, description?: string | null, status: string, createdAt?: string | null, lastUpdatedAt?: string | null, archivedAt?: string | null } | null } };

export type PutKeyMutationVariables = Exact<{
  input: PutKeyInput;
}>;


export type PutKeyMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', putKey: { __typename?: 'PutKeyResponse', message: string, key: string } } };

export type RenameKeyMutationVariables = Exact<{
  input: RenameKeyInput;
}>;


export type RenameKeyMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', renameKey: { __typename?: 'RenameKeyResponse', message: string, success: boolean, hasConflicts: boolean, conflicts: Array<string> } } };

export type SearchTorrentsQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchTorrentsQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', searchTorrents: Array<{ __typename?: 'TorrentSearchResult', name: string, seeders: number, leechers: number, size: string, sizeBytes: any, publishDate?: string | null, magnet: string }> } };

export type TailscaleDeviceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TailscaleDeviceQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', tailscaleDevice?: { __typename?: 'TailscaleDevice', id: string, headscaleId: any, name: string, ipv4?: string | null, status: DeviceStatus, online: boolean, expiredAt?: any | null, lastSeen?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } };

export type TailscaleDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type TailscaleDevicesQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', tailscaleDevices: Array<{ __typename?: 'TailscaleDevice', id: string, headscaleId: any, name: string, ipv4?: string | null, status: DeviceStatus, online: boolean, expiredAt?: any | null, lastSeen?: string | null, createdAt?: any | null, updatedAt?: any | null }> } };


export const AddTorrentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTorrent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddTorrentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTorrent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"job"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"targetKeyPath"}},{"kind":"Field","name":{"kind":"Name","value":"sourceType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"infoHash"}},{"kind":"Field","name":{"kind":"Name","value":"totalBytes"}},{"kind":"Field","name":{"kind":"Name","value":"downloadedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"downloadRateBps"}},{"kind":"Field","name":{"kind":"Name","value":"uploadRateBps"}},{"kind":"Field","name":{"kind":"Name","value":"peersConnected"}},{"kind":"Field","name":{"kind":"Name","value":"seedsConnected"}},{"kind":"Field","name":{"kind":"Name","value":"etaSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"magnetDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"infoHash"}},{"kind":"Field","name":{"kind":"Name","value":"infoHashVersion"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUri"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"pieceLength"}},{"kind":"Field","name":{"kind":"Name","value":"pieceCount"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"trackers"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexInTorrent"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddTorrentMutation, AddTorrentMutationVariables>;
export const CancelTorrentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cancelTorrent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelTorrent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"jobId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"job"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"targetKeyPath"}},{"kind":"Field","name":{"kind":"Name","value":"sourceType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"infoHash"}},{"kind":"Field","name":{"kind":"Name","value":"totalBytes"}},{"kind":"Field","name":{"kind":"Name","value":"downloadedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"downloadRateBps"}},{"kind":"Field","name":{"kind":"Name","value":"uploadRateBps"}},{"kind":"Field","name":{"kind":"Name","value":"peersConnected"}},{"kind":"Field","name":{"kind":"Name","value":"seedsConnected"}},{"kind":"Field","name":{"kind":"Name","value":"etaSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"magnetDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"infoHash"}},{"kind":"Field","name":{"kind":"Name","value":"infoHashVersion"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUri"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"pieceLength"}},{"kind":"Field","name":{"kind":"Name","value":"pieceCount"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"trackers"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexInTorrent"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CancelTorrentMutation, CancelTorrentMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BucketKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const DeleteKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BucketKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteKeyMutation, DeleteKeyMutationVariables>;
export const ExpireTailscaleDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"expireTailscaleDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expireTailscaleDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"device"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"headscaleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ipv4"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"online"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ExpireTailscaleDeviceMutation, ExpireTailscaleDeviceMutationVariables>;
export const AccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"account"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"personId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"remoteUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<AccountQuery, AccountQueryVariables>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"personId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"remoteUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const CreateIpWhitelistEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createIpWhitelistEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IpWhitelistEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIpWhitelistEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"immutable"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateIpWhitelistEntryMutation, CreateIpWhitelistEntryMutationVariables>;
export const DeleteIpWhitelistEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteIpWhitelistEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIpWhitelistEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteIpWhitelistEntryMutation, DeleteIpWhitelistEntryMutationVariables>;
export const IpWhitelistEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ipWhitelistEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ipWhitelistEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"immutable"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<IpWhitelistEntriesQuery, IpWhitelistEntriesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const MyRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myRoles"}}]}}]}}]} as unknown as DocumentNode<MyRolesQuery, MyRolesQueryVariables>;
export const SuspendAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"suspendAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"personId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"remoteUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SuspendAccountMutation, SuspendAccountMutationVariables>;
export const UnsuspendAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unsuspendAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsuspendAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"personId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"remoteUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UnsuspendAccountMutation, UnsuspendAccountMutationVariables>;
export const UpdateIpWhitelistEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateIpWhitelistEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IpWhitelistEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIpWhitelistEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"entry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"immutable"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateIpWhitelistEntryMutation, UpdateIpWhitelistEntryMutationVariables>;
export const GetPresignedDownloadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getPresignedDownloadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BucketKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedDownloadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<GetPresignedDownloadUrlMutation, GetPresignedDownloadUrlMutationVariables>;
export const GetPresignedUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getPresignedUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PresignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<GetPresignedUploadUrlMutation, GetPresignedUploadUrlMutationVariables>;
export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;
export const ListBucketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listBuckets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listBuckets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"globalAliases"}},{"kind":"Field","name":{"kind":"Name","value":"localAliases"}}]}}]}}]}}]} as unknown as DocumentNode<ListBucketsQuery, ListBucketsQueryVariables>;
export const ListKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listKeys"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listKeys"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"prefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"isDirectory"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"torrent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"magnetDetailId"}},{"kind":"Field","name":{"kind":"Name","value":"downloadRateBps"}},{"kind":"Field","name":{"kind":"Name","value":"etaSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"peersConnected"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListKeysQuery, ListKeysQueryVariables>;
export const LocateKeyDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"locateKeyDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keyPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"keyPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keyPath"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"keyPath"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LocateKeyDetailQuery, LocateKeyDetailQueryVariables>;
export const PutKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"putKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PutKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"putKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<PutKeyMutation, PutKeyMutationVariables>;
export const RenameKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"renameKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"hasConflicts"}},{"kind":"Field","name":{"kind":"Name","value":"conflicts"}}]}}]}}]}}]} as unknown as DocumentNode<RenameKeyMutation, RenameKeyMutationVariables>;
export const SearchTorrentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTorrents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTorrents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"seeders"}},{"kind":"Field","name":{"kind":"Name","value":"leechers"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"publishDate"}},{"kind":"Field","name":{"kind":"Name","value":"magnet"}}]}}]}}]}}]} as unknown as DocumentNode<SearchTorrentsQuery, SearchTorrentsQueryVariables>;
export const TailscaleDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tailscaleDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tailscaleDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"headscaleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ipv4"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"online"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<TailscaleDeviceQuery, TailscaleDeviceQueryVariables>;
export const TailscaleDevicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tailscaleDevices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tailscaleDevices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"headscaleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ipv4"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"online"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<TailscaleDevicesQuery, TailscaleDevicesQueryVariables>;