import { Inbox } from "lucide-react";

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <Inbox className="size-7 text-faint" strokeWidth={1.5} />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
