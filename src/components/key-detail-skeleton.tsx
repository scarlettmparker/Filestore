import { Card, CardBody, Skeleton } from "@sun/components";
import detailStyles from "./key-detail/key-detail.module.css";

/**
 * Loading skeleton for key details.
 */
const KeyDetailSkeleton = () => {
  return (
    <Card className={detailStyles.detail_card}>
      <CardBody>
        <Skeleton style={{ width: "100%", height: "12rem" }} />
      </CardBody>
    </Card>
  );
};

export default KeyDetailSkeleton;
