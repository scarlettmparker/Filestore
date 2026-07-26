import { Suspense } from "react";
import { Card, CardBody } from "@sun/components";
import { HealthQuery } from "~/generated/graphql";
import { usePageData } from "@sun/ssr/react";
import StatusSkeleton from "~/components/status-skeleton";

/**
 * Loads and renders the health status.
 */
const StatusContent = () => {
  const { data: health } = usePageData<
    HealthQuery["filestoreQueries"]["health"]
  >("health", "filestore");

  return (
    <Card>
      <CardBody>{health}</CardBody>
    </Card>
  );
};

/**
 * Status page, check for health of Vite app and Garage.
 */
const StatusPage = () => {
  return (
    <Suspense fallback={<StatusSkeleton />}>
      <StatusContent />
    </Suspense>
  );
};

export default StatusPage;
