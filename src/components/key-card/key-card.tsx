import type { KeyEntry } from "~/generated/graphql";
import styles from "./key-card.module.css";
import { Card, CardBody, CardFooter } from "@sun/components";
import Key from "~/components/key";
import { TFunction } from "i18next";
import { ContextMenu } from "@sun/components";
import { ContextMenuContent } from "@sun/components";
import { ContextMenuTrigger } from "@sun/components";
import { ContextMenuItem } from "@sun/components";
import { ContextMenuSubTrigger } from "@sun/components";
import { ContextMenuSub } from "@sun/components";
import { ContextMenuSubContent } from "@sun/components";
import { FileIcon, FolderIcon } from "lucide-react";
import { executeMutation } from "~/server/actions/utils";

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
   * Current path for cache invalidation
   */
  currentPath?: string;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
} & React.PropsWithChildren;

/**
 * Card displaying list of keys.
 */
const KeyCard = (props: KeyCardProps) => {
  const { keys, bucketName, t, children, currentPath = "" } = props;
  const ICON_SIZE = 16;

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
                currentPath={currentPath}
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
        <ContextMenuItem>{t("context-menu.refetch")}</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>{t("context-menu.new")}</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const content = await file.text();
                    const key = file.name;
                    await executeMutation("filestore/put", {
                      bucket: bucketName,
                      key,
                      content,
                      isFile: true,
                      path: currentPath,
                    });
                  }
                };
                input.click();
              }}
            >
              <FileIcon width={ICON_SIZE} height={ICON_SIZE} />
              {t("context-menu.file")}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                const key = `${currentPath}/new-key`;
                await executeMutation("filestore/put", {
                  bucket: bucketName,
                  key,
                  isFile: false,
                  path: currentPath,
                });
              }}
            >
              <FolderIcon width={ICON_SIZE} height={ICON_SIZE} />
              {t("context-menu.folder")}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default KeyCard;
