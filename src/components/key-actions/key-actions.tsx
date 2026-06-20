import { DropdownMenuTrigger } from "@sun/components";
import { DropdownMenuItem } from "@sun/components";
import { DropdownMenuContent } from "@sun/components";
import { DropdownMenu } from "@sun/components";
import { MoreVertical, Trash2Icon, Download, Edit } from "lucide-react";
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
   * Callback to delete the key.
   */
  onDelete?: (key: string) => void;
  /**
   * Callback to download the key file.
   */
  onDownload?: () => void;
  /**
   * Frontend mode for iframe-aware rendering.
   */
  frontendMode?: FrontendModeType;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
};

const KeyActions = (props: KeyActionsProps) => {
  const { keyEntry, onDelete, onDownload, frontendMode, t } = props;
  const { startRename } = useContext(RenameContext);

  if (frontendMode === FrontendMode.EMULATOR) {
    return null;
  }

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
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download width={ICON_SIZE} height={ICON_SIZE} />{" "}
            {t("context-menu.download")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={startRename}>
          <Edit width={ICON_SIZE} height={ICON_SIZE} />{" "}
          {t("context-menu.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete?.(keyEntry.key)}
        >
          <Trash2Icon width={ICON_SIZE} height={ICON_SIZE} />{" "}
          {t("context-menu.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KeyActions;
