import { cn } from "@/lib/utils";

export function Section({
  children, className, tone = "paper", id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "surface" | "ink";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-22",
        tone === "surface" && "bg-surface",
        tone === "ink" && "bg-ink text-white",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Eyebrow + heading + optional lead paragraph, used at the top of a section. */
export function SectionHead({
  eyebrow, title, lead, align = "left", className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold md:text-[2rem]">{title}</h2>
      {lead && <div className="mt-4 text-[17px] leading-relaxed text-muted">{lead}</div>}
    </div>
  );
}
