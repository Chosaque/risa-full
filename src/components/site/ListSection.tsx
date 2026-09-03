import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getListItems } from "@/lib/queries";
import { getLocale } from "@/lib/request";
import { localePath, pick } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type Props = {
  listKey: string;
  columns?: 2 | 3 | 4;
  variant?: "card" | "plain" | "numbered";
  className?: string;
};

/**
 * Renders a `list_items` group. Admins add, reorder and edit entries from
 * /admin/lists — which is what makes these sections growable, not just editable.
 */
export async function ListSection({ listKey, columns = 2, variant = "card", className }: Props) {
  const [items, locale] = await Promise.all([getListItems(listKey), getLocale()]);
  if (items.length === 0) return null;

  const grid = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <ul className={cn("grid gap-px overflow-hidden rounded-2xl bg-line", grid, variant !== "card" && "gap-6 bg-transparent", className)}>
      {items.map((item, i) => {
        const title = pick(item, "title", locale);
        const body = pick(item, "body", locale);
        const href = item.href ? (item.href.startsWith("/") ? localePath(locale, item.href) : item.href) : "";

        const inner = (
          <>
            {variant === "numbered" ? (
              <span className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-ink">
                {i + 1}
              </span>
            ) : (
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon name={item.icon} />
              </span>
            )}
            <h3 className="text-[17px] font-semibold">{title}</h3>
            {body && <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>}
            {href && (
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                ดูเพิ่มเติม <ArrowRight className="size-3.5" />
              </span>
            )}
          </>
        );

        const cls =
          variant === "card"
            ? "flex h-full flex-col bg-paper p-6 md:p-7 transition-colors hover:bg-surface/70"
            : "flex h-full flex-col rounded-2xl border border-line bg-paper p-6";

        return (
          <li key={item.id} className={variant === "card" ? "" : ""}>
            {href ? (
              <Link href={href} className={cls}>{inner}</Link>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
