import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElementPay",
  description: "Crypto payment processing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`font-sans`}>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main className="pt-24">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
