import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@sun/components";
import styles from "./admin-subnav.module.css";

const NAV_ITEMS = [
  { labelKey: "accounts", href: "/admin" },
  { labelKey: "ip-config", href: "/admin/ip-config" },
] as const;

/**
 * Finds the most specific nav item matching the current pathname.
 */
const getActiveHref = (pathname: string) => {
  return [...NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href))?.href;
};

/**
 * Sub-navigation for the admin section.
 */
const AdminSubnav = () => {
  const { t } = useTranslation("admin");
  const { pathname } = useLocation();

  const activeHref = getActiveHref(pathname);

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <Link key={item.href} to={item.href} className={styles.link}>
            <Button variant={isActive ? "default" : "secondary"}>
              {t(item.labelKey)}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminSubnav;
