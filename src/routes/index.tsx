import { ListBucketsQuery } from "~/generated/graphql";
import { fetchListBuckets } from "~/utils/api";
import { getPageData, pageDataRegistry } from "~/utils/page-data";

/**
 * Home page displaying admin panel.
 */
const Index = () => {
  const { data: buckets } = getPageData<
    ListBucketsQuery["filestoreQueries"]["listBuckets"]
  >("buckets", "filestore");

  if (!buckets) {
    return <>Loading...</>;
  }

  console.log("buckets", buckets);

  return <></>;
};

/**
 * Server-side data fetching function to list buckets.
 */
export async function getBuckets(): Promise<Record<string, unknown> | null> {
  try {
    const result = await fetchListBuckets();
    if (result?.data && result?.success) {
      const buckets = (result.data as ListBucketsQuery).filestoreQueries
        .listBuckets;
      if (buckets) {
        return { buckets };
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch bucket data:", error);
    return null;
  }
}

/**
 * Register the data loader for this page.
 */
export function registerBucketsDataLoader(): void {
  pageDataRegistry.registerPageDataLoader("filestore", getBuckets);
}

export default Index;
