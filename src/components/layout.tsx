import { useLocation } from "react-router-dom";
import { BreadcrumbProvider } from "@sun/components";
import { usePageViewTracking } from "@sun/ssr";
import Nav from "./nav";

type LayoutProps = React.PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  usePageViewTracking(pathname);

  return (
    <BreadcrumbProvider>
      {!pathname.startsWith("/viewer") && <Nav />}
      {children}
    </BreadcrumbProvider>
  );
}
