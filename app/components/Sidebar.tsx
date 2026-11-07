"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const { session } = useAuth();
  const router = useRouter();

  // لمعرفة الصفحة الحالية
  const pathname = usePathname();

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    pathname.startsWith("/subscriptions"),
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isSubsRoute = pathname.startsWith("/subscriptions");

  return (
    <aside className="w-64 bg-white dark:bg-[#1e293b] border-l border-gray-200 dark:border-slate-700/50 flex flex-col hidden md:flex z-20">
      <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-slate-700/50 gap-3">
        <img
          src="/logo.png"
          alt="Nawar"
          className="h-10 w-10 object-contain drop-shadow-md"
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            Nawar
          </span>
          <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            {t("subManager")}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
        >
          <LayoutDashboard size={20} />
          <span>{t("dashboard")}</span>
        </Link>

        {/* قسم الاشتراكات المحدث */}
        <div>
          <div
            className={`flex items-center rounded-xl transition-all ${isSubsRoute ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
          >
            {/* الرابط القابل للضغط - يذهب لصفحة النظرة العامة */}
            <Link
              href="/subscriptions"
              className="flex-1 flex items-center gap-3 px-4 py-3"
            >
              <CreditCard size={20} />
              <span className={isSubsRoute ? "font-semibold" : "font-medium"}>
                {t("subscriptions")}
              </span>
            </Link>
            {/* زر السهم لفتح القائمة */}
            <button
              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
              className="p-3 hover:text-teal-500 transition-colors"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isSubMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* القائمة الفرعية */}
          {isSubMenuOpen && (
            <div className="mr-9 mt-1 space-y-1 border-r-2 border-gray-200 dark:border-slate-700 pr-2">
              <Link
                href="/subscriptions/active"
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/subscriptions/active" ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10" : "text-gray-500 dark:text-slate-400 hover:text-teal-500"}`}
              >
                {t("active")}
              </Link>
              <Link
                href="/subscriptions/upcoming"
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/subscriptions/upcoming" ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10" : "text-gray-500 dark:text-slate-400 hover:text-teal-500"}`}
              >
                {t("upcoming")}
              </Link>
              <Link
                href="/subscriptions/cancelled"
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/subscriptions/cancelled" ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10" : "text-gray-500 dark:text-slate-400 hover:text-teal-500"}`}
              >
                {t("cancelled")}
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/reports"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/reports" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
        >
          <BarChart3 size={20} />
          <span>{t("reports")}</span>
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/settings" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
        >
          <Settings size={20} />
          <span>{t("settings")}</span>
        </Link>
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/profile" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
        >
          <UserCircle size={20} />
          <span>{t("profile")}</span>
        </Link>
      </nav>

      {/* قسم المستخدم في الأسفل */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700/50 relative">
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all text-right"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {profile?.first_name ? profile.first_name[0] : "U"}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
              {profile?.first_name
                ? `${profile.first_name} ${profile.last_name || ""}`
                : "مستخدم جديد"}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
              {session?.user.email}
            </p>
          </div>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute bottom-20 left-4 right-4 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              <Settings size={16} /> {t("editProfile")}
            </Link>
            <button
              onClick={() =>
                supabase.auth.signOut().then(() => router.push("/login"))
              }
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-right"
            >
              <LogOut size={16} /> {t("logout")}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
