import { Button } from "@sun/components";
import type { SubtitleSearchResult } from "~/generated/graphql";
import { useTranslation } from "@sun/i18n";
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
   * Uses a result without persisting.
   */
  onUse: (result: SubtitleSearchResult) => void;
  /**
   * Uses a result and persists it.
   */
  onSave: (result: SubtitleSearchResult) => void;
};

const SubtitleSearchResults = (props: SubtitleSearchResultsProps) => {
  const { results, hasSearched, saving, onUse, onSave } = props;
  const { t } = useTranslation("bucket");

  if (!hasSearched) return null;

  if (results.length === 0) {
    return <p className={styles.empty}>{t("viewer.subtitles-no-results")}</p>;
  }

  return (
    <div className={styles.results}>
      {results.map((result) => (
        <div key={result.fileId ?? result.label} className={styles.result}>
          <span className={styles.label}>{result.label}</span>
          <div className={styles.actions}>
            <Button variant="secondary" disabled={saving} onClick={() => onUse(result)}>
              {t("viewer.subtitles-use")}
            </Button>
            <Button variant="secondary" disabled={saving} onClick={() => onSave(result)}>
              {t("viewer.subtitles-save")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubtitleSearchResults;
