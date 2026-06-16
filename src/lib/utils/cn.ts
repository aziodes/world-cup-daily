/** Tiny class-name joiner. Replace with clsx + tailwind-merge only if you need conflict resolution. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
