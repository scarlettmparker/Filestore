import type { KeyEntry, QueryResult } from "~/generated/graphql";
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
import { executeMutation, MutationResult } from "~/server/actions/utils";
import { ICON_SIZE } from "~/utils/const";
import KeyActions from "../key-actions";

/**
 * Options required to process a direct-to-storage file upload.
 */
interface UploadOptions {
  bucketName: string;
  currentPath: string;
  file: File;
}

/**
 * Uploads a file directly to storage using a presigned URL.
 * Requests a secure upload URL from the server, executes an asynchronous PUT request with
 * XHR progress tracking, and notifies the backend upon successful completion.
 *
 * @param options Required data payloads containing file metadata and destination paths.
 * @returns Promise that resolves when the upload and backend synchronization are finished.
 */
const uploadFileToStorage = async ({
  bucketName,
  currentPath,
  file,
}: UploadOptions): Promise<void> => {
  const key = `${currentPath}${file.name}`;
  const contentType = file.type || "application/octet-stream";

  const urlRes = await executeMutation("filestore/get-presigned-upload-url", {
    bucket: bucketName,
    key,
    contentType,
  });

  if (urlRes.__typename !== "QuerySuccess" || !urlRes.id) {
    console.error("Failed to get presigned upload URL");
    return;
  }

  const presignedUrl = urlRes.id;

  /**
   * Using XMLHttpRequest here instead of fetch to enable upload progress tracking,
   * which is not natively supported in fetch as of now. This allows us
   * to provide real-time feedback on the upload status.
   */
  const putRes = await new Promise<XMLHttpRequest>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl, true);
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        console.log(`Progress: ${percent}% (${event.loaded}/${event.total})`);
      }
    };

    xhr.onload = () => resolve(xhr);
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(file);
  });

  if (putRes.status !== 200) {
    console.error("Direct upload failed", putRes.status);
    return;
  }

  console.log(`[Upload] Completed upload for ${key}`);

  await executeMutation("filestore/upload-complete", {
    bucket: bucketName,
    key,
    path: currentPath,
  });
};

/**
 * Resolves the destination directory path string by appending a predictable tailing slash.
 * Prevents double slashes if the root path configuration is already established.
 *
 * @param currentPath Current directory hierarchy path.
 * @param targetName String name of the item being generated.
 * @returns Formatted path combination string, or null if root.
 */
const formatKeyPath = (
  currentPath: string,
  targetName: string | null,
): string | null => {
  const base = currentPath ? currentPath.replace(/\/$/, "") : "";

  // If no target name is provided, return just the base path with a trailing slash,
  // or an actual null if we are at the root.
  if (!targetName) {
    return base ? `${base}/` : null;
  }

  return `${base ? base + "/" : ""}${targetName}`;
};

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

  /**
   * Prompts the user to select a file from their native file explorer and coordinates the upload pipeline.
   */
  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      await uploadFileToStorage({ bucketName, currentPath, file });
    };
    input.click();
  };

  /**
   * Mandates the creation of a structural directory placeholder down the active route path.
   */
  const handleCreateKey = async () => {
    const key = formatKeyPath(currentPath, null);
    await executeMutation("filestore/put", {
      bucket: bucketName,
      key,
      isFile: false,
      path: currentPath,
    });
  };

  /**
   * Downloads a file using a presigned GET URL (direct from storage).
   */
  const handleFileDownload = async (keyPath: string) => {
    const res = await executeMutation("filestore/get-presigned-download-url", {
      bucket: bucketName,
      key: keyPath,
    });

    if (res.__typename === "QuerySuccess" && res.id) {
      window.open(res.id, "_blank");
    } else {
      console.error("Failed to get presigned download URL");
    }
  };

  /**
   * Deletes a file.
   */
  const handleFileDelete = async (keyPath: string) => {
    const res = await executeMutation("filestore/delete-file", {
      bucket: bucketName,
      key: keyPath,
    });

    if (!res || res.__typename !== "QuerySuccess") {
      console.error("Failed to delete file");
    }
  };

  /**
   * Deletes a key (folder) and all nested contents.
   */
  const handleKeyDelete = async (keyPath: string) => {
    const res = await executeMutation("filestore/delete-key", {
      bucket: bucketName,
      key: keyPath,
    });

    if (!res || res.__typename !== "QuerySuccess") {
      console.error("Failed to delete key");
    }
  };

  /**
   * Handle key rename. This is used for both files and directories.
   *
   * @param newKeyPath The new key path to rename to.
   */
  const handleKeyRename = async (
    sourceKey: string,
    targetKey: string,
    merge: boolean,
  ): Promise<MutationResult> => {
    return await executeMutation("filestore/rename-key", {
      bucket: bucketName,
      sourceKey,
      targetKey,
      merge,
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
                onRename={handleKeyRename}
                currentPath={currentPath}
                href={
                  key.isDirectory ? `/bucket/${bucketName}/${key.key}` : "#"
                }
                onClick={
                  key.isDirectory
                    ? undefined
                    : () => handleFileDownload(key.key)
                }
              >
                <KeyActions
                  keyEntry={key}
                  key={idx}
                  onDelete={
                    key.isDirectory ? handleKeyDelete : handleFileDelete
                  }
                />
              </Key>
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
