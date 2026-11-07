"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ExternalLink,
  RotateCcw,
  Ban,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header"; // <-- استيراد الهيدر الجديد
import { toast } from "sonner";

function SubscriptionListContent() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  const params = useParams();
  const statusFilter = params.status as string;

  const [mounted, setMounted] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // حالة البحث
  const [searchQuery, setSearchQuery] = useState("");

  // حالات الإضافة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remindDays, setRemindDays] = useState("7");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [adding, setAdding] = useState(false);

  // حالات التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editRemindDays, setEditRemindDays] = useState("7");
  const [editWebsiteUrl, setEditWebsiteUrl] = useState("");
  const [editCategory, setEditCategory] = useState("Entertainment");
  const [updating, setUpdating] = useState(false);

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
        website_url: websiteUrl,
        category,
        cycle: "monthly",
        is_active: true,
      },
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("subAdded"));
      setIsAddModalOpen(false);
      setName("");
      setAmount("");
      setDate("");
      setWebsiteUrl("");
      fetchData();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    await supabase.from("subscriptions").delete().eq("id", id);
    toast.success(t("subDeleted"));
    fetchData();
  };

  const openEditModal = (sub: any) => {
    setEditingId(sub.id);
    setEditName(sub.name);
    setEditAmount(sub.amount.toString());
    setEditDate(sub.next_renewal_date);
    setEditRemindDays(sub.remind_days_before.toString());
    setEditWebsiteUrl(sub.website_url || "");
    setEditCategory(sub.category || "Entertainment");
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    await supabase
      .from("subscriptions")
      .update({
        name: editName,
        amount: parseFloat(editAmount),
        next_renewal_date: editDate,
        remind_days_before: parseInt(editRemindDays),
        website_url: editWebsiteUrl,
        category: editCategory,
      })
      .eq("id", editingId);
    toast.success(t("subUpdated"));
    setIsEditModalOpen(false);
    fetchData();
    setUpdating(false);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase
      .from("subscriptions")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    fetchData();
  };

  // الفلترة الديناميكية (البحث + الحالة)
  const filteredSubs = subscriptions.filter((sub) => {
    // فلترة البحث بالاسم
    if (
      searchQuery &&
      !sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // فلترة الحالة (نشط، قادم، ملغى)
    if (statusFilter === "cancelled") return sub.is_active === false;
    if (statusFilter === "active") return sub.is_active !== false;
    if (statusFilter === "upcoming") {
      if (sub.is_active === false) return false;
      const diffDays = Math.ceil(
        (new Date(sub.next_renewal_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return diffDays <= 30 && diffDays >= 0;
    }
    return true;
  });

  const pageTitle =
    statusFilter === "upcoming"
      ? t("upcoming")
      : statusFilter === "cancelled"
        ? t("cancelled")
        : t("active");

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
        {/* استخدام مكون الهيدر الموحد */}
        <Header title={`${pageTitle} ${t("subscriptions")}`} />

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* شريط البحث */}
          <div className="relative max-w-md">
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {t("subsList")}
              </h2>
              {statusFilter !== "cancelled" && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all"
                >
                  <Plus size={18} /> {t("addSub")}
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-gray-500 p-6 text-center">{t("loading")}</p>
            ) : filteredSubs.length === 0 ? (
              // الحالة الفارغة المحسنة
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <CreditCard size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {t("noSubs")}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 mb-6">
                  {t("addFirstSubDesc")}
                </p>

                {statusFilter !== "cancelled" && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Plus size={20} /> {t("addSub")}
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium rounded-r-lg">
                        {t("service")}
                      </th>
                      <th className="px-6 py-4 font-medium">{t("dueDate")}</th>
                      <th className="px-6 py-4 font-medium">{t("cost")}</th>
                      <th className="px-6 py-4 font-medium text-center">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                    {filteredSubs.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
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
                                }}
                              />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {sub.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                          {sub.next_renewal_date}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          ${sub.amount}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {statusFilter === "cancelled" ? (
                              <button
                                onClick={() =>
                                  toggleStatus(sub.id, sub.is_active)
                                }
                                className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition text-xs font-medium flex items-center gap-1"
                              >
                                <RotateCcw size={14} /> {t("reactivate")}
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    window.open(sub.website_url, "_blank")
                                  }
                                  className="px-3 py-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-slate-900 rounded-lg transition font-medium flex items-center gap-1 text-xs"
                                  title={t("goToAccount")}
                                >
                                  <ExternalLink size={14} /> {t("renewNow")}
                                </button>
                                <button
                                  onClick={() => openEditModal(sub)}
                                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
                                  title={t("edit")}
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    toggleStatus(sub.id, sub.is_active)
                                  }
                                  className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
                                  title={t("cancelSub")}
                                >
                                  <Ban size={18} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                              title={t("delete")}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* نافذة الإضافة */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
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
                    {t("category")}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  >
                    <option value="Entertainment">{t("catEnt")}</option>
                    <option value="Productivity">{t("catProd")}</option>
                    <option value="Utilities">{t("catUtil")}</option>
                    <option value="Other">{t("catOther")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                  {t("websiteUrl")}
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
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

      {/* نافذة التعديل */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {t("editSub")}
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                  {t("subName")}
                </label>
                <input
                  required
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
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
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                    {t("category")}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  >
                    <option value="Entertainment">{t("catEnt")}</option>
                    <option value="Productivity">{t("catProd")}</option>
                    <option value="Utilities">{t("catUtil")}</option>
                    <option value="Other">{t("catOther")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                    {t("remindBefore")}
                  </label>
                  <input
                    required
                    type="number"
                    value={editRemindDays}
                    onChange={(e) => setEditRemindDays(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                    {t("nextDate")}
                  </label>
                  <input
                    required
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                  {t("websiteUrl")}
                </label>
                <input
                  type="url"
                  value={editWebsiteUrl}
                  onChange={(e) => setEditWebsiteUrl(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white font-bold py-2 rounded-lg transition"
                >
                  {t("cancel")}
                </button>
                <button
                  disabled={updating}
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-2 rounded-lg transition"
                >
                  {updating ? t("saving") : t("update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionList() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white">
          جاري التحميل...
        </div>
      }
    >
      <SubscriptionListContent />
    </Suspense>
  );
}
