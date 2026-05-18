import { Breadcrumb } from "@sun/components";
import Bucket from "~/components/bucket";
import styles from "./bucket.module.css";

/**
 * File overview for a single bucket. Top level view
 */
const BucketPage = () => {
  return (
    <div className={styles.card_wrapper}>
      <Breadcrumb>
        <Bucket />
      </Breadcrumb>
    </div>
  );
};

export default BucketPage;
