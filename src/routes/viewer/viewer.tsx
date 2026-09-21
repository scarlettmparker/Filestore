import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoViewer from "~/components/video-viewer";
import { executeMutation } from "@sun/ssr";
import type { GetPresignedDownloadUrlResponse } from "~/generated/graphql";

/**
 * Route component for the video viewer page. Reads bucket and key from
 * query params, fetches a presigned URL, and renders the video player.
 */
const ViewerRoute = () => {
  const [params] = useSearchParams();
  const bucket = params.get("bucket");
  const key = params.get("key");
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!bucket || !key) return;
    let cancelled = false;
    (async () => {
      try {
        if (key.endsWith(".mkv") || key.endsWith(".avi")) {
          const res = await executeMutation<GetPresignedDownloadUrlResponse>(
            "filestore/get-presigned-download-url",
            { bucket, key: key + ".mp4" },
          );
          if (!cancelled && res.url) {
            setSrc(res.url);
            return;
          }
        }
        const res = await executeMutation<GetPresignedDownloadUrlResponse>(
          "filestore/get-presigned-download-url",
          { bucket, key },
        );
        if (!cancelled && res.url) {
          setSrc(res.url);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to resolve video URL", err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bucket, key]);

  if (!bucket || !key) {
    return <p>Missing bucket or key parameter.</p>;
  }

  if (!src) {
    return null;
  }

  return <VideoViewer src={src} />;
};

export default ViewerRoute;
