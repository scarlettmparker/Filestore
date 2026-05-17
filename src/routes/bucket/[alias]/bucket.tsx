import { CardHeader, CardTitle } from "@sun/components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import KeyCard from "~/components/key-card";
import { ListKeysQuery } from "~/generated/graphql";
import { fetchListKeys } from "~/utils/api";
import { getPageData, pageDataRegistry } from "~/utils/page-data";

/**
 * File overview for a single bucket. Top level view
 */
const Bucket = () => {
  const { alias } = useParams<{ alias: string }>();
  const { data: keys } = getPageData<
    ListKeysQuery["filestoreQueries"]["listKeys"]
  >("keys", `filestore/:alias`, { alias });

  if (!keys || !alias) return null;

  const { t } = useTranslation("bucket");

  return (
    <KeyCard keys={keys} bucketName={alias} t={t}>
      <CardHeader>
        <CardTitle>{alias}</CardTitle>
      </CardHeader>
    </KeyCard>
  );
};

/**
 * Server-side data fetching function to list keys in a bucket.
 */
export async function listKeys(
  alias: string,
): Promise<Record<string, unknown> | null> {
  try {
    const result = await fetchListKeys(alias);
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
export function registerBucketOverviewDataLoader(): void {
  pageDataRegistry.registerPageDataLoader(
    "filestore/:alias",
    async (params) => {
      const alias = params?.alias as string;
      if (!alias) return null;
      return listKeys(alias);
    },
  );
}

export default Bucket;
