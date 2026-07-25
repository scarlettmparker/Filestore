import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@sun/components";
import styles from "./admin-subnav.module.css";

const NAV_ITEMS = [
  { labelKey: "accounts", href: "/admin" },
  { labelKey: "ip-config", href: "/admin/ip-config" },
] as const;

/**
 * Sub-navigation for the admin section.
 */
const AdminSubnav = () => {
  const { t } = useTranslation("admin");
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const active = item.href === "/admin"
          ? pathname.startsWith("/admin") && !pathname.startsWith("/admin/ip-config")
          : pathname.startsWith(item.href);
        return (
          <Link key={item.href} to={item.href} className={styles.link}>
            <Button
              variant={active ? "default" : "secondary"}
              className={styles.button}
            >
              {t(item.labelKey)}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminSubnav;
