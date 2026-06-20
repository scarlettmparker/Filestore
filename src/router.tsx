import { RouteObject, useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("~/routes/index"));
const NotFound = lazy(() => import("~/routes/not-found"));
const Status = lazy(() => import("~/routes/status"));
const BucketLayout = lazy(() => import("~/routes/bucket/bucket-layout"));

/**
 * List of routes.
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "status",
    element: <Status />,
  },
  {
    path: "bucket/:alias/*",
    element: (
      <Suspense fallback={null}>
        <BucketLayout />
      </Suspense>
    ),
  },
  {
    path: "bucket/:alias",
    element: (
      <Suspense fallback={null}>
        <BucketLayout />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const Router = () => {
  return useRoutes(routes);
};
