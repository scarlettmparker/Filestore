import { useBreadcrumbContext } from "@sun/components";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type FilestoreBreadcrumbProps = {
  /**
   * Bucket alias.
   */
  alias: string;

  /**
   * Current path.
   */
  path?: string;
} & React.PropsWithChildren;

const FilestoreBreadcrumb = (props: FilestoreBreadcrumbProps) => {
  const { children, alias } = props;
  const { setBreadcrumbs, setCurrent } = useBreadcrumbContext();
  const location = useLocation();

  useEffect(() => {
    if (!alias || !location) return;

    // Split out parts. (e.g., "/bucket/images/folders/subfolder")
    const segments = location.pathname.split("/").filter(Boolean);
    const runtimeCrumbs = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return {
        label: segment,
        href: href,
      };
    });

    const baseBreadcrumb = {
      label: "Buckets",
      href: "/",
    };

    // If we have crumbs, override the first one to be "Buckets" navigating to "/"
    if (runtimeCrumbs.length > 0) {
      runtimeCrumbs[0] = baseBreadcrumb;
    } else {
      runtimeCrumbs.push(baseBreadcrumb);
    }

    setBreadcrumbs(runtimeCrumbs);
    setCurrent(location.pathname);
  }, [alias, location.pathname, setBreadcrumbs, setCurrent]);

  return children;
};

export default FilestoreBreadcrumb;
