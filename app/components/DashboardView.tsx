"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "./Sidebar";
import Header from "./Header"; // <-- استيراد الهيدر

export default function DashboardView() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const { theme } = useTheme(); // نحتاج theme للرسوم البيانية
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remindDays, setRemindDays] = useState("7");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !session) router.push("/login");
  }, [session, authLoading, router]);

  const fetchData = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .order("next_renewal_date", { ascending: true });
    if (subs) setSubscriptions(subs);
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (prof) setProfile(prof);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setAdding(true);
    const { error } = await supabase.from("subscriptions").insert([
      {
        user_id: session.user.id,
        name,
        amount: parseFloat(amount),
        next_renewal_date: date,
        remind_days_before: parseInt(remindDays),
        cycle: "monthly",
      },
    ]);
    if (!error) {
      setIsModalOpen(false);
      setName("");
      setAmount("");
      setDate("");
      setRemindDays("7");
      fetchData();
    }
    setAdding(false);
  };

  const totalSubs = subscriptions.length;
  const nextRenewal = subscriptions.length > 0 ? subscriptions[0] : null;
  const monthlyCost = subscriptions
    .reduce(
      (acc, sub) =>
        sub.cycle === "yearly" ? acc + sub.amount / 12 : acc + sub.amount,
      0,
    )
    .toFixed(2);

  // حساب المجاميع لكل تصنيف
  const categoryTotals = subscriptions.reduce(
    (acc, sub) => {
      const cat = sub.category || "Other";
      acc[cat] = (acc[cat] || 0) + sub.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.keys(categoryTotals).map((key) => ({
    name: t(`cat${key.substring(0, 4)}` as any) || key, // ترجمة اسم التصنيف
    value: categoryTotals[key],
  }));

  // إذا كان المستخدم جديداً وليس لديه اشتراكات، نعرض بيانات وهمية للشكل فقط
  if (chartData.length === 0) {
    chartData.push({ name: t("catOther"), value: 100 });
  }

  const COLORS = ["#2dd4bf", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

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
        <Header title={t("dashboard")} />

        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 dark:from-teal-500/20 dark:to-slate-800 p-8 rounded-2xl border border-teal-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {t("welcome")} {profile?.first_name || ""}!
              </h2>
              <p className="text-gray-600 dark:text-slate-300">
                {t("subsCount").replace("{count}", totalSubs.toString())}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
            >
              <Plus size={20} /> {t("addSub")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t("totalSubs"),
                value: totalSubs,
                color: "text-gray-900 dark:text-white",
              },
              {
                title: t("nextRenewal"),
                value: nextRenewal ? nextRenewal.name : "-",
                color: "text-gray-900 dark:text-white text-xl",
              },
              {
                title: t("monthlyCost"),
                value: `$${monthlyCost}`,
                color: "text-gray-900 dark:text-white",
              },
              { title: t("savings"), value: "$0.00", color: "text-teal-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-center"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">
                  {stat.title}
                </p>
                <p className={`text-3xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm h-96 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {t("spendingByCategory")}
              </h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
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

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {t("activeSubs")}
              </h3>
              <div className="overflow-y-auto flex-1 pr-2">
                {loading ? (
                  <p className="text-gray-500">{t("loading")}</p>
                ) : subscriptions.length === 0 ? (
                  <p className="text-gray-500">{t("noSubs")}</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                      {subscriptions.map((sub) => (
                        <tr
                          key={sub.id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${sub.name.toLowerCase().replace(/\s/g, "")}.com&sz=64`}
                                  alt={sub.name}
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement!.innerText =
                                      sub.name[0].toUpperCase();
                                    e.currentTarget.parentElement!.classList.add(
                                      "text-teal-500",
                                      "font-bold",
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {sub.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                  {t("sampleData")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-gray-500 dark:text-slate-400">
                            {sub.next_renewal_date}
                          </td>
                          <td className="py-4 text-left font-semibold text-gray-900 dark:text-white">
                            ${sub.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* نافذة إضافة اشتراك */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {t("addNewSub")}
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                  {t("subName")}
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  placeholder="Netflix"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                    {t("amount")}
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                    {t("remindBefore")}
                  </label>
                  <input
                    required
                    type="number"
                    value={remindDays}
                    onChange={(e) => setRemindDays(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                  {t("nextDate")}
                </label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
              <button
                disabled={adding}
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2 rounded-lg mt-2 transition"
              >
                {adding ? t("saving") : t("save")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
