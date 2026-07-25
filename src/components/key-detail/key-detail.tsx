import { Card, CardBody } from "@sun/components";
import { formatDate } from "@sun/utils";
import { TFunction } from "i18next";
import type { KeyDetail } from "~/generated/graphql";
import styles from "./key-detail.module.css";

type KeyDetailProps = {
  /**
   * Key detail data fetched server-side.
   */
  detail: KeyDetail;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
} & React.PropsWithChildren;

/**
 * Displays detailed metadata for a selected key in the right panel.
 */
const KeyDetailPanel = (props: KeyDetailProps) => {
  const { detail, t } = props;

  return (
    <Card className={styles.detail_card}>
      <CardBody className={styles.detail_body}>
        <label>{t("detail.key-path")}</label>
        <p className={styles.detail_value}>{detail.keyPath}</p>

        <label>{t("detail.name")}</label>
        <p className={styles.detail_value}>{detail.name || "-"}</p>

        <label>{t("detail.description")}</label>
        <p className={styles.detail_value}>{detail.description || "-"}</p>

        <label>{t("detail.bucket")}</label>
        <p className={styles.detail_value}>{detail.bucket}</p>

        <label>{t("detail.status")}</label>
        <p className={styles.detail_value}>{detail.status}</p>

        <label>{t("detail.created")}</label>
        <p className={styles.detail_value}>{formatDate(detail.createdAt) || "-"}</p>

        <label>{t("detail.last-updated")}</label>
        <p className={styles.detail_value}>{formatDate(detail.lastUpdatedAt) || "-"}</p>
      </CardBody>
    </Card>
  );
};

export default KeyDetailPanel;
