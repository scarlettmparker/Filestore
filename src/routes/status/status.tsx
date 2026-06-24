import { HealthQuery } from "~/generated/graphql";
import { fetchHealth } from "~/utils/api";
import { pageDataRegistry } from "@sun/ssr";
import { usePageData } from "@sun/ssr/react";

/**
 * Status page, check for health of Vite app and Garage.
 */
const StatusPage = () => {
  const { data: health } = usePageData<
    HealthQuery["filestoreQueries"]["health"]
  >("health", "filestore");

  if (!health) {
    return <>Loading...</>;
  }

  return <>{health}</>;
};

/**
 * Server-side data fetching function for StatusPage.
 */
export async function getHealthData(): Promise<Record<string, unknown> | null> {
  try {
    const result = await fetchHealth();
    if (result?.data && result?.success) {
      const health = (result.data as HealthQuery).filestoreQueries.health;
      if (health) {
        return { health };
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch health data:", error);
    return null;
  }
}

/**
 * Register the data loader for this page.
 */
export function registerStatusDataLoader(): void {
  pageDataRegistry.registerPageDataLoader("filestore", getHealthData);
}

export default StatusPage;
