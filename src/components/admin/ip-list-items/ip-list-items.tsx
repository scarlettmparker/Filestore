import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sun/components";
import { usePageData } from "@sun/ssr/react";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import type { IpWhitelistEntry } from "~/generated/graphql";
import styles from "./ip-list-items.module.css";

type IpListItemsProps = {
  /**
   * Called when the user clicks edit on an entry.
   */
  onEdit: (entry: IpWhitelistEntry) => void;
  /**
   * Called when the user clicks delete on an entry.
   */
  onDelete: (entry: IpWhitelistEntry) => void;
};

/**
 * Renders the IP whitelist body.
 */
const IpListItems = (props: IpListItemsProps) => {
  const { onEdit, onDelete } = props;
  const { t } = useTranslation("admin");
  const { data: entries } = usePageData<IpWhitelistEntry[]>(
    "ipEntries",
    "ipEntries",
  );

  return (
    <div className={styles.list_body}>
      {!entries?.length ? (
        <p className={styles.no_items}>{t("ip-no-items-found")}</p>
      ) : (
        entries.map((entry: IpWhitelistEntry) => (
          <Link
            key={entry.id}
            to={`/admin/access/ip/${entry.id}`}
            className={styles.item_link}
          >
            <Button variant="secondary" className={styles.list_button}>
              <span className={styles.list_name}>{entry.pattern}</span>
              {!entry.enabled && (
                <Badge variant="secondary">{t("status-suspended")}</Badge>
              )}
              {!entry.immutable && (
                <span className={styles.list_actions}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVerticalIcon
                        width={16}
                        height={16}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <PencilSquareIcon width={16} height={16} />
                        {t("edit-ip")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(entry)}>
                        <TrashIcon width={16} height={16} />
                        {t("ip-delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              )}
            </Button>
          </Link>
        ))
      )}
    </div>
  );
};

export default IpListItems;
