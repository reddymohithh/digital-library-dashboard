import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { AdminProvider } from "@/lib/AdminContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "My Library — Digital Library Dashboard",
  description: "A personal reading tracker: browse your library and track reading goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
