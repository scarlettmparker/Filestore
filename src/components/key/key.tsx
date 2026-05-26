import { FileIcon, FolderIcon } from "lucide-react";
import { KeyEntry } from "~/generated/graphql";
import styles from "./key.module.css";
import { cn } from "~/utils/cn";
import { Button } from "@sun/components";
import { ICON_SIZE } from "~/utils/const";
import { Input } from "@sun/components";
import { MutationResult } from "~/server/actions/utils";
import { useState, useCallback, useMemo, useEffect } from "react";
import ConfirmRenameDialog from "../confirm-rename-dialog";
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
   * Optional href.
   */
  href?: string | null;
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
    href,
    currentPath = "",
    className,
    children,
    t,
    ...rest
  } = props;

  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [targetKey, setTargetKey] = useState<string | null>(null);

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

  /**
   * Get a key icon. TODO: can be expanded in future to
   * detect file path for icon.
   */
  const getKeyIcon = useCallback(() => {
    return key.isDirectory ? (
      <FolderIcon width={ICON_SIZE} height={ICON_SIZE} />
    ) : (
      <FileIcon width={ICON_SIZE} height={ICON_SIZE} />
    );
  }, [key.isDirectory]);

  /**
   * Helper to prevent event propagation for input field.
   */
  const preventPropagation = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

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
        // Set dialog message here to open confirm dialog
        setDialogMessage(res.message);
      } else if (res.__typename === "StandardError") {
        console.error(res.message);
      }
    }
  }, [inputValue, displayName, key.key, currentPath, onRename]);

  /**
   * Handle confirming rename in case of merge conflict.
   * This will attempt to rename again with merge flag set to true.
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
      // If we're closing the dialog without confirming (e.g. hitting cancel)
      // we undo the local state back to the original key name.
      if (message === null) {
        setInputValue(displayName);
        setTargetKey(null);
      }
    },
    [displayName],
  );

  return (
    <>
      <a href={href ?? undefined} className={styles.key_link}>
        <Button
          variant="secondary"
          className={cn(styles.key_button, className)}
          disabled={!href}
          // We care more about the button being spread than the link
          {...rest}
        >
          {getKeyIcon()}
          <Input
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onClick={preventPropagation}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              e.stopPropagation();
              // Trigger rename on Enter and blur input, also handle Escape to cancel rename
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
              if (e.key === "Escape") {
                setInputValue(displayName);
                e.currentTarget.blur();
              }
            }}
            onFocus={preventPropagation}
            onBlur={handleRename}
          />
          {/* This is in bytes for whatever reason so we will deal with it */}
          {!key.isDirectory && (
            <>
              {/* Only need to push this to the left */}
              <p className={styles.key_last_modified}>{key.lastModified}</p>
              <p>{`${key.size} B`}</p>
            </>
          )}
          {children}
        </Button>
      </a>
      <ConfirmRenameDialog
        message={dialogMessage}
        setMessage={handleDialogMessage}
        onConfirm={handleConfirmRename}
        t={t}
      />
    </>
  );
};

export default Key;
