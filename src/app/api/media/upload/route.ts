import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { audit, getCurrentUser } from "@/lib/auth";
import { ALLOWED_DOC, ALLOWED_IMAGE, MAX_BYTES, putObject } from "@/lib/storage";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const kind = form.get("kind") === "document" ? "document" : "image";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 12 MB" }, { status: 413 });
  }

  const allowed = kind === "document" ? [...ALLOWED_DOC, ...ALLOWED_IMAGE] : ALLOWED_IMAGE;
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: `ไม่รองรับไฟล์ชนิด ${file.type || "unknown"}` }, { status: 415 });
  }

  const stored = await putObject(file);
  const [row] = await sql<{ id: string; url: string }[]>`
    insert into media (url, path, filename, mime, size_bytes)
    values (${stored.url}, ${stored.path}, ${stored.filename}, ${file.type}, ${stored.size})
    returning id, url`;

  await audit(user.email, "create", "media", row.id, null, stored);
  return NextResponse.json({ ...stored, id: row.id, mime: file.type });
}
