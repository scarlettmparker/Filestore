import { Card, CardBody } from "@sun/components";
import { FolderOpen } from "lucide-preact";
import type { Translator } from "@sun/i18n";
import styles from "./key-detail-placeholder.module.css";

type KeyDetailPlaceholderProps = {
  /**
   * i18n translation function.
   */
  t: Translator;
} & React.PropsWithChildren;

/**
 * Placeholder displayed in the right panel when no key is selected.
 */
const KeyDetailPlaceholder = (props: KeyDetailPlaceholderProps) => {
  const { t } = props;

  return (
    <Card className={styles.placeholder_card}>
      <CardBody className={styles.placeholder_body}>
        <FolderOpen width={48} height={48} />
        <p>{t("detail-placeholder.title")}</p>
      </CardBody>
    </Card>
  );
};

export default KeyDetailPlaceholder;
