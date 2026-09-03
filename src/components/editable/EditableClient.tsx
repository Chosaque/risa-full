"use client";

import { useState, useTransition, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";
import { Check, Languages, Loader2, X } from "lucide-react";
import { saveContentBlock } from "@/actions/content";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export type EditableTag =
  | "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "li" | "strong" | "em";

type Props = {
  contentKey: string;
  label: string;
  type: "text" | "richtext" | "image" | "url" | "number" | "icon";
  valueTh: string;
  valueEn: string;
  locale: Locale;
  as: EditableTag;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  isEmpty: boolean;
};

const LANG_LABEL = { th: "ไทย", en: "English" } as const;

export function EditableClient({
  contentKey, label, type, valueTh, valueEn, locale, as: Tag,
  className, style, children, isEmpty,
}: Props) {
  const [open, setOpen] = useState(false);
  const [th, setTh] = useState(valueTh);
  const [en, setEn] = useState(valueEn);
  const [tab, setTab] = useState<Locale>(locale);
  const [pending, start] = useTransition();
  const router = useRouter();

  function save() {
    start(async () => {
      const res = await saveContentBlock(contentKey, th, en);
      if (res.ok) {
        toast.success("บันทึกแล้ว / Saved");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  const value = tab === "th" ? th : en;
  const setValue = tab === "th" ? setTh : setEn;
  const multiline = type === "text" && (valueTh.includes("\n") || valueEn.includes("\n"));

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Tag
          data-editable
          data-label={label}
          data-empty={isEmpty ? "true" : undefined}
          title={`${label} · ${contentKey}`}
          className={cn(className, open && "bg-accent-soft")}
          style={style}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {children}
        </Tag>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          collisionPadding={16}
          className="z-[80] w-[min(30rem,calc(100vw-2rem))] rounded-xl border border-line bg-paper shadow-[0_16px_48px_-12px_rgb(10_10_11/0.28)]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <header className="flex items-start justify-between gap-3 border-b border-line-soft px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{label}</p>
              <p className="truncate font-mono text-[11px] text-faint">{contentKey}</p>
            </div>
            <Popover.Close
              className="-mr-1 -mt-1 rounded p-1.5 text-muted hover:bg-surface hover:text-ink"
              aria-label="ปิด"
            >
              <X className="size-4" />
            </Popover.Close>
          </header>

          <div className="flex items-center gap-1 px-4 pt-3">
            <Languages className="mr-1 size-3.5 text-faint" />
            {(["th", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setTab(l)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  tab === l ? "bg-ink text-white" : "text-muted hover:bg-surface",
                )}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>

          <div className="px-4 py-3">
            {type === "richtext" ? (
              <RichTextEditor key={tab} value={value} onChange={setValue} />
            ) : multiline || value.length > 90 ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                autoFocus
                className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm leading-relaxed outline-none focus:border-accent focus:bg-paper"
              />
            ) : (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
                }}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:bg-paper"
              />
            )}
            <p className="mt-2 text-[11px] text-faint">
              {type === "text" && "ขึ้นบรรทัดใหม่ได้ด้วย Enter · "}
              เว้นว่างไว้จะใช้ข้อความของอีกภาษาแทน
            </p>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-line-soft px-4 py-3">
            <Popover.Close className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface">
              ยกเลิก
            </Popover.Close>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-60"
            >
              {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              บันทึก
            </button>
          </footer>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
