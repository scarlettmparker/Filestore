import type { KeyEntry } from "~/generated/graphql";
import styles from "./key-card.module.css";
import { Card, CardBody, CardFooter } from "@sun/components";
import Key from "~/components/key";
import { TFunction } from "i18next";
import { ContextMenu } from "@sun/components";
import { ContextMenuContent } from "@sun/components";
import { ContextMenuTrigger } from "@sun/components";
import { ContextMenuItem } from "@sun/components";

type KeyCardProps = {
  /**
   * List of keys to display.
   */
  keys: KeyEntry[];
  /**
   * Bucket user is currently in. Required due to slug
   */
  bucketName: string;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
} & React.PropsWithChildren;

/**
 * Card displaying list of keys.
 */
const KeyCard = (props: KeyCardProps) => {
  const { keys, bucketName, t, children } = props;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={styles.keys_card}>
          {children}
          <CardBody className={styles.keys_card_body}>
            {keys.map((key, idx) => (
              <Key
                key={idx}
                keyEntry={key}
                href={
                  key.isDirectory
                    ? `${bucketName}/${key.key}`
                    : `/rest/buckets/${bucketName}/download?key=${encodeURIComponent(key.key)}`
                }
              />
            ))}
          </CardBody>
          <CardFooter>{t("items", { count: keys.length })}</CardFooter>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Test Item</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default KeyCard;
