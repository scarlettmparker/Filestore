import { usePageData } from "~/utils/use-page-data";
import { LocateKeyDetailQuery } from "~/generated/graphql";
import KeyDetailPanel from "~/components/key-detail";
import KeyDetailPlaceholder from "~/components/key-detail-placeholder";
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
};

/**
 * Renders the detail panel for a selected key.
 * Must be wrapped in Suspense by the parent so that the thrown promise
 * from getPageData is caught at the correct boundary level.
 */
const DetailPanel = (props: DetailPanelProps) => {
  const { pattern, pageParams, selectedKey, t } = props;

  const { data: detail } = usePageData<
    LocateKeyDetailQuery["filestoreQueries"]["locate"]
  >("detail", pattern, { ...pageParams, selected: selectedKey });

  return selectedKey && detail ? (
    <KeyDetailPanel detail={detail} t={t} />
  ) : (
    <KeyDetailPlaceholder t={t} />
  );
};

export default DetailPanel;
