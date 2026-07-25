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
import { executeMutation } from "@sun/ssr";

type AddIpDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Callback when the dialog is dismissed.
   */
  onClose: () => void;
};

/**
 * Dialog for adding an IP whitelist entry.
 */
const AddIpDialog = (props: AddIpDialogProps) => {
  const { open, onClose } = props;
  const { t } = useTranslation("admin");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const pattern = data.get("pattern") as string;
    const description = data.get("description") as string | null;
    await executeMutation("gaia/createIpWhitelistEntry", {
      pattern,
      description: description || null,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("add-ip-title")}</DialogTitle>
      </DialogHeader>
      <Form onSubmit={handleSubmit}>
        <DialogBody>
          <FormField name="pattern">
            <FormLabel>{t("ip-pattern")}</FormLabel>
            <FormItem>
              <Input
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
                type="text"
                placeholder={t("ip-description-placeholder")}
              />
            </FormItem>
          </FormField>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("cancel-label")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t("ip-creating-label") : t("add-ip-submit")}
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
};

export default AddIpDialog;
