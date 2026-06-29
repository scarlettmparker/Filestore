/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

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
  "mutation deleteFile($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteFile(bucket: $bucket, key: $key)\n  }\n}": typeof types.DeleteFileDocument;
  "mutation deleteKey($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteKey(bucket: $bucket, key: $key)\n  }\n}": typeof types.DeleteKeyDocument;
  "mutation getPresignedDownloadUrl($bucket: String!, $key: String!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(bucket: $bucket, key: $key)\n  }\n}": typeof types.GetPresignedDownloadUrlDocument;
  "mutation getPresignedUploadUrl($bucket: String!, $key: String!, $contentType: String) {\n  filestoreMutations {\n    getPresignedUploadUrl(bucket: $bucket, key: $key, contentType: $contentType)\n  }\n}": typeof types.GetPresignedUploadUrlDocument;
  "query health {\n  filestoreQueries {\n    health\n  }\n}": typeof types.HealthDocument;
  "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}": typeof types.ListBucketsDocument;
  "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}": typeof types.ListKeysDocument;
  "query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}": typeof types.LocateKeyDetailDocument;
  "mutation putKey($bucket: String!, $key: String) {\n  filestoreMutations {\n    putKey(bucket: $bucket, key: $key)\n  }\n}": typeof types.PutKeyDocument;
  "mutation renameKey($bucket: String!, $sourceKey: String!, $targetKey: String!, $merge: Boolean!) {\n  filestoreMutations {\n    renameKey(\n      bucket: $bucket\n      sourceKey: $sourceKey\n      targetKey: $targetKey\n      merge: $merge\n    ) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}": typeof types.RenameKeyDocument;
};
const documents: Documents = {
  "mutation deleteFile($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteFile(bucket: $bucket, key: $key)\n  }\n}":
    types.DeleteFileDocument,
  "mutation deleteKey($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteKey(bucket: $bucket, key: $key)\n  }\n}":
    types.DeleteKeyDocument,
  "mutation getPresignedDownloadUrl($bucket: String!, $key: String!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(bucket: $bucket, key: $key)\n  }\n}":
    types.GetPresignedDownloadUrlDocument,
  "mutation getPresignedUploadUrl($bucket: String!, $key: String!, $contentType: String) {\n  filestoreMutations {\n    getPresignedUploadUrl(bucket: $bucket, key: $key, contentType: $contentType)\n  }\n}":
    types.GetPresignedUploadUrlDocument,
  "query health {\n  filestoreQueries {\n    health\n  }\n}":
    types.HealthDocument,
  "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}":
    types.ListBucketsDocument,
  "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}":
    types.ListKeysDocument,
  "query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}":
    types.LocateKeyDetailDocument,
  "mutation putKey($bucket: String!, $key: String) {\n  filestoreMutations {\n    putKey(bucket: $bucket, key: $key)\n  }\n}":
    types.PutKeyDocument,
  "mutation renameKey($bucket: String!, $sourceKey: String!, $targetKey: String!, $merge: Boolean!) {\n  filestoreMutations {\n    renameKey(\n      bucket: $bucket\n      sourceKey: $sourceKey\n      targetKey: $targetKey\n      merge: $merge\n    ) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}":
    types.RenameKeyDocument,
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
export function graphql(
  source: "mutation deleteFile($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteFile(bucket: $bucket, key: $key)\n  }\n}",
): (typeof documents)["mutation deleteFile($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteFile(bucket: $bucket, key: $key)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation deleteKey($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteKey(bucket: $bucket, key: $key)\n  }\n}",
): (typeof documents)["mutation deleteKey($bucket: String!, $key: String!) {\n  filestoreMutations {\n    deleteKey(bucket: $bucket, key: $key)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation getPresignedDownloadUrl($bucket: String!, $key: String!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(bucket: $bucket, key: $key)\n  }\n}",
): (typeof documents)["mutation getPresignedDownloadUrl($bucket: String!, $key: String!) {\n  filestoreMutations {\n    getPresignedDownloadUrl(bucket: $bucket, key: $key)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation getPresignedUploadUrl($bucket: String!, $key: String!, $contentType: String) {\n  filestoreMutations {\n    getPresignedUploadUrl(bucket: $bucket, key: $key, contentType: $contentType)\n  }\n}",
): (typeof documents)["mutation getPresignedUploadUrl($bucket: String!, $key: String!, $contentType: String) {\n  filestoreMutations {\n    getPresignedUploadUrl(bucket: $bucket, key: $key, contentType: $contentType)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query health {\n  filestoreQueries {\n    health\n  }\n}",
): (typeof documents)["query health {\n  filestoreQueries {\n    health\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}",
): (typeof documents)["query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}",
): (typeof documents)["query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}",
): (typeof documents)["query locateKeyDetail($bucket: String!, $keyPath: String!) {\n  filestoreQueries {\n    locate(bucket: $bucket, keyPath: $keyPath) {\n      id\n      bucket\n      keyPath\n      name\n      description\n      status\n      createdAt\n      lastUpdatedAt\n      archivedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation putKey($bucket: String!, $key: String) {\n  filestoreMutations {\n    putKey(bucket: $bucket, key: $key)\n  }\n}",
): (typeof documents)["mutation putKey($bucket: String!, $key: String) {\n  filestoreMutations {\n    putKey(bucket: $bucket, key: $key)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation renameKey($bucket: String!, $sourceKey: String!, $targetKey: String!, $merge: Boolean!) {\n  filestoreMutations {\n    renameKey(\n      bucket: $bucket\n      sourceKey: $sourceKey\n      targetKey: $targetKey\n      merge: $merge\n    ) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}",
): (typeof documents)["mutation renameKey($bucket: String!, $sourceKey: String!, $targetKey: String!, $merge: Boolean!) {\n  filestoreMutations {\n    renameKey(\n      bucket: $bucket\n      sourceKey: $sourceKey\n      targetKey: $targetKey\n      merge: $merge\n    ) {\n      success\n      hasConflicts\n      conflicts\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
