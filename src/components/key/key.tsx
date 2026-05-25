import { FileIcon, FolderIcon } from "lucide-react";
import { KeyEntry } from "~/generated/graphql";
import styles from "./key.module.css";
import { cn } from "~/utils/cn";
import { Button } from "@sun/components";
import { ICON_SIZE } from "~/utils/const";
import { Input } from "@sun/components";

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
  onRename: (sourceKey: string, targetKey: string) => void;
  /**
   * Current path for stripping out of dirs.
   */
  currentPath?: string;
  /**
   * Optional href.
   */
  href?: string | null;
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
    ...rest
  } = props;

  // Strip out current path from key name
  const displayName =
    currentPath && key.key.startsWith(currentPath)
      ? key.key.slice(currentPath.length).replace(/^\//, "") // Removes leading slash if left over
      : key.key;

  /**
   * Get a key icon. TODO: can be expanded in future to
   * detect file path for icon.
   */
  const getKeyIcon = () => {
    return key.isDirectory ? (
      <FolderIcon width={ICON_SIZE} height={ICON_SIZE} />
    ) : (
      <FileIcon width={ICON_SIZE} height={ICON_SIZE} />
    );
  };

  /**
   * Helper to prevent event propagation for input field.
   */
  const preventPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handle key rename on blur or enter key.
   */
  const handleRename = (e: React.FocusEvent<HTMLInputElement>) => {
    const newKey = e.target.value.trim();
    if (newKey !== displayName) {
      onRename(key.key, currentPath ? `${currentPath}/${newKey}` : newKey);
    }
  };

  return (
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
          defaultValue={displayName}
          onClick={preventPropagation}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
            // Trigger rename on Enter and blur input, also handle Escape to cancel rename
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              e.currentTarget.value = displayName;
              e.currentTarget.blur();
            }
          }}
          onFocus={preventPropagation}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            handleRename(e);
          }}
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
  );
};

export default Key;
