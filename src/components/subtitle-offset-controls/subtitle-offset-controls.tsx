import { Button, Input, Label } from "@sun/components";
import type { TargetedEvent } from "preact";
import { useTranslation } from "@sun/i18n";
import styles from "./subtitle-offset-controls.module.css";

type SubtitleOffsetControlsProps = {
  /**
   * Current offset in milliseconds.
   */
  offsetMs: number;
  /**
   * Changes the offset.
   */
  onOffsetChange: (value: number) => void;
};

const SubtitleOffsetControls = (props: SubtitleOffsetControlsProps) => {
  const { offsetMs, onOffsetChange } = props;
  const { t } = useTranslation("bucket");

  return (
    <div className={styles.row}>
      <Label className={styles.label}>{t("viewer.subtitles-offset")}</Label>
      <Input
        type="range"
        min={-10000}
        max={10000}
        step={100}
        value={offsetMs}
        onChange={(e: TargetedEvent<HTMLInputElement, Event>) =>
          onOffsetChange(Number(e.currentTarget.value))
        }
        className={styles.slider}
        aria-label={t("viewer.subtitles-offset")}
      />
      <span className={styles.value}>{(offsetMs / 1000).toFixed(1)}s</span>
      <Button variant="secondary" onClick={() => onOffsetChange(0)}>
        {t("viewer.subtitles-offset-reset")}
      </Button>
    </div>
  );
};

export default SubtitleOffsetControls;
