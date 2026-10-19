import { Suspense } from "react";
import { useTranslation } from "@sun/i18n";
import { Card, CardBody, CardHeader, CardTitle, Button } from "@sun/components";
import { PlusOutline } from "preact-heroicons";
import IpListItems from "~/components/admin/ip-list-items";
import IpListFooter from "~/components/admin/ip-list-footer";
import type { IpWhitelistEntry } from "~/generated/graphql";
import styles from "./ip-list.module.css";

type IpListProps = {
  /**
   * IP whitelist entries to display.
   */
  entries: IpWhitelistEntry[];
  /**
   * Called to open the add dialog.
   */
  onAdd: () => void;
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
 * List of IP whitelist entries.
 */
const IpList = (props: IpListProps) => {
  const { entries, onAdd, onEdit, onDelete } = props;
  const { t } = useTranslation("admin");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={styles.title}>
            {t("ip-title")}
            <Button
              variant="secondary"
              className={styles.add_button}
              onClick={onAdd}
              title={t("add-ip-title")}
            >
              <PlusOutline width={16} height={16} />
              {t("add-ip-title")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Suspense fallback={null}>
            <IpListItems entries={entries} onEdit={onEdit} onDelete={onDelete} />
          </Suspense>
        </CardBody>
        <Suspense fallback={null}>
          <IpListFooter />
        </Suspense>
      </Card>
    </>
  );
};

export default IpList;
