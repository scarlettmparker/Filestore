import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "@sun/i18n";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sun/components";
import { useMutation, usePageData } from "@sun/ssr/react";
import { EllipsisVerticalOutline, LockClosedOutline, LockOpenOutline } from "preact-heroicons";
import { executeMutation, patchPageData } from "@sun/ssr";
import ConfirmSuspendAccountDialog from "~/components/admin/confirm-suspend-account-dialog";
import ConfirmUnsuspendAccountDialog from "~/components/admin/confirm-unsuspend-account-dialog";
import {
  AccountStatus,
  type Account,
  type PagedAccounts,
  type SuspendAccountResponse,
  type UnsuspendAccountResponse,
} from "~/generated/graphql";
import styles from "./user-list-items.module.css";

type AdminUserListItemsProps = {
  /**
   * Committed search query.
   */
  search: string;
  /**
   * Zero-based page index.
   */
  page: number;
};

/**
 * Account and target status for a suspend/unsuspend toggle.
 */
type AccountToggle = {
  /**
   * Account being toggled.
   */
  account: Account;
  /**
   * Whether the account is being suspended.
   */
  suspended: boolean;
};

/**
 * Renders the account list body.
 */
const AdminUserListItems = ({ search, page }: AdminUserListItemsProps) => {
  const { t } = useTranslation("admin");
  const [suspendId, setSuspendId] = useState<string | null>(null);
  const [unsuspendId, setUnsuspendId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const params = { page: String(page), search: search || undefined };
  const { data: accountsData } = usePageData<PagedAccounts>("accounts", "accounts", params);

  const [accounts, toggleAccount] = useMutation<
    AccountToggle,
    SuspendAccountResponse | UnsuspendAccountResponse,
    PagedAccounts
  >({
    base: accountsData,
    reducer: (current, payload) => ({
      ...current,
      items: current.items.map((account) =>
        account.id === payload.account.id
          ? {
              ...account,
              status: payload.suspended ? AccountStatus.Suspended : AccountStatus.Active,
            }
          : account,
      ),
    }),
    action: (payload) =>
      payload.suspended
        ? executeMutation<SuspendAccountResponse>("gaia/suspendAccount", {
            id: payload.account.id,
          })
        : executeMutation<UnsuspendAccountResponse>("gaia/unsuspendAccount", {
            id: payload.account.id,
          }),
    onSuccess: (response) => {
      patchPageData<PagedAccounts>("accounts", "accounts", params, (current) => {
        const base = current ?? accountsData;
        return {
          ...base,
          items: base.items.map((account) =>
            account.id === response.account.id ? response.account : account,
          ),
        };
      });
    },
    onError: (error) => console.error(error.message),
  });

  const suspendAccount = suspendId ? accounts?.items?.find((a) => a.id === suspendId) : null;
  const unsuspendAccount = unsuspendId ? accounts?.items?.find((a) => a.id === unsuspendId) : null;

  return (
    <>
      <div className={styles.list_body}>
        {!accounts?.items?.length ? (
          <p className={styles.no_items}>{t("no-items-found")}</p>
        ) : (
          accounts.items.map((account) => (
            <Link
              key={account.id}
              to={{
                pathname: `/admin/${account.id}`,
                search: searchParams.toString(),
              }}
              className={styles.item_link}
            >
              <Button variant="secondary" className={styles.list_button}>
                <p className={styles.list_name}>{account.username}</p>
                <span className={styles.list_actions}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVerticalOutline
                        width={16}
                        height={16}
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {account.status === "SUSPENDED" ? (
                        <DropdownMenuItem onClick={() => setUnsuspendId(account.id)}>
                          <LockOpenOutline width={16} height={16} />
                          {t("unsuspend-account")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => setSuspendId(account.id)}>
                          <LockClosedOutline width={16} height={16} />
                          {t("suspend-account")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </Button>
            </Link>
          ))
        )}
      </div>
      {suspendAccount && (
        <ConfirmSuspendAccountDialog
          open={!!suspendId}
          onClose={() => setSuspendId(null)}
          onConfirm={() => {
            setSuspendId(null);
            toggleAccount({ account: suspendAccount, suspended: true });
          }}
          username={suspendAccount.username}
        />
      )}
      {unsuspendAccount && (
        <ConfirmUnsuspendAccountDialog
          open={!!unsuspendId}
          onClose={() => setUnsuspendId(null)}
          onConfirm={() => {
            setUnsuspendId(null);
            toggleAccount({ account: unsuspendAccount, suspended: false });
          }}
          username={unsuspendAccount.username}
        />
      )}
    </>
  );
};

export default AdminUserListItems;
