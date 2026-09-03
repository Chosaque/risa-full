import { getStats } from "@/lib/queries";
import { getLocale } from "@/lib/request";
import { pick } from "@/lib/i18n";

export async function StatsStrip({ tone = "surface" }: { tone?: "surface" | "ink" }) {
  const [stats, locale] = await Promise.all([getStats(), getLocale()]);
  if (stats.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.id}
          className={
            tone === "ink"
              ? "bg-ink px-6 py-8 text-white"
              : "bg-paper px-6 py-8"
          }
        >
          <dd className="flex items-baseline gap-0.5 text-[2.25rem] font-semibold leading-none tracking-tight">
            {s.value}
            <span className="text-accent">{s.suffix}</span>
          </dd>
          <dt className={tone === "ink" ? "mt-2.5 text-sm text-white/65" : "mt-2.5 text-sm text-muted"}>
            {pick(s, "label", locale)}
          </dt>
        </div>
      ))}
    </dl>
  );
}
