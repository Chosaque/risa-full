"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveContentBlock } from "@/actions/content";
import { MediaPickerDialog } from "@/components/ui/media-picker";
import { cn } from "@/lib/utils";

type Props = {
  contentKey: string;
  label: string;
  value: string;
  className?: string;
  children: React.ReactNode;
};

export function EditableImageClient({ contentKey, label, value, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();
  const router = useRouter();

  function set(url: string) {
    start(async () => {
      const res = await saveContentBlock(contentKey, url, url);
      if (res.ok) {
        toast.success("บันทึกรูปแล้ว");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <>
      <div data-editable data-label={label} className={cn("group relative", className)}>
        {children}
        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-[inherit] bg-ink/45 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-paper px-3 py-1.5 text-xs font-medium text-ink shadow"
          >
            <ImagePlus className="size-3.5" />
            {value ? "เปลี่ยนรูป" : "เลือกรูป"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => set("")}
              aria-label="ลบรูป"
              className="rounded-lg bg-paper p-2 text-ink shadow hover:text-red-600"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <MediaPickerDialog open={open} onOpenChange={setOpen} onSelect={set} />
    </>
  );
}
