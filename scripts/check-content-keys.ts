/**
 * Checks the three places a content key has to line up:
 *
 *   src/content/registry.ts  →  the code that renders it  →  the `content_blocks` table
 *
 * A key used in code but absent from the registry is a hard error: the page
 * renders nothing there. The other two directions are warnings — an unreferenced
 * key is only dead weight, and a key missing from the database is one
 * `pnpm db:seed` away.
 *
 * Run with `pnpm check:content-keys`.
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"], quiet: true });

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { ALL_KEYS, ALL_BLOCKS, LIST_DEFS } from "../src/content/registry";

const SRC_DIR = path.join(process.cwd(), "src");

// ── output ────────────────────────────────────────────────────────────────
const useColour = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const paint = (code: string) => (s: string) => (useColour ? `\u001b[${code}m${s}\u001b[0m` : s);
const bold = paint("1");
const dim = paint("2");
const red = paint("31");
const green = paint("32");
const yellow = paint("33");
const cyan = paint("36");

// ── how a content key appears in a .tsx file ──────────────────────────────
// Every registry key and list key is dotted (`page.section.name`), which is
// what separates them from unrelated props such as `sortKey="name"`.
const PATTERNS: RegExp[] = [
  // <Editable k="…" /> and <Editable k={"…"} />
  /\bk\s*=\s*(?:"([^"\n]+)"|'([^'\n]+)'|\{\s*"([^"\n]+)"\s*\}|\{\s*'([^'\n]+)'\s*\})/g,
  // eyebrowKey="…", titleKey="…", subtitleKey="…", listKey="…", and the same
  // names used as object properties (`{ titleKey: "…" }`) before being spread
  // into a component.
  /\b[A-Za-z_$][\w$]*Key\s*[=:]\s*(?:"([^"\n]+)"|'([^'\n]+)'|\{\s*"([^"\n]+)"\s*\}|\{\s*'([^'\n]+)'\s*\})/g,
  // SEO strings and other values read on the server rather than rendered.
  /\bcontent\(\s*(?:"([^"\n]+)"|'([^'\n]+)')/g,
  /\bblockValue\(\s*[\w$]+\.get\(\s*(?:"([^"\n]+)"|'([^'\n]+)')/g,
];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith(".tsx")) yield full;
  }
}

async function collectUsedKeys(): Promise<Map<string, Set<string>>> {
  /** key → the files that reference it. */
  const used = new Map<string, Set<string>>();

  for await (const file of walk(SRC_DIR)) {
    const source = await readFile(file, "utf8");
    const relative = path.relative(process.cwd(), file);
    for (const pattern of PATTERNS) {
      pattern.lastIndex = 0;
      for (const match of source.matchAll(pattern)) {
        const key = match.slice(1).find((group) => group !== undefined);
        if (!key || !key.includes(".")) continue;
        const files = used.get(key) ?? new Set<string>();
        files.add(relative);
        used.set(key, files);
      }
    }
  }
  return used;
}

async function keysInDatabase(): Promise<Set<string> | null> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log(
      `  ${yellow("•")} DATABASE_URL is not set — skipping the ${bold("content_blocks")} check.`,
    );
    console.log(`    ${dim("Copy .env.example to .env.local to enable it.")}\n`);
    return null;
  }

  const sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 10 });
  try {
    const rows = await sql<{ key: string }[]>`select key from content_blocks`;
    return new Set(rows.map((row) => row.key));
  } catch (error) {
    console.log(`  ${yellow("•")} Could not reach the database — skipping that check.`);
    console.log(`    ${dim(error instanceof Error ? error.message : String(error))}\n`);
    return null;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function main() {
  const used = await collectUsedKeys();
  const sectionOf = new Map(ALL_BLOCKS.map((block) => [block.key, block.section]));
  // A list key (`listKey="about.objectives"`) is defined in LIST_DEFS, not as a
  // content block, so it is a legitimate reference rather than a missing key.
  const listKeys = new Set<string>(LIST_DEFS.map((def) => def.key));

  console.log(`\n${bold("Content keys")} ${dim("· registry ↔ code ↔ database")}\n`);

  // (a) used in code, absent from the registry — hard error.
  const missing = [...used.keys()]
    .filter((key) => !ALL_KEYS.has(key) && !listKeys.has(key))
    .sort();

  if (missing.length > 0) {
    console.log(
      red(`  ✗ ${missing.length} key(s) used in code but missing from src/content/registry.ts`),
    );
    for (const key of missing) {
      console.log(`      ${red(key)}`);
      for (const file of [...(used.get(key) ?? [])].sort()) console.log(`        ${dim(file)}`);
    }
    console.log("");
  } else {
    console.log(green("  ✓ every key used in code exists in the registry"));
  }

  // (b) in the registry, never referenced — warning. `seo` sections are read
  // through generateMetadata(), not rendered, so they are never "referenced"
  // in the sense this scan can see beyond the content() call it already counts.
  const unreferenced = [...ALL_KEYS]
    .filter((key) => !used.has(key) && sectionOf.get(key) !== "seo")
    .sort();

  if (unreferenced.length > 0) {
    console.log(yellow(`  ⚠ ${unreferenced.length} registry key(s) not referenced in any .tsx`));
    for (const key of unreferenced) console.log(`      ${yellow(key)}`);
    console.log("");
  } else {
    console.log(green("  ✓ every registry key is referenced in code"));
  }

  // (c) in the registry, absent from the database — warning, fixed by seeding.
  const inDatabase = await keysInDatabase();
  if (inDatabase) {
    const unseeded = [...ALL_KEYS].filter((key) => !inDatabase.has(key)).sort();
    if (unseeded.length > 0) {
      console.log(
        yellow(`  ⚠ ${unseeded.length} registry key(s) missing from content_blocks`) +
          ` — run ${bold("pnpm db:seed")}`,
      );
      for (const key of unseeded) console.log(`      ${yellow(key)}`);
      console.log("");
    } else {
      console.log(green("  ✓ every registry key is present in content_blocks"));
    }
  }

  // Counted against the registry so the three figures line up; list keys and
  // anything else picked up by the scan are reported above, not here.
  const usedFromRegistry = [...ALL_KEYS].filter((key) => used.has(key)).length;
  const dbCount = inDatabase ? String(inDatabase.size) : "not checked";
  console.log(
    `\n  ${cyan(`${ALL_KEYS.size} keys in registry`)} · ${cyan(
      `${usedFromRegistry} used in code`,
    )} · ${cyan(`${dbCount} in database`)}\n`,
  );

  process.exit(missing.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(red("check:content-keys failed"));
  console.error(error);
  process.exit(1);
});
