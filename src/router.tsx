import { RouteObject, useRoutes } from "react-router-dom";
import { lazy } from "react";
import Bucket from "./routes/bucket/[alias]";

const Index = lazy(() => import("~/routes/index"));
const NotFound = lazy(() => import("~/routes/not-found"));
const Status = lazy(() => import("~/routes/status"));

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
    element: <Bucket />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const Router = () => {
  return useRoutes(routes);
};
