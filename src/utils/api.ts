/**
 * Generic API helper for making GraphQL requests.
 * Handles fetching data from the GraphQL server with error handling.
 */

import { print, DocumentNode } from "graphql";
import {
  CompleteMultipartUploadDocument,
  CompleteMultipartUploadMutation,
  CompleteMultipartUploadMutationVariables,
  HealthDocument,
  ListBucketsDocument,
  ListFilesDocument,
  ListFilesQuery,
  ListFilesQueryVariables,
  ListKeysDocument,
  ListKeysQuery,
  ListKeysQueryVariables,
  PutFileDocument,
  PutFileMutation,
  PutFileMutationVariables,
  PutKeyDocument,
  PutKeyMutation,
  PutKeyMutationVariables,
  StartMultipartUploadDocument,
  StartMultipartUploadMutation,
  StartMultipartUploadMutationVariables,
  UploadPartDocument,
  UploadPartMutation,
  UploadPartMutationVariables,
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
    listFiles: DocumentNode;
    listKeys: DocumentNode;
  };
  filestoreMutations: {
    putFile: DocumentNode;
    putKey: DocumentNode;
    startMultipartUpload: DocumentNode;
    uploadPart: DocumentNode;
    completeMultipartUpload: DocumentNode;
  };
};

/**
 * Registry of GraphQL operations mapped to their query documents.
 */
const operationRegistry: OperationRegistry = {
  // Queries:
  filestoreQueries: {
    health: HealthDocument,
    listBuckets: ListBucketsDocument,
    listFiles: ListFilesDocument,
    listKeys: ListKeysDocument,
  },
  filestoreMutations: {
    putFile: PutFileDocument,
    putKey: PutKeyDocument,
    startMultipartUpload: StartMultipartUploadDocument,
    uploadPart: UploadPartDocument,
    completeMultipartUpload: CompleteMultipartUploadDocument,
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
 * List files in the given bucket.
 *
 * @param bucket The bucket name to query.
 */
export async function fetchListFiles(bucket: string) {
  return fetchGraphQLData<ListFilesQuery, ListFilesQueryVariables>(
    "filestoreQueries.listFiles",
    { bucket },
  );
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
 * Upload a file directly with content.
 *
 * @param bucket The bucket to upload into.
 * @param key The key (path/file name) for the file.
 * @param content The file content as a string.
 */
export async function mutatePutFile(
  bucket: string,
  key: string,
  content: string,
) {
  return fetchGraphQLData<PutFileMutation, PutFileMutationVariables>(
    "filestoreMutations.putFile",
    { bucket, key, content },
  );
}

/**
 * Begin a multipart upload and return the upload ID.
 *
 * @param bucket The bucket to upload into.
 * @param key The file key for the multipart upload.
 */
export async function mutateStartMultipartUpload(bucket: string, key: string) {
  return fetchGraphQLData<
    StartMultipartUploadMutation,
    StartMultipartUploadMutationVariables
  >("filestoreMutations.startMultipartUpload", { bucket, key });
}

/**
 * Upload a single part of a multipart upload.
 *
 * @param bucket The bucket of the file.
 * @param key The file key.
 * @param uploadId The multipart upload ID.
 * @param partNumber The part number for this chunk.
 * @param content The part contents as a string.
 */
export async function mutateUploadPart(
  bucket: string,
  key: string,
  uploadId: string,
  partNumber: number,
  content: string,
) {
  return fetchGraphQLData<UploadPartMutation, UploadPartMutationVariables>(
    "filestoreMutations.uploadPart",
    { bucket, key, uploadId, partNumber, content },
  );
}

/**
 * Complete a multipart upload with the uploaded part metadata.
 *
 * @param bucket The bucket of the file.
 * @param key The file key.
 * @param uploadId The multipart upload ID.
 * @param parts Array of uploaded part metadata (partNumber + etag).
 */
export async function mutateCompleteMultipartUpload(
  bucket: string,
  key: string,
  uploadId: string,
  parts: Array<{ partNumber: number; etag: string }>,
) {
  return fetchGraphQLData<
    CompleteMultipartUploadMutation,
    CompleteMultipartUploadMutationVariables
  >("filestoreMutations.completeMultipartUpload", {
    bucket,
    key,
    uploadId,
    parts,
  });
}

/**
 * Create a new key (folder) using putKey.
 *
 * @param bucket The bucket.
 * @param key The key for the folder, default "new-key".
 */
export async function mutatePutKey(bucket: string, key: string) {
  return fetchGraphQLData<PutKeyMutation, PutKeyMutationVariables>(
    "filestoreMutations.putKey",
    { bucket, key },
  );
}
