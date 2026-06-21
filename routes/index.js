/**
 * @fileoverview Defines and sets up all application routes.
 * @module routes
 */
import { renderApp } from "../utils/ssr.js";
import { base, isProduction } from "../config.js";
import { Buffer } from "buffer";
import { matchOriginToMode, FrontendMode } from "@sun/shared";

/**
 * Reads a named cookie value from a raw Cookie header.
 *
 * @param {string|undefined} cookieHeader - The full Cookie header string.
 * @param {string} name - Cookie name to read.
 * @returns {string|undefined} Decoded cookie value or undefined if not found.
 */
function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(/;\s*/)) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(index + 1));
    }
  }
}

/**
 * Sets up all routes for the Fastify application.
 *
 * @param {import("fastify").FastifyInstance} app - The Fastify application instance.
 * @param {object} vite - The Vite dev server instance (optional, only in development).
 */
export function setupRoutes(app, vite) {
  /**
   * Catch-all route for server-side rendering of pages.
   * This route handles all GET requests not otherwise handled by static file serving or specific API routes.
   * It fetches user data, loads translations, and renders the React application.
   * It also includes a basic check for file extensions to bypass SSR for static assets.
   *
   * @param {import("fastify").FastifyRequest} request - Fastify request object.
   * @param {import("fastify").FastifyReply} reply - Fastify reply object.
   */
  app.setNotFoundHandler({ method: ["GET"] }, async (request, reply) => {
    const mutationPayloadCookie = getCookieValue(
      request.headers.cookie,
      "mutation_payload",
    );
    const invalidateCacheCookie = getCookieValue(
      request.headers.cookie,
      "invalidate_cache",
    );
    let mutationPayload = null;
    if (mutationPayloadCookie) {
      try {
        mutationPayload = JSON.parse(
          Buffer.from(mutationPayloadCookie, "base64").toString("utf-8"),
        );
      } catch (_) {
        // Do nothing
      }
    }

    const requestUrl = new URL(request.raw.url, "http://localhost");
    const pathname = requestUrl.pathname;
    if (/\.[^/]+$/.test(pathname)) {
      return reply.callNotFound();
    }

    let url = pathname.replace(base, "");
    if (!url.startsWith("/")) url = "/" + url;
    if (requestUrl.search) url += requestUrl.search;

    const langHeader = request.headers["accept-language"] || "en";
    const locale = langHeader.split(",")[0] || "en";

    // Compute pageName the same way as client getPageName()
    const pageName = url.split("/")[1] || "home";

    // Resolve the frontend mode from the HTTP Referer header.
    let frontendMode = FrontendMode.FILESTORE;
    const referer = request.headers.referer;
    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        const ownOrigin = `https://${request.headers.host}`;
        if (refererOrigin !== ownOrigin) {
          const detected = matchOriginToMode(referer);
          if (detected) frontendMode = detected;
        }
      } catch {
        // invalid
      }
    }

    try {
      await renderApp(
        {
          vite,
          isProduction,
          url,
          locale,
          pageName,
          frontendMode,
          mutationPayload,
          invalidateCacheCookie,
        },
        reply.raw,
      );
    } catch (e) {
      console.error("Error during route handling:", e);
      reply.status(500).send("Internal Server Error: " + e.message);
    }
  });
}
