import { Button, Checkbox, ScrollArea } from "@sun/components";
import type { SubtitleSearchResult } from "~/generated/graphql";
import { useTranslation } from "@sun/i18n";
import type { TargetedEvent } from "preact";
import styles from "./subtitle-search-results.module.css";

type SubtitleSearchResultsProps = {
  /**
   * Search results.
   */
  results: SubtitleSearchResult[];
  /**
   * Whether a search has been performed.
   */
  hasSearched: boolean;
  /**
   * Whether a download is running.
   */
  saving: boolean;
  /**
   * Whether downloaded subtitles are persisted.
   */
  saveAlongside: boolean;
  /**
   * Changes the persist preference.
   */
  onSaveAlongsideChange: (value: boolean) => void;
  /**
   * Uses a result.
   */
  onUse: (result: SubtitleSearchResult, persist: boolean) => void;
};

const SubtitleSearchResults = (props: SubtitleSearchResultsProps) => {
  const {
    results,
    hasSearched,
    saving,
    saveAlongside,
    onSaveAlongsideChange,
    onUse,
  } = props;
  const { t } = useTranslation("bucket");

  if (!hasSearched) return null;

  if (results.length === 0) {
    return <p className={styles.empty}>{t("viewer.subtitles-no-results")}</p>;
  }

  return (
    <div className={styles.container}>
      <Checkbox
        checked={saveAlongside}
        onChange={(event: TargetedEvent<HTMLInputElement, Event>) =>
          onSaveAlongsideChange(event.currentTarget.checked)
        }
        label={t("viewer.subtitles-save")}
        className={styles.save_option}
      />
      <ScrollArea maxHeight="12rem" className={styles.scroll_area}>
        <div className={styles.results}>
          {results.map((result) => (
            <Button
              key={result.fileId ?? result.label}
              variant="secondary"
              disabled={saving}
              className={styles.result}
              onClick={() => onUse(result, saveAlongside)}
            >
              <span className={styles.label}>{result.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SubtitleSearchResults;
