import { ListBucketsQuery } from "~/generated/graphql";
import { fetchListBuckets } from "~/utils/api";
import { getPageData, pageDataRegistry } from "~/utils/page-data";
import { Button, Card, CardBody } from "@sun/components";
import { Folder } from "lucide-react";
import styles from "./index.module.css";

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

  return (
    <>
      <Card className={styles.buckets_card}>
        <CardBody>
          {buckets.map((bucket, idx) => (
            <a
              key={idx}
              href={`/bucket/${bucket.globalAliases}`}
              className={styles.bucket_link}
            >
              <Button variant="secondary" className={styles.bucket_button}>
                <Folder width={16} height={16} />
                {bucket.globalAliases}
              </Button>
            </a>
          ))}
        </CardBody>
      </Card>
    </>
  );
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
