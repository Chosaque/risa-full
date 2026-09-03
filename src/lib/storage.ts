import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Local-disk storage adapter. Swap the body of `putObject` for Supabase
 * Storage / Vercel Blob when the site moves off a single machine — nothing
 * else in the app touches the filesystem.
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

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
export const MAX_BYTES = 12 * 1024 * 1024;

export type StoredObject = { url: string; path: string; filename: string; size: number };

export async function putObject(file: File): Promise<StoredObject> {
  const ext = (path.extname(file.name) || "").toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8);
  const base = path
    .basename(file.name, path.extname(file.name))
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "file";
  const stamp = new Date().toISOString().slice(0, 7); // yyyy-mm
  const name = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(UPLOAD_DIR, stamp);

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return {
    url: `/uploads/${stamp}/${name}`,
    path: `${stamp}/${name}`,
    filename: file.name,
    size: file.size,
  };
}
