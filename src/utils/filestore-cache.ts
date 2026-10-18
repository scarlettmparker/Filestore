import { makeCacheKey, revalidatePageData } from "@sun/ssr";

/**
 * Builds the page-data cache key for a bucket's key list at a folder path.
 */
export function keysCacheKey(bucket: string, path?: string): string {
  const folderPath = path || "";
  const pattern = folderPath ? "bucket/:alias/*" : "bucket/:alias";
  const params: Record<string, unknown> = folderPath
    ? { alias: bucket, path: folderPath }
    : { alias: bucket };
  return makeCacheKey(pattern, params);
}

/**
 * Background-refetches a bucket's key list after a mutation.
 */
export function revalidateKeys(bucket: string, path?: string): void {
  revalidatePageData([keysCacheKey(bucket, path)]);
}
