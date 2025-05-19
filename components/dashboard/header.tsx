"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/i18n/language-context";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const { t } = useLanguage();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between pb-6 border-b mb-6">
      <div>
        <h1 className="text-2xl font-bold">{t.dashboard.title}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button onClick={handleSignOut} variant="outline">
          {t.dashboard.signOut}
        </Button>
      </div>
    </header>
  );
}
