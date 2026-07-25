import { BreadcrumbProvider } from "@sun/components";
import Nav from "./nav";

type LayoutProps = React.PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  return (
    <BreadcrumbProvider>
      <Nav />
      {children}
    </BreadcrumbProvider>
  );
}
