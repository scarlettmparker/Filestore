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
} from "@sun/components";
import type { IpWhitelistEntry } from "~/generated/graphql";

type EditIpDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Callback when the dialog is dismissed.
   */
  onClose: () => void;
  /**
   * Entry being edited.
   */
  entry: IpWhitelistEntry | null;
  /**
   * Called with updated values when the user saves.
   */
  onSave: (id: string, pattern: string, description: string | null) => void;
};

/**
 * Dialog for editing an IP whitelist entry.
 */
const EditIpDialog = (props: EditIpDialogProps) => {
  const { open, onClose, entry, onSave } = props;
  const { t } = useTranslation("admin");
  const [loading, setLoading] = useState(false);

  if (!entry) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const pattern = data.get("pattern") as string;
    const description = data.get("description") as string | null;
    onSave(entry.id, pattern, description || null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("edit-ip-title")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Form id="edit-ip-form" onSubmit={handleSubmit}>
          <FormField name="pattern">
            <FormLabel>{t("ip-pattern")}</FormLabel>
            <FormItem>
              <Input
                name="pattern"
                type="text"
                placeholder={t("ip-pattern-placeholder")}
                defaultValue={entry.pattern}
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
                defaultValue={entry.description ?? ""}
              />
            </FormItem>
          </FormField>
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("cancel-label")}
        </Button>
        <Button type="submit" form="edit-ip-form" disabled={loading}>
          {loading ? t("ip-editing-label") : t("edit-ip-submit")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditIpDialog;
