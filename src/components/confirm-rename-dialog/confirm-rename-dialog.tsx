import { useCallback } from "react";
import { DialogFooter, Button } from "@sun/components";
import { DialogHeader, DialogTitle, DialogBody } from "@sun/components";
import { Dialog } from "@sun/components";
import { TFunction } from "i18next";
import styles from "./confirm-rename-dialog.module.css";

type ConfirmRenameDialogProps = {
  /**
   * Whether the dialog is open or not.
   */
  message: string | null;
  /**
   * Setter for dialog message. Setting to null will close the dialog.
   */
  setMessage: (message: string | null) => void;
  /**
   * Callback for when user confirms the rename action. This triggers rename with force merge flag.
   */
  onConfirm: () => void;
  /**
   * i18n translation function.
   */
  t: TFunction<"bucket">;
};

/**
 * Confirmation dialog for renaming keys when there is a conflict.
 * This will trigger a rename with merge flag enabled when confirmed.
 */
const ConfirmRenameDialog = (props: ConfirmRenameDialogProps) => {
  const { message, setMessage, onConfirm, t } = props;

  const handleCancel = useCallback(() => {
    setMessage(null);
  }, [setMessage]);

  return (
    <Dialog
      open={!!message}
      onOpenChange={(open: boolean) => !open && handleCancel()}
    >
      <DialogHeader>
        <DialogTitle>{t("confirm-dialog.title")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>{t("confirm-dialog.body")}</p>
        <p className={styles.confirm_rename_message}>
          <strong>{message}</strong>
        </p>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" onClick={handleCancel}>
          {t("confirm-dialog.cancel-button")}
        </Button>
        <Button type="submit" onClick={onConfirm}>
          {t("confirm-dialog.confirm-button")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmRenameDialog;
