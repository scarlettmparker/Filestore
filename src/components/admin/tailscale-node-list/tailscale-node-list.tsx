import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sun/components";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import type { TailscaleDevice } from "~/generated/graphql";
import styles from "./tailscale-node-list.module.css";

type TailscaleNodeListProps = {
  /**
   * Tailscale devices to display.
   */
  devices: TailscaleDevice[];
  /**
   * Opens the expire confirmation for a device.
   */
  onExpire: (deviceId: string, deviceName: string) => void;
};

/**
 * List of Tailscale devices, each showing name, IP, online status,
 * and an expire action in a dropdown menu.
 */
const TailscaleNodeList = (props: TailscaleNodeListProps) => {
  const { devices, onExpire } = props;
  const { t } = useTranslation("admin");

  if (!devices.length) {
    return <p className={styles.no_items}>{t("tailscale.no-nodes")}</p>;
  }

  return (
    <div className={styles.list_body}>
      {devices.map((device) => (
        <Link
          key={device.id}
          to={`/admin/access/tailscale/${device.id}`}
          className={styles.item_link}
        >
          <Button variant="secondary" className={styles.list_button}>
            <span className={styles.list_name}>{device.name}</span>
            <Badge>{device.status}</Badge>
            <Badge>
              {device.online ? t("tailscale.online") : t("tailscale.offline")}
            </Badge>
            <span className={styles.list_actions}>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <EllipsisVerticalIcon width={16} height={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onExpire(device.id, device.name)}
                  >
                    <TrashIcon width={16} height={16} />
                    {t("tailscale.expire")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default TailscaleNodeList;
