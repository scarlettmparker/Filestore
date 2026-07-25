import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
} from "@sun/components";
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
          <CardTitle>{t("ip-title")}</CardTitle>
        </CardHeader>
        <CardBody>
          <div className={styles.toolbar}>
            <Button onClick={onAdd}>{t("add-ip-title")}</Button>
          </div>
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
