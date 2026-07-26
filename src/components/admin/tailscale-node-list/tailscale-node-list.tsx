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
import styles from "./tailscale-node-list.module.css";

type TailscaleNode = {
  id: number;
  name: string;
  ipv4: string;
  online: boolean;
  lastSeen: string;
};

type TailscaleNodeListProps = {
  /**
   * Tailscale nodes to display.
   */
  nodes: TailscaleNode[];
  /**
   * Callback when the expire action is triggered for a node.
   */
  onExpire: (nodeId: number) => void;
};

/**
 * List of Tailscale nodes, each showing name, IP, online status,
 * and an expire action in a dropdown menu.
 */
const TailscaleNodeList = (props: TailscaleNodeListProps) => {
  const { nodes, onExpire } = props;
  const { t } = useTranslation("admin");

  if (!nodes.length) {
    return <p className={styles.no_items}>{t("tailscale.no-nodes")}</p>;
  }

  return (
    <div className={styles.list_body}>
      {nodes.map((node) => (
        <Link
          key={node.id}
          to={`/admin/access/tailscale/${node.id}`}
          className={styles.item_link}
        >
          <Button variant="secondary" className={styles.list_button}>
            <span className={styles.list_name}>{node.name}</span>
            <Badge>
              {node.online ? t("tailscale.online") : t("tailscale.offline")}
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
                    onClick={() => onExpire(node.id)}
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
