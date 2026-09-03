"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Switch from "@radix-ui/react-switch";
import { LayoutDashboard, Loader2, LogOut, PencilRuler } from "lucide-react";
import { toggleEditMode } from "@/actions/content";
import { logoutAction } from "@/actions/auth";

type Props = { email: string; editing: boolean; adminHref: string };

/** Fixed bar shown to signed-in staff on every public page. */
export function EditBar({ email, editing, adminHref }: Props) {
  const [pending, start] = useTransition();
  const router = useRouter();

  useEffect(() => {
    document.body.dataset.editMode = editing ? "on" : "off";
    return () => { delete document.body.dataset.editMode; };
  }, [editing]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[75] print:hidden">
      <div className="container-page pb-3">
        <div className="mx-auto flex w-fit max-w-full items-center gap-3 overflow-x-auto rounded-full border border-ink/10 bg-ink/95 px-3 py-2 text-white shadow-[0_10px_36px_-8px_rgb(10_10_11/0.5)] backdrop-blur">
          <span className="flex shrink-0 items-center gap-2 pl-1">
            <PencilRuler className="size-4 text-white/70" strokeWidth={1.7} />
            <label htmlFor="risa-edit-toggle" className="cursor-pointer text-[13px] font-medium">
              โหมดแก้ไข
            </label>
          </span>

          <Switch.Root
            id="risa-edit-toggle"
            checked={editing}
            disabled={pending}
            onCheckedChange={(v) =>
              start(async () => {
                await toggleEditMode(v);
                router.refresh();
              })
            }
            className="relative h-5 w-9 shrink-0 rounded-full bg-white/25 transition-colors data-[state=checked]:bg-accent disabled:opacity-60"
          >
            <Switch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[1.15rem]" />
          </Switch.Root>

          {pending && <Loader2 className="size-3.5 shrink-0 animate-spin text-white/60" />}

          <span className="h-4 w-px shrink-0 bg-white/20" />

          <Link
            href={adminHref}
            className="shrink-0 rounded-full px-2.5 py-1 text-[13px] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="inline-flex items-center gap-1.5">
              <LayoutDashboard className="size-3.5" strokeWidth={1.7} />
              หลังบ้าน
            </span>
          </Link>

          <span className="hidden shrink-0 text-[12px] text-white/45 sm:inline">{email}</span>

          <form action={logoutAction} className="shrink-0">
            <button
              type="submit"
              className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="ออกจากระบบ"
              title="ออกจากระบบ"
            >
              <LogOut className="size-3.5" strokeWidth={1.7} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
