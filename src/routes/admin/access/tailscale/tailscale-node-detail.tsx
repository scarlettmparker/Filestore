import { useParams } from "react-router-dom";
import { usePageData } from "@sun/ssr/react";
import { useTranslation } from "react-i18next";
import TailscaleDetail from "~/components/admin/tailscale-detail";
import type { TailscaleDevice } from "~/generated/graphql";

/**
 * Route component that loads a single Tailscale device by id from
 * the detail loader and renders the device detail card.
 */
const TailscaleNodeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("admin");
  const { data: device } = usePageData<TailscaleDevice>(
    "tailscaleDevice",
    "tailscaleDevice/:id",
    { id },
  );

  if (!device) {
    return <p>{t("ip-not-found")}</p>;
  }

  return <TailscaleDetail device={device} />;
};

export default TailscaleNodeDetail;
