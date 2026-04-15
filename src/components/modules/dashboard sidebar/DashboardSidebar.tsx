"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronRight, Sun, Moon, PanelLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Role, SIDEBAR_CONFIG } from "./sidebar.config";

interface Props {
  role: Role;
  user: { name?: string | null; email?: string | null };
}

export default function DashboardSidebar({ role, user }: Props) {
  const config = SIDEBAR_CONFIG[role];
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

//   if (!mounted) return null;

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-full flex-col z-30 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        bg-white dark:bg-[#0a0f1e]
        text-slate-900 dark:text-white
        border-r border-slate-200 dark:border-white/5`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <config.icon size={18} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-bold text-sm">MediStore</p>
                <p className="text-[11px] text-slate-500 dark:text-white/40">
                  {config.title}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <PanelLeft size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {config.nav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={18} />

                {!collapsed && (
                  <>
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight size={14} />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 border-t border-slate-200 dark:border-white/5 pt-3 space-y-1">
          {/* Theme */}
          {mounted && (
  <button
    onClick={() =>
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5"
  >
    {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    {!collapsed && (
      <span>
        {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    )}
  </button>
)}

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-200 dark:bg-violet-600/30 flex items-center justify-center text-xs font-bold">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-white/40 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-[#0a0f1e] border-b border-slate-200 dark:border-white/5 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm">{config.title}</span>
      </div>

      <div className="md:hidden h-14" />
    </>
  );
}