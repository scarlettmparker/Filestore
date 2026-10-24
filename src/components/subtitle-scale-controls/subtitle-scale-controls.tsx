import { Button, Input, Label } from "@sun/components";
import type { TargetedEvent } from "preact";
import { useTranslation } from "@sun/i18n";
import styles from "./subtitle-scale-controls.module.css";

type SubtitleScaleControlsProps = {
  /**
   * Current scale factor.
   */
  scale: number;
  /**
   * Changes the scale.
   */
  onScaleChange: (value: number) => void;
};

const SubtitleScaleControls = (props: SubtitleScaleControlsProps) => {
  const { scale, onScaleChange } = props;
  const { t } = useTranslation("bucket");

  return (
    <div className={styles.row}>
      <Label className={styles.label}>{t("viewer.subtitles-scale")}</Label>
      <Input
        type="range"
        min={50}
        max={200}
        step={10}
        value={Math.round(scale * 100)}
        onChange={(e: TargetedEvent<HTMLInputElement, Event>) =>
          onScaleChange(Number(e.currentTarget.value) / 100)
        }
        className={styles.slider}
        aria-label={t("viewer.subtitles-scale")}
      />
      <span className={styles.value}>{Math.round(scale * 100)}%</span>
      <Button variant="secondary" onClick={() => onScaleChange(1)}>
        {t("viewer.subtitles-scale-reset")}
      </Button>
    </div>
  );
};

export default SubtitleScaleControls;
