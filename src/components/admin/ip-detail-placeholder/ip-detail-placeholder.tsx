import { Card, CardBody } from "@sun/components";
import { WrenchOutline } from "preact-heroicons";
import { useTranslation } from "react-i18next";
import styles from "./ip-detail-placeholder.module.css";

/**
 * Placeholder shown in the IP config detail panel when no entry is selected.
 */
const IpDetailPlaceholder = () => {
  const { t } = useTranslation("admin");

  return (
    <Card>
      <CardBody className={styles.placeholder_body}>
        <WrenchOutline width={48} height={48} />
        <p>{t("ip-select")}</p>
      </CardBody>
    </Card>
  );
};

export default IpDetailPlaceholder;
