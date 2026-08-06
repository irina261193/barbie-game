import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["cyrillic"], weight: ["600", "700"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["cyrillic"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "DreamPlay — мир волшебных игр",
  description: "Три сказочные мини-игры: наряды, самоцветы и салон для щенка.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "DreamPlay — мир волшебных игр", description: "Наряды, самоцветы и салон для щенка — выбирай своё приключение.", images: [{ url: "/og.png", width: 1732, height: 909 }] },
  twitter: { card: "summary_large_image", title: "DreamPlay — мир волшебных игр", description: "Три сказочные мини-игры в одном волшебном мире.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
