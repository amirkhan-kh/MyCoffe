import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Marck_Script, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const marck = Marck_Script({
  variable: "--font-marck",
  subsets: ["latin", "cyrillic"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MY COFFEE by Dilim — Menyu",
  description: "MY COFFEE by Dilim qahvaxonasi menyusi · Andijon",
  icons: { icon: "/brand/logo-round.png", apple: "/brand/logo-round.png" },
};

export const viewport: Viewport = {
  themeColor: "#0e0907",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const langBootstrap = `try{var l=localStorage.getItem("mc-lang");if(!l){var n=(navigator.language||"").slice(0,2);l=n==="ru"||n==="en"?n:"uz"}if(l==="ru"||l==="en"){document.documentElement.classList.add("lang-pending")}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uz"
      className={`${cormorant.variable} ${playfair.variable} ${manrope.variable} ${marck.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
