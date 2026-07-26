import { Button } from "@sun/components";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./access-tabs.module.css";

const TABS = [
  { labelKey: "ip-tab", to: "/admin/access/ip" },
  { labelKey: "tailscale-tab", to: "/admin/access/tailscale" },
];

/**
 * Tab navigation for the Access Control section.
 * Renders IP and Tailscale tabs left-aligned above the content cards.
 */
const AccessTabs = () => {
  const { t } = useTranslation("admin");
  const { pathname } = useLocation();

  return (
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
  );
};

export default AccessTabs;
