import { useState, Suspense, useCallback } from "react";
import { useOutlet } from "react-router-dom";
import { executeMutation } from "@sun/ssr";
import { usePageData } from "@sun/ssr/react";
import AccessTabs from "~/components/admin/access-tabs";
import TailscaleCard from "~/components/admin/tailscale-card";
import TailscaleQrDialog from "~/components/admin/tailscale-qr-dialog";
import TailscaleDetailPlaceholder from "~/components/admin/tailscale-detail-placeholder";
import ConfirmExpireNodeDialog from "~/components/admin/confirm-expire-node-dialog";
import { IpDetailSkeleton } from "~/components/admin/skeletons";
import type { TailscaleDevice } from "~/generated/graphql";
import styles from "../../ip-config/ip-config.module.css";

/**
 * Tailscale admin page: lists Tailscale devices and provides QR code
 * generation for pre-auth keys.
 */
const TailscalePage = () => {
  const outlet = useOutlet();
  const [qrOpen, setQrOpen] = useState(false);
  const [expiringDevice, setExpiringDevice] = useState<{ id: string; name: string } | null>(null);

  const { data: devices } = usePageData<TailscaleDevice[]>(
    "tailscaleDevices",
    "tailscaleDevices",
  );

  /**
   * Opens the expire confirmation for a device.
   */
  const handleExpireClick = useCallback((deviceId: string, deviceName: string) => {
    setExpiringDevice({ id: deviceId, name: deviceName });
  }, []);

  /**
   * Expires the device via Headscale API and marks it expired in Gaia.
   */
  const handleExpireConfirm = useCallback(async () => {
    if (!expiringDevice) return;
    const device = devices?.find((d) => d.id === expiringDevice.id);
    if (device) {
      await executeMutation("headscale/expire-node", { id: device.headscaleId });
    }
    await executeMutation("gaia/expireTailscaleDevice", { id: expiringDevice.id });
    setExpiringDevice(null);
  }, [expiringDevice, devices]);

  return (
    <>
      <div className={styles.items_layout}>
        <div className={styles.items_list_panel}>
          <AccessTabs />
          <TailscaleCard
            devices={devices ?? []}
            onExpire={handleExpireClick}
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
      <ConfirmExpireNodeDialog
        open={!!expiringDevice}
        onClose={() => setExpiringDevice(null)}
        onConfirm={handleExpireConfirm}
        nodeName={expiringDevice?.name ?? ""}
      />
    </>
  );
};

export default TailscalePage;
