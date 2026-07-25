import { useState, Suspense } from "react";
import { useOutlet } from "react-router-dom";
import IpList from "~/components/admin/ip-list";
import IpDetailPlaceholder from "~/components/admin/ip-detail-placeholder";
import { IpDetailSkeleton } from "~/components/admin/skeletons";
import AddIpDialog from "~/components/admin/add-ip-dialog";
import styles from "./ip-config.module.css";

/**
 * IP whitelist configuration page.
 */
const IpConfig = () => {
  const outlet = useOutlet();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div className={styles.items_layout}>
        <div className={styles.items_list_panel}>
          <IpList onAdd={() => setAddOpen(true)} />
        </div>
        <div className={styles.items_detail_panel}>
          <Suspense fallback={<IpDetailSkeleton />}>
            {outlet ?? <IpDetailPlaceholder />}
          </Suspense>
        </div>
      </div>
      <AddIpDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </>
  );
};

export default IpConfig;
