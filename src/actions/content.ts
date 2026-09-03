"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { audit, requireUser, setEditMode } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/utils";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Save one content block. Used by every inline editor on the public site. */
export async function saveContentBlock(
  key: string,
  valueTh: string,
  valueEn: string,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const [before] = await sql<{ value_th: string; value_en: string; type: string }[]>`
      select value_th, value_en, type from content_blocks where key = ${key}`;
    if (!before) return { ok: false, error: `Unknown content key: ${key}` };

    const clean = (v: string) => (before.type === "richtext" ? sanitizeHtml(v) : v);
    const th = clean(valueTh);
    const en = clean(valueEn);

    await sql`
      update content_blocks
      set value_th = ${th}, value_en = ${en}, updated_by = ${user.email}
      where key = ${key}`;

    await audit(user.email, "update", "content_blocks", key, before, { value_th: th, value_en: en });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function toggleEditMode(on: boolean): Promise<ActionResult> {
  try {
    await requireUser();
    await setEditMode(on);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Not signed in" };
  }
}
