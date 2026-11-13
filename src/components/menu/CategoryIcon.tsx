import type { CategoryIcon as IconKey } from "@/lib/types";

const PATHS: Record<IconKey, React.ReactNode> = {
  coffee: (
    <>
      <path d="M4.5 10h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V10Z" />
      <path d="M16.5 11.5h1.2a2.3 2.3 0 0 1 0 4.6h-1.6" />
      <path d="M3 21h16" />
      <path d="M8.5 3.5c-.8 1 .8 1.8 0 3M12 3c-.8 1 .8 1.8 0 3" />
    </>
  ),
  iced: (
    <>
      <path d="M6 7h11l-1.4 13.2a1 1 0 0 1-1 .8H8.4a1 1 0 0 1-1-.8L6 7Z" />
      <path d="M13.5 7 15 2.5h2.5" />
      <rect x="8.2" y="10.2" width="3" height="3" rx=".6" transform="rotate(-12 9.7 11.7)" />
      <rect x="11.6" y="13" width="3" height="3" rx=".6" transform="rotate(10 13.1 14.5)" />
    </>
  ),
  noncoffee: (
    <>
      <path d="M5 9h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" />
      <path d="M16 10.5h1.3a2.2 2.2 0 0 1 0 4.4H16" />
      <circle cx="8.6" cy="7" r="1.5" />
      <circle cx="12" cy="6.2" r="1.6" />
      <circle cx="14.4" cy="7.4" r="1.2" />
    </>
  ),
  tea: (
    <>
      <path d="M5 11.5c0-2.5 3-4 6.5-4s6.5 1.5 6.5 4V14a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5v-2.5Z" />
      <path d="M18 12h1.5a2 2 0 0 1 0 4H17.6" />
      <path d="M5 13 2.8 10.6" />
      <path d="M11.5 7.5V6M10 6h3" />
      <path d="M8 21h7" />
    </>
  ),
  lemonade: (
    <>
      <path d="M6.5 8h10l-1.2 12a1 1 0 0 1-1 1H8.7a1 1 0 0 1-1-1L6.5 8Z" />
      <path d="M7.1 13h8.8" />
      <circle cx="16.5" cy="6.5" r="3.2" />
      <path d="M16.5 3.3v6.4M13.3 6.5h6.4M14.2 4.2l4.6 4.6M18.8 4.2l-4.6 4.6" />
    </>
  ),
  mojito: (
    <>
      <path d="M6 8h11.5l-1.6 12.1a1 1 0 0 1-1 .9H8.6a1 1 0 0 1-1-.9L6 8Z" />
      <path d="M9.5 8C8 5.5 9.5 3.5 12 3.5c0 2.5-1.2 3.6-2.5 4.5Z" />
      <path d="M13 8c.4-2.2 2.2-3.2 4.2-2.7-.5 1.9-2 2.7-4.2 2.7Z" />
      <circle cx="10" cy="15" r="1" />
      <circle cx="13.5" cy="12.5" r=".9" />
      <circle cx="12.8" cy="17.2" r=".8" />
    </>
  ),
  milkshake: (
    <>
      <path d="M7 10.5h10l-1.3 9.6a1 1 0 0 1-1 .9H9.3a1 1 0 0 1-1-.9L7 10.5Z" />
      <path d="M6.5 10.5c0-2.6 2.4-4.5 5.5-4.5s5.5 1.9 5.5 4.5" />
      <path d="M13.5 6.2 15.5 2" />
      <circle cx="12" cy="4.6" r="1.1" />
    </>
  ),
  smoothie: (
    <>
      <path d="M6.5 9.5h11l-1.4 10.6a1 1 0 0 1-1 .9H8.9a1 1 0 0 1-1-.9L6.5 9.5Z" />
      <path d="M5.5 9.5h13" />
      <path d="M7.5 9.5a4.5 4 0 0 1 9 0" />
      <path d="M12.5 5.5 14 2" />
      <path d="M8 14c1.3.8 2.7.8 4 0s2.7-.8 4 0" />
    </>
  ),
  juice: (
    <>
      <circle cx="12" cy="13" r="7.5" />
      <circle cx="12" cy="13" r="5.2" />
      <path d="M12 7.8v10.4M6.8 13h10.4M8.3 9.3l7.4 7.4M15.7 9.3l-7.4 7.4" />
      <path d="M12 5.5c.6-1.8 2.2-2.6 4-2.4-.5 1.6-1.9 2.4-4 2.4Z" />
    </>
  ),
  croissant: (
    <>
      <path d="M3 15.5c1.5-5 5-8 9-8s7.5 3 9 8c-1.8 1.4-3.6 1.4-5 .4-1.2 1.2-2.6 1.6-4 1.6s-2.8-.4-4-1.6c-1.4 1-3.2 1-5-.4Z" />
      <path d="M8 16.6c.4-3 1.6-5.6 4-9.1 2.4 3.5 3.6 6.1 4 9.1" />
      <path d="M5 15.8c1-2.4 2.4-4.6 4.4-6.6M19 15.8c-1-2.4-2.4-4.6-4.4-6.6" />
    </>
  ),
  toast: (
    <>
      <path d="M6 20V11.5a3.8 3.8 0 0 1-1.5-3C4.5 6 7.6 4 12 4s7.5 2 7.5 4.5a3.8 3.8 0 0 1-1.5 3V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z" />
      <path d="M9 13.5h6M9 16.5h4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z" />
      <path d="M18.5 16.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" />
    </>
  ),
};

export const ICON_KEYS = Object.keys(PATHS) as IconKey[];

export function CategoryIcon({ icon, className }: { icon: IconKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[icon] ?? PATHS.sparkle}
    </svg>
  );
}
