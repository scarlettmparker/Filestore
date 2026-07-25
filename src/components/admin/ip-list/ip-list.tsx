import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
} from "@sun/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import IpListItems from "~/components/admin/ip-list-items";
import IpListFooter from "~/components/admin/ip-list-footer";
import styles from "./ip-list.module.css";

type IpListProps = {
  /**
   * Called to open the add dialog.
   */
  onAdd: () => void;
};

/**
 * List of IP whitelist entries.
 */
const IpList = (props: IpListProps) => {
  const { onAdd } = props;
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
            <IpListItems />
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
