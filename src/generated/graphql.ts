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
};

export type Bucket = {
  __typename?: 'Bucket';
  created?: Maybe<Scalars['String']['output']>;
  globalAliases?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  localAliases?: Maybe<Array<Scalars['String']['output']>>;
};

export type CompletedPart = {
  etag: Scalars['String']['input'];
  partNumber: Scalars['Int']['input'];
};

export type File = {
  __typename?: 'File';
  key: Scalars['String']['output'];
  lastModified?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type FilestoreMutations = {
  __typename?: 'FilestoreMutations';
  deleteFile?: Maybe<Scalars['Boolean']['output']>;
  deleteKey?: Maybe<Scalars['Boolean']['output']>;
  getPresignedDownloadUrl?: Maybe<Scalars['String']['output']>;
  getPresignedUploadUrl?: Maybe<Scalars['String']['output']>;
  putKey?: Maybe<Scalars['Boolean']['output']>;
};


export type FilestoreMutationsDeleteFileArgs = {
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
};


export type FilestoreMutationsDeleteKeyArgs = {
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
};


export type FilestoreMutationsGetPresignedDownloadUrlArgs = {
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
};


export type FilestoreMutationsGetPresignedUploadUrlArgs = {
  bucket: Scalars['String']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};


export type FilestoreMutationsPutKeyArgs = {
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type FilestoreQueries = {
  __typename?: 'FilestoreQueries';
  health?: Maybe<Scalars['String']['output']>;
  listBuckets?: Maybe<Array<Bucket>>;
  listFiles?: Maybe<Array<File>>;
  listKeys?: Maybe<Array<KeyEntry>>;
};


export type FilestoreQueriesListFilesArgs = {
  bucket: Scalars['String']['input'];
};


export type FilestoreQueriesListKeysArgs = {
  bucket: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
};

export type KeyEntry = {
  __typename?: 'KeyEntry';
  isDirectory: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  lastModified?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  filestoreMutations: FilestoreMutations;
};

export type Query = {
  __typename?: 'Query';
  filestoreQueries: FilestoreQueries;
};

export type QueryResult = QuerySuccess | StandardError;

export type QuerySuccess = {
  __typename?: 'QuerySuccess';
  id?: Maybe<Scalars['ID']['output']>;
  message: Scalars['String']['output'];
};

export type StandardError = {
  __typename?: 'StandardError';
  message: Scalars['String']['output'];
};

export type DeleteFileMutationVariables = Exact<{
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', deleteFile?: boolean | null } };

export type DeleteKeyMutationVariables = Exact<{
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
}>;


export type DeleteKeyMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', deleteKey?: boolean | null } };

export type GetPresignedDownloadUrlMutationVariables = Exact<{
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
}>;


export type GetPresignedDownloadUrlMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', getPresignedDownloadUrl?: string | null } };

export type GetPresignedUploadUrlMutationVariables = Exact<{
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPresignedUploadUrlMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', getPresignedUploadUrl?: string | null } };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', health?: string | null } };

export type ListBucketsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBucketsQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', listBuckets?: Array<{ __typename?: 'Bucket', id: string, created?: string | null, globalAliases?: Array<string> | null, localAliases?: Array<string> | null }> | null } };

export type ListFilesQueryVariables = Exact<{
  bucket: Scalars['String']['input'];
}>;


export type ListFilesQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', listFiles?: Array<{ __typename?: 'File', key: string, size?: number | null, lastModified?: string | null }> | null } };

export type ListKeysQueryVariables = Exact<{
  bucket: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListKeysQuery = { __typename?: 'Query', filestoreQueries: { __typename?: 'FilestoreQueries', listKeys?: Array<{ __typename?: 'KeyEntry', key: string, isDirectory: boolean, size?: number | null, lastModified?: string | null }> | null } };

export type PutKeyMutationVariables = Exact<{
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
}>;


export type PutKeyMutation = { __typename?: 'Mutation', filestoreMutations: { __typename?: 'FilestoreMutations', putKey?: boolean | null } };


export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const DeleteKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}]}}]}}]} as unknown as DocumentNode<DeleteKeyMutation, DeleteKeyMutationVariables>;
export const GetPresignedDownloadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getPresignedDownloadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedDownloadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}]}}]}}]} as unknown as DocumentNode<GetPresignedDownloadUrlMutation, GetPresignedDownloadUrlMutationVariables>;
export const GetPresignedUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getPresignedUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedUploadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"contentType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}]}]}}]}}]} as unknown as DocumentNode<GetPresignedUploadUrlMutation, GetPresignedUploadUrlMutationVariables>;
export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;
export const ListBucketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listBuckets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listBuckets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"globalAliases"}},{"kind":"Field","name":{"kind":"Name","value":"localAliases"}}]}}]}}]}}]} as unknown as DocumentNode<ListBucketsQuery, ListBucketsQueryVariables>;
export const ListFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}}]}}]}}]}}]} as unknown as DocumentNode<ListFilesQuery, ListFilesQueryVariables>;
export const ListKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listKeys"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listKeys"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"prefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"isDirectory"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}}]}}]}}]}}]} as unknown as DocumentNode<ListKeysQuery, ListKeysQueryVariables>;
export const PutKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"putKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filestoreMutations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"putKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}]}}]}}]} as unknown as DocumentNode<PutKeyMutation, PutKeyMutationVariables>;