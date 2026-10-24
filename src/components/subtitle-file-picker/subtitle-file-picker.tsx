import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  SearchBar,
} from "@sun/components";
import { useTranslation } from "@sun/i18n";
import type { ListKeysQuery } from "~/generated/graphql";
import styles from "./subtitle-file-picker.module.css";

type SubtitleFile = NonNullable<ListKeysQuery["filestoreQueries"]["listKeys"]>[number];

type SubtitleFilePickerProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Files available in the current folder.
   */
  files: SubtitleFile[];
  /**
   * Whether the file list is loading.
   */
  loading: boolean;
  /**
   * Closes the dialog.
   */
  onClose: () => void;
  /**
   * Uses the selected subtitle file.
   */
  onSelect: (key: string) => void;
};

const SUBTITLE_EXTENSIONS = [".srt", ".vtt", ".ass", ".ssa"];

/**
 * Dialog for choosing an existing subtitle file from the bucket.
 */
const SubtitleFilePicker = (props: SubtitleFilePickerProps) => {
  const { open, files, loading, onClose, onSelect } = props;
  const { t } = useTranslation("bucket");
  const [query, setQuery] = useState("");

  const visibleFiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    return files.filter((file) => {
      if (file.isDirectory) return false;
      const lower = file.key.toLowerCase();
      if (!SUBTITLE_EXTENSIONS.some((extension) => lower.endsWith(extension))) {
        return false;
      }
      return term === "" || lower.includes(term);
    });
  }, [files, query]);

  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("viewer.subtitles-file-picker-title")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className={styles.body}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t("viewer.subtitles-file-picker-search")}
          />
          <div className={styles.list}>
            {loading ? (
              <p className={styles.empty}>{t("viewer.subtitles-file-picker-loading")}</p>
            ) : visibleFiles.length === 0 ? (
              <p className={styles.empty}>{t("viewer.subtitles-file-picker-empty")}</p>
            ) : (
              visibleFiles.map((file) => (
                <Button
                  key={file.key}
                  variant="secondary"
                  className={styles.file}
                  onClick={() => onSelect(file.key)}
                >
                  <span className={styles.file_name}>{file.name ?? file.key}</span>
                  <span className={styles.file_path}>{file.key}</span>
                </Button>
              ))
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          {t("viewer.subtitles-file-picker-cancel")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SubtitleFilePicker;
