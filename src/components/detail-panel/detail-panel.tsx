import { usePageData } from "@sun/ssr/react";
import { LocateKeyDetailQuery, TorrentDownload } from "~/generated/graphql";
import KeyDetailPanel from "~/components/key-detail";
import KeyDetailPlaceholder from "~/components/key-detail-placeholder";
import TorrentDetailPanel from "~/components/torrent-detail";
import { TFunction } from "i18next";

type DetailPanelProps = {
  /**
   * Route pattern for cache key generation.
   */
  pattern: string;
  /**
   * Page parameters for cache key generation.
   */
  pageParams: Record<string, unknown>;
  /**
   * Currently selected key path, or null.
   */
  selectedKey: string | null;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
  /**
   * Torrent download data for the selected key, if it is a torrent.
   */
  torrentInfo?: TorrentDownload | null;
};

/**
 * Renders the detail panel for a selected key.
 * Must be wrapped in Suspense by the parent so that the thrown promise
 * from getPageData is caught at the correct boundary level.
 */
const DetailPanel = (props: DetailPanelProps) => {
  const { pattern, pageParams, selectedKey, t, torrentInfo } = props;

  if (selectedKey && torrentInfo) {
    return <TorrentDetailPanel torrent={torrentInfo} t={t} />;
  }

  const { data: detail } = usePageData<
    LocateKeyDetailQuery["filestoreQueries"]["locate"]
  >("detail", pattern, { ...pageParams, selected: selectedKey });

  const hasDetail = detail && (detail as Record<string, unknown>).__typename !== "Placeholder";

  return selectedKey && hasDetail ? (
    <KeyDetailPanel detail={detail as LocateKeyDetailQuery["filestoreQueries"]["locate"]} t={t} />
  ) : (
    <KeyDetailPlaceholder t={t} />
  );
};

export default DetailPanel;
