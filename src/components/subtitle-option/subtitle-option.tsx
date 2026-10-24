import { Badge, DropdownMenuItem } from "@sun/components";
import { useTranslation } from "@sun/i18n";
import { SubtitleSource, type Subtitle } from "~/generated/graphql";
import styles from "./subtitle-option.module.css";

type SubtitleOptionProps = {
  /**
   * Subtitle to render.
   */
  subtitle: Subtitle;
  /**
   * Whether this subtitle is selected.
   */
  selected: boolean;
  /**
   * Selects this subtitle.
   */
  onSelect: (key: string) => void;
};

const SubtitleOption = (props: SubtitleOptionProps) => {
  const { subtitle, selected, onSelect } = props;
  const { t } = useTranslation("bucket");
  const language = t(`viewer.subtitles-language-${subtitle.language}`);
  const source =
    subtitle.source === SubtitleSource.Local
      ? t("viewer.subtitles-source-local")
      : t("viewer.subtitles-source-opensubtitles");

  return (
    <DropdownMenuItem onClick={() => onSelect(subtitle.subtitleKey)}>
      <span>
        {language} ({source})
      </span>
      {selected ? (
        <Badge variant="secondary" className={styles.active}>
          {t("viewer.subtitles-active")}
        </Badge>
      ) : null}
    </DropdownMenuItem>
  );
};

export default SubtitleOption;
