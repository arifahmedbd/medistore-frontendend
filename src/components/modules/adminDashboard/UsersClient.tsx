"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Shield, ShieldOff, UserCheck, Store,
  ChevronLeft, ChevronRight, Filter, Loader2, MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { updateUserRoleAction, updateUserStatusAction } from "@/actions/admin.action";


interface User {
  id: string; name: string; email: string; role: string;
  status: string; createdAt: string; image: string | null;
  phone: string | null; emailVerified: boolean;
  _count: { orders: number };
}

interface Props {
  users: User[]; totalPages: number; total: number;
  page: number; search: string;
  roleFilter: string; statusFilter: string;
}

const ROLE_META: Record<string, { label: string; color: string }> = {
  USER: { label: "USER", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  SELLER:   { label: "Seller",   color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  ADMIN:    { label: "Admin",    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
};

function UserActionMenu({ user, onDone }: { user: User; onDone: () => void }) {
  const [open, setOpen]           = useState(false);
  const [isPending, startTransition] = useTransition();

  const changeRole = (role: "USER" | "SELLER") => {
    setOpen(false);
    startTransition(async () => {
      const res = await updateUserRoleAction(user.id, role);
      if (res?.success) { toast.success(`Role changed to ${role}`); onDone(); }
      else toast.error(res?.message ?? "Failed");
    });
  };

  const changeStatus = (status: "ACTIVE" | "BANNED") => {
    setOpen(false);
    startTransition(async () => {
      const res = await updateUserStatusAction(user.id, status);
      if (res?.success) { toast.success(status === "BANNED" ? "User banned" : "User unbanned"); onDone(); }
      else toast.error(res?.message ?? "Failed");
    });
  };

  if (user.role === "ADMIN") return <span className="text-xs text-slate-300 dark:text-slate-600 italic px-2">Protected</span>;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <MoreHorizontal size={15} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-[#0e1525] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1 overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-3 py-1.5">Change Role</p>
            {user.role !== "USER" && (
              <button onClick={() => changeRole("USER")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <UserCheck size={13} className="text-sky-500" /> Make USER
              </button>
            )}
            {user.role !== "SELLER" && (
              <button onClick={() => changeRole("SELLER")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <Store size={13} className="text-emerald-500" /> Make Seller
              </button>
            )}
            <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-3 py-1.5">Status</p>
            {user.status === "ACTIVE" ? (
              <button onClick={() => changeStatus("BANNED")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                <ShieldOff size={13} /> Ban User
              </button>
            ) : (
              <button onClick={() => changeStatus("ACTIVE")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition">
                <Shield size={13} /> Unban User
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function UsersClient({ users, totalPages, total, page, search, roleFilter, statusFilter }: Props) {
  const router      = useRouter();
  const [searchVal, setSearchVal] = useState(search);

  const buildHref = (overrides: { page?: number; search?: string; role?: string; status?: string }) => {
    const q = new URLSearchParams();
    const s = overrides.search  ?? search;
    const r = overrides.role    ?? roleFilter;
    const st= overrides.status  ?? statusFilter;
    const p = overrides.page    ?? 1;
    if (s)  q.set("search", s);
    if (r)  q.set("role", r);
    if (st) q.set("status", st);
    if (p > 1) q.set("page", String(p));
    return `/admin/users?${q.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildHref({ search: searchVal, page: 1 }));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Users</h1>
          <p className="text-sm text-slate-400 mt-1">{total} user{total !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px] max-w-sm">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search name or email..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0e1525] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <button type="submit" className="px-3.5 py-2 bg-[#0a0f1e] dark:bg-violet-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-slate-400" />
          {["", "USER", "SELLER", "ADMIN"].map((r) => (
            <Link key={r} href={buildHref({ role: r, page: 1 })}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                roleFilter === r
                  ? "bg-[#0a0f1e] dark:bg-violet-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}>
              {r || "All Roles"}
            </Link>
          ))}
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
          {["", "ACTIVE", "BANNED"].map((st) => (
            <Link key={st} href={buildHref({ status: st, page: 1 })}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                statusFilter === st
                  ? st === "BANNED"
                    ? "bg-red-500 text-white"
                    : "bg-[#0a0f1e] dark:bg-violet-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}>
              {st || "All Status"}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 overflow-hidden mb-5">
        {users.length === 0 ? (
          <div className="py-20 text-center">
            <Search size={32} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#09111e] text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700/40">
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Orders</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1020] transition align-middle">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-sm font-bold text-violet-600 dark:text-violet-400 shrink-0 overflow-hidden">
                          {user.image
                            ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            : user.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_META[user.role]?.color ?? ""}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        user.status === "BANNED"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-200">
                      {user._count.orders}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <UserActionMenu user={user} onDone={() => router.refresh()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {page > 1 && (
            <Link href={buildHref({ page: page - 1 })} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ChevronLeft size={15} />
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildHref({ page: p })}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
                p === page
                  ? "bg-[#0a0f1e] dark:bg-violet-600 text-white"
                  : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}>{p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={buildHref({ page: page + 1 })} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ChevronRight size={15} />
            </Link>
          )}
        </div>
      )}
    </>
  );
}