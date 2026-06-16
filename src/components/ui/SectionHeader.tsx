import Link from "next/link";

export function SectionHeader({
  title,
  eyebrow,
  href,
  linkLabel = "View all",
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg font-bold text-line">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs font-medium text-line/60 underline-offset-4 hover:text-line hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
