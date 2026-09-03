import Link from "next/link";
import { cn } from "@/lib/utils";
import { getContentMap } from "@/lib/content";
import { REGISTRY } from "@/content/registry";
import { PageHeader } from "@/components/admin/ui";
import { PagesEditor } from "@/components/admin/PagesEditor";

export default async function PagesAdminPage({ searchParams }: PageProps<"/admin/pages">) {
  const { page: pageParam } = await searchParams;
  const activeKey = typeof pageParam === "string" && REGISTRY.some((p) => p.page === pageParam)
    ? pageParam
    : REGISTRY[0].page;

  const [map, active] = await Promise.all([
    getContentMap(),
    Promise.resolve(REGISTRY.find((p) => p.page === activeKey)!),
  ]);

  const initial: Record<string, { th: string; en: string }> = {};
  for (const section of active.sections) {
    for (const block of section.blocks) {
      const row = map.get(block.key);
      initial[block.key] = { th: row?.value_th ?? "", en: row?.value_en ?? "" };
    }
  }

  return (
    <div>
      <PageHeader
        title="ข้อความในหน้าเว็บ"
        description="แก้ไขข้อความและรูปภาพของแต่ละหน้า ทั้งภาษาไทยและอังกฤษ — เหมือนกับที่แก้ไขแบบคลิกตรงหน้าเว็บได้เลย"
      />

      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-line pb-4">
        {REGISTRY.map((p) => (
          <Link
            key={p.page}
            href={`/admin/pages?page=${p.page}`}
            prefetch={false}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              p.page === activeKey ? "bg-ink text-white" : "text-ink-2 hover:bg-surface",
            )}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* `key` forces a remount on tab change — otherwise PagesEditor's
          useState(initial) keeps the previous page's values on a client-side
          navigation, since React preserves component state across prop updates
          at the same position in the tree. */}
      <PagesEditor key={activeKey} sections={active.sections} initial={initial} />
    </div>
  );
}
