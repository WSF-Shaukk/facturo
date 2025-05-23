import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { Header } from "@/components/header";
import Link from "next/link";

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
              <footer className="border-t py-4 text-center text-sm ">
                <div className=" mx-auto px-10">
                  <div className="md:flex justify-between items-center">
                    <div className="lg:flex items-center gap-5 hidden">
                      <Link href="/" className="flex items-center gap-2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                          <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                          <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V5C21 3.34315 19.6569 2 18 2H6ZM5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="font-bold text-lg">
                          Facturo.africa
                        </span>
                      </Link>
                      <span className="text-sm">Built for African entrepreneurs — fast, mobile, and professional invoicing.</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-10 justify-between ">
                      <div>
                        <p className="font-semibold">Pages</p>
                        <ul className="space-y-2 mt-2">
                          <li>
                            <Link href="/" className="hover:underline">
                              Home
                            </Link>
                          </li>
                          <li>
                            <Link href="/invoice" className="hover:underline">
                              Create Invoice
                            </Link>
                          </li>
                          <li>
                            <Link href="/pro" className="hover:underline">
                              Pricing
                            </Link>
                          </li>
                          <li>
                            <Link href="/privacy" className="hover:underline">
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link href="/terms" className="hover:underline">
                              Terms of Use
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {/* need help */}
                      <div>
                        <p className="font-semibold mt-10 md:mt-0">
                          Need Help?
                        </p>
                        <ul className="space-y-2 mt-2">
                          <li className="flex flex-col">
                            <span>WhatsApp Support</span>
                            <span className="text-[#FF0000]">
                              +234 8 127 697 879
                            </span>
                          </li>
                          <li className="flex flex-col">
                            <span>Mail Support</span>
                            <Link
                              target="_blank"
                              href="mailto:facturoafrica@gmail.com"
                            >
                              <span className="text-[#FF0000]">
                                facturoafrica@gmail.com
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {/* follow us */}
                      <div>
                        <p className="font-semibold mt-10 md:mt-0">Follow us</p>
                        <div className="mt-2">
                          <p>Facebook</p>
                          <Link
                            target="_blank"
                            href="https://www.facebook.com/profile.php?id=100067040096310"
                          >
                            <span className="text-[#FF0000]">
                              https://www.facebook.com/profile.php?id=100067040096310
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                    <p className="text-gray-500 mt-16">
                      © {new Date().getFullYear()} Facturo.africa. All rights
                      reserved.
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
