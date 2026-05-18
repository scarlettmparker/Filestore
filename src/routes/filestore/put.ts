import { mutationRegistry } from "~/utils/mutations";
import { MutationResult } from "~/server/actions/utils";
import { mutatePutFile, mutatePutKey } from "~/utils/api";
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
    const pattern = folderPath ? `bucket/:alias/:path` : `bucket/:alias`;
    const params: Record<string, unknown> = folderPath
      ? { alias: bucket, path: folderPath }
      : { alias: bucket };
    const cacheKey = makeCacheKey(`${pattern}:keys`, params);
    console.log("[put-mutation] throwing redirect for invalidate", { redirectTo, cacheKey, params });
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
 * Register the mutation handler for filestore put operations.
 */
export function registerFilestorePutMutation(): void {
  mutationRegistry.registerMutationHandler("filestore/put", handlePutFileOrKey);
}
