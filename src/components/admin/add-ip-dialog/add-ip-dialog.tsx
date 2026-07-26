import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormLabel,
  FormItem,
  Input,
  Checkbox,
} from "@sun/components";

import styles from "./add-ip-dialog.module.css";

type AddIpDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Callback when the dialog is dismissed.
   */
  onClose: () => void;
  /**
   * Called with the entered values when the user saves.
   */
  onSave: (
    pattern: string,
    description: string | null,
    immutable: boolean,
    enabled: boolean,
  ) => void;
};

/**
 * Dialog for adding an IP whitelist entry.
 */
const AddIpDialog = (props: AddIpDialogProps) => {
  const { open, onClose, onSave } = props;
  const { t } = useTranslation("admin");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const pattern = data.get("pattern") as string;
    const description = data.get("description") as string | null;
    const immutable = data.get("immutable") === "on";
    const enabled = data.get("enabled") !== "off";
    onSave(pattern, description || null, immutable, enabled);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("add-ip-title")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Form id="add-ip-form" onSubmit={handleSubmit}>
          <FormField name="pattern">
            <FormLabel>{t("ip-pattern")}</FormLabel>
            <FormItem>
              <Input
                name="pattern"
                type="text"
                placeholder={t("ip-pattern-placeholder")}
                autoFocus
                required
              />
            </FormItem>
          </FormField>
          <FormField name="description">
            <FormLabel>{t("ip-description")}</FormLabel>
            <FormItem>
              <Input
                name="description"
                type="text"
                placeholder={t("ip-description-placeholder")}
              />
            </FormItem>
          </FormField>
          <FormField name="immutable" className={styles.immutable}>
            <FormItem>
              <Checkbox name="immutable" />
            </FormItem>
            <FormLabel>{t("immutable")}</FormLabel>
          </FormField>
          <FormField name="enabled" className={styles.checkbox_row}>
            <FormItem>
              <Checkbox name="enabled" defaultChecked />
            </FormItem>
            <FormLabel>{t("enabled")}</FormLabel>
          </FormField>
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("cancel-label")}
        </Button>
        <Button type="submit" form="add-ip-form" disabled={loading}>
          {loading ? t("ip-creating-label") : t("add-ip-submit")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddIpDialog;
