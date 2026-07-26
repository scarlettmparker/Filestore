import { Card, CardBody, CardHeader, CardTitle, Badge } from "@sun/components";
import { useTranslation } from "react-i18next";
import type { TailscaleDevice } from "~/generated/graphql";
import styles from "./tailscale-detail.module.css";

type TailscaleDetailProps = {
  /**
   * Tailscale device to display.
   */
  device: TailscaleDevice;
};

/**
 * Displays details of a Tailscale device.
 */
const TailscaleDetail = (props: TailscaleDetailProps) => {
  const { device } = props;
  const { t } = useTranslation("admin");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{device.name}</CardTitle>
      </CardHeader>
      <CardBody className={styles.detail_body}>
        <label>{t("status")}</label>
        <p className={styles.detail_value}>
          <Badge>{device.status}</Badge>
        </p>
        <label>{t("tailscale.ip")}</label>
        <p className={styles.detail_value}>{device.ipv4 ?? "-"}</p>
        <label>{t("tailscale.last-seen")}</label>
        <p className={styles.detail_value}>
          {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : "-"}
        </p>
        {device.expiredAt && (
          <>
            <label>{t("tailscale.expired-at")}</label>
            <p className={styles.detail_value}>
              {new Date(device.expiredAt).toLocaleString()}
            </p>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default TailscaleDetail;
