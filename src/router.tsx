import { RouteObject, useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

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
const AccessLayout = lazy(() => import("~/routes/admin/access/access-layout"));
const TailscalePage = lazy(() => import("~/routes/admin/access/tailscale/tailscale-page"));

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
        path: "ip-config",
        element: <Navigate to="/admin/access/ip" replace />,
      },
      {
        path: "ip-config/:id",
        element: <Navigate to="/admin/access/ip/:id" replace />,
      },
      {
        path: "access",
        element: (
          <Suspense fallback={null}>
            <AccessLayout />
          </Suspense>
        ),
        children: [
          {
            path: "ip",
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
            path: "tailscale",
            element: (
              <Suspense fallback={null}>
                <TailscalePage />
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
