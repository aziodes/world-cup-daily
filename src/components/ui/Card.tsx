import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-white/10 bg-pitch-900 p-4 shadow-sm",
        className
      )}
    >
      {children}
    </Tag>
  );
}
