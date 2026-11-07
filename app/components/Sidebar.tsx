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
import { useSidebar } from "../context/SidebarContext"; // <-- استيراد السياق

export default function Sidebar({ profile }: { profile: any }) {
  const { t, lang } = useLanguage();
  const { session } = useAuth();
  const router = useRouter();
  const { isOpen, close } = useSidebar(); // <-- جلب حالة القائمة

  const pathname = usePathname();

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    pathname.startsWith("/subscriptions"),
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isSubsRoute = pathname.startsWith("/subscriptions");

  // تحديد اتجاه الاخفاء حسب اللغة
  const hiddenClass = lang === "ar" ? "translate-x-full" : "-translate-x-full";

  // دالة تغلق القائمة عند التنقل (للهواتف)
  const handleLinkClick = () => close();

  return (
    <>
      {/* الخلفية السوداء عند فتح القائمة في الهاتف */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 w-64 bg-white dark:bg-[#1e293b] border-e border-gray-200 dark:border-slate-700/50 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 md:z-20 ${
          isOpen ? "translate-x-0 shadow-2xl" : hiddenClass
        }`}
      >
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
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
          >
            <LayoutDashboard size={20} />
            <span>{t("dashboard")}</span>
          </Link>

          <div>
            <div
              className={`flex items-center rounded-xl transition-all ${isSubsRoute ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
            >
              <Link
                href="/subscriptions"
                onClick={handleLinkClick}
                className="flex-1 flex items-center gap-3 px-4 py-3"
              >
                <CreditCard size={20} />
                <span className={isSubsRoute ? "font-semibold" : "font-medium"}>
                  {t("subscriptions")}
                </span>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsSubMenuOpen(!isSubMenuOpen);
                }}
                className="p-3 hover:text-teal-500 transition-colors"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isSubMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {isSubMenuOpen && (
              <div className="mr-9 mt-1 space-y-1 border-r-2 border-gray-200 dark:border-slate-700 pr-2">
                <Link
                  href="/subscriptions/active"
                  onClick={handleLinkClick}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/subscriptions/active" ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10" : "text-gray-500 dark:text-slate-400 hover:text-teal-500"}`}
                >
                  {t("active")}
                </Link>
                <Link
                  href="/subscriptions/upcoming"
                  onClick={handleLinkClick}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/subscriptions/upcoming" ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10" : "text-gray-500 dark:text-slate-400 hover:text-teal-500"}`}
                >
                  {t("upcoming")}
                </Link>
                <Link
                  href="/subscriptions/cancelled"
                  onClick={handleLinkClick}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === "/subscriptions/cancelled" ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10" : "text-gray-500 dark:text-slate-400 hover:text-teal-500"}`}
                >
                  {t("cancelled")}
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/reports"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/reports" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
          >
            <BarChart3 size={20} />
            <span>{t("reports")}</span>
          </Link>
          <Link
            href="/settings"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/settings" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
          >
            <Settings size={20} />
            <span>{t("settings")}</span>
          </Link>
          <Link
            href="/profile"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/profile" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}
          >
            <UserCircle size={20} />
            <span>{t("profile")}</span>
          </Link>
        </nav>

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
                onClick={handleLinkClick}
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
    </>
  );
}
