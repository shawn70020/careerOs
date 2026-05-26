"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const common = useTranslations("common");

  const navItems = [
    { href: "/dashboard" as const, label: t("dashboard"), icon: LayoutDashboard },
    { href: "/career-profile" as const, label: t("careerProfile"), icon: User },
    { href: "/resume" as const, label: t("resume"), icon: FileText },
    { href: "/jobs" as const, label: t("jobs"), icon: Briefcase },
    { href: "/learning" as const, label: t("learning"), icon: GraduationCap },
    { href: "/interview" as const, label: t("interview"), icon: MessageSquare },
    { href: "/settings" as const, label: t("settings"), icon: Settings },
  ];

  return (
    <aside className="flex w-56 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="text-lg font-bold text-primary">
          {common("appName")}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
