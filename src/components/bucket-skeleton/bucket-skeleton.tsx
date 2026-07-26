import { Card, CardBody, Skeleton } from "@sun/components";
import styles from "./bucket-skeleton.module.css";

/**
 * Full-page skeleton for the bucket view while data loads.
 */
const BucketSkeleton = () => (
  <div className={styles.layout}>
    <div className={styles.left_panel}>
      <Card>
        <CardBody>
          <Skeleton className={styles.skeleton_block} />
        </CardBody>
      </Card>
    </div>
    <div className={styles.right_panel}>
      <Card>
        <CardBody>
          <Skeleton className={styles.skeleton_block} />
        </CardBody>
      </Card>
    </div>
  </div>
);

export default BucketSkeleton;
