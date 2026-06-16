import Link from "next/link";

const NAV = [
  { href: "/", label: "Today", icon: "●" },
  { href: "/fixtures", label: "Fixtures", icon: "▤" },
  { href: "/standings", label: "Groups", icon: "▦" },
  { href: "/bracket", label: "Bracket", icon: "◧" },
  { href: "/stats", label: "Stats", icon: "★" },
];

/**
 * Landscape-first navigation: a fixed left rail on wide screens (iPad
 * landscape and up), collapsing to a horizontal top bar on phones/portrait.
 * This keeps the dashboard's wide aspect ratio fully usable for content.
 */
export function TournamentSidebar() {
  return (
    <header className="border-b border-white/10 bg-pitch-950/95 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:w-56 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="flex items-center justify-between px-4 py-3 lg:flex-col lg:items-stretch lg:gap-6 lg:px-5 lg:py-6">
        <Link
          href="/"
          className="font-display text-lg font-black tracking-tight text-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold lg:text-xl"
        >
          World Cup <span className="text-gold">Daily</span>
        </Link>
        <p className="hidden text-xs text-line/50 lg:block">
          FIFA World Cup 2026
          <br />
          CAN · MEX · USA
        </p>
      </div>
      <nav aria-label="Main" className="px-2 pb-2 lg:flex-1 lg:px-3">
        <ul className="-mb-px flex gap-1 overflow-x-auto text-sm lg:mb-0 lg:flex-col lg:gap-0.5 lg:overflow-visible">
          {NAV.map((item) => (
            <li key={item.href} className="lg:w-full">
              <Link
                href={item.href}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg border-b-2 border-transparent px-3 py-2 font-medium text-line/70 hover:border-white/30 hover:text-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold lg:border-b-0 lg:px-3 lg:py-2.5 lg:hover:bg-white/5"
              >
                <span aria-hidden="true" className="text-gold lg:w-4">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="hidden px-5 pb-6 text-[11px] text-line/40 lg:block">
        Unofficial fan dashboard.
        <br />
        Times shown in your local
        <br />
        timezone.
      </p>
    </header>
  );
}
