"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createBrowserClient();
  const { t } = useLanguage();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const NavItems = () => (
    <>
      {user && (
        <Button variant="default" asChild>
          <Link href="/invoice">Create</Link>
        </Button>
      )}
      <Button variant="ghost" asChild>
        <Link href="/pro">{t.header.pricing}</Link>
      </Button>
      <LanguageSelector />
      {!isLoading && (
        <>
          {user ? (
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">{t.header.dashboard}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">{t.header.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t.header.signup}</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
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
          <span className="font-bold text-lg">{t.header.title}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavItems />
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8 ">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
