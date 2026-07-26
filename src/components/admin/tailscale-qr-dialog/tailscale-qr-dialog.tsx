import { useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectOption,
} from "@sun/components";
import { useTranslation } from "react-i18next";

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

  /**
   * Generates a pre-auth key via the backend and stores the QR image
   * data URL and raw key text.
   */
  const handleGenerate = useCallback(async () => {
    const response = await fetch(
      `/api/headscale/preauth-key?expiry=${encodeURIComponent(expiry)}`,
    );
    if (!response.ok) return;
    // Extract key text from response header or body
    const keyFromHeader = response.headers.get("X-Preauth-Key");
    if (keyFromHeader) {
      setKeyText(keyFromHeader);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = () => setQrDataUrl(reader.result as string);
    reader.readAsDataURL(blob);
  }, [expiry]);

  /**
   * Copies the pre-auth key to the clipboard.
   */
  const handleCopyKey = useCallback(async () => {
    if (!keyText) return;
    try {
      await navigator.clipboard.writeText(keyText);
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
        <Label htmlFor="tailscale-expiry">{t("tailscale.expiry")}</Label>
        <Select
          id="tailscale-expiry"
          value={expiry}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExpiry(e.target.value)}
        >
          {EXPIRY_OPTIONS.map((opt) => (
            <SelectOption key={opt.value} value={opt.value}>
              {opt.label}
            </SelectOption>
          ))}
        </Select>

        <Button variant="default" onClick={handleGenerate}>
          {t("tailscale.generate-qr")}
        </Button>

        {qrDataUrl && (
          <div>
            <img
              src={qrDataUrl}
              alt={t("tailscale.qr-alt")}
            />
            {keyText && (
              <>
                <p>{keyText}</p>
                <Button variant="secondary" onClick={handleCopyKey}>
                  {t("tailscale.copy-key")}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default TailscaleQrDialog;
