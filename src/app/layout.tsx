import type { Metadata, Viewport } from "next";
import { TournamentSidebar } from "@/components/sports/TournamentSidebar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "World Cup Daily — FIFA World Cup 2026 scores & fixtures",
    template: "%s · World Cup Daily",
  },
  description:
    "Live scores, fixtures, group tables, knockout bracket and stats for the 2026 FIFA World Cup, in your local timezone.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WC Daily",
  },
  openGraph: {
    title: "World Cup Daily",
    description: "Your daily FIFA World Cup 2026 dashboard.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f16",
  // Allow the page to use the full iPad landscape width without a forced
  // max scale; the layout below is designed to fill it.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh lg:pl-56">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-pitch-950"
        >
          Skip to content
        </a>
        <TournamentSidebar />
        <main id="main" className="px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <footer className="px-4 py-8 text-xs text-line/40 lg:px-8">
          Unofficial fan dashboard. Kick-off times shown in your local timezone.
        </footer>
      </body>
    </html>
  );
}
