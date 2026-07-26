import { Card, CardBody } from "@sun/components";
import { TFunction } from "i18next";
import type { TorrentDownload } from "~/generated/graphql";
import { TorrentJobStatus } from "~/generated/graphql";
import styles from "./torrent-detail.module.css";

type TorrentDetailPanelProps = {
  torrent: TorrentDownload;
  t: TFunction<"bucket">;
};

const TorrentDetailPanel = (props: TorrentDetailPanelProps) => {
  const { torrent, t } = props;

  return (
    <Card className={styles.detail_card}>
      <CardBody className={styles.detail_body}>
        <label>{t("torrent.status")}</label>
        <p className={styles.detail_value}>
          {torrent.status === TorrentJobStatus.Transcoding ? t("torrent.transcoding") : torrent.status}
        </p>

        <label>{t("torrent.progress")}</label>
        <p className={styles.detail_value}>
          {(torrent.progress * 100).toFixed(1)}%
        </p>

        {torrent.status !== TorrentJobStatus.Transcoding && (
          <>
            <label>{t("torrent.downloaded")}</label>
            <p className={styles.detail_value}>
              {formatBytes(torrent.downloadedBytes)} / {formatBytes(torrent.totalBytes)}
            </p>

            <label>{t("torrent.download-rate")}</label>
            <p className={styles.detail_value}>
              {torrent.downloadRateBps != null
                ? formatBytes(torrent.downloadRateBps) + "/s"
                : "-"}
            </p>

            <label>{t("torrent.peers")}</label>
            <p className={styles.detail_value}>
              {torrent.peersConnected != null ? torrent.peersConnected : "-"}
            </p>

            <label>{t("torrent.eta")}</label>
            <p className={styles.detail_value}>
              {torrent.etaSeconds != null ? formatEta(torrent.etaSeconds) : "-"}
            </p>
          </>
        )}

        {torrent.errorMessage && (
          <>
            <label>{t("torrent.error")}</label>
            <p className={styles.detail_value + " " + styles.error}>
              {torrent.errorMessage}
            </p>
          </>
        )}
      </CardBody>
    </Card>
  );
};

function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return "-";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function formatEta(seconds: number): string {
  if (seconds < 60) return seconds + "s";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m " + (seconds % 60) + "s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h + "h " + m + "m";
}

export default TorrentDetailPanel;