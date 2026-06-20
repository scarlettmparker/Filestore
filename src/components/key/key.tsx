import { FileIcon, FolderIcon } from "lucide-react";
import { KeyEntry } from "~/generated/graphql";
import styles from "./key.module.css";
import { cn } from "~/utils/cn";
import { Button } from "@sun/components";
import { ICON_SIZE } from "~/utils/const";
import { Input } from "@sun/components";
import { MutationResult } from "~/server/actions/utils";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import ConfirmRenameDialog from "../confirm-rename-dialog";
import { TFunction } from "i18next";
import { FrontendMode } from "@sun/shared";
import type { FrontendMode as FrontendModeType } from "@sun/shared";

type KeyProps = {
  /**
   * Key to display in list.
   */
  keyEntry: KeyEntry;
  /**
   * Callback for renaming a key, requires both source and target key.
   * @param sourceKey Key to rename from.
   * @param targetKey Key to rename to.
   */
  onRename: (
    sourceKey: string,
    targetKey: string,
    merge: boolean,
  ) => Promise<MutationResult>;
  /**
   * Current path for stripping out of dirs.
   */
  currentPath?: string;
  /**
   * Optional href.
   */
  href?: string | null;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
  /**
   * Frontend mode for iframe-aware rendering.
   */
  frontendMode?: FrontendModeType;
  /**
   * Callback to download the key file.
   */
  onDownload?: () => void;
} & React.HTMLAttributes<HTMLButtonElement> &
  React.PropsWithChildren;

/**
 * A single key in a list.
 */
const Key = (props: KeyProps) => {
  const {
    keyEntry: key,
    onRename,
    href,
    currentPath = "",
    className,
    children,
    t,
    frontendMode,
    onDownload,
    ...rest
  } = props;

  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [targetKey, setTargetKey] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmulator = frontendMode === FrontendMode.EMULATOR;

  // Strip out current path from key name
  const displayName = useMemo(() => {
    return currentPath && key.key.startsWith(currentPath)
      ? key.key.slice(currentPath.length).replace(/^\//, "")
      : key.key;
  }, [currentPath, key.key]);

  // Make the input controlled so we can cleanly revert it
  const [inputValue, setInputValue] = useState(displayName);

  // Keep input in sync if the underlying display name updates
  useEffect(() => {
    setInputValue(displayName);
  }, [displayName]);

  // Focus input when rename mode activates
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  /**
   * Get a key icon.
   */
  const getKeyIcon = useCallback(() => {
    return key.isDirectory ? (
      <FolderIcon width={ICON_SIZE} height={ICON_SIZE} />
    ) : (
      <FileIcon width={ICON_SIZE} height={ICON_SIZE} />
    );
  }, [key.isDirectory]);

  /**
   * Handle key rename on blur or enter key.
   */
  const handleRename = useCallback(async () => {
    const newKey = inputValue.trim();
    setTargetKey(newKey);

    if (newKey !== displayName) {
      const res = await onRename(
        key.key,
        currentPath ? `${currentPath}/${newKey}` : newKey,
        false,
      );

      if (res.__typename === "FormError") {
        setDialogMessage(res.message);
      } else if (res.__typename === "StandardError") {
        console.error(res.message);
      }
    }
    setIsRenaming(false);
  }, [inputValue, displayName, key.key, currentPath, onRename]);

  /**
   * Handle confirming rename in case of merge conflict.
   */
  const handleConfirmRename = useCallback(async () => {
    if (targetKey) {
      await onRename(
        key.key,
        currentPath ? `${currentPath}/${targetKey}` : targetKey,
        true,
      );
      setDialogMessage(null);
      setTargetKey(null);
    }
  }, [targetKey, key.key, currentPath, onRename]);

  const handleDialogMessage = useCallback(
    (message: string | null) => {
      setDialogMessage(message);
      if (message === null) {
        setInputValue(displayName);
        setTargetKey(null);
      }
    },
    [displayName],
  );

  /**
   * Handle double-click to enter rename mode.
   * Disabled in emulator mode.
   */
  const handleDoubleClick = useCallback(() => {
    if (isEmulator) return;
    setIsRenaming(true);
  }, [isEmulator]);

  return (
    <div className={styles.key_wrapper} onDoubleClick={handleDoubleClick}>
      <a href={href ?? undefined} className={styles.key_link}>
        <Button
          variant="secondary"
          className={cn(styles.key_button, className)}
          disabled={!href}
          {...rest}
        >
          {getKeyIcon()}
          <span className={styles.key_hidden_spacer}>
            {inputValue || displayName}
          </span>

          <span className={styles.key_actions_wrapper}>
            {!key.isDirectory && (
              <>
                <p>{key.lastModified}</p>
                <p>{`${key.size} B`}</p>
              </>
            )}
            {children}
          </span>
        </Button>
      </a>

      {isRenaming && (
        <Input
          ref={inputRef}
          className={styles.key_input_absolute}
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              setInputValue(displayName);
              setIsRenaming(false);
            }
          }}
          onBlur={handleRename}
        />
      )}

      <ConfirmRenameDialog
        message={dialogMessage}
        setMessage={handleDialogMessage}
        onConfirm={handleConfirmRename}
        t={t}
      />
    </div>
  );
};

export default Key;
