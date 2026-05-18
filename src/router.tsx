import { RouteObject, useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("~/routes/index"));
const NotFound = lazy(() => import("~/routes/not-found"));
const Status = lazy(() => import("~/routes/status"));
const Bucket = lazy(() => import("~/routes/bucket/[alias]"));
const Folder = lazy(() => import("./routes/bucket/[alias]/[...path]"));

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
    path: "bucket/:alias",
    element: (
      <Suspense fallback={null}>
        <Bucket />
      </Suspense>
    ),
  },
  {
    path: "bucket/:alias/:path",
    element: (
      <Suspense fallback={null}>
        <Folder />
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
