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

  /**
   * Handle uploading a (small) file, uploads the raw base64 content to the bucket.
   */
  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();

        // Set up what happens when the file is done reading
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          // dataUrl looks like "data:image/png;base64,iVBORw0KGgo..."
          // We split it to send just the raw base64 string to the backend
          const base64Content = dataUrl.split(",")[1];

          const key = `${currentPath}${file.name}`;
          await executeMutation("filestore/put", {
            bucket: bucketName,
            key,
            content: base64Content,
            contentType: file.type || "application/octet-stream",
            isFile: true,
            path: currentPath,
          });
        };

        // Start reading the file as a binary-safe data URL
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  /**
   * Handle creating a key, creates a "directory" (0 byte key) in the bucket.
   */
  const handleCreateKey = async () => {
    const base = currentPath ? currentPath.replace(/\/$/, "") : "";
    const key = `${base ? base + "/" : ""}new-key`;
    await executeMutation("filestore/put", {
      bucket: bucketName,
      key,
      isFile: false,
      path: currentPath,
    });
  };

  return (
    <ContextMenu className={styles.keys_card}>
      <ContextMenuTrigger>
        <Card>
          {children}
          <CardBody className={styles.keys_card_body}>
            {keys.map((key, idx) => (
              <Key
                key={idx}
                keyEntry={key}
                currentPath={currentPath}
                href={
                  key.isDirectory
                    ? `/bucket/${bucketName}/${key.key}`
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
            <ContextMenuItem onClick={handleFileUpload}>
              <FileIcon width={ICON_SIZE} height={ICON_SIZE} />
              {t("context-menu.file")}
            </ContextMenuItem>
            <ContextMenuItem onClick={handleCreateKey}>
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
