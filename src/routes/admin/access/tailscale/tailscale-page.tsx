import { useState, Suspense, useCallback } from "react";
import { useOutlet } from "react-router-dom";
import { executeMutation } from "@sun/ssr";
import AccessTabs from "~/components/admin/access-tabs";
import TailscaleCard from "~/components/admin/tailscale-card";
import TailscaleQrDialog from "~/components/admin/tailscale-qr-dialog";
import TailscaleDetailPlaceholder from "~/components/admin/tailscale-detail-placeholder";
import { IpDetailSkeleton } from "~/components/admin/skeletons";
import { usePageData } from "@sun/ssr/react";
import styles from "../../ip-config/ip-config.module.css";

type TailscaleNode = {
  id: number;
  name: string;
  ipv4: string;
  online: boolean;
  lastSeen: string;
};

/**
 * Tailscale admin page: lists Tailscale nodes and provides QR code
 * generation for pre-auth keys.
 */
const TailscalePage = () => {
  const outlet = useOutlet();
  const [qrOpen, setQrOpen] = useState(false);
  const { data: nodes } = usePageData<TailscaleNode[]>(
    "tailscaleNodes",
    "tailscaleNodes",
  );

  /**
   * Expires a Tailscale node via the backend mutation.
   */
  const handleExpire = useCallback(async (nodeId: number) => {
    await executeMutation("headscale/expire-node", { id: nodeId });
  }, []);

  return (
    <>
      <div className={styles.items_layout}>
        <div className={styles.items_list_panel}>
          <AccessTabs />
          <TailscaleCard
            nodes={nodes ?? []}
            onExpire={handleExpire}
            onGenerateQr={() => setQrOpen(true)}
          />
        </div>
        <div className={styles.items_detail_panel}>
          <Suspense fallback={<IpDetailSkeleton />}>
            {outlet ?? <TailscaleDetailPlaceholder />}
          </Suspense>
        </div>
      </div>
      <TailscaleQrDialog open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
};

export default TailscalePage;
