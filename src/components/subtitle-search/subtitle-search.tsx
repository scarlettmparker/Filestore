import {
  Button,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  SearchBar,
} from "@sun/components";
import { useTranslation } from "@sun/i18n";
import styles from "./subtitle-search.module.css";

const LANGUAGES = ["en", "es", "fr", "de", "it", "pt"] as const;

type SubtitleSearchProps = {
  /**
   * Search query text.
   */
  query: string;
  /**
   * Search language.
   */
  language: string;
  /**
   * Changes the query.
   */
  onQueryChange: (value: string) => void;
  /**
   * Changes the language.
   */
  onLanguageChange: (value: string) => void;
  /**
   * Runs the search.
   */
  onSearch: () => void;
};

const SubtitleSearch = (props: SubtitleSearchProps) => {
  const { query, language, onQueryChange, onLanguageChange, onSearch } = props;
  const { t } = useTranslation("bucket");

  return (
    <div className={styles.row}>
      <SearchBar
        value={query}
        onChange={onQueryChange}
        onSearch={onSearch}
        placeholder={t("viewer.subtitles-search-placeholder")}
        className={styles.query}
      />
      <div className={styles.language}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {t(`viewer.subtitles-language-${language}`)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {LANGUAGES.map((option) => (
              <Button
                key={option}
                variant="secondary"
                className={styles.language_option}
                onClick={() => onLanguageChange(option)}
              >
                {t(`viewer.subtitles-language-${option}`)}
              </Button>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </div>
    </div>
  );
};

export default SubtitleSearch;
