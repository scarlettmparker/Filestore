import {
  useState,
  useTransition,
  useRef,
  useCallback,
  type ChangeEvent,
} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Form,
  Input,
  SearchBar,
} from "@sun/components";
import { executeMutation } from "@sun/ssr";
import { useTranslation } from "react-i18next";
import styles from "./torrent-dialog.module.css";
import type { SearchTorrentsQuery } from "~/generated/graphql";

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

type SearchResult =
  SearchTorrentsQuery["filestoreQueries"]["searchTorrents"][number];

/**
 * Dialog for starting a torrent download.
 */
const TorrentDialog = (props: TorrentDialogProps) => {
  const { open, onClose, bucketName, currentPath } = props;
  const { t } = useTranslation("bucket");
  const [tab, setTab] = useState<"magnet" | "search">("magnet");
  const [magnet, setMagnet] = useState("");
  const [torrentBase64, setTorrentBase64] = useState<string | null>(null);
  const [torrentFileName, setTorrentFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  /**
   * Resets all local state to defaults.
   */
  const reset = useCallback(() => {
    setMagnet("");
    setTorrentBase64(null);
    setTorrentFileName(null);
    setError(null);
    setResults([]);
    setSearchQuery("");
  }, []);

  /**
   * Closes the dialog and resets state.
   */
  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  /**
   * Reads a .torrent file and stores its base64 content.
   */
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
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
    },
    [],
  );

  /**
   * Handles magnet input change.
   */
  const handleMagnetChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setMagnet(event.target.value);
      if (event.target.value) {
        setTorrentBase64(null);
        setTorrentFileName(null);
      }
    },
    [],
  );

  /**
   * Submits the magnet link or .torrent file to start a download.
   */
  const handleSubmit = useCallback(async () => {
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
  }, [magnet, torrentBase64, bucketName, currentPath, handleClose, t]);

  /**
   * Searches Jackett for torrents matching the query.
   */
  const handleSearch = useCallback(
    async (value: string) => {
      if (!value.trim()) return;
      setError(null);
      const res = await executeMutation("filestore/search-torrents", {
        query: value.trim(),
      });
      if (res.__typename === "QuerySuccess" && res.message) {
        try {
          setResults(JSON.parse(res.message as string));
        } catch {
          setError(t("torrent-dialog.search-error"));
        }
      } else {
        setError(t("torrent-dialog.search-error"));
      }
    },
    [t],
  );

  /**
   * Starts a torrent download from a search result.
   */
  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      startTransition(async () => {
        const res = await executeMutation("filestore/add-torrent", {
          bucket: bucketName,
          path: currentPath,
          magnet: result.magnet,
          torrentFileBase64: null,
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
    },
    [bucketName, currentPath, handleClose, t],
  );

  /**
   * Opens the file picker for .torrent files.
   */
  const handleChooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => !open && handleClose()}
    >
      <DialogHeader>
        <DialogTitle>{t("torrent-dialog.title")}</DialogTitle>
      </DialogHeader>
      <div className={styles.tabs}>
        <Button
          variant={tab === "magnet" ? "default" : "secondary"}
          className={styles.tab_button}
          onClick={() => setTab("magnet")}
        >
          {t("torrent-dialog.magnet-tab")}
        </Button>
        <Button
          variant={tab === "search" ? "default" : "secondary"}
          className={styles.tab_button}
          onClick={() => setTab("search")}
        >
          {t("torrent-dialog.search-tab")}
        </Button>
      </div>
      <DialogBody>
        {tab === "magnet" ? (
          <Form
            id="torrent-form"
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              placeholder={t("torrent-dialog.magnet-placeholder")}
              value={magnet}
              onChange={handleMagnetChange}
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
              onClick={handleChooseFile}
            >
              {torrentFileName ?? t("torrent-dialog.choose-file")}
            </Button>
            {error && <p className={styles.error}>{error}</p>}
          </Form>
        ) : (
          <div className={styles.search_container}>
            <div className={styles.toolbar}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(value: string) => {
                  setSearchQuery(value);
                  handleSearch(value);
                }}
                placeholder={t("torrent-dialog.search-placeholder")}
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {results.length > 0 && (
              <ul className={styles.result_list}>
                {results.map((r, i) => (
                  <li key={i}>
                    <Button
                      variant="secondary"
                      className={styles.result_button}
                      onClick={() => handleSelectResult(r)}
                      disabled={pending}
                    >
                      <span className={styles.result_name}>{r.name}</span>
                      <span className={styles.result_meta}>
                        <p>
                          {r.seeders} {t("torrent-dialog.seeders")}
                        </p>
                        <p>{r.size}</p>
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" type="button" onClick={handleClose}>
          {t("torrent-dialog.cancel")}
        </Button>
        {tab === "magnet" && (
          <Button type="submit" form="torrent-form" disabled={pending}>
            {t("torrent-dialog.add")}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default TorrentDialog;
