import { useParams } from "react-router-dom";
import { usePageData } from "@sun/ssr/react";
import { useTranslation } from "react-i18next";
import TailscaleDetail from "~/components/admin/tailscale-detail";

type TailscaleNode = {
  id: number;
  name: string;
  ipv4: string;
  online: boolean;
  lastSeen: string;
};

/**
 * Route component that loads a single Tailscale node by id from
 * the detail loader and renders the device detail card.
 */
const TailscaleNodeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("admin");
  const { data: node } = usePageData<TailscaleNode>(
    "tailscaleNode",
    "tailscaleNode/:id",
    { id },
  );

  if (!node) {
    return <p>{t("ip-not-found")}</p>;
  }

  return <TailscaleDetail node={node} />;
};

export default TailscaleNodeDetail;
