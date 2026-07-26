import { Card, CardBody, CardFooter, CardHeader, CardTitle, Button } from "@sun/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import TailscaleNodeList from "~/components/admin/tailscale-node-list";
import styles from "./tailscale-card.module.css";

type TailscaleNode = {
  id: number;
  name: string;
  ipv4: string;
  online: boolean;
  lastSeen: string;
};

type TailscaleCardProps = {
  /**
   * Tailscale nodes to display in the list.
   */
  nodes: TailscaleNode[];
  /**
   * Expires a node by its Headscale id.
   */
  onExpire: (nodeId: number) => void;
  /**
   * Opens the QR code generator dialog.
   */
  onGenerateQr: () => void;
};

/**
 * Card displaying the list of Tailscale nodes with a button to
 * generate pre-auth key QR codes.
 */
const TailscaleCard = (props: TailscaleCardProps) => {
  const { nodes, onExpire, onGenerateQr } = props;
  const { t } = useTranslation("admin");

  return (
    <Card>
      <CardHeader className={styles.header}>
        <CardTitle>{t("tailscale.title")}</CardTitle>
        <Button
          variant="secondary"
          onClick={onGenerateQr}
          title={t("tailscale.generate-qr")}
          aria-label={t("tailscale.generate-qr")}
        >
          <PlusIcon width={16} height={16} />
          {t("tailscale.generate-qr")}
        </Button>
      </CardHeader>
      <CardBody>
        <TailscaleNodeList nodes={nodes} onExpire={onExpire} />
      </CardBody>
      {nodes.length > 0 && (
        <CardFooter>
          <span>{t("tailscale.items-count", { count: nodes.length })}</span>
        </CardFooter>
      )}
    </Card>
  );
};

export default TailscaleCard;
