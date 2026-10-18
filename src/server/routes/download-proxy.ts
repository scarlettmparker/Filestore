/**
 * Server route for proxying file download requests through the Filestore server.
 *
 * <p>This keeps browser requests same-origin while forwarding the download call
 * to the backend service configured by {@code GRAPHQL_ENDPOINT}.
 */
import { Buffer } from "buffer";
import type { SunApp } from "@sun/ssr/server";

/**
 * Returns the base URL for the backend API derived from the GraphQL endpoint.
 *
 * @returns normalized backend base URL without a trailing slash
 */
function getBackendApiBase(): string {
  const endpoint =
    process.env.GRAPHQL_ENDPOINT || "http://localhost:8083/graphql";

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
 * Registers the download proxy route on the provided Fastify app.
 *
 * @param app Fastify application instance
 */
export function registerDownloadProxyRoute(app: SunApp): void {
  app.get("/rest/buckets/:bucket/download", async (request, reply) => {
    const bucket = request.params.bucket;
    const key = request.query.key;

    if (!key || Array.isArray(key)) {
      return reply.status(400).send({ error: "Missing key query parameter" });
    }

    const backendBase = getBackendApiBase();
    const upstreamUrl = `${backendBase}/api/buckets/${encodeURIComponent(
      bucket,
    )}/download?key=${encodeURIComponent(String(key))}`;

    const upstreamResponse = await fetch(upstreamUrl);
    reply.status(upstreamResponse.status);

    upstreamResponse.headers.forEach((value, name) => {
      if (name.toLowerCase() === "transfer-encoding") return;
      reply.header(name, value);
    });

    const body = await upstreamResponse.arrayBuffer();
    return reply.send(Buffer.from(body));
  });
}
