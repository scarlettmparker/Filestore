import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, CardTitle, Button } from "@sun/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import IpListItems from "~/components/admin/ip-list-items";
import IpListFooter from "~/components/admin/ip-list-footer";
import type { IpWhitelistEntry } from "~/generated/graphql";
import styles from "./ip-list.module.css";

type IpListProps = {
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
  const { onAdd, onEdit, onDelete } = props;
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
              <PlusIcon width={16} height={16} />
              {t("add-ip-title")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Suspense fallback={null}>
            <IpListItems onEdit={onEdit} onDelete={onDelete} />
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
