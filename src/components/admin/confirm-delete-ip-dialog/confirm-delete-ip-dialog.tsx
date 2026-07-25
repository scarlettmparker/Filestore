import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sun/components";

type ConfirmDeleteIpDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Callback to close without confirming.
   */
  onClose: () => void;
  /**
   * Callback to fire the delete mutation.
   */
  onConfirm: () => void;
  /**
   * Pattern of the entry being deleted.
   */
  pattern: string;
};

/**
 * Confirmation dialog for deleting an IP whitelist entry.
 */
const ConfirmDeleteIpDialog = (props: ConfirmDeleteIpDialogProps) => {
  const { open, onClose, onConfirm, pattern } = props;
  const { t } = useTranslation("admin");

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("ip-delete-title", { pattern })}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>{t("ip-delete-body")}</p>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("cancel-label")}
        </Button>
        <Button type="submit" variant="destructive" onClick={onConfirm}>
          {t("confirm-label")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDeleteIpDialog;
