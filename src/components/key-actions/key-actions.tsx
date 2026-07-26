import { DropdownMenuTrigger } from "@sun/components";
import { DropdownMenuItem } from "@sun/components";
import { DropdownMenuContent } from "@sun/components";
import { DropdownMenu } from "@sun/components";
import {
  MoreVertical,
  Trash2Icon,
  Download,
  Edit,
  XCircle,
  Eye,
} from "lucide-react";
import { useContext } from "react";
import { ICON_SIZE } from "~/utils/const";
import { KeyEntry } from "~/generated/graphql";
import { FrontendMode } from "@sun/shared";
import type { FrontendMode as FrontendModeType } from "@sun/shared";
import { TFunction } from "i18next";
import RenameContext from "~/contexts/rename-context";

type KeyActionsProps = {
  /**
   * Key to download/delete.
   */
  keyEntry: KeyEntry;
  /**
   * Callback to open the key file in a viewer.
   */
  onOpen?: () => void;
  /**
   * Callback to delete the key.
   */
  onDelete?: (key: string) => void;
  /**
   * Callback to download the key file.
   */
  onDownload?: () => void;
  /**
   * Callback to cancel a torrent download.
   */
  onCancelTorrent?: () => void;
  /**
   * Frontend mode for iframe-aware rendering.
   */
  frontendMode: FrontendModeType | null;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
};

const KeyActions = (props: KeyActionsProps) => {
  const {
    keyEntry,
    onOpen,
    onDelete,
    onDownload,
    onCancelTorrent,
    frontendMode,
    t,
  } = props;
  const { startRename } = useContext(RenameContext);

  if (frontendMode === FrontendMode.EMULATOR) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <MoreVertical width={ICON_SIZE} height={ICON_SIZE} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!keyEntry.torrent && onOpen && (
          <DropdownMenuItem onClick={onOpen}>
            <Eye width={ICON_SIZE} height={ICON_SIZE} />{" "}
            {t("context-menu.open")}
          </DropdownMenuItem>
        )}
        {!keyEntry.torrent && onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download width={ICON_SIZE} height={ICON_SIZE} />{" "}
            {t("context-menu.download")}
          </DropdownMenuItem>
        )}
        {!keyEntry.torrent && (
          <DropdownMenuItem onClick={startRename}>
            <Edit width={ICON_SIZE} height={ICON_SIZE} /> {t("context-menu.edit")}
          </DropdownMenuItem>
        )}
        {keyEntry.torrent && onCancelTorrent && (
          <DropdownMenuItem variant="destructive" onClick={onCancelTorrent}>
            <XCircle width={ICON_SIZE} height={ICON_SIZE} />{" "}
            {t("context-menu.cancel-torrent")}
          </DropdownMenuItem>
        )}
        {!keyEntry.torrent && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete?.(keyEntry.key)}
          >
            <Trash2Icon width={ICON_SIZE} height={ICON_SIZE} />{" "}
            {t("context-menu.delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KeyActions;
