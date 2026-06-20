import { useRef, useEffect, useCallback } from "react";
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
import { executeMutation, MutationResult } from "~/server/actions/utils";
import { ICON_SIZE } from "~/utils/const";
import KeyActions from "../key-actions";
import { EventBus, PostMessageBridge } from "@sun/events";
import { FILESTORE_EVENTS, FrontendMode } from "@sun/shared";
import type {
  FrontendMode as FrontendModeType,
  FilestoreEventPayloads,
} from "@sun/shared";

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

  if (urlRes.__typename !== "QuerySuccess" || !("id" in urlRes && urlRes.id)) {
    console.error("[Upload] Failed to get presigned upload URL", urlRes);
    return;
  }

  const presignedUrl = (urlRes as { id: string }).id;

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
        console.log(`[Upload] Progress: ${percent}%`);
      }
    };

    xhr.onload = () => resolve(xhr);
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(file);
  });

  if (putRes.status !== 200) {
    // An error happened
    return;
  }

  // We can get res from here at some point if we want to
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
   * Bucket user is currently in. Required due to slug.
   */
  bucketName: string;
  /**
   * Current path for cache invalidation.
   */
  currentPath?: string;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
  /**
   * Frontend mode for iframe-aware rendering.
   */
  frontendMode?: FrontendModeType;
  /**
   * Callback when a file key is selected for detail view.
   */
  onKeySelect?: (key: string) => void;
  /**
   * Callback to set the folder targeted for delete confirmation.
   * Pass null to dismiss the dialog.
   */
  onDeleteTargetChange: (target: string | null) => void;
} & React.PropsWithChildren;

/**
 * Card displaying list of keys with upload/create actions.
 */
const KeyCard = (props: KeyCardProps) => {
  const {
    keys,
    bucketName,
    t,
    children,
    currentPath = "",
    frontendMode,
    onKeySelect,
    onDeleteTargetChange,
  } = props;
  const bridgeRef = useRef<PostMessageBridge<FilestoreEventPayloads> | null>(
    null,
  );
  const isIframe = typeof window !== "undefined" && window.self !== window.top;

  // Set up bridge to parent window when running inside an iframe
  useEffect(() => {
    if (!isIframe || !window.parent) return;

    const localBus = new EventBus<FilestoreEventPayloads>();
    const remoteBus = new EventBus<FilestoreEventPayloads>();

    bridgeRef.current = new PostMessageBridge(localBus, remoteBus, {
      target: window.parent,
      origin: "*",
    });

    return () => bridgeRef.current?.destroy();
  }, []);

  const isEmulator = frontendMode === FrontendMode.EMULATOR;

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
      if (isIframe && bridgeRef.current) {
        bridgeRef.current.send(FILESTORE_EVENTS.FILE_DOWNLOAD, { url: res.id });
      } else {
        window.open(res.id, "_blank");
      }
    } else {
      console.error("Failed to get presigned download URL");
    }
  };

  /**
   * Deletes a file directly (no confirmation needed).
   */
  const handleFileDelete = useCallback(
    async (keyPath: string) => {
      const res = await executeMutation("filestore/delete-file", {
        bucket: bucketName,
        key: keyPath,
        path: currentPath,
      });

      if (!res || res.__typename !== "QuerySuccess") {
        console.error("Failed to delete file");
      }
    },
    [bucketName],
  );

  /**
   * Handle key rename. This is used for both files and directories.
   *
   * @param sourceKey The original key path.
   * @param targetKey The new key path to rename to.
   * @param merge Whether to merge with existing keys at the target.
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
      path: currentPath,
    });
  };

  /**
   * Resolves the click handler for a key entry.
   * Files select for detail on click. Directories navigate on double-click only.
   */
  const getKeyOnClick = useCallback(
    (key: KeyEntry) => {
      if (key.isDirectory) return undefined;
      if (isEmulator) return () => handleFileDownload(key.key);
      return () => onKeySelect?.(key.key);
    },
    [isEmulator, onKeySelect],
  );

  /**
   * Resolves the delete handler for a key entry.
   * Files delete immediately, folders open a confirmation dialog.
   */
  const getKeyOnDelete = useCallback(
    (key: KeyEntry) => {
      if (key.isDirectory) return () => onDeleteTargetChange(key.key);
      return () => handleFileDelete(key.key);
    },
    [onDeleteTargetChange, handleFileDelete],
  );

  /**
   * Handles the download action for a key entry. Directories do not support download.
   * @param key Key entry to download.
   */
  const handleKeyDownload = (key: KeyEntry) => {
    return key.isDirectory ? undefined : () => handleFileDownload(key.key);
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
                onClick={getKeyOnClick(key)}
                onDownload={handleKeyDownload(key)}
                t={t}
              >
                <KeyActions
                  keyEntry={key}
                  key={idx}
                  onDelete={getKeyOnDelete(key)}
                  onDownload={handleKeyDownload(key)}
                  frontendMode={frontendMode}
                  t={t}
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
              {t("context-menu.new-file")}
            </ContextMenuItem>
            <ContextMenuItem onClick={handleCreateKey}>
              <FolderIcon width={ICON_SIZE} height={ICON_SIZE} />
              {t("context-menu.new-folder")}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default KeyCard;
