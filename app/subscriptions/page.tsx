"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; // <-- استيراد الهيدر
import Link from "next/link";

export default function SubscriptionsOverview() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !session) router.push("/login");
  }, [session, authLoading, router]);

  useEffect(() => {
    if (!session?.user) return;
    const fetchData = async () => {
      const { data: subs } = await supabase.from("subscriptions").select("*");
      if (subs) setSubscriptions(subs);
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (prof) setProfile(prof);
      setLoading(false);
    };
    fetchData();
  }, [session]);

  const activeSubs = subscriptions.filter((s) => s.is_active !== false);
  const cancelledSubs = subscriptions.filter((s) => s.is_active === false);

  const activeCount = activeSubs.length;
  const cancelledCount = cancelledSubs.length;

  const upcomingCount = activeSubs.filter((sub) => {
    const today = new Date();
    const nextDate = new Date(sub.next_renewal_date);
    const diffDays = Math.ceil(
      (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays <= 30 && diffDays >= 0;
  }).length;

  if (authLoading || !mounted || !session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white">
        {t("loading")}
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar profile={profile} />

      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-[#0f172a]">
        {/* استخدام مكون الهيدر */}
        <Header title={t("subsOverview")} />

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* بطاقة الفعالة */}
            <Link
              href="/subscriptions/active"
              className="group bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm hover:border-teal-500/50 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {t("active")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {t("activeDesc")}
                  </p>
                </div>
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500">
                  <ArrowRight
                    size={24}
                    className="transform group-hover:-translate-x-1 transition-transform"
                  />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {activeCount}
              </p>
            </Link>

            {/* بطاقة القادمة */}
            <Link
              href="/subscriptions/upcoming"
              className="group bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm hover:border-blue-500/50 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {t("upcoming")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {t("upcomingDesc")}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <ArrowRight
                    size={24}
                    className="transform group-hover:-translate-x-1 transition-transform"
                  />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {upcomingCount}
              </p>
            </Link>

            {/* بطاقة الملغاة */}
            <Link
              href="/subscriptions/cancelled"
              className="group bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm hover:border-red-500/50 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {t("cancelled")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {t("cancelledDesc")}
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                  <ArrowRight
                    size={24}
                    className="transform group-hover:-translate-x-1 transition-transform"
                  />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {cancelledCount}
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
