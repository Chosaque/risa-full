// Multipart requests need headroom beneath Vercel's 4.5 MB request limit.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const UPLOAD_SIZE_HINT = "ขนาดไม่เกิน 4 MB ต่อไฟล์";

export function validateUploadSize(file: Pick<File, "size" | "name">): void {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name}: ${UPLOAD_SIZE_HINT}`);
  }
}
