import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, CardTitle } from "@sun/components";
import { usePageData } from "@sun/ssr/react";
import type { IpWhitelistEntry } from "~/generated/graphql";
import styles from "./ip-detail.module.css";

type IpDetailProps = {
  /**
   * Entry id to display.
   */
  ipId: string;
};

/**
 * Displays an IP whitelist entry's fields.
 */
const IpDetail = (props: IpDetailProps) => {
  const { ipId } = props;
  const { t } = useTranslation("admin");
  const { data: entries } = usePageData<IpWhitelistEntry[]>(
    "ipEntries",
    "ipEntries",
  );
  const entry = entries?.find((e: IpWhitelistEntry) => e.id === ipId);

  if (!entry) {
    return <p>{t("ip-not-found")}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry.pattern}</CardTitle>
      </CardHeader>
      <CardBody className={styles.detail_body}>
        <label>{t("ip-pattern")}</label>
        <p className={styles.detail_value}>{entry.pattern}</p>
        <label>{t("ip-description")}</label>
        <p className={styles.detail_value}>
          {entry.description ?? t("ip-none")}
        </p>
        <label>{t("status")}</label>
        <p className={styles.detail_value}>
          {entry.enabled ? t("status-active") : t("status-suspended")}
        </p>
        {entry.immutable && (
          <>
            <label>{t("immutable")}</label>
            <p className={styles.detail_value}>{t("immutable-hint")}</p>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default IpDetail;
