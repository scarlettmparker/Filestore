/**
 * Returns the base URL for the backend API derived from the GraphQL endpoint.
 *
 * @returns normalized backend base URL without a trailing slash
 */
export function getBackendApiBase(): string {
  const endpoint = process.env.GRAPHQL_ENDPOINT || "http://localhost:8083/graphql";

  try {
    const url = new URL(endpoint);
    url.pathname = "/";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return endpoint.replace(/\/graphql$/, "").replace(/\/$/, "");
  }
}

/**
 * Reports whether an object exists by requesting a single byte of it.
 *
 * @param bucket bucket holding the object
 * @param key object key
 */
export async function objectExists(bucket: string, key: string): Promise<boolean> {
  const url = `${getBackendApiBase()}/api/view/${encodeURIComponent(
    bucket,
  )}?key=${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, { headers: { Range: "bytes=0-0" } });
    await response.body?.cancel();
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Starts a background transcode for an MKV or AVI file.
 *
 * @param bucket bucket holding the file
 * @param key key of the file to transcode
 */
export function triggerTranscode(bucket: string, key: string): void {
  const url = `${getBackendApiBase()}/api/transcode`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, key }),
  }).catch((err) => console.error("Transcode failed:", err));
}
