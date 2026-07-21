import { ListBucketsQuery } from "~/generated/graphql";
import { usePageData } from "@sun/ssr/react";
import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sun/components";
import { Folder } from "lucide-react";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * Home page displaying admin panel.
 */
const Index = () => {
  const { data: buckets } = usePageData<
    ListBucketsQuery["filestoreQueries"]["listBuckets"]
  >("buckets", "filestore");

  if (!buckets) {
    return <>Loading...</>;
  }

  const { t } = useTranslation("home");

  return (
    <Card className={styles.buckets_card}>
      <CardHeader>
        <CardTitle>{t("card-title")}</CardTitle>
        <CardDescription>{t("card-description")}</CardDescription>
      </CardHeader>
      <CardBody>
        {buckets.map((bucket, idx) => (
          <Link
            key={idx}
            to={`/bucket/${bucket.globalAliases}`}
            className={styles.bucket_link}
          >
            <Button variant="secondary" className={styles.bucket_button}>
              <Folder width={16} height={16} />
              {bucket.globalAliases}
            </Button>
          </Link>
        ))}
      </CardBody>
      <CardFooter>{t("items", { count: buckets.length })}</CardFooter>
    </Card>
  );
};

export default Index;
