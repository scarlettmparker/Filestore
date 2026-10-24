import { useState, useRef, useCallback, useEffect } from "react";
import type { TargetedEvent, TargetedKeyboardEvent } from "preact";
import {
  Button,
  Input,
  Label,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sun/components";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  FolderOpen,
} from "lucide-preact";
import { useTranslation } from "@sun/i18n";
import { executeMutation } from "@sun/ssr";
import SubtitleOffsetControls from "~/components/subtitle-offset-controls";
import SubtitleScaleControls from "~/components/subtitle-scale-controls";
import SubtitleSearch from "~/components/subtitle-search";
import SubtitleSearchResults from "~/components/subtitle-search-results";
import SubtitleOption from "~/components/subtitle-option";
import SubtitleFilePicker from "~/components/subtitle-file-picker";
import { retimeVtt } from "~/utils/subtitle";
import {
  Subtitle,
  SubtitleSearchResult,
  FetchSubtitleResponse,
  type ListKeysQuery,
} from "~/generated/graphql";
import { SubtitleSource } from "~/generated/graphql";
import styles from "./video-viewer.module.css";

type VideoViewerProps = {
  /**
   * URL of the video (presigned or /api/view/... endpoint).
   */
  src: string;
  /**
   * Bucket holding the video.
   */
  bucket?: string;
  /**
   * Original key of the video.
   */
  sourceKey?: string;
};

const SPEEDS = [0.5, 1, 1.5, 2];
const SKIP_OFFSET = 10;

/**
 * Formats seconds into a mm:ss or h:mm:ss string.
 *
 * @param seconds time in seconds.
 */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const h = Math.floor(m / 60);
  if (h > 0) {
    return `${h}:${String(m % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Full-featured video player. Renders as a standalone full-page component
 * for use in a route or new tab.
 */
const VideoViewer = (props: VideoViewerProps) => {
  const { src, bucket, sourceKey } = props;
  const { t } = useTranslation("bucket");
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [speed, setSpeed] = useState(1);

  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [baseVtt, setBaseVtt] = useState<string | null>(null);
  const [offsetMs, setOffsetMs] = useState(0);
  const [vttUrl, setVttUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("en");
  const [searchResults, setSearchResults] = useState<SubtitleSearchResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [saveAlongside, setSaveAlongside] = useState(true);
  const [activeResultId, setActiveResultId] = useState<number | null>(null);
  const [subtitleScale, setSubtitleScale] = useState(1);
  const [searchNonce, setSearchNonce] = useState(0);
  const [filePickerOpen, setFilePickerOpen] = useState(false);
  const [filePickerLoading, setFilePickerLoading] = useState(false);
  const [bucketFiles, setBucketFiles] = useState<
    NonNullable<ListKeysQuery["filestoreQueries"]["listKeys"]>
  >([]);

  /**
   * Loads subtitles for the current video.
   */
  useEffect(() => {
    if (!bucket || !sourceKey) return;
    executeMutation<Subtitle[]>("filestore/subtitles", { bucket, keyPath: sourceKey })
      .then((result) => setSubtitles(result ?? []))
      .catch(() => setSubtitles([]));
  }, [bucket, sourceKey]);

  /**
   * Prefills the search query from the file name.
   */
  useEffect(() => {
    if (!sourceKey) return;
    const name = sourceKey.split("/").pop() ?? sourceKey;
    const stem = name.replace(/\.[^.]+$/, "");
    setSearchQuery(stem.replace(/[._]/g, " "));
  }, [sourceKey]);

  /**
   * Regenerates the Blob URL whenever the base VTT or offset changes.
   */
  useEffect(() => {
    if (!baseVtt) {
      if (vttUrl) URL.revokeObjectURL(vttUrl);
      setVttUrl(null);
      return;
    }
    const url = URL.createObjectURL(new Blob([retimeVtt(baseVtt, offsetMs)], { type: "text/vtt" }));
    setVttUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [baseVtt, offsetMs]);

  /**
   * Ensures the active subtitle track is displayed.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.track.mode = vttUrl ? "showing" : "disabled";
  }, [vttUrl]);

  /**
   * Fetches a local subtitle's VTT.
   */
  const fetchLocal = useCallback(
    async (subtitleKey: string) => {
      if (!bucket || !sourceKey) return;
      const response = await executeMutation<FetchSubtitleResponse>("filestore/fetch-subtitle", {
        input: {
          bucket,
          keyPath: sourceKey,
          subtitleKey,
          source: SubtitleSource.Local,
          language: null,
          persist: false,
          fileId: null,
        },
      });
      setBaseVtt(response?.vtt ?? null);
    },
    [bucket, sourceKey],
  );

  /**
   * Fetches an OpenSubtitles result.
   */
  const fetchResult = useCallback(
    async (result: SubtitleSearchResult, persist: boolean) => {
      if (!bucket || !sourceKey) return;
      setSaving(true);
      try {
        const response = await executeMutation<FetchSubtitleResponse>("filestore/fetch-subtitle", {
          input: {
            bucket,
            keyPath: sourceKey,
            subtitleKey: null,
            source: SubtitleSource.Opensubtitles,
            fileId: result.fileId ?? null,
            language: result.language || searchLanguage || "en",
            persist,
          },
        });
        setBaseVtt(response?.vtt ?? null);
        setSelectedKey(response?.subtitleKey ?? null);
        setActiveResultId(result.fileId ?? null);
        if (persist) {
          const list = await executeMutation<Subtitle[]>("filestore/subtitles", {
            bucket,
            keyPath: sourceKey,
          });
          setSubtitles(list ?? []);
        }
      } finally {
        setSaving(false);
      }
    },
    [bucket, sourceKey, searchLanguage],
  );

  /**
   * Runs an OpenSubtitles search.
   */
  const runSearch = useCallback(async () => {
    if (!bucket || !sourceKey) return;
    setHasSearched(true);
    const results = await executeMutation<SubtitleSearchResult[]>("filestore/search-subtitles", {
      input: {
        bucket,
        keyPath: sourceKey,
        query: searchQuery || null,
        language: searchLanguage || null,
      },
    });
    setSearchResults(results ?? []);
    setSearchNonce((value) => value + 1);
  }, [bucket, sourceKey, searchQuery, searchLanguage]);

  /**
   * Opens the subtitle file picker and loads the current folder.
   */
  const openFilePicker = useCallback(async () => {
    if (!bucket || !sourceKey) return;
    setFilePickerOpen(true);
    setFilePickerLoading(true);
    const slash = sourceKey.lastIndexOf("/");
    const prefix = slash >= 0 ? sourceKey.slice(0, slash + 1) : undefined;
    try {
      const files = await executeMutation<ListKeysQuery["filestoreQueries"]["listKeys"]>(
        "filestore/list-keys",
        { bucket, prefix },
      );
      setBucketFiles(files ?? []);
    } catch {
      setBucketFiles([]);
    } finally {
      setFilePickerLoading(false);
    }
  }, [bucket, sourceKey]);

  /**
   * Uses a subtitle file selected from the bucket.
   */
  const handleFileSelect = useCallback(
    (key: string) => {
      setSelectedKey(key);
      void fetchLocal(key);
      setActiveResultId(null);
      setFilePickerOpen(false);
    },
    [fetchLocal],
  );

  /**
   * Selects a subtitle by key.
   */
  const handleSelect = useCallback(
    (key: string | null) => {
      if (key === null || (key === selectedKey && vttUrl !== null)) {
        setSelectedKey(null);
        setBaseVtt(null);
        setActiveResultId(null);
        return;
      }
      setSelectedKey(key);
      const local = subtitles.find((s) => s.subtitleKey === key);
      if (local) {
        void fetchLocal(key);
      }
      setActiveResultId(null);
    },
    [subtitles, fetchLocal, selectedKey, vttUrl],
  );

  /**
   * Uses a search result, or turns subtitles off when it is already active.
   */
  const handleUseResult = useCallback(
    (result: SubtitleSearchResult, persist: boolean) => {
      if (activeResultId === result.fileId && vttUrl !== null) {
        setSelectedKey(null);
        setBaseVtt(null);
        setActiveResultId(null);
        return;
      }
      void fetchResult(result, persist);
    },
    [activeResultId, vttUrl, fetchResult],
  );

  /**
   * Toggles play/pause on the video element.
   */
  const handlePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  }, []);

  /**
   * Toggles mute on the video element.
   */
  const handleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  /**
   * Updates the volume from the range input.
   *
   * @param e Input change event.
   */
  const handleVolume = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      const value = parseFloat(e.currentTarget.value);
      const v = videoRef.current;
      if (!v) return;
      v.volume = value;
      setVolumeState(value);
      if (value === 0) {
        v.muted = true;
        setMuted(true);
      } else if (muted) {
        v.muted = false;
        setMuted(false);
      }
    },
    [muted],
  );

  /**
   * Seeks the video to the position set by the seek bar.
   *
   * @param e Input change event.
   */
  const handleSeek = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = parseFloat(e.currentTarget.value);
  }, []);

  /**
   * Toggles fullscreen on the video container.
   */
  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  /**
   * Handles keyboard shortcuts for the player.
   *
   * @param e Keyboard event.
   */
  const handleKeyDown = useCallback(
    (e: TargetedKeyboardEvent<HTMLDivElement>) => {
      const v = videoRef.current;
      if (!v) return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        handlePlayPause();
      }
      if (e.key === "f") {
        handleFullscreen();
      }
      if (e.key === "m") {
        handleMute();
      }
      if (e.key === "ArrowLeft") {
        v.currentTime = Math.max(0, v.currentTime - SKIP_OFFSET);
      }
      if (e.key === "ArrowRight") {
        v.currentTime = Math.min(v.duration || 0, v.currentTime + SKIP_OFFSET);
      }
      if (e.key === "c") {
        if (selectedKey === null) {
          const first = subtitles[0]?.subtitleKey ?? null;
          if (first) handleSelect(first);
        } else {
          handleSelect(null);
        }
      }
      if (e.key === "[") {
        setOffsetMs((value) => value - 100);
      }
      if (e.key === "]") {
        setOffsetMs((value) => value + 100);
      }
    },
    [handlePlayPause, handleFullscreen, handleMute, selectedKey, subtitles, handleSelect],
  );

  /**
   * Updates playing state when the video starts or resumes.
   */
  const handlePlay = useCallback(() => setPlaying(true), []);

  /**
   * Updates playing state when the video pauses.
   */
  const handlePause = useCallback(() => setPlaying(false), []);

  /**
   * Updates playing state when the video ends.
   */
  const handleEnded = useCallback(() => setPlaying(false), []);

  /**
   * Stores the video duration once metadata loads.
   */
  const handleMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration ?? 0);
  }, []);

  /**
   * Updates current time during playback.
   */
  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(videoRef.current?.currentTime ?? 0);
  }, []);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div className={styles.page}>
      <div
        ref={containerRef}
        className={styles.video_container}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <video
          ref={videoRef}
          src={src}
          style={{ "--subtitle-scale": subtitleScale } as React.CSSProperties}
          className={styles.video_element}
          autoPlay
          onClick={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleMetadata}
          onEnded={handleEnded}
          onPlay={handlePlay}
          onPause={handlePause}
        >
          {vttUrl ? (
            <track
              key={vttUrl}
              ref={trackRef}
              kind="subtitles"
              src={vttUrl}
              srcLang={searchLanguage || "en"}
              default
            />
          ) : null}
        </video>
        <div className={styles.controls}>
          <div className={styles.controls_main}>
            <Button
              variant="secondary"
              onClick={handlePlayPause}
              title={playing ? t("viewer.pause") : t("viewer.play")}
              aria-label={playing ? t("viewer.pause") : t("viewer.play")}
            >
              {playing ? <Pause width={16} height={16} /> : <Play width={16} height={16} />}
            </Button>
            <Label className={styles.time}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Label>
            <Input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className={styles.seek_bar}
              aria-label={t("viewer.seek")}
            />
            <Button
              variant="secondary"
              onClick={handleMute}
              title={t("viewer.mute")}
              aria-label={t("viewer.mute")}
            >
              {muted || volume === 0 ? (
                <VolumeX width={16} height={16} />
              ) : (
                <Volume2 width={16} height={16} />
              )}
            </Button>
            <Input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className={styles.volume_bar}
              aria-label={t("viewer.volume")}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  title={t("viewer.speed")}
                  aria-label={t("viewer.speed")}
                >
                  {speed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SPEEDS.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => {
                      setSpeed(s);
                      if (videoRef.current) videoRef.current.playbackRate = s;
                    }}
                  >
                    {s}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  title={t("viewer.subtitles")}
                  aria-label={t("viewer.subtitles")}
                >
                  <Subtitles width={16} height={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent key={searchNonce} className={styles.subtitle_menu_content}>
                <div className={styles.subtitle_menu}>
                  <div className={styles.subtitle_section}>
                    {subtitles.map((subtitle) => (
                      <SubtitleOption
                        key={subtitle.subtitleKey}
                        subtitle={subtitle}
                        selected={selectedKey === subtitle.subtitleKey}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>

                  <div className={styles.subtitle_section}>
                    <DropdownMenuItem onClick={openFilePicker}>
                      <FolderOpen width={16} height={16} />
                      {t("viewer.subtitles-browse-files")}
                    </DropdownMenuItem>
                  </div>

                  <div className={styles.subtitle_section}>
                    <SubtitleOffsetControls offsetMs={offsetMs} onOffsetChange={setOffsetMs} />
                    <SubtitleScaleControls scale={subtitleScale} onScaleChange={setSubtitleScale} />
                  </div>

                  <div className={styles.subtitle_section}>
                    <SubtitleSearch
                      query={searchQuery}
                      language={searchLanguage}
                      onQueryChange={setSearchQuery}
                      onLanguageChange={setSearchLanguage}
                      onSearch={runSearch}
                    />
                    <SubtitleSearchResults
                      results={searchResults}
                      hasSearched={hasSearched}
                      saving={saving}
                      saveAlongside={saveAlongside}
                      onSaveAlongsideChange={setSaveAlongside}
                      activeFileId={activeResultId}
                      onUse={handleUseResult}
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="secondary"
              onClick={handleFullscreen}
              title={t("viewer.fullscreen")}
              aria-label={t("viewer.fullscreen")}
            >
              {fullscreen ? (
                <Minimize width={16} height={16} />
              ) : (
                <Maximize width={16} height={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <SubtitleFilePicker
        open={filePickerOpen}
        files={bucketFiles}
        loading={filePickerLoading}
        onClose={() => setFilePickerOpen(false)}
        onSelect={handleFileSelect}
      />
    </div>
  );
};

export default VideoViewer;
