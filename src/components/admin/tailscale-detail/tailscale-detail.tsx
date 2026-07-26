import { Card, CardBody, CardHeader, CardTitle, Badge } from "@sun/components";
import { useTranslation } from "react-i18next";
import styles from "./tailscale-detail.module.css";

type TailscaleNode = {
  id: number;
  name: string;
  ipv4: string;
  online: boolean;
  lastSeen: string;
};

type TailscaleDetailProps = {
  /**
   * Tailscale node to display.
   */
  node: TailscaleNode;
};

/**
 * Displays details of a Tailscale device.
 */
const TailscaleDetail = (props: TailscaleDetailProps) => {
  const { node } = props;
  const { t } = useTranslation("admin");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{node.name}</CardTitle>
      </CardHeader>
      <CardBody className={styles.detail_body}>
        <label>{t("status")}</label>
        <p className={styles.detail_value}>
          <Badge>
            {node.online ? t("tailscale.online") : t("tailscale.offline")}
          </Badge>
        </p>
        <label>{t("tailscale.ip")}</label>
        <p className={styles.detail_value}>{node.ipv4}</p>
        <label>{t("tailscale.last-seen")}</label>
        <p className={styles.detail_value}>
          {node.lastSeen ? new Date(node.lastSeen).toLocaleString() : "-"}
        </p>
      </CardBody>
    </Card>
  );
};

export default TailscaleDetail;
