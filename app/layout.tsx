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
              <footer className="border-t py-12 text-sm bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Logo and Description Section */}
                    <div className="lg:col-span-4">
                      <Link href="/" className="flex items-center gap-2 mb-4">
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
                        <span className="font-bold text-xl">
                          Facturo.africa
                        </span>
                      </Link>
                      <p className="text-gray-600 max-w-md">
                        Built for African entrepreneurs — fast, mobile, and
                        professional invoicing.
                      </p>
                    </div>

                    {/* Navigation Links Section */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Pages Section */}
                        <div>
                          <h3 className="font-semibold text-base mb-4">
                            Pages
                          </h3>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Home
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/invoice"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Create Invoice
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/pro"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Pricing
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/privacy"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Privacy Policy
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/terms"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Terms of Use
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Support Section */}
                        <div>
                          <h3 className="font-semibold text-base mb-4">
                            Need Help?
                          </h3>
                          <ul className="space-y-4">
                            <li>
                              <p className="text-gray-600 mb-1">
                                WhatsApp Support
                              </p>
                              <a
                                href="https://wa.me/2348127697879"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 transition-colors"
                              >
                                +234 8 127 697 879
                              </a>
                            </li>
                            <li>
                              <p className="text-gray-600 mb-1">Mail Support</p>
                              <a
                                href="mailto:facturoafrica@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 transition-colors"
                              >
                                facturoafrica@gmail.com
                              </a>
                            </li>
                          </ul>
                        </div>

                        {/* Social Media Section */}
                        <div>
                          <h3 className="font-semibold text-base mb-4">
                            Follow us
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-600 mb-1">Facebook</p>
                              <a
                                href="https://www.facebook.com/profile.php?id=100067040096310"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 transition-colors break-all"
                              >
                                facebook.com/facturoafrica
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copyright Section */}
                  <div className="border-t mt-12 pt-8">
                    <p className="text-gray-500 text-center">
                      © {new Date().getFullYear()} Facturo.africa. All rights
                      reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
