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
import { ListKeysQuery } from "~/generated/graphql";
import { fetchListKeys, fetchLocateKeyDetail } from "~/utils/api";
import { pageDataRegistry } from "~/utils/page-data";
import { usePageData } from "~/utils/use-page-data";
import { executeMutation } from "~/server/actions/utils";
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

  const { t } = useTranslation("bucket");

  /**
   * Select a key for detail view. Updates the search param client-side; the
   * detail cache key changes and usePageData re-suspends, fetching via
   * /__page-data without a full reload.
   */
  const handleKeySelect = (key: string) => {
    setSearchParams(
      (prev) => {
        prev.set("selected", key);
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
    </div>
  );
};

/**
 * Server-side data fetching function for bucket views.
 * Fetches both the key list and optionally the selected key detail.
 */
async function fetchBucketData(
  alias: string,
  path: string,
  selected?: string | null,
): Promise<Record<string, unknown> | null> {
  try {
    const result = await fetchListKeys(alias, path || undefined);
    if (!result?.data || !result?.success) return null;

    const keys = (result.data as ListKeysQuery).filestoreQueries.listKeys;
    if (!keys) return null;

    const data: Record<string, unknown> = { keys, detail: null };

    if (selected) {
      const detailResult = await fetchLocateKeyDetail(alias, selected);
      if (detailResult) {
        data.detail = detailResult;
      }
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch bucket data:", error);
    return null;
  }
}

/**
 * Register data loaders for both root bucket and nested path views.
 */
export function registerBucketLayoutDataLoader(): void {
  pageDataRegistry.registerPageDataLoader("bucket/:alias", async (params) => {
    const alias = params?.alias as string;
    const selected = params?.selected as string | null;

    if (!alias) return null;
    return fetchBucketData(alias, "", selected);
  });

  pageDataRegistry.registerPageDataLoader("bucket/:alias/*", async (params) => {
    const alias = params?.alias as string;
    const path = params?.path as string;
    const selected = params?.selected as string | null;

    if (!alias || !path) return null;
    return fetchBucketData(alias, path, selected);
  });
}

export default BucketLayout;
