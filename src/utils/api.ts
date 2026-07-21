/**
 * Generic API helper for making GraphQL requests.
 * Handles fetching data from the GraphQL server with error handling.
 */

import { print, DocumentNode } from "graphql";
import {
  AddTorrentDocument,
  AddTorrentMutation,
  AddTorrentMutationVariables,
  DeleteFileDocument,
  DeleteFileMutation,
  DeleteFileMutationVariables,
  DeleteKeyDocument,
  DeleteKeyMutation,
  DeleteKeyMutationVariables,
  GetPresignedDownloadUrlDocument,
  GetPresignedDownloadUrlMutation,
  GetPresignedDownloadUrlMutationVariables,
  GetPresignedUploadUrlDocument,
  GetPresignedUploadUrlMutation,
  GetPresignedUploadUrlMutationVariables,
  HealthDocument,
  ListBucketsDocument,
  ListKeysDocument,
  ListKeysQuery,
  ListKeysQueryVariables,
  LocateKeyDetailDocument,
  LocateKeyDetailQuery,
  LocateKeyDetailQueryVariables,
  PutKeyDocument,
  PutKeyMutation,
  PutKeyMutationVariables,
  RenameKeyDocument,
  RenameKeyMutation,
  RenameKeyMutationVariables,
} from "~/generated/graphql";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
};

/**
 * Type definition for the operation registry with strong typing.
 */
type OperationRegistry = {
  filestoreQueries: {
    health: DocumentNode;
    listBuckets: DocumentNode;
    listKeys: DocumentNode;
    locate: DocumentNode;
  };
  filestoreMutations: {
    putKey: DocumentNode;
    getPresignedUploadUrl: DocumentNode;
    getPresignedDownloadUrl: DocumentNode;
    deleteFile: DocumentNode;
    deleteKey: DocumentNode;
    renameKey: DocumentNode;
    addTorrent: DocumentNode;
  };
};

/**
 * Registry of GraphQL operations mapped to their query documents.
 */
const operationRegistry: OperationRegistry = {
  filestoreQueries: {
    health: HealthDocument,
    listBuckets: ListBucketsDocument,
    listKeys: ListKeysDocument,
    locate: LocateKeyDetailDocument,
  },
  filestoreMutations: {
    putKey: PutKeyDocument,
    getPresignedUploadUrl: GetPresignedUploadUrlDocument,
    getPresignedDownloadUrl: GetPresignedDownloadUrlDocument,
    deleteFile: DeleteFileDocument,
    deleteKey: DeleteKeyDocument,
    renameKey: RenameKeyDocument,
    addTorrent: AddTorrentDocument,
  },
};

/**
 * Retrieves a GraphQL operation document by its namespaced path.
 *
 * @param path The dot-separated path to the operation
 * @returns The DocumentNode if found, otherwise undefined.
 */
function getOperation(path: string): DocumentNode | undefined {
  const parts = path.split(".");
  let current: unknown = operationRegistry;
  for (const part of parts) {
    if (
      current &&
      typeof current === "object" &&
      current !== null &&
      part in current
    ) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current as DocumentNode;
}

/**
 * Registers a new GraphQL operation with its query document.
 *
 * @param operationName The name of the operation.
 * @param queryDocument The GraphQL query document.
 */
export function registerGraphQLOperation(
  operationName: string,
  queryDocument: DocumentNode,
): void {
  (operationRegistry as Record<string, unknown>)[operationName] = queryDocument;
}

/**
 * Retry with backoff function.
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  delays: number[],
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i <= delays.length; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < delays.length) {
        await new Promise((resolve) => setTimeout(resolve, delays[i]));
      }
    }
  }
  throw lastError;
};

/**
 * Generic function to fetch data from GraphQL server.
 *
 * @param operationName The name of the GraphQL operation to execute.
 * @param variables Variables for the operation (if any).
 * @returns Promise resolving to ApiResponse.
 */
export async function fetchGraphQLData<
  T,
  V extends Record<string, unknown> | undefined = Record<string, unknown>,
>(operationName: string, variables?: V): Promise<ApiResponse<T>> {
  const endpoint =
    process.env.GRAPHQL_ENDPOINT || "http://localhost:8083/graphql";
  const clientSecret = process.env.CLIENT_SECRET || "";
  const clientId = process.env.CLIENT_ID || "filestore";

  const query = getOperation(operationName);
  if (!query) {
    return {
      success: false,
      error: "Unknown operation",
      statusCode: 400,
    };
  }

  try {
    return await retryWithBackoff(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Secret": clientSecret,
          "X-Client-Id": clientId,
        },
        body: JSON.stringify({
          query: print(query),
          variables,
        }),
      });

      if (!response.ok) {
        throw {
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      const result = await response.json();

      if (result.errors) {
        throw {
          message: result.errors
            .map((e: { message: string }) => e.message)
            .join(", "),
          statusCode: 400,
        };
      }

      if (!result.data) {
        throw { message: "No data returned", statusCode: 400 };
      }

      return {
        success: true,
        data: result.data,
      };
    }, [500, 2000, 4000, 6000]);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      "statusCode" in error
    ) {
      return {
        success: false,
        error: error.message as string,
        statusCode: error.statusCode as number,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 500,
    };
  }
}

/**
 * Health operation for status page.
 */
export async function fetchHealth() {
  return fetchGraphQLData("filestoreQueries.health");
}

/**
 * Buckets operation for home page.
 */
export async function fetchListBuckets() {
  return fetchGraphQLData("filestoreQueries.listBuckets");
}

/**
 * List keys under a prefix in the specified bucket.
 *
 * @param bucket The bucket to query.
 * @param prefix Optional folder prefix to list.
 */
export async function fetchListKeys(bucket: string, prefix?: string) {
  return fetchGraphQLData<ListKeysQuery, ListKeysQueryVariables>(
    "filestoreQueries.listKeys",
    { bucket, prefix },
  );
}

/**
 * Create a new key (folder) using putKey.
 *
 * @param bucket The bucket.
 * @param key The key for the folder.
 */
export async function mutatePutKey(bucket: string, key: string | null) {
  return fetchGraphQLData<PutKeyMutation, PutKeyMutationVariables>(
    "filestoreMutations.putKey",
    { bucket, key },
  );
}

/**
 * Delete a file only.
 *
 * @param bucket The bucket of the file.
 * @param key The key of the file to delete.
 */
export async function mutateDeleteFile(bucket: string, key: string) {
  return fetchGraphQLData<DeleteFileMutation, DeleteFileMutationVariables>(
    "filestoreMutations.deleteFile",
    { bucket, key },
  );
}

/**
 * Delete a key (folder) or file.
 * Note: this is a separate mutation from deleteFile to allow for recursively
 * deleting all keys/files under a prefix when deleting a folder key.
 *
 * @param bucket The bucket of the key.
 * @param key The key to delete (can be a folder or file).
 */
export async function mutateDeleteKey(bucket: string, key: string) {
  return fetchGraphQLData<DeleteKeyMutation, DeleteKeyMutationVariables>(
    "filestoreMutations.deleteKey",
    { bucket, key },
  );
}

/**
 * Rename a key.
 *
 * @param bucket The bucket of the key.
 * @param sourceKey The original key to rename (can be a folder or file).
 * @param targetKey The new key name (can be a folder or file). If the source is a folder,
 * all nested keys/files will be renamed with the new prefix.
 * @param merge Whether to merge with existing keys if targetKey already exists.
 */
export async function mutateRenameKey(
  bucket: string,
  sourceKey: string,
  targetKey: string,
  merge?: boolean,
) {
  return fetchGraphQLData<RenameKeyMutation, RenameKeyMutationVariables>(
    "filestoreMutations.renameKey",
    {
      bucket,
      sourceKey,
      targetKey,
      merge: merge || false,
    },
  );
}

/**
 * Get a presigned PUT URL for direct upload.
 */
export async function mutateGetPresignedUploadUrl(
  bucket: string,
  key: string,
  contentType?: string,
) {
  return fetchGraphQLData<
    GetPresignedUploadUrlMutation,
    GetPresignedUploadUrlMutationVariables
  >("filestoreMutations.getPresignedUploadUrl", {
    bucket,
    key,
    contentType: contentType || null,
  }).then((res) => res?.data?.filestoreMutations?.getPresignedUploadUrl);
}

/**
 * Get a presigned GET URL for direct download.
 */
export async function mutateGetPresignedDownloadUrl(
  bucket: string,
  key: string,
) {
  return fetchGraphQLData<
    GetPresignedDownloadUrlMutation,
    GetPresignedDownloadUrlMutationVariables
  >("filestoreMutations.getPresignedDownloadUrl", {
    bucket,
    key,
  }).then((res) => res?.data?.filestoreMutations?.getPresignedDownloadUrl);
}

/**
 * Locate a single key's detailed metadata by bucket and key path.
 *
 * @param bucket The bucket containing the key.
 * @param keyPath The full key path to locate.
 */
export async function fetchLocateKeyDetail(bucket: string, keyPath: string) {
  return fetchGraphQLData<LocateKeyDetailQuery, LocateKeyDetailQueryVariables>(
    "filestoreQueries.locate",
    { bucket, keyPath },
  ).then((res) => res?.data?.filestoreQueries?.locate);
}

/**
 * Add a torrent from a magnet link or base64-encoded .torrent file.
 *
 * @param bucket The bucket to download into.
 * @param path The parent folder path, or null for the bucket root.
 * @param magnet A magnet URI, when adding by link.
 * @param torrentFileBase64 A base64-encoded .torrent file, when adding by file.
 */
export async function mutateAddTorrent(
  bucket: string,
  path: string | null,
  magnet: string | null,
  torrentFileBase64: string | null,
) {
  return fetchGraphQLData<AddTorrentMutation, AddTorrentMutationVariables>(
    "filestoreMutations.addTorrent",
    { bucket, path, magnet, torrentFileBase64 },
  ).then((res) => res?.data?.filestoreMutations?.addTorrent);
}
