import { Breadcrumb, CardHeader, CardTitle } from "@sun/components";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useCallback, useEffect, Suspense } from "react";
import { FrontendMode, detectFrontendMode } from "@sun/shared";
import FilestoreBreadcrumb from "~/components/filestore-breadcrumb";
import KeyCard from "~/components/key-card";
import DetailPanel from "~/components/detail-panel";
import KeyDetailPlaceholder from "~/components/key-detail-placeholder";
import KeyDetailSkeleton from "~/components/key-detail-skeleton";
import ConfirmDeleteDialog from "~/components/confirm-delete-dialog";
import TorrentDialog from "~/components/torrent-dialog";
import { ListKeysQuery } from "~/generated/graphql";
import { executeMutation, makeCacheKey, revalidatePageData } from "@sun/ssr";
import { usePageData } from "@sun/ssr/react";
import styles from "./bucket-layout.module.css";

/**
 * Layout for bucket and folder views.
 */
const BucketLayout = () => {
  const params = useParams();
  const alias = params.alias as string;
  const rawPath = (params["*"] as string) || "";
  const path = rawPath ? rawPath.replace(/\/?$/, "/") : "";

  // Get the selected key from the search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedKey = searchParams.get("selected");

  // State to manage the key that is targeted for deletion
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [torrentOpen, setTorrentOpen] = useState(false);
  const [frontendMode, setFrontendMode] = useState<FrontendMode | null>(null);

  useEffect(() => {
    const mode = detectFrontendMode();
    setFrontendMode(mode);
  }, []);

  const pattern = path ? "bucket/:alias/*" : "bucket/:alias";
  const pageParams = path ? { alias, path } : { alias };

  const { data: keys } = usePageData<
    ListKeysQuery["filestoreQueries"]["listKeys"]
  >("keys", pattern, pageParams);

  const selectedEntry = keys?.find((k) => k.key === selectedKey);
  const torrentInfo = selectedEntry?.torrent;

  const { t } = useTranslation("bucket");

  /**
   * While any visible key is a torrent still downloading, refetch the listing
   * on an interval so progress updates without a full reload.
   */
  const hasDownloading = !!keys?.some((key) => key.torrent);
  useEffect(() => {
    if (!hasDownloading) return;
    const cacheKey = makeCacheKey(`${pattern}:keys`, pageParams);
    const interval = setInterval(() => revalidatePageData([cacheKey]), 3000);
    return () => clearInterval(interval);
    // pageParams is derived from alias/path; depend on those to avoid churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDownloading, alias, path, pattern]);

  /**
   * Select a key for detail view. Updates the search param client-side; the
   * detail cache key changes and usePageData re-suspends, fetching via
   * /__page-data without a full reload.
   */
  const handleKeySelect = (key?: string) => {
    setSearchParams(
      (prev) => {
        if (key) {
          prev.set("selected", key);
        } else {
          prev.delete("selected");
        }
        return prev;
      },
      { replace: true },
    );
  };

  /**
   * Handle deleting a key.
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    await executeMutation("filestore/delete-key", {
      bucket: alias,
      key: deleteTarget,
      path: path,
    });

    setDeleteTarget(null);
  }, [deleteTarget, alias]);

  if (!keys || !alias) return null;

  return (
    <div className={styles.layout}>
      <Breadcrumb className={styles.breadcrumb}>
        <FilestoreBreadcrumb alias={alias} path={path || undefined} />
      </Breadcrumb>

      <div className={styles.content}>
        <div className={styles.left_panel}>
          <KeyCard
            keys={keys}
            bucketName={alias}
            currentPath={path}
            t={t}
            frontendMode={frontendMode}
            onKeySelect={handleKeySelect}
            onDeleteTargetChange={setDeleteTarget}
            onAddTorrent={() => setTorrentOpen(true)}
          >
            <CardHeader>
              <CardTitle>{path ? `${alias}/${path}` : alias}</CardTitle>
            </CardHeader>
          </KeyCard>
        </div>

        {frontendMode === FrontendMode.FILESTORE && (
          <div className={styles.right_panel}>
            {selectedKey ? (
              <Suspense fallback={<KeyDetailSkeleton />}>
                <DetailPanel
                  pattern={pattern}
                  pageParams={pageParams}
                  selectedKey={selectedKey}
                  torrentInfo={torrentInfo}
                  t={t}
                />
              </Suspense>
            ) : (
              <KeyDetailPlaceholder t={t} />
            )}
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        folderName={deleteTarget || ""}
        t={t}
      />

      <TorrentDialog
        open={torrentOpen}
        onClose={() => setTorrentOpen(false)}
        bucketName={alias}
        currentPath={path}
      />
    </div>
  );
};

export default BucketLayout;
