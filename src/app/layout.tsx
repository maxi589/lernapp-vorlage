import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// next/font lädt die Schrift beim Bauen herunter und liefert sie selbst aus (kein Abruf bei Google im Betrieb).
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: "Lern-App",
  description: "Kurse, Notizen, Prüfungen und Wochenplan",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Lern-App", statusBarStyle: "default" },
};

export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
