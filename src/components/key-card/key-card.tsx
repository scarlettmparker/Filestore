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

const CHUNK_SIZE = 1024 * 512; // 512 kb
/**
 * Convert a Blob/File slice to a raw base64 string
 */
const readBlobAsBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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
      if (!file) return;

      const key = `${currentPath}${file.name}`;
      if (file.size <= CHUNK_SIZE) {
        const base64Content = await readBlobAsBase64(file);
        await executeMutation("filestore/put", {
          bucket: bucketName,
          key,
          content: base64Content,
          contentType: file.type || "application/octet-stream",
          isFile: true,
          path: currentPath,
        });
      } else {
        console.log(
          `[Multipart] Starting upload for ${file.name} (${file.size} bytes)`,
        );

        const startRes = await executeMutation("filestore/multipart-start", {
          bucket: bucketName,
          key,
        });

        if (startRes.__typename !== "QuerySuccess") {
          console.error("Failed to start multipart upload");
          return;
        }

        // We pass the uploadId back in the 'id' field of QuerySuccess
        const uploadId = startRes.id;
        const parts: Array<{ partNumber: number; eTag: string }> = [];
        const totalParts = Math.ceil(file.size / CHUNK_SIZE);

        for (let i = 0; i < totalParts; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          const base64Content = await readBlobAsBase64(chunk);
          const partNumber = i + 1;

          const partRes = await executeMutation("filestore/multipart-upload", {
            bucket: bucketName,
            key,
            uploadId,
            partNumber,
            content: base64Content,
          });

          if (partRes.__typename !== "QuerySuccess" || !partRes.id) {
            console.error(`Failed to upload part ${partNumber}`);
            return;
          }

          parts.push({
            partNumber,
            eTag: partRes.id,
          });

          console.log(
            `Completed part ${partNumber}/${totalParts} (${Math.round((end / file.size) * 100)}%)`,
          );
        }

        // Final completion triggers the server redirect + cache invalidation
        await executeMutation("filestore/multipart-complete", {
          bucket: bucketName,
          key,
          uploadId,
          parts,
          path: currentPath,
        });
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
