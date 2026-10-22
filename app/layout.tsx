import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  // Variable font: covers the 400/500/600 weights used.
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Como",
  description: "Two-player Spanish vocabulary game",
  appleWebApp: { capable: true, title: "Como", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ebe5f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full overscroll-none font-sans">{children}</body>
    </html>
  );
}
