import "server-only";
import { sql } from "@/lib/db";
import { getCollection, type CollectionConfig, type Row } from "./collection-config";

/**
 * Server-side reads for the collection engine. Identifiers only ever come from
 * a `CollectionConfig`, never from the request, and are quoted by postgres.js.
 */

/** Dates arrive from postgres.js as `Date`; the client form wants plain strings. */
function serialize(row: Row): Row {
  const out: Row = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Date ? value.toISOString() : value;
  }
  return out;
}

export async function listRows(
  key: string,
  scopeValue?: string | null,
): Promise<Row[]> {
  const config = getCollection(key);
  const rows =
    config.scopeColumn && scopeValue != null
      ? await sql<Row[]>`
          select * from ${sql(config.table)}
          where ${sql(config.scopeColumn)} = ${scopeValue}
          order by sort asc, created_at asc`
      : await sql<Row[]>`
          select * from ${sql(config.table)}
          order by sort asc, created_at asc`;
  return rows.map(serialize);
}

export async function getRow(key: string, id: string): Promise<Row | null> {
  const config = getCollection(key);
  const rows = await sql<Row[]>`
    select * from ${sql(config.table)} where id = ${id} limit 1`;
  return rows[0] ? serialize(rows[0]) : null;
}

export async function countRows(key: string): Promise<number> {
  const config = getCollection(key);
  const rows = await sql<{ n: number }[]>`
    select count(*)::int as n from ${sql(config.table)}`;
  return rows[0]?.n ?? 0;
}

/** Blank row shaped by the config, for the "new" form. */
export function emptyRow(config: CollectionConfig): Row {
  const row: Row = {};
  for (const field of config.fields) {
    const blank =
      field.type === "number" ? null
      : field.type === "date" ? ""
      : field.type === "tags" ? []
      : field.type === "select" ? (field.options?.[0]?.value ?? "")
      : "";
    if (field.bilingual) {
      row[`${field.name}_th`] = blank;
      row[`${field.name}_en`] = blank;
    } else {
      row[field.name] = blank;
      if (field.type === "latlng" && field.lngName) row[field.lngName] = null;
    }
  }
  if (config.hasStatus) row.status = "draft";
  return row;
}
