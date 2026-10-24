/**
 * Shifts every cue timestamp in a WebVTT document.
 *
 * @param vttText The source WebVTT text.
 * @param offsetMs Offset in milliseconds (positive delays subtitles).
 * @returns Valid WebVTT with shifted cues.
 */
export function retimeVtt(vttText: string, offsetMs: number): string {
  const offset = offsetMs / 1000;
  const cueTiming = /^(\d{1,2}:)?\d{1,2}:\d{2}\.\d{3}\s*-->\s*(\d{1,2}:)?\d{1,2}:\d{2}\.\d{3}/;

  return vttText
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(cueTiming);
      if (!match) return line;
      const arrowIndex = line.indexOf("-->");
      const startText = line.slice(0, arrowIndex).trim();
      const rest = line.slice(arrowIndex + 3);
      const endMatch = rest.match(/^\s*((\d{1,2}:)?\d{1,2}:\d{2}\.\d{3})/);
      if (!endMatch) return line;
      const endText = endMatch[1].trim();
      const tail = rest.slice(endMatch[0].length);
      const start = clampTimestamp(parseTimestamp(startText) + offset);
      const end = clampTimestamp(parseTimestamp(endText) + offset);
      return `${formatTimestamp(start)} --> ${formatTimestamp(Math.max(start, end))}${tail}`;
    })
    .join("\n");
}

function parseTimestamp(value: string): number {
  const parts = value.split(":");
  if (parts.length === 3) {
    return (
      Number(parts[0]) * 3600 +
      Number(parts[1]) * 60 +
      Number(parts[2])
    );
  }
  if (parts.length === 2) {
    return Number(parts[0]) * 60 + Number(parts[1]);
  }
  return Number(parts[0]);
}

function formatTimestamp(seconds: number): string {
  const total = Math.max(0, seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const whole = Math.floor(secs);
  const millis = Math.round((secs - whole) * 1000);
  const mm = String(minutes).padStart(2, "0");
  const ss = String(whole).padStart(2, "0");
  const ms = String(millis).padStart(3, "0");
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${mm}:${ss}.${ms}`;
  }
  return `${mm}:${ss}.${ms}`;
}

function clampTimestamp(value: number): number {
  return Math.max(0, value);
}
