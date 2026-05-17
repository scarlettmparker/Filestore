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
    "mutation completeMultipartUpload($bucket: String!, $key: String!, $uploadId: String!, $parts: [CompletedPart!]!) {\n  filestoreMutations {\n    completeMultipartUpload(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      parts: $parts\n    )\n  }\n}": typeof types.CompleteMultipartUploadDocument,
    "query health {\n  filestoreQueries {\n    health\n  }\n}": typeof types.HealthDocument,
    "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}": typeof types.ListBucketsDocument,
    "query listFiles($bucket: String!) {\n  filestoreQueries {\n    listFiles(bucket: $bucket) {\n      key\n      size\n      lastModified\n    }\n  }\n}": typeof types.ListFilesDocument,
    "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}": typeof types.ListKeysDocument,
    "mutation putFile($bucket: String!, $key: String!, $content: String!) {\n  filestoreMutations {\n    putFile(bucket: $bucket, key: $key, content: $content)\n  }\n}": typeof types.PutFileDocument,
    "mutation startMultipartUpload($bucket: String!, $key: String!) {\n  filestoreMutations {\n    startMultipartUpload(bucket: $bucket, key: $key)\n  }\n}": typeof types.StartMultipartUploadDocument,
    "mutation uploadPart($bucket: String!, $key: String!, $uploadId: String!, $partNumber: Int!, $content: String!) {\n  filestoreMutations {\n    uploadPart(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      partNumber: $partNumber\n      content: $content\n    )\n  }\n}": typeof types.UploadPartDocument,
};
const documents: Documents = {
    "mutation completeMultipartUpload($bucket: String!, $key: String!, $uploadId: String!, $parts: [CompletedPart!]!) {\n  filestoreMutations {\n    completeMultipartUpload(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      parts: $parts\n    )\n  }\n}": types.CompleteMultipartUploadDocument,
    "query health {\n  filestoreQueries {\n    health\n  }\n}": types.HealthDocument,
    "query listBuckets {\n  filestoreQueries {\n    listBuckets {\n      id\n      created\n      globalAliases\n      localAliases\n    }\n  }\n}": types.ListBucketsDocument,
    "query listFiles($bucket: String!) {\n  filestoreQueries {\n    listFiles(bucket: $bucket) {\n      key\n      size\n      lastModified\n    }\n  }\n}": types.ListFilesDocument,
    "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}": types.ListKeysDocument,
    "mutation putFile($bucket: String!, $key: String!, $content: String!) {\n  filestoreMutations {\n    putFile(bucket: $bucket, key: $key, content: $content)\n  }\n}": types.PutFileDocument,
    "mutation startMultipartUpload($bucket: String!, $key: String!) {\n  filestoreMutations {\n    startMultipartUpload(bucket: $bucket, key: $key)\n  }\n}": types.StartMultipartUploadDocument,
    "mutation uploadPart($bucket: String!, $key: String!, $uploadId: String!, $partNumber: Int!, $content: String!) {\n  filestoreMutations {\n    uploadPart(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      partNumber: $partNumber\n      content: $content\n    )\n  }\n}": types.UploadPartDocument,
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
export function graphql(source: "mutation completeMultipartUpload($bucket: String!, $key: String!, $uploadId: String!, $parts: [CompletedPart!]!) {\n  filestoreMutations {\n    completeMultipartUpload(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      parts: $parts\n    )\n  }\n}"): (typeof documents)["mutation completeMultipartUpload($bucket: String!, $key: String!, $uploadId: String!, $parts: [CompletedPart!]!) {\n  filestoreMutations {\n    completeMultipartUpload(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      parts: $parts\n    )\n  }\n}"];
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
export function graphql(source: "query listFiles($bucket: String!) {\n  filestoreQueries {\n    listFiles(bucket: $bucket) {\n      key\n      size\n      lastModified\n    }\n  }\n}"): (typeof documents)["query listFiles($bucket: String!) {\n  filestoreQueries {\n    listFiles(bucket: $bucket) {\n      key\n      size\n      lastModified\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}"): (typeof documents)["query listKeys($bucket: String!, $prefix: String) {\n  filestoreQueries {\n    listKeys(bucket: $bucket, prefix: $prefix) {\n      key\n      isDirectory\n      size\n      lastModified\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation putFile($bucket: String!, $key: String!, $content: String!) {\n  filestoreMutations {\n    putFile(bucket: $bucket, key: $key, content: $content)\n  }\n}"): (typeof documents)["mutation putFile($bucket: String!, $key: String!, $content: String!) {\n  filestoreMutations {\n    putFile(bucket: $bucket, key: $key, content: $content)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation startMultipartUpload($bucket: String!, $key: String!) {\n  filestoreMutations {\n    startMultipartUpload(bucket: $bucket, key: $key)\n  }\n}"): (typeof documents)["mutation startMultipartUpload($bucket: String!, $key: String!) {\n  filestoreMutations {\n    startMultipartUpload(bucket: $bucket, key: $key)\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation uploadPart($bucket: String!, $key: String!, $uploadId: String!, $partNumber: Int!, $content: String!) {\n  filestoreMutations {\n    uploadPart(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      partNumber: $partNumber\n      content: $content\n    )\n  }\n}"): (typeof documents)["mutation uploadPart($bucket: String!, $key: String!, $uploadId: String!, $partNumber: Int!, $content: String!) {\n  filestoreMutations {\n    uploadPart(\n      bucket: $bucket\n      key: $key\n      uploadId: $uploadId\n      partNumber: $partNumber\n      content: $content\n    )\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;