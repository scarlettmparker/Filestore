import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sun/components";

type ConfirmExpireNodeDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Closes the dialog without expiring.
   */
  onClose: () => void;
  /**
   * Confirms the expiration.
   */
  onConfirm: () => void;
  /**
   * Name of the node being expired.
   */
  nodeName: string;
};

/**
 * Confirmation dialog for expiring a Tailscale device.
 */
const ConfirmExpireNodeDialog = (props: ConfirmExpireNodeDialogProps) => {
  const { open, onClose, onConfirm, nodeName } = props;
  const { t } = useTranslation("admin");

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("tailscale.expire-title", { name: nodeName })}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>{t("tailscale.expire-body")}</p>
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

export default ConfirmExpireNodeDialog;
