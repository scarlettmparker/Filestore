import { Skeleton } from "@sun/components";
import styles from "./detail-skeleton.module.css";

/**
 * Skeleton placeholder shown while detail data is being fetched.
 */
const DetailSkeleton = () => (
  <div className={styles.detail_skeleton}>
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton key={i} className={styles.detail_skeleton_row} />
    ))}
  </div>
);

export default DetailSkeleton;
