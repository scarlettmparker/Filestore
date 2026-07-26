import { useState, useRef, useCallback, useEffect } from "react";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./viewer.module.css";

type VideoViewerProps = {
  /**
   * URL of the video (presigned or /api/view/... endpoint).
   */
  src: string;
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
  const { src } = props;
  const { t } = useTranslation("bucket");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [speed, setSpeed] = useState(1);

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
  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
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
  }, [muted]);

  /**
   * Seeks the video to the position set by the seek bar.
   *
   * @param e Input change event.
   */
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = parseFloat(e.target.value);
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
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [handlePlayPause, handleFullscreen, handleMute]);

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
    <div
      ref={containerRef}
      className={styles.video_container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        src={src}
        className={styles.video_element}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadata}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={handlePause}
      />
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
            {muted || volume === 0 ? <VolumeX width={16} height={16} /> : <Volume2 width={16} height={16} />}
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
          <Button
            variant="secondary"
            onClick={handleFullscreen}
            title={t("viewer.fullscreen")}
            aria-label={t("viewer.fullscreen")}
          >
            {fullscreen ? <Minimize width={16} height={16} /> : <Maximize width={16} height={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;
