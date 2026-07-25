import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sun/components";
import { usePageData } from "@sun/ssr/react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { executeMutation } from "@sun/ssr";
import ConfirmDeleteIpDialog from "~/components/admin/confirm-delete-ip-dialog";
import type { IpWhitelistEntry } from "~/generated/graphql";
import styles from "./ip-list-items.module.css";

/**
 * Renders the IP whitelist body.
 */
const IpListItems = () => {
  const { t } = useTranslation("admin");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: entries } = usePageData<IpWhitelistEntry[]>(
    "ipEntries",
    "ipEntries",
  );

  const deleteEntry = deleteId
    ? entries?.find((e: IpWhitelistEntry) => e.id === deleteId)
    : null;

  return (
    <>
      <div className={styles.list_body}>
        {!entries?.length ? (
          <p className={styles.no_items}>{t("ip-no-items-found")}</p>
        ) : (
          entries.map((entry: IpWhitelistEntry) => (
            <Link
              key={entry.id}
              to={`/admin/ip-config/${entry.id}`}
              className={styles.item_link}
            >
              <Button
                variant="secondary"
                className={styles.list_button}
              >
                <span className={styles.list_name}>{entry.pattern}</span>
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
                      <DropdownMenuItem onClick={() => setDeleteId(entry.id)}>
                        <TrashIcon width={16} height={16} />
                        {t("ip-delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </Button>
            </Link>
          ))
        )}
      </div>
      {deleteEntry && (
        <ConfirmDeleteIpDialog
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            setDeleteId(null);
            await executeMutation("gaia/deleteIpWhitelistEntry", {
              id: deleteEntry.id,
            });
            navigate("/admin/ip-config");
          }}
          pattern={deleteEntry.pattern}
        />
      )}
    </>
  );
};

export default IpListItems;
