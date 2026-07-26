import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoViewer from "~/components/video-viewer";
import { executeMutation } from "@sun/ssr";

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
      // For MKV/AVI originals, try the transcoded MP4 version first.
      if (key.endsWith(".mkv") || key.endsWith(".avi")) {
        const res = await executeMutation(
          "filestore/get-presigned-download-url",
          { bucket, key: key + ".mp4" },
        );
        if (!cancelled && res.__typename === "QuerySuccess" && res.id) {
          setSrc(res.id);
          return;
        }
      }
      // Fall back to the original file
      const res = await executeMutation(
        "filestore/get-presigned-download-url",
        { bucket, key },
      );
      if (!cancelled && res.__typename === "QuerySuccess" && res.id) {
        setSrc(res.id);
      }
    })();
    return () => { cancelled = true; };
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
