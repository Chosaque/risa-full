import { cn } from "@/lib/utils";

type Props = {
  seed: string;
  className?: string;
  /** "graphic" uses the RISA arrow motif; "portrait" a neutral figure for people. */
  kind?: "graphic" | "portrait";
};

/**
 * Deterministic stand-in for an image slot that has no file yet, so an
 * unfilled slot still looks designed rather than broken.
 */
export function Placeholder({ seed, className, kind = "graphic" }: Props) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const rotate = (h % 24) - 12;
  const shiftX = (h >> 5) % 30;
  const shiftY = (h >> 9) % 24;
  const opacity = 0.1 + ((h >> 13) % 8) / 100;
  const id = `ph-${(h % 100000).toString(36)}`;

  return (
    <div aria-hidden className={cn("relative isolate overflow-hidden bg-surface", className)}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        role="presentation"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-surface-2)" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={opacity} />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#${id})`} />

        {kind === "portrait" ? (
          <g fill="var(--color-accent)" fillOpacity="0.2">
            <circle cx="200" cy="122" r="44" />
            <path d="M108 300c0-50.8 41.2-92 92-92s92 41.2 92 92z" />
          </g>
        ) : (
          <>
            <g
              transform={`translate(${shiftX} ${shiftY}) rotate(${rotate} 200 150)`}
              fill="none"
              stroke="var(--color-accent)"
              strokeOpacity="0.32"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* the "A" of the RISA wordmark: a line that rises, dips, then climbs */}
              <path d="M40 232 L150 232 L232 96 L282 186 L352 62" />
              <path d="M330 62 L352 62 L352 84" />
            </g>
            <circle cx="252" cy="150" r="7" fill="var(--color-accent)" fillOpacity="0.3" />
          </>
        )}
      </svg>
    </div>
  );
}
