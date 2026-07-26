import { Button } from "@sun/components";
import { useLocation } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./access-layout.module.css";

const TABS = [
  { labelKey: "ip-tab", to: "/admin/access/ip" },
  { labelKey: "tailscale-tab", to: "/admin/access/tailscale" },
];

/**
 * Layout with tab navigation for the Access Control section.
 * Renders IP and Tailscale tabs above nested route content.
 */
const AccessLayout = () => {
  const { t } = useTranslation("admin");
  const { pathname } = useLocation();

  return (
    <>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <Link key={tab.to} to={tab.to} className={styles.link}>
            <Button
              variant={pathname.startsWith(tab.to) ? "default" : "secondary"}
            >
              {t(tab.labelKey)}
            </Button>
          </Link>
        ))}
      </div>
      <Outlet />
    </>
  );
};

export default AccessLayout;
