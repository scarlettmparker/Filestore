import { useState, useTransition, useRef, type ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Form,
  Input,
} from "@sun/components";
import { executeMutation } from "@sun/ssr";
import { useTranslation } from "react-i18next";
import styles from "./torrent-dialog.module.css";

type TorrentDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Closes the dialog.
   */
  onClose: () => void;
  /**
   * Bucket to download into.
   */
  bucketName: string;
  /**
   * Parent folder path the torrent lands under.
   */
  currentPath: string;
};

/**
 * Dialog for starting a torrent download from a magnet link or .torrent file.
 */
const TorrentDialog = (props: TorrentDialogProps) => {
  const { open, onClose, bucketName, currentPath } = props;
  const { t } = useTranslation("bucket");
  const [magnet, setMagnet] = useState("");
  const [torrentBase64, setTorrentBase64] = useState<string | null>(null);
  const [torrentFileName, setTorrentFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setMagnet("");
    setTorrentBase64(null);
    setTorrentFileName(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setTorrentBase64(result.split(",")[1] ?? null);
      setTorrentFileName(file.name);
      setMagnet("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError(null);
    const trimmed = magnet.trim();
    if (!trimmed && !torrentBase64) {
      setError(t("torrent-dialog.error-empty"));
      return;
    }
    startTransition(async () => {
      const res = await executeMutation("filestore/add-torrent", {
        bucket: bucketName,
        path: currentPath,
        magnet: trimmed || null,
        torrentFileBase64: torrentBase64,
      });
      if (res.__typename === "QuerySuccess") {
        handleClose();
      } else {
        setError(
          "message" in res && res.message
            ? res.message
            : t("torrent-dialog.error-generic"),
        );
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => !open && handleClose()}
    >
      <DialogHeader>
        <DialogTitle>{t("torrent-dialog.title")}</DialogTitle>
      </DialogHeader>
      <Form
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <DialogBody>
          <Input
            placeholder={t("torrent-dialog.magnet-placeholder")}
            value={magnet}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setMagnet(event.target.value);
              if (event.target.value) {
                setTorrentBase64(null);
                setTorrentFileName(null);
              }
            }}
            className={styles.magnet_input}
          />
          <div className={styles.or}>{t("torrent-dialog.or")}</div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".torrent,application/x-bittorrent"
            onChange={handleFileChange}
            hidden
          />
          <Button
            variant="secondary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            {torrentFileName ?? t("torrent-dialog.choose-file")}
          </Button>
          {error && <p className={styles.error}>{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" type="button" onClick={handleClose}>
            {t("torrent-dialog.cancel")}
          </Button>
          <Button type="submit" disabled={pending}>
            {t("torrent-dialog.add")}
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
};

export default TorrentDialog;
