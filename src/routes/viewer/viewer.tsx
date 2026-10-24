import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@sun/components";
import { useTranslation } from "@sun/i18n";
import { executeMutation } from "@sun/ssr";
import VideoViewer from "~/components/video-viewer";
import styles from "./viewer.module.css";

type VideoSource = {
  /**
   * Presigned URL for the playable object, or null when nothing is playable.
   */
  url: string | null;
  /**
   * Key of the playable object, or the requested key when unresolved.
   */
  key: string;
  /**
   * Whether the returned URL points at a browser-playable object.
   */
  playable: boolean;
  /**
   * Whether the original still needs transcoding before it can play.
   */
  needsTranscode: boolean;
  /**
   * Whether any source object exists for the key.
   */
  found: boolean;
};

const POLL_INTERVAL_MS = 5000;
const PREPARE_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Route component for the video viewer page. Reads bucket and key from
 * query params, resolves a playable source, and renders the video player.
 */
const ViewerRoute = () => {
  const { t } = useTranslation("bucket");
  const [params] = useSearchParams();
  const bucket = params.get("bucket");
  const key = params.get("key");
  const [source, setSource] = useState<VideoSource | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [failed, setFailed] = useState(false);
  const cancelledRef = useRef(false);

  const resolveSource = useCallback(async () => {
    if (!bucket || !key) return null;
    return executeMutation<VideoSource>("filestore/resolve-video-source", { bucket, key });
  }, [bucket, key]);

  useEffect(() => {
    cancelledRef.current = false;
    resolveSource()
      .then((next) => {
        if (!cancelledRef.current) setSource(next);
      })
      .catch(() => {
        if (!cancelledRef.current) setFailed(true);
      });
    return () => {
      cancelledRef.current = true;
    };
  }, [resolveSource]);

  useEffect(() => {
    if (!preparing) return;
    let cancelled = false;
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      const next = await resolveSource();
      if (cancelled) return;
      if (next?.playable) {
        setSource(next);
        setPreparing(false);
        return;
      }
      if (Date.now() - startedAt > PREPARE_TIMEOUT_MS) {
        setPreparing(false);
        setFailed(true);
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = setTimeout(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [preparing, resolveSource]);

  const handlePrepare = useCallback(async () => {
    if (!bucket || !key) return;
    setFailed(false);
    setPreparing(true);
    try {
      await executeMutation("filestore/transcode-video", { bucket, key });
    } catch {
      setPreparing(false);
      setFailed(true);
    }
  }, [bucket, key]);

  if (!bucket || !key) {
    return <p className={styles.message}>{t("viewer.missing-params")}</p>;
  }

  if (failed) {
    return <p className={styles.message}>{t("viewer.prepare-failed")}</p>;
  }

  if (!source) {
    return null;
  }

  if (source.playable && source.url) {
    return <VideoViewer src={source.url} />;
  }

  if (source.needsTranscode) {
    return (
      <div className={styles.prepare}>
        <p>{t("viewer.prepare-title")}</p>
        <p className={styles.message}>{t("viewer.prepare-body")}</p>
        <Button onClick={handlePrepare} disabled={preparing}>
          {preparing ? t("viewer.preparing") : t("viewer.prepare-action")}
        </Button>
      </div>
    );
  }

  return <p className={styles.message}>{t("viewer.not-found")}</p>;
};

export default ViewerRoute;
