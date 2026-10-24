import { defineLoader, defineMutation, MutationError, type MutationContext } from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { tokenFrom } from "./context";
import { objectExists, triggerTranscode } from "./backend";
import { AUTH_COOKIE, getCookieValue } from "~/utils/auth";
import {
  AddTorrentDocument,
  CancelTorrentDocument,
  DeleteFileDocument,
  DeleteKeyDocument,
  DeleteSubtitleDocument,
  FetchSubtitleDocument,
  GetPresignedDownloadUrlDocument,
  GetPresignedUploadUrlDocument,
  HealthDocument,
  ListBucketsDocument,
  ListKeysDocument,
  LocateKeyDetailDocument,
  PutKeyDocument,
  RenameKeyDocument,
  SearchSubtitlesDocument,
  SearchTorrentsDocument,
  SubtitlesDocument,
  type AddTorrentResponse,
  type CancelTorrentResponse,
  type DeleteFileResponse,
  type DeleteKeyResponse,
  type GetPresignedDownloadUrlResponse,
  type GetPresignedUploadUrlResponse,
  type PutKeyResponse,
  type RenameKeyResponse,
  type TorrentSearchResult,
  type AddTorrentMutation,
  type CancelTorrentMutation,
  type DeleteFileMutation,
  type DeleteKeyMutation,
  type DeleteSubtitleMutation,
  type DeleteSubtitleMutationVariables,
  type FetchSubtitleMutation,
  type FetchSubtitleMutationVariables,
  type GetPresignedUploadUrlMutation,
  type GetPresignedDownloadUrlMutation,
  type HealthQuery,
  type ListBucketsQuery,
  type ListKeysQuery,
  type LocateKeyDetailQuery,
  type PutKeyMutation,
  type RenameKeyMutation,
  type SearchSubtitlesMutation,
  type SearchSubtitlesMutationVariables,
  type SearchTorrentsQuery,
  type SubtitlesQuery,
  type SubtitlesQueryVariables,
} from "~/generated/graphql";

/**
 * Body shape for key-list-affecting mutations: the bucket and, for nested
 * operations, the folder path.
 */
type BucketBody = {
  bucket: string;
  key?: string | null;
  path?: string;
};

/**
 * Playable source resolved for a video key.
 */
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

/**
 * Returns a presigned download URL for a key.
 */
async function presignDownload(
  bucket: string,
  key: string,
  context: MutationContext,
): Promise<string | null> {
  const result = await executeDocument<GetPresignedDownloadUrlMutation>(
    GetPresignedDownloadUrlDocument,
    { input: { bucket, key } },
    tokenFrom(context),
  );
  return result.data?.filestoreMutations?.getPresignedDownloadUrl?.url ?? null;
}

/**
 * Puts a file or key.
 */
defineMutation({
  path: "filestore/put",
  async handler(body: BucketBody, context: MutationContext): Promise<PutKeyResponse> {
    const { bucket, key } = body;
    if (!bucket) {
      throw new MutationError("Invalid input: bucket required");
    }
    if (key !== undefined && key !== null && typeof key !== "string") {
      throw new MutationError("Invalid input: key must be a string or null");
    }
    const result = await executeDocument<PutKeyMutation>(
      PutKeyDocument,
      { input: { bucket, key: key ?? null } },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.putKey;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to put file/key");
    }
    return response;
  },
});

/**
 * Returns a presigned upload URL for direct-to-storage PUT.
 */
defineMutation({
  path: "filestore/get-presigned-upload-url",
  async handler(
    body: { bucket: string; key: string; contentType?: string },
    context: MutationContext,
  ): Promise<GetPresignedUploadUrlResponse> {
    const result = await executeDocument<GetPresignedUploadUrlMutation>(
      GetPresignedUploadUrlDocument,
      {
        input: {
          bucket: body.bucket,
          key: body.key,
          contentType: typeof body.contentType === "string" ? body.contentType : null,
        },
      },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.getPresignedUploadUrl;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to generate presigned URL");
    }
    return response;
  },
});

/**
 * Returns a presigned download URL for a key.
 */
defineMutation({
  path: "filestore/get-presigned-download-url",
  async handler(
    body: { bucket: string; key: string },
    context: MutationContext,
  ): Promise<GetPresignedDownloadUrlResponse> {
    const result = await executeDocument<GetPresignedDownloadUrlMutation>(
      GetPresignedDownloadUrlDocument,
      { input: { bucket: body.bucket, key: body.key } },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.getPresignedDownloadUrl;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to generate presigned download URL");
    }
    return response;
  },
});

/**
 * Notifies the backend that a direct presigned upload completed.
 * Also triggers transcoding for MKV/AVI files.
 */
defineMutation({
  path: "filestore/upload-complete",
  async handler(body: BucketBody & { key?: string }): Promise<{ message: string; key: string }> {
    const key = body.key ?? "";
    if (key.endsWith(".mkv") || key.endsWith(".avi")) {
      triggerTranscode(body.bucket, key);
    }

    return { message: "Uploaded successfully", key };
  },
});

/**
 * Resolves the browser-playable source for a video key, preferring a
 * transcoded MP4 when one exists.
 */
defineMutation({
  path: "filestore/resolve-video-source",
  async handler(
    body: BucketBody & { key: string },
    context: MutationContext,
  ): Promise<VideoSource> {
    const { bucket, key } = body;
    if (!bucket || !key) {
      throw new MutationError("Invalid input: bucket and key required");
    }

    const needsTranscode = /\.(mkv|avi)$/i.test(key);
    if (!needsTranscode) {
      if (!(await objectExists(bucket, key))) {
        return { url: null, key, playable: false, needsTranscode: false, found: false };
      }
      return {
        url: await presignDownload(bucket, key, context),
        key,
        playable: true,
        needsTranscode: false,
        found: true,
      };
    }

    const mp4Key = `${key}.mp4`;
    if (await objectExists(bucket, mp4Key)) {
      return {
        url: await presignDownload(bucket, mp4Key, context),
        key: mp4Key,
        playable: true,
        needsTranscode: false,
        found: true,
      };
    }

    const found = await objectExists(bucket, key);
    return { url: null, key, playable: false, needsTranscode: found, found };
  },
});

/**
 * Starts a background transcode for a video key.
 */
defineMutation({
  path: "filestore/transcode-video",
  async handler(body: BucketBody & { key: string }): Promise<{ message: string; key: string }> {
    const { bucket, key } = body;
    if (!bucket || !key) {
      throw new MutationError("Invalid input: bucket and key required");
    }
    triggerTranscode(bucket, key);
    return { message: "Transcode started", key };
  },
});

/**
 * Deletes a single file.
 */
defineMutation({
  path: "filestore/delete-file",
  async handler(
    body: BucketBody & { key: string },
    context: MutationContext,
  ): Promise<DeleteFileResponse> {
    const { bucket, key } = body;
    const result = await executeDocument<DeleteFileMutation>(
      DeleteFileDocument,
      { input: { bucket, key } },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.deleteFile;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to delete file");
    }
    return response;
  },
});

/**
 * Deletes a key (folder or file) and its contents.
 */
defineMutation({
  path: "filestore/delete-key",
  async handler(
    body: BucketBody & { key: string },
    context: MutationContext,
  ): Promise<DeleteKeyResponse> {
    const { bucket, key } = body;
    const result = await executeDocument<DeleteKeyMutation>(
      DeleteKeyDocument,
      { input: { bucket, key } },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.deleteKey;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to delete key");
    }
    return response;
  },
});

/**
 * Renames a key, reporting merge conflicts when merge is false.
 */
defineMutation({
  path: "filestore/rename-key",
  async handler(
    body: BucketBody & {
      sourceKey: string;
      targetKey: string;
      merge?: boolean;
    },
    context: MutationContext,
  ): Promise<RenameKeyResponse> {
    const { bucket, sourceKey, targetKey, merge } = body;
    const result = await executeDocument<RenameKeyMutation>(
      RenameKeyDocument,
      { input: { bucket, sourceKey, targetKey, merge: merge ?? false } },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.renameKey;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to rename key");
    }
    return response;
  },
});

/**
 * Starts a torrent download into the bucket.
 */
defineMutation({
  path: "filestore/add-torrent",
  async handler(
    body: {
      bucket: string;
      path?: string;
      magnet?: string;
      torrentFileBase64?: string;
    },
    context: MutationContext,
  ): Promise<AddTorrentResponse> {
    const { bucket, path, magnet, torrentFileBase64 } = body;
    if (!bucket) {
      throw new MutationError("Invalid input: bucket required");
    }
    const result = await executeDocument<AddTorrentMutation>(
      AddTorrentDocument,
      {
        input: {
          bucket,
          path: path ?? null,
          magnet: magnet ?? null,
          torrentFileBase64: torrentFileBase64 ?? null,
        },
      },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.addTorrent;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to add torrent");
    }
    return response;
  },
});

/**
 * Cancels a torrent job and removes its scratch data.
 */
defineMutation({
  path: "filestore/cancel-torrent",
  async handler(
    body: { jobId: string; bucket: string; path?: string },
    context: MutationContext,
  ): Promise<CancelTorrentResponse> {
    if (!body.jobId) {
      throw new MutationError("jobId required");
    }
    const result = await executeDocument<CancelTorrentMutation>(
      CancelTorrentDocument,
      { jobId: body.jobId },
      tokenFrom(context),
    );
    const response = result.data?.filestoreMutations?.cancelTorrent;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to cancel torrent");
    }
    return response;
  },
});

/**
 * Searches Prowlarr for torrents matching the query.
 */
defineMutation({
  path: "filestore/search-torrents",
  async handler(body: { query: string }, context: MutationContext): Promise<TorrentSearchResult[]> {
    const result = await executeDocument<SearchTorrentsQuery>(
      SearchTorrentsDocument,
      { query: body.query },
      tokenFrom(context),
    );
    const results = result.data?.filestoreQueries?.searchTorrents;
    if (results == null) {
      throw new MutationError(result.error || "Search failed");
    }
    return results;
  },
});

/**
 * Loads health data for the status page.
 */
defineLoader({
  pattern: "filestore",
  async loader() {
    const result = await executeDocument<HealthQuery>(HealthDocument, {});
    const health = result.data?.filestoreQueries?.health;
    return health ? { health } : null;
  },
});

/**
 * Loads bucket list for the home page.
 */
defineLoader({
  pattern: "filestore",
  async loader(_params, context) {
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    const result = await executeDocument<ListBucketsQuery>(ListBucketsDocument, {}, token);
    const buckets = result.data?.filestoreQueries?.listBuckets;
    return buckets ? { buckets } : null;
  },
});

/**
 * Fetches key list and optional key detail for bucket views.
 */
async function fetchBucketData(
  alias: string,
  path: string,
  selected?: string | null,
  token?: string,
): Promise<Record<string, unknown> | null> {
  const result = await executeDocument<ListKeysQuery>(
    ListKeysDocument,
    { bucket: alias, prefix: path || undefined },
    token,
  );
  const keys = result.data?.filestoreQueries?.listKeys;
  if (!keys) return null;

  const data: Record<string, unknown> = {
    keys,
    detail: { __typename: "Placeholder", key: selected },
  };

  if (selected) {
    const detailResult = await executeDocument<LocateKeyDetailQuery>(
      LocateKeyDetailDocument,
      { bucket: alias, keyPath: selected },
      token,
    );
    const detail = detailResult.data?.filestoreQueries?.locate;
    if (detail) {
      data.detail = detail;
    }
  }

  return data;
}

/**
 * Loads key list for a bucket root (no folder path).
 */
defineLoader({
  pattern: "bucket/:alias",
  async loader(params, context) {
    const alias = params.alias as string;
    const selected = params.selected as string | null;
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!alias) return null;
    return fetchBucketData(alias, "", selected, token);
  },
});

/**
 * Loads key list for a bucket at a folder path.
 */
defineLoader({
  pattern: "bucket/:alias/*",
  async loader(params, context) {
    const alias = params.alias as string;
    const path = params.path as string;
    const selected = params.selected as string | null;
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!alias || !path) return null;
    return fetchBucketData(alias, path, selected, token);
  },
});

/**
 * Lists subtitles for a video key.
 */
defineMutation({
  path: "filestore/subtitles",
  async handler(
    body: SubtitlesQueryVariables,
    context: MutationContext,
  ): Promise<SubtitlesQuery["filestoreQueries"]["subtitles"]> {
    const result = await executeDocument<SubtitlesQuery, SubtitlesQueryVariables>(
      SubtitlesDocument,
      body,
      tokenFrom(context),
    );
    return result.data?.filestoreQueries?.subtitles ?? [];
  },
});

/**
 * Searches OpenSubtitles for a video.
 */
defineMutation({
  path: "filestore/search-subtitles",
  async handler(
    body: SearchSubtitlesMutationVariables,
    context: MutationContext,
  ): Promise<SearchSubtitlesMutation["filestoreMutations"]["searchSubtitles"]> {
    const result = await executeDocument<
      SearchSubtitlesMutation,
      SearchSubtitlesMutationVariables
    >(SearchSubtitlesDocument, body, tokenFrom(context));
    return result.data?.filestoreMutations?.searchSubtitles ?? [];
  },
});

/**
 * Fetches a subtitle and optionally persists it.
 */
defineMutation({
  path: "filestore/fetch-subtitle",
  async handler(
    body: FetchSubtitleMutationVariables,
    context: MutationContext,
  ): Promise<FetchSubtitleMutation["filestoreMutations"]["fetchSubtitle"]> {
    const result = await executeDocument<
      FetchSubtitleMutation,
      FetchSubtitleMutationVariables
    >(FetchSubtitleDocument, body, tokenFrom(context));
    const response = result.data?.filestoreMutations?.fetchSubtitle;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to fetch subtitle");
    }
    return response;
  },
});

/**
 * Deletes a subtitle object.
 */
defineMutation({
  path: "filestore/delete-subtitle",
  async handler(
    body: DeleteSubtitleMutationVariables,
    context: MutationContext,
  ): Promise<DeleteSubtitleMutation["filestoreMutations"]["deleteSubtitle"]> {
    const result = await executeDocument<
      DeleteSubtitleMutation,
      DeleteSubtitleMutationVariables
    >(DeleteSubtitleDocument, body, tokenFrom(context));
    const response = result.data?.filestoreMutations?.deleteSubtitle;
    if (response == null) {
      throw new MutationError(result.error ?? "Failed to delete subtitle");
    }
    return response;
  },
});
