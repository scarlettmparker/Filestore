import { DropdownMenuTrigger } from "@sun/components";
import { DropdownMenuItem } from "@sun/components";
import { DropdownMenuContent } from "@sun/components";
import { DropdownMenu } from "@sun/components";
import { MoreVertical, Trash2Icon } from "lucide-react";
import { ICON_SIZE } from "~/utils/const";
import { KeyEntry } from "~/generated/graphql";

type KeyActionsProps = {
  /**
   * Key to download/delete
   */
  keyEntry: KeyEntry;

  /**
   * Delete file/key
   */
  onDelete?: (key: string) => void;
};

const KeyActions = (props: KeyActionsProps) => {
  const { keyEntry, onDelete } = props;

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
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete?.(keyEntry.key)}
        >
          <Trash2Icon width={ICON_SIZE} height={ICON_SIZE} /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KeyActions;
