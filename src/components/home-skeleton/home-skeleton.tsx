import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@sun/components";
import styles from "./home-skeleton.module.css";

/**
 * Full-page skeleton for the home page while data loads.
 */
const HomeSkeleton = () => (
  <Card className={styles.card}>
    <CardHeader>
      <Skeleton className={styles.skeleton_title} />
      <Skeleton className={styles.skeleton_desc} />
    </CardHeader>
    <CardBody className={styles.skeleton_list}>
      <Skeleton className={styles.skeleton_row} />
    </CardBody>
    <CardFooter>
      <Skeleton className={styles.skeleton_footer} />
    </CardFooter>
  </Card>
);

export default HomeSkeleton;
