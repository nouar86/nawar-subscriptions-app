"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; // <-- استيراد الهيدر
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ReportsPage() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const { theme } = useTheme(); // نحتاج theme للرسوم البيانية
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

  const totalSpent = subscriptions
    .reduce((acc, sub) => acc + sub.amount, 0)
    .toFixed(2);

  const barData = [
    { name: "Jan", amount: 40 },
    { name: "Feb", amount: 30 },
    { name: "Mar", amount: 60 },
    { name: "Apr", amount: 45 },
    { name: "May", amount: 90 },
    { name: "Jun", amount: 65 },
  ];

  const pieData = [
    { name: "Entertainment", value: 400 },
    { name: "Software", value: 300 },
    { name: "Other", value: 200 },
  ];
  const COLORS = ["#2dd4bf", "#3b82f6", "#f59e0b"];

  if (authLoading || !mounted || !session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white">
        {t("loading")}
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar profile={profile} />
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[#0f172a]">
        {/* استخدام مكون الهيدر */}
        <Header title={t("reportsTitle")} />

        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                {t("totalSpent")}
              </p>
              <p className="text-3xl font-extrabold text-teal-500">
                ${totalSpent}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm h-96 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {t("monthlyTrend")}
              </h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                        borderColor: "#334155",
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#2dd4bf"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm h-96 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {t("categoryBreakdown")}
              </h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                        borderColor: "#334155",
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
