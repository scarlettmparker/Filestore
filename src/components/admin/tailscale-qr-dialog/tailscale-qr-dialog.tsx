import { useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormLabel,
  FormItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DialogFooter,
} from "@sun/components";
import { executeMutation } from "@sun/ssr";
import { useTranslation } from "react-i18next";

import styles from "./tailscale-qr-dialog.module.css";

type TailscaleQrDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Closes the dialog.
   */
  onClose: () => void;
};

const EXPIRY_OPTIONS = [
  { label: "30m", value: "30m" },
  { label: "1h", value: "1h" },
  { label: "2h", value: "2h" },
  { label: "6h", value: "6h" },
  { label: "24h", value: "24h" },
];

/**
 * Dialog for generating a pre-auth key QR code for Tailscale device enrollment.
 */
const TailscaleQrDialog = (props: TailscaleQrDialogProps) => {
  const { open, onClose } = props;
  const { t } = useTranslation("admin");
  const [expiry, setExpiry] = useState("1h");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [keyText, setKeyText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /**
   * Generates a pre-auth key via the backend mutation.
   */
  const handleGenerate = useCallback(async () => {
    const res = await executeMutation("headscale/generate-key", { expiry });
    if (res.__typename === "QuerySuccess" && res.id) {
      setQrDataUrl(res.id);
      setKeyText(res.message || null);
    }
  }, [expiry]);

  /**
   * Copies the pre-auth key to the clipboard and shows a brief
   * confirmation toast.
   */
  const handleCopyKey = useCallback(async () => {
    if (!keyText) return;
    try {
      await navigator.clipboard.writeText(keyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // 3 seconds
    } catch {
      // Clipboard not available
    }
  }, [keyText]);

  /**
   * Resets state and closes the dialog.
   */
  const handleClose = useCallback(() => {
    setQrDataUrl(null);
    setKeyText(null);
    setExpiry("1h");
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && handleClose()}>
      <DialogHeader>
        <DialogTitle>{t("tailscale.qr-title")}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Form id="tailscale-qr-form">
          <FormField name="expiry" className={styles.row}>
            <FormLabel>{t("tailscale.expiry")}</FormLabel>
            <FormItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" type="button">
                    {EXPIRY_OPTIONS.find((o) => o.value === expiry)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {EXPIRY_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setExpiry(opt.value)}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormItem>
          </FormField>
        </Form>

        {qrDataUrl && (
          <div className={styles.qr_wrapper}>
            <img src={qrDataUrl} alt={t("tailscale.qr-alt")} />
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        {keyText && (
          <Button variant="secondary" onClick={handleCopyKey}>
            {copied ? t("tailscale.key-copied") : t("tailscale.copy-key")}
          </Button>
        )}
        <Button variant="default" onClick={handleGenerate}>
          {t("tailscale.generate-qr")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default TailscaleQrDialog;
