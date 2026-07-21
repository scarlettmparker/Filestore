import { HealthQuery } from "~/generated/graphql";
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

export default StatusPage;
