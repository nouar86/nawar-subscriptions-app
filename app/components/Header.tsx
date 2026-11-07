"use client";

import { useState } from "react";
import { Search, Bell, Languages, Moon, Sun } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "next-themes";

export default function Header({ title }: { title: string }) {
  const { t, toggleLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {/* زر الوضع الليلي */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* زر اللغة */}
        <button
          onClick={toggleLang}
          className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
          title="Switch Language"
        >
          <Languages size={20} className="text-teal-500" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-1"></div>

        {/* زر البحث */}
        <button className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
          <Search size={20} />
        </button>

        {/* زر الإشعارات */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute end-0 mt-2 w-64 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {t("notifications")}
                </h3>
              </div>
              <div className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">
                {t("noNotifications")}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
