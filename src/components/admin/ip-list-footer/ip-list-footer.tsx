import { useTranslation } from "react-i18next";
import { CardFooter } from "@sun/components";
import { usePageData } from "@sun/ssr/react";
import type { IpWhitelistEntry } from "~/generated/graphql";

/**
 * Entry count footer for the IP whitelist.
 */
const IpListFooter = () => {
  const { t } = useTranslation("admin");
  const { data } = usePageData<IpWhitelistEntry[]>("ipEntries", "ipEntries");
  const count = data?.length ?? 0;

  if (!count) return null;

  return (
    <CardFooter>
      <span>{t("ip-items-count", { count })}</span>
    </CardFooter>
  );
};

export default IpListFooter;
