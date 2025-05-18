import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facturo.africa - Professional Invoices in 1 Minute",
  description:
    "Generate professional invoices in under a minute. No account required. Perfect for African micro-entrepreneurs.",
  keywords:
    "invoice generator, Africa, micro-entrepreneurs, mobile invoicing, WhatsApp invoice",
  openGraph: {
    title: "Facturo.africa - Professional Invoices in 1 Minute",
    description:
      "Generate professional invoices in under a minute. No account required.",
    url: "https://facturo.africa",
    siteName: "Facturo.africa",
    locale: "en_US",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-4 text-center text-sm text-gray-500">
                <div className="container mx-auto px-4">
                  <p>
                    © {new Date().getFullYear()} Facturo.africa - Professional
                    Invoices for African Entrepreneurs
                  </p>
                </div>
              </footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
