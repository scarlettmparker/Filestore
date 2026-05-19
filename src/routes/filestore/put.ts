import { mutationRegistry } from "~/utils/mutations";
import { MutationResult } from "~/server/actions/utils";
import {
  mutateCompleteMultipartUpload,
  mutateGetPresignedUploadUrl,
  mutatePutFile,
  mutatePutKey,
  mutateStartMultipartUpload,
  mutateUploadPart,
} from "~/utils/api";
import { makeCacheKey } from "~/utils/page-data";
import { ServerRedirectError } from "~/utils/server-redirect";

/**
 * Handler for putting a file or key via server mutation.
 */
async function handlePutFileOrKey(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, content, isFile } = body;

  if (typeof bucket !== "string" || typeof key !== "string") {
    return {
      __typename: "StandardError" as const,
      message: "Invalid input: bucket and key required",
    };
  }

  let result;
  if (isFile && typeof content === "string") {
    result = await mutatePutFile(bucket, key, content);
  } else {
    result = await mutatePutKey(bucket, key);
  }

  if (result?.data) {
    const folderPath = (body.path as string) || "";
    const redirectTo = folderPath
      ? `/bucket/${bucket}/${folderPath}`
      : `/bucket/${bucket}`;
    const pattern = folderPath ? `bucket/:alias/*` : `bucket/:alias`;

    const params: Record<string, unknown> = folderPath
      ? { alias: bucket, path: folderPath }
      : { alias: bucket };
    const cacheKey = makeCacheKey(`${pattern}:keys`, params);

    throw new ServerRedirectError(redirectTo, cacheKey, {
      __typename: "QuerySuccess",
      message: "Uploaded",
      id: "",
    });
  }

  return {
    __typename: "StandardError",
    message: "Failed to put file/key",
  } as const;
}

/**
 * Handle multipart start
 */
async function handleMultipartStart(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key } = body;
  const result = await mutateStartMultipartUpload(
    bucket as string,
    key as string,
  );

  const uploadId = result?.data?.filestoreMutations?.startMultipartUpload;
  if (uploadId) {
    // Return uploadId in the 'id' field so the client can use it
    return { __typename: "QuerySuccess", message: "Started", id: uploadId };
  }

  return {
    __typename: "StandardError",
    message: "Failed to start multipart upload",
  };
}

/**
 * Handle individual part uploads
 */
async function handleMultipartUpload(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, uploadId, partNumber, content } = body;
  const result = await mutateUploadPart(
    bucket as string,
    key as string,
    uploadId as string,
    partNumber as number,
    content as string,
  );

  const etag = result?.data?.filestoreMutations?.uploadPart;
  if (etag) {
    // Return the ETag in the 'id' field so the client can store it for completion
    return { __typename: "QuerySuccess", message: "Part uploaded", id: etag };
  }

  return { __typename: "StandardError", message: "Failed to upload part" };
}

/**
 * Handle multipart completion, executing identical cache/redirect logic
 */
async function handleMultipartComplete(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, uploadId, parts, path } = body;
  const result = await mutateCompleteMultipartUpload(
    bucket as string,
    key as string,
    uploadId as string,
    parts as Array<{ partNumber: number; etag: string }>,
  );

  if (result?.data) {
    const folderPath = (path as string) || "";
    const redirectTo = folderPath
      ? `/bucket/${bucket}/${folderPath}`
      : `/bucket/${bucket}`;
    const pattern = folderPath ? `bucket/:alias/*` : `bucket/:alias`;

    const params: Record<string, unknown> = folderPath
      ? { alias: bucket, path: folderPath }
      : { alias: bucket };
    const cacheKey = makeCacheKey(`${pattern}:keys`, params);

    throw new ServerRedirectError(redirectTo, cacheKey, {
      __typename: "QuerySuccess",
      message: "Uploaded successfully",
      id: "",
    });
  }

  return {
    __typename: "StandardError",
    message: "Failed to complete multipart upload",
  };
}

/**
 * Handle getting a presigned upload URL
 */
async function handleGetPresignedUploadUrl(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, contentType } = body;
  const url = await mutateGetPresignedUploadUrl(
    bucket as string,
    key as string,
    typeof contentType === "string" ? contentType : undefined,
  );

  if (url) {
    return { __typename: "QuerySuccess", message: "URL generated", id: url };
  }

  return {
    __typename: "StandardError",
    message: "Failed to generate presigned URL",
  };
}

/**
 * Register the mutation handler for filestore put operations.
 */
export function registerFilestorePutMutations(): void {
  mutationRegistry.registerMutationHandler("filestore/put", handlePutFileOrKey);
  mutationRegistry.registerMutationHandler(
    "filestore/multipart-start",
    handleMultipartStart,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/multipart-upload",
    handleMultipartUpload,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/multipart-complete",
    handleMultipartComplete,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/get-presigned-upload-url",
    handleGetPresignedUploadUrl,
  );
  console.log("[mutations] Registered filestore/get-presigned-upload-url handler");
}
