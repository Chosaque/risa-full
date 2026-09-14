import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put, del } from "@vercel/blob";
import { MAX_UPLOAD_BYTES } from "./upload-limits";

/**
 * Storage adapter with two backends, chosen at runtime by whether a Blob
 * token is configured:
 *
 *  - `BLOB_READ_WRITE_TOKEN` set  → Vercel Blob (production; files persist
 *    across deploys and serve from Blob's own CDN origin).
 *  - unset                        → local disk under public/uploads (local
 *    dev only — Vercel's serverless filesystem is not writable/persistent,
 *    so this path must never be reached in production).
 *
 * Nothing outside this file knows which backend is active.
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
export const ALLOWED_DOC = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/zip",
];
export const MAX_BYTES = MAX_UPLOAD_BYTES;

export function uploadsConfigured(): boolean {
  return blobEnabled() || !process.env.VERCEL;
}

export type StoredObject = { url: string; path: string; filename: string; size: number };

function safeName(file: File): { base: string; ext: string; stamp: string } {
  const ext = (path.extname(file.name) || "").toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8);
  const base =
    path
      .basename(file.name, path.extname(file.name))
      .replace(/[^\p{L}\p{N}._-]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "file";
  const stamp = new Date().toISOString().slice(0, 7); // yyyy-mm
  return { base, ext, stamp };
}

export async function putObject(file: File): Promise<StoredObject> {
  if (!uploadsConfigured()) throw new Error("UPLOAD_STORAGE_NOT_CONFIGURED");
  const { base, ext, stamp } = safeName(file);
  const name = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const key = `${stamp}/${name}`;

  if (blobEnabled()) {
    const blob = await put(`uploads/${key}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return { url: blob.url, path: blob.pathname, filename: file.name, size: file.size };
  }

  const dir = path.join(UPLOAD_DIR, stamp);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return { url: `/uploads/${key}`, path: key, filename: file.name, size: file.size };
}

/** `objectPath` is whatever `putObject` returned as `path` for that row. */
export async function deleteObject(objectPath: string): Promise<void> {
  if (blobEnabled()) {
    await del(objectPath.startsWith("uploads/") ? objectPath : `uploads/${objectPath}`);
    return;
  }
  try {
    await unlink(path.join(UPLOAD_DIR, objectPath));
  } catch (e) {
    // Already gone (or was never a local file, e.g. a stale Blob-backed row
    // in a dev database) — deleting the DB row still proceeds either way.
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
}
