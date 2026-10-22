import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { MeshBackground } from "@/components/mesh-background";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Como",
  description: "Two-player Spanish vocabulary game",
  appleWebApp: { capable: true, title: "Como", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Apply the saved theme before paint to avoid a flash.
const themeScript = `try{if(localStorage.getItem("como:theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full overscroll-none">
        <MeshBackground />
        {children}
      </body>
    </html>
  );
}
