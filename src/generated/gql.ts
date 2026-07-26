/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation addTorrent($input: AddTorrentInput!) {\n  filestoreMutations {\n    addTorrent(input: $input) {\n      id\n      bucket\n      targetKeyPath\n      status\n      progress\n      magnetDetail {\n        displayName\n      }\n    }\n  }\n}": typeof types.AddTorrentDocument,
    "mutation cancelTorrent($jobId: String!) {\n  filestoreMutations {\n    cancelTorrent(jobId: $jobId) {\n      id\n      status\n    }\n  }\n}": typeof types.CancelTorrentDocument,
    "mutation deleteFile($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteFile(input: $input)\n  }\n}": typeof types.DeleteFileDocument,
    "mutation deleteKey($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteKey(input: $input)\n  }\n}": typeof types.DeleteKeyDocument,
    "query account($id: ID!) {\n  gaiaQueries {\n    account(id: $id) {\n      id\n      username\n      personId\n      status\n      provider\n      remoteUsers {\n        type\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.AccountDocument,
    "query accounts($pagination: PaginationInput) {\n  gaiaQueries {\n    accounts(pagination: $pagination) {\n      items {\n        id\n        username\n        personId\n        status\n        provider\n        remoteUsers {\n          type\n          id\n        }\n        createdAt\n        updatedAt\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": typeof types.AccountsDocument,
    "mutation createIpWhitelistEntry($input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    createIpWhitelistEntry(input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": typeof types.CreateIpWhitelistEntryDocument,
    "mutation deleteIpWhitelistEntry($id: ID!) {\n  gaiaMutations {\n    deleteIpWhitelistEntry(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": typeof types.DeleteIpWhitelistEntryDocument,
    "query ipWhitelistEntries {\n  gaiaQueries {\n    ipWhitelistEntries {\n      id\n      pattern\n      description\n      enabled\n      immutable\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.IpWhitelistEntriesDocument,
    "mutation Login($input: LoginInput!) {\n  gaiaMutations {\n    login(input: $input) {\n      token\n    }\n  }\n}": typeof types.LoginDocument,
    "query myRoles {\n  gaiaQueries {\n    myRoles\n  }\n}": typeof types.MyRolesDocument,
    "mutation suspendAccount($id: ID!) {\n  gaiaMutations {\n    suspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": typeof types.SuspendAccountDocument,
    "mutation unsuspendAccount($id: ID!) {\n  gaiaMutations {\n    unsuspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": typeof types.UnsuspendAccountDocument,
    "mutation updateIpWhitelistEntry($id: ID!, $input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    updateIpWhitelistEntry(id: $id, input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": typeof types.UpdateIpWhitelistEntryDocument,
    "mutation getPresignedDownloadUrl($input: BucketKeyInput!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(input: $input)\n  }\n}": typeof types.GetPresignedDownloadUrlDocument,
    "mutation getPresignedUploadUrl($input: PresignInput!) {\n  filestoreMutations {\n    getPresignedUploadUrl(input: $input)\n  }\n}": typeof types.GetPresignedUploadUrlDocument,
    "query health {\n  filestoreQueries {\n    health\n  }\n}": typeof types.HealthDocument,
    "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}": typeof types.ListBucketsDocument,
    "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n      name\n      description\n      torrent {\n        jobId\n        status\n        progress\n        magnetDetailId\n        downloadRateBps\n        etaSeconds\n        peersConnected\n        errorMessage\n      }\n    }\n  }\n}": typeof types.ListKeysDocument,
    "query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}": typeof types.LocateKeyDetailDocument,
    "mutation putKey($input: PutKeyInput!) {\n  filestoreMutations {\n    putKey(input: $input)\n  }\n}": typeof types.PutKeyDocument,
    "mutation renameKey($input: RenameKeyInput!) {\n  filestoreMutations {\n    renameKey(input: $input) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}": typeof types.RenameKeyDocument,
    "query searchTorrents($query: String!) {\n  filestoreQueries {\n    searchTorrents(query: $query) {\n      name\n      seeders\n      leechers\n      size\n      sizeBytes\n      publishDate\n      magnet\n    }\n  }\n}": typeof types.SearchTorrentsDocument,
};
const documents: Documents = {
    "mutation addTorrent($input: AddTorrentInput!) {\n  filestoreMutations {\n    addTorrent(input: $input) {\n      id\n      bucket\n      targetKeyPath\n      status\n      progress\n      magnetDetail {\n        displayName\n      }\n    }\n  }\n}": types.AddTorrentDocument,
    "mutation cancelTorrent($jobId: String!) {\n  filestoreMutations {\n    cancelTorrent(jobId: $jobId) {\n      id\n      status\n    }\n  }\n}": types.CancelTorrentDocument,
    "mutation deleteFile($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteFile(input: $input)\n  }\n}": types.DeleteFileDocument,
    "mutation deleteKey($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteKey(input: $input)\n  }\n}": types.DeleteKeyDocument,
    "query account($id: ID!) {\n  gaiaQueries {\n    account(id: $id) {\n      id\n      username\n      personId\n      status\n      provider\n      remoteUsers {\n        type\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}": types.AccountDocument,
    "query accounts($pagination: PaginationInput) {\n  gaiaQueries {\n    accounts(pagination: $pagination) {\n      items {\n        id\n        username\n        personId\n        status\n        provider\n        remoteUsers {\n          type\n          id\n        }\n        createdAt\n        updatedAt\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}": types.AccountsDocument,
    "mutation createIpWhitelistEntry($input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    createIpWhitelistEntry(input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": types.CreateIpWhitelistEntryDocument,
    "mutation deleteIpWhitelistEntry($id: ID!) {\n  gaiaMutations {\n    deleteIpWhitelistEntry(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": types.DeleteIpWhitelistEntryDocument,
    "query ipWhitelistEntries {\n  gaiaQueries {\n    ipWhitelistEntries {\n      id\n      pattern\n      description\n      enabled\n      immutable\n      createdAt\n      updatedAt\n    }\n  }\n}": types.IpWhitelistEntriesDocument,
    "mutation Login($input: LoginInput!) {\n  gaiaMutations {\n    login(input: $input) {\n      token\n    }\n  }\n}": types.LoginDocument,
    "query myRoles {\n  gaiaQueries {\n    myRoles\n  }\n}": types.MyRolesDocument,
    "mutation suspendAccount($id: ID!) {\n  gaiaMutations {\n    suspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": types.SuspendAccountDocument,
    "mutation unsuspendAccount($id: ID!) {\n  gaiaMutations {\n    unsuspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": types.UnsuspendAccountDocument,
    "mutation updateIpWhitelistEntry($id: ID!, $input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    updateIpWhitelistEntry(id: $id, input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}": types.UpdateIpWhitelistEntryDocument,
    "mutation getPresignedDownloadUrl($input: BucketKeyInput!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(input: $input)\n  }\n}": types.GetPresignedDownloadUrlDocument,
    "mutation getPresignedUploadUrl($input: PresignInput!) {\n  filestoreMutations {\n    getPresignedUploadUrl(input: $input)\n  }\n}": types.GetPresignedUploadUrlDocument,
    "query health {\n  filestoreQueries {\n    health\n  }\n}": types.HealthDocument,
    "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}": types.ListBucketsDocument,
    "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n      name\n      description\n      torrent {\n        jobId\n        status\n        progress\n        magnetDetailId\n        downloadRateBps\n        etaSeconds\n        peersConnected\n        errorMessage\n      }\n    }\n  }\n}": types.ListKeysDocument,
    "query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}": types.LocateKeyDetailDocument,
    "mutation putKey($input: PutKeyInput!) {\n  filestoreMutations {\n    putKey(input: $input)\n  }\n}": types.PutKeyDocument,
    "mutation renameKey($input: RenameKeyInput!) {\n  filestoreMutations {\n    renameKey(input: $input) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}": types.RenameKeyDocument,
    "query searchTorrents($query: String!) {\n  filestoreQueries {\n    searchTorrents(query: $query) {\n      name\n      seeders\n      leechers\n      size\n      sizeBytes\n      publishDate\n      magnet\n    }\n  }\n}": types.SearchTorrentsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation addTorrent($input: AddTorrentInput!) {\n  filestoreMutations {\n    addTorrent(input: $input) {\n      id\n      bucket\n      targetKeyPath\n      status\n      progress\n      magnetDetail {\n        displayName\n      }\n    }\n  }\n}"): (typeof documents)["mutation addTorrent($input: AddTorrentInput!) {\n  filestoreMutations {\n    addTorrent(input: $input) {\n      id\n      bucket\n      targetKeyPath\n      status\n      progress\n      magnetDetail {\n        displayName\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation cancelTorrent($jobId: String!) {\n  filestoreMutations {\n    cancelTorrent(jobId: $jobId) {\n      id\n      status\n    }\n  }\n}"): (typeof documents)["mutation cancelTorrent($jobId: String!) {\n  filestoreMutations {\n    cancelTorrent(jobId: $jobId) {\n      id\n      status\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation deleteFile($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteFile(input: $input)\n  }\n}"): (typeof documents)["mutation deleteFile($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteFile(input: $input)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation deleteKey($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteKey(input: $input)\n  }\n}"): (typeof documents)["mutation deleteKey($input: BucketKeyInput!) {\n  filestoreMutations {\n    deleteKey(input: $input)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query account($id: ID!) {\n  gaiaQueries {\n    account(id: $id) {\n      id\n      username\n      personId\n      status\n      provider\n      remoteUsers {\n        type\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}"): (typeof documents)["query account($id: ID!) {\n  gaiaQueries {\n    account(id: $id) {\n      id\n      username\n      personId\n      status\n      provider\n      remoteUsers {\n        type\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query accounts($pagination: PaginationInput) {\n  gaiaQueries {\n    accounts(pagination: $pagination) {\n      items {\n        id\n        username\n        personId\n        status\n        provider\n        remoteUsers {\n          type\n          id\n        }\n        createdAt\n        updatedAt\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}"): (typeof documents)["query accounts($pagination: PaginationInput) {\n  gaiaQueries {\n    accounts(pagination: $pagination) {\n      items {\n        id\n        username\n        personId\n        status\n        provider\n        remoteUsers {\n          type\n          id\n        }\n        createdAt\n        updatedAt\n      }\n      pageInfo {\n        page\n        size\n        totalPages\n        totalCount\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createIpWhitelistEntry($input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    createIpWhitelistEntry(input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"): (typeof documents)["mutation createIpWhitelistEntry($input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    createIpWhitelistEntry(input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation deleteIpWhitelistEntry($id: ID!) {\n  gaiaMutations {\n    deleteIpWhitelistEntry(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"): (typeof documents)["mutation deleteIpWhitelistEntry($id: ID!) {\n  gaiaMutations {\n    deleteIpWhitelistEntry(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ipWhitelistEntries {\n  gaiaQueries {\n    ipWhitelistEntries {\n      id\n      pattern\n      description\n      enabled\n      immutable\n      createdAt\n      updatedAt\n    }\n  }\n}"): (typeof documents)["query ipWhitelistEntries {\n  gaiaQueries {\n    ipWhitelistEntries {\n      id\n      pattern\n      description\n      enabled\n      immutable\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginInput!) {\n  gaiaMutations {\n    login(input: $input) {\n      token\n    }\n  }\n}"): (typeof documents)["mutation Login($input: LoginInput!) {\n  gaiaMutations {\n    login(input: $input) {\n      token\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query myRoles {\n  gaiaQueries {\n    myRoles\n  }\n}"): (typeof documents)["query myRoles {\n  gaiaQueries {\n    myRoles\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation suspendAccount($id: ID!) {\n  gaiaMutations {\n    suspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"): (typeof documents)["mutation suspendAccount($id: ID!) {\n  gaiaMutations {\n    suspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation unsuspendAccount($id: ID!) {\n  gaiaMutations {\n    unsuspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"): (typeof documents)["mutation unsuspendAccount($id: ID!) {\n  gaiaMutations {\n    unsuspendAccount(id: $id) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation updateIpWhitelistEntry($id: ID!, $input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    updateIpWhitelistEntry(id: $id, input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"): (typeof documents)["mutation updateIpWhitelistEntry($id: ID!, $input: IpWhitelistEntryInput!) {\n  gaiaMutations {\n    updateIpWhitelistEntry(id: $id, input: $input) {\n      ... on QuerySuccess {\n        __typename\n        message\n        id\n      }\n      ... on StandardError {\n        __typename\n        message\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation getPresignedDownloadUrl($input: BucketKeyInput!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(input: $input)\n  }\n}"): (typeof documents)["mutation getPresignedDownloadUrl($input: BucketKeyInput!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(input: $input)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation getPresignedUploadUrl($input: PresignInput!) {\n  filestoreMutations {\n    getPresignedUploadUrl(input: $input)\n  }\n}"): (typeof documents)["mutation getPresignedUploadUrl($input: PresignInput!) {\n  filestoreMutations {\n    getPresignedUploadUrl(input: $input)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query health {\n  filestoreQueries {\n    health\n  }\n}"): (typeof documents)["query health {\n  filestoreQueries {\n    health\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}"): (typeof documents)["query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n      name\n      description\n      torrent {\n        jobId\n        status\n        progress\n        magnetDetailId\n        downloadRateBps\n        etaSeconds\n        peersConnected\n        errorMessage\n      }\n    }\n  }\n}"): (typeof documents)["query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n      name\n      description\n      torrent {\n        jobId\n        status\n        progress\n        magnetDetailId\n        downloadRateBps\n        etaSeconds\n        peersConnected\n        errorMessage\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}"): (typeof documents)["query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation putKey($input: PutKeyInput!) {\n  filestoreMutations {\n    putKey(input: $input)\n  }\n}"): (typeof documents)["mutation putKey($input: PutKeyInput!) {\n  filestoreMutations {\n    putKey(input: $input)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation renameKey($input: RenameKeyInput!) {\n  filestoreMutations {\n    renameKey(input: $input) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}"): (typeof documents)["mutation renameKey($input: RenameKeyInput!) {\n  filestoreMutations {\n    renameKey(input: $input) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query searchTorrents($query: String!) {\n  filestoreQueries {\n    searchTorrents(query: $query) {\n      name\n      seeders\n      leechers\n      size\n      sizeBytes\n      publishDate\n      magnet\n    }\n  }\n}"): (typeof documents)["query searchTorrents($query: String!) {\n  filestoreQueries {\n    searchTorrents(query: $query) {\n      name\n      seeders\n      leechers\n      size\n      sizeBytes\n      publishDate\n      magnet\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;