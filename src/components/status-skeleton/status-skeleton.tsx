import { Card, CardBody, Skeleton } from "@sun/components";
import styles from "./status-skeleton.module.css";

/**
 * Skeleton for the status page while data loads.
 */
const StatusSkeleton = () => (
  <Card>
    <CardBody>
      <Skeleton className={styles.skeleton_text} />
    </CardBody>
  </Card>
);

export default StatusSkeleton;
