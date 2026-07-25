/**
 * @fileoverview Defines and sets up all application routes.
 * @module routes
 */
import { renderApp } from "@sun/ssr/server";
import { base, isProduction, manifestPath } from "../config.js";
import { Buffer } from "buffer";
import { matchOriginToMode, FrontendMode } from "@sun/shared";
import { getCookieValue } from "@sun/api";
import {
  AUTH_COOKIE,
  loginViaGaia,
  buildAuthCookie,
  clearAuthCookie,
} from "../src/utils/auth.ts";

/** Pages that do not require an authenticated session. */
const PUBLIC_PAGES = new Set(["/login", "/register"]);

/**
 * Sets up all routes for the Fastify application.
 *
 * @param {import("fastify").FastifyInstance} app - The Fastify application instance.
 * @param {object} vite - The Vite dev server instance (optional, only in development).
 */
export function setupRoutes(app, vite) {
  /**
   * Login via PRG: validate against gaia, set the httpOnly cookie, redirect.
   */
  app.post("/__login", async (request, reply) => {
    const { username, password } = request.body ?? {};
    const token = await loginViaGaia(username, password);
    if (!token) return reply.redirect("/login?error=1");
    reply.header("Set-Cookie", buildAuthCookie(token));
    return reply.redirect("/");
  });

  /**
   * Logout via PRG: clear the cookie, redirect to /login.
   */
  app.post("/__logout", async (_request, reply) => {
    reply.header("Set-Cookie", clearAuthCookie());
    return reply.redirect("/login");
  });

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

    const token = getCookieValue(request.headers.cookie, AUTH_COOKIE);
    const normalizedPath =
      pathname.length > 1 && pathname.endsWith("/")
        ? pathname.replace(/\/+$/, "")
        : pathname;
    const isPublic = PUBLIC_PAGES.has(normalizedPath);

    if (!token && !isPublic) return reply.redirect("/login");
    if (token && isPublic) return reply.redirect("/");

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
          manifestPath,
        },
        reply.raw,
      );
    } catch (e) {
      console.error("Error during route handling:", e);
      reply.status(500).send("Internal Server Error: " + e.message);
    }
  });
}
