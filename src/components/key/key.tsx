import { FileIcon, FolderIcon } from "lucide-react";
import { KeyEntry } from "~/generated/graphql";
import styles from "./key.module.css";
import { cn } from "~/utils/cn";
import { Button } from "@sun/components";

type KeyProps = {
  /**
   * Key to display in list.
   */
  keyEntry: KeyEntry;
  /**
   * Optional href.
   */
  href?: string | null;
} & React.HTMLAttributes<HTMLButtonElement>;

/**
 * A single key in a list.
 */
const Key = (props: KeyProps) => {
  const { keyEntry: key, href, className, ...rest } = props;

  /**
   * Get a key icon. TODO: can be expanded in future to
   * detect file path for icon.
   */
  const getKeyIcon = () => {
    const ICON_SIZE = 16;
    return key.isDirectory ? (
      <FolderIcon width={ICON_SIZE} height={ICON_SIZE} />
    ) : (
      <FileIcon width={ICON_SIZE} height={ICON_SIZE} />
    );
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
        {key.key}
        {/* This is in bytes for whatever reason so we will deal with it */}
        {!key.isDirectory && (
          <>
            {/* Only need to push this to the left */}
            <p className={styles.key_last_modified}>{key.lastModified}</p>
            <p>{`${key.size} B`}</p>
          </>
        )}
      </Button>
    </a>
  );
};

export default Key;
