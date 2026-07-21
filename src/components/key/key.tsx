import { FileIcon, FolderIcon } from "lucide-react";
import { KeyEntry } from "~/generated/graphql";
import styles from "./key.module.css";
import { cn } from "@sun/utils";
import { Button } from "@sun/components";
import { ICON_SIZE } from "~/utils/const";
import { Input } from "@sun/components";
import { MutationResult } from "@sun/ssr";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmRenameDialog from "../confirm-rename-dialog";
import RenameContext from "~/contexts/rename-context";
import { TFunction } from "i18next";

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
   * Callback to download the key file.
   */
  onDownload?: () => void;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
} & React.HTMLAttributes<HTMLButtonElement> &
  React.PropsWithChildren;

/**
 * A single key in a list.
 */
const Key = (props: KeyProps) => {
  const {
    keyEntry: key,
    onRename,
    currentPath = "",
    className,
    children,
    t,
    onDownload: _onDownload,
    ...rest
  } = props;

  const navigate = useNavigate();
  const alias = useParams().alias as string;
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [targetKey, setTargetKey] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <FolderIcon
        className={styles.icon}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    ) : (
      <FileIcon className={styles.icon} width={ICON_SIZE} height={ICON_SIZE} />
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
   * Handle double-click: navigate for directories, rename for files. A torrent
   * still downloading is left non-interactive.
   */
  const handleDoubleClick = useCallback(() => {
    if (key.torrent) return;
    if (key.isDirectory) {
      navigate(`/bucket/${alias}/${key.key}`);
    } else {
      setIsRenaming(true);
    }
  }, [key.isDirectory, key.torrent, key.key, alias, navigate]);

  const contextValue = useMemo(
    () => ({
      startRename: () => setIsRenaming(true),
      endRename: () => setIsRenaming(false),
    }),
    [],
  );

  return (
    <RenameContext.Provider value={contextValue}>
      <div className={styles.key_wrapper} onDoubleClick={handleDoubleClick}>
        <Button
          variant="secondary"
          className={cn(styles.key_button, className)}
          {...rest}
        >
          {getKeyIcon()}
          <span className={styles.key_hidden_spacer}>
            {inputValue || displayName}
          </span>

          <span className={styles.key_actions_wrapper}>
            {key.torrent ? (
              <span className={styles.progress_wrapper}>
                <span className={styles.progress_status}>
                  {`${Math.round((key.torrent.progress ?? 0) * 100)}%`}
                </span>
                <span className={styles.progress_track}>
                  <span
                    className={styles.progress_fill}
                    style={{
                      width: `${Math.round((key.torrent.progress ?? 0) * 100)}%`,
                    }}
                  />
                </span>
              </span>
            ) : (
              <>
                {!key.isDirectory && (
                  <>
                    <p>{key.lastModified}</p>
                    <p>{`${key.size} B`}</p>
                  </>
                )}
                {children}
              </>
            )}
          </span>
        </Button>

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
    </RenameContext.Provider>
  );
};

export default Key;
