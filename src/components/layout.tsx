import { BreadcrumbProvider } from "@sun/components";

type LayoutProps = React.PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  return <BreadcrumbProvider>{children}</BreadcrumbProvider>;
}
