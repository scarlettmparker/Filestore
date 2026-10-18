import { Card, CardBody } from "@sun/components";
import { ComputerDesktopOutline } from "preact-heroicons";
import { useTranslation } from "@sun/i18n";
import styles from "./tailscale-detail-placeholder.module.css";

/**
 * Placeholder shown when no Tailscale device is selected.
 */
const TailscaleDetailPlaceholder = () => {
  const { t } = useTranslation("admin");
  return (
    <Card>
      <CardBody className={styles.placeholder_body}>
        <ComputerDesktopOutline width={48} height={48} />
        <p>{t("select-device")}</p>
      </CardBody>
    </Card>
  );
};

export default TailscaleDetailPlaceholder;
