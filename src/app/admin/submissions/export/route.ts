import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const KINDS = new Set(["contact", "membership", "job"]);

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const kind = new URL(request.url).searchParams.get("kind");
  const rows = kind && KINDS.has(kind)
    ? await sql`select id, kind, name, email, subject, payload, status, notes, created_at
                from submissions where kind = ${kind} order by created_at desc`
    : await sql`select id, kind, name, email, subject, payload, status, notes, created_at
                from submissions order by created_at desc`;

  const header = ["id", "kind", "name", "email", "subject", "payload", "status", "notes", "created_at"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      header.map((h) => csvCell(h === "payload" ? JSON.stringify(r[h]) : r[h as keyof typeof r])).join(","),
    ),
  ];

  return new NextResponse(`﻿${lines.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions${kind ? `-${kind}` : ""}.csv"`,
    },
  });
}
