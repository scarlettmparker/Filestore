import { defineLoader } from "@sun/ssr";

const backendUrl = () =>
  (process.env.GRAPHQL_ENDPOINT || "http://localhost:8083/graphql")
    .replace("/graphql", "");

/**
 * Loads all Tailscale nodes for the admin page list.
 */
defineLoader({
  pattern: "tailscaleNodes",
  async loader() {
    try {
      const res = await fetch(`${backendUrl()}/api/headscale/nodes`);
      return { tailscaleNodes: await res.json() };
    } catch {
      return { tailscaleNodes: [] };
    }
  },
});

/**
 * Loads a single Tailscale node by id for the detail panel.
 */
defineLoader({
  pattern: "tailscaleNode/:id",
  async loader(params) {
    const id = params.id as string;
    if (!id) return { tailscaleNode: null };
    try {
      const res = await fetch(`${backendUrl()}/api/headscale/nodes/${id}`);
      if (!res.ok) return { tailscaleNode: null };
      return { tailscaleNode: await res.json() };
    } catch {
      return { tailscaleNode: null };
    }
  },
});
