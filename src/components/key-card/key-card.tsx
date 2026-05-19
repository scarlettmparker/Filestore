import type { KeyEntry } from "~/generated/graphql";
import styles from "./key-card.module.css";
import { Card, CardBody, CardFooter } from "@sun/components";
import Key from "~/components/key";
import { TFunction } from "i18next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuSubTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
} from "@sun/components";
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
 * Card displaying list of keys with upload/create actions.
 */
const KeyCard = (props: KeyCardProps) => {
  const { keys, bucketName, t, children, currentPath = "" } = props;
  const ICON_SIZE = 16;

  /**
   * Handle uploading a file using a presigned URL (direct PUT to storage).
   */
  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const key = `${currentPath}${file.name}`;
      const contentType = file.type || "application/octet-stream";

      const urlRes = await executeMutation(
        "filestore/get-presigned-upload-url",
        {
          bucket: bucketName,
          key,
          contentType,
        },
      );

      if (urlRes.__typename !== "QuerySuccess" || !urlRes.id) {
        console.error("Failed to get presigned upload URL");
        return;
      }

      const presignedUrl = urlRes.id;

      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": contentType },
      });

      if (!putRes.ok) {
        console.error("Direct upload failed", putRes.status);
        return;
      }

      // Trigger redirect + cache invalidation
      await executeMutation("filestore/put", {
        bucket: bucketName,
        key,
        isFile: true,
        path: currentPath,
      });
    };
    input.click();
  };

  /**
   * Handle creating a key (directory placeholder).
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
