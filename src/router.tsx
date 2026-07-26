import { RouteObject, useRoutes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("~/routes/index"));
const ViewerRoute = lazy(() => import("~/routes/viewer/viewer"));
const NotFound = lazy(() => import("~/routes/not-found"));
const Status = lazy(() => import("~/routes/status"));
const BucketLayout = lazy(() => import("~/routes/bucket/bucket-layout"));
const Login = lazy(() => import("~/routes/login"));
const AdminLayout = lazy(() => import("~/routes/admin/admin-layout"));
const Admin = lazy(() => import("~/routes/admin"));
const AccountDetailPage = lazy(() => import("~/routes/admin/account-detail-page"));
const IpConfig = lazy(() => import("~/routes/admin/ip-config"));
const IpDetailPage = lazy(() => import("~/routes/admin/ip-config/ip-detail-page"));
const TailscalePage = lazy(() => import("~/routes/admin/access/tailscale/tailscale-page"));
const TailscaleNodeDetail = lazy(() => import("~/routes/admin/access/tailscale/tailscale-node-detail"));

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
    path: "viewer",
    element: (
      <Suspense fallback={null}>
        <ViewerRoute />
      </Suspense>
    ),
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
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "admin",
    element: (
      <Suspense fallback={null}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        path: "access",
        element: <Navigate to="/admin/access/ip" replace />,
      },
      {
        path: "",
        element: (
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: <AccountDetailPage />,
          },
        ],
      },
      {
        path: "access/ip",
        element: (
          <Suspense fallback={null}>
            <IpConfig />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: <IpDetailPage />,
          },
        ],
      },
      {
        path: "access/tailscale",
        element: (
          <Suspense fallback={null}>
            <TailscalePage />
          </Suspense>
        ),
        children: [
          {
            path: ":id",
            element: (
              <Suspense fallback={null}>
                <TailscaleNodeDetail />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const Router = () => {
  return useRoutes(routes);
};
