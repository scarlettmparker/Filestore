import { useState, useEffect, Suspense, useCallback } from "react";
import { useOutlet } from "react-router-dom";
import TailscaleCard from "~/components/admin/tailscale-card";
import TailscaleQrDialog from "~/components/admin/tailscale-qr-dialog";
import IpDetailPlaceholder from "~/components/admin/ip-detail-placeholder";
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
  const [nodes, setNodes] = useState<TailscaleNode[]>([]);

  /**
   * Fetches the list of Tailscale nodes on mount.
   */
  useEffect(() => {
    fetch("/api/headscale/nodes")
      .then((r) => r.json())
      .then((data) => setNodes(data))
      .catch(() => {});
  }, []);

  /**
   * Expires a Tailscale node by calling the backend.
   */
  const handleExpire = useCallback(async (nodeId: number) => {
    await fetch(`/api/headscale/nodes/${nodeId}/expire`, { method: "POST" });
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
  }, []);

  return (
    <>
      <div className={styles.items_layout}>
        <div className={styles.items_list_panel}>
          <TailscaleCard nodes={nodes} onExpire={handleExpire} onGenerateQr={() => setQrOpen(true)} />
        </div>
        <div className={styles.items_detail_panel}>
          <Suspense fallback={null}>
            {outlet ?? <IpDetailPlaceholder />}
          </Suspense>
        </div>
      </div>
      <TailscaleQrDialog open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
};

export default TailscalePage;
