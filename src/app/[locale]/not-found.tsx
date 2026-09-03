import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Rendered for any unmatched path under /th and /en. It can be reached without
 * the locale header the rest of the site relies on, so it says everything twice
 * rather than guessing which language the visitor came in with.
 */
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">
        404
      </p>
      <h1 className="mt-4 max-w-2xl text-[2rem] font-semibold md:text-[2.5rem]">
        ไม่พบหน้าที่คุณกำลังค้นหา
      </h1>
      <p className="mt-2 max-w-2xl text-[1.35rem] font-medium text-ink-2 md:text-[1.6rem]">
        We couldn&rsquo;t find that page.
      </p>
      <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
        หน้านี้อาจถูกย้าย เปลี่ยนชื่อ หรือลบไปแล้ว
        <br />
        The page may have been moved, renamed, or removed.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 text-[15px] font-medium text-white transition-colors hover:bg-ink-2"
      >
        กลับสู่หน้าแรก · Back to home
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
