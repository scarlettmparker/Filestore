import { Breadcrumb } from "@sun/components";
import { CardHeader, CardTitle } from "@sun/components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FilestoreBreadcrumb from "~/components/filestore-breadcrumb";
import KeyCard from "~/components/key-card";
import { ListKeysQuery } from "~/generated/graphql";
import { fetchListKeys } from "~/utils/api";
import { getPageData, pageDataRegistry } from "~/utils/page-data";
import styles from "./folder.module.css";

/**
 * Component displaying a folder and its keys as a card.
 */
const Folder = () => {
  const { alias, path } = useParams<{ alias: string; path: string }>();
  const { data: keys } = getPageData<
    ListKeysQuery["filestoreQueries"]["listKeys"]
  >("keys", `bucket/:alias/:path`, { alias, path });

  if (!keys || !alias) return null;

  const { t } = useTranslation("bucket");

  return (
    <div className={styles.card_wrapper}>
      <Breadcrumb>
        <FilestoreBreadcrumb alias={alias} path={path}>
          <KeyCard keys={keys} bucketName={alias} currentPath={path} t={t}>
            <CardHeader>
              <CardTitle>{`${alias}/${path}`}</CardTitle>
            </CardHeader>
          </KeyCard>
        </FilestoreBreadcrumb>
      </Breadcrumb>
    </div>
  );
};

/**
 * Server-side data fetching function to list keys in a bucket.
 */
export async function listKeys(
  /**
   * Bucket alias.
   */
  alias: string,
  /**
   * Path in bucket.
   */
  path: string,
): Promise<Record<string, unknown> | null> {
  try {
    const result = await fetchListKeys(alias, `${path}/`);
    if (result?.data && result?.success) {
      const keys = (result.data as ListKeysQuery).filestoreQueries.listKeys;
      if (keys) {
        return { keys };
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch key data:", error);
    return null;
  }
}

/**
 * Register the data loader for this page.
 */
export function registerFolderOverviewDataLoader(): void {
  pageDataRegistry.registerPageDataLoader(
    "bucket/:alias/:path",
    async (params) => {
      const alias = params?.alias as string;
      const path = params?.path as string;
      if (!alias || !path) return null;
      return listKeys(alias, path);
    },
  );
}

export default Folder;
