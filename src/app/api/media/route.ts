import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteObject } from "@/lib/storage";

export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const rows = q
    ? await sql`select id, url, filename, mime, size_bytes, created_at from media
                where filename ilike ${"%" + q + "%"} order by created_at desc limit 120`
    : await sql`select id, url, filename, mime, size_bytes, created_at from media
                order by created_at desc limit 120`;
  return NextResponse.json({ items: rows });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const [row] = await sql<{ path: string }[]>`select path from media where id = ${id}`;
  await sql`delete from media where id = ${id}`;
  if (row) await deleteObject(row.path);

  return NextResponse.json({ ok: true });
}
