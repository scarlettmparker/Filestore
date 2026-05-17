import { useParams } from "react-router-dom";
import { ListKeysQuery } from "~/generated/graphql";
import { fetchListKeys } from "~/utils/api";
import { getPageData, pageDataRegistry } from "~/utils/page-data";

const Folder = () => {
  const { alias, path } = useParams<{ alias: string; path: string }>();
  const { data: keys } = getPageData<
    ListKeysQuery["filestoreQueries"]["listKeys"]
  >("keys", "filestore/:alias/:path", { alias, path });

  return <></>;
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
    "filestore/:alias/:path",
    async (params) => {
      const alias = params?.alias as string;
      const path = params?.path as string;
      if (!alias || !path) return null;
      return listKeys(alias, path);
    },
  );
}

export default Folder;
