import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button } from "@sun/components";
import { TFunction } from "i18next";

type ConfirmDeleteDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Callback to close the dialog.
   */
  onClose: () => void;
  /**
   * Callback to confirm deletion.
   */
  onConfirm: () => void;
  /**
   * Display name of the folder being deleted.
   */
  folderName: string;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
};

/**
 * Confirmation dialog for deleting folders.
 */
const ConfirmDeleteDialog = (props: ConfirmDeleteDialogProps) => {
  const { open, onClose, onConfirm, folderName, t } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => !open && onClose()}
    >
      <DialogHeader>
        <DialogTitle>{t("confirm-delete-dialog.title")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>{t("confirm-delete-dialog.body-folder", { name: folderName })}</p>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          {t("confirm-delete-dialog.cancel-button")}
        </Button>
        <Button variant="destructive" type="submit" onClick={onConfirm}>
          {t("confirm-delete-dialog.confirm-button")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;