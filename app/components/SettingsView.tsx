"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  CheckCircle2,
  AlertCircle,
  Camera,
  Globe,
  Moon,
  Sun,
  User,
  Bell,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";
import Sidebar from "./Sidebar";
import Header from "./Header"; // <-- استيراد الهيدر

export default function SettingsView() {
  const { session, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [chatId, setChatId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (!session?.user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setCountry(data.country || "");
        setPhone(data.phone || "");
        setChatId(data.telegram_chat_id || "");
        setAvatarUrl(data.avatar_url || "");
      }
    };
    fetchProfile();
  }, [session]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${session?.user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setLoading(true);
    setMessage({ type: "", text: "" });
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      first_name: firstName,
      last_name: lastName,
      country,
      phone,
      telegram_chat_id: chatId,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Settings saved successfully!" });
    setLoading(false);
  };

  if (authLoading || !mounted)
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-[#0f172a] min-h-screen text-gray-900 dark:text-white">
        {t("loading")}
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar profile={profile} />

      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-[#0f172a]">
        {/* استخدام مكون الهيدر */}
        <Header title={t("settings")} />

        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "account" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
            >
              <User size={20} /> {t("accountSettings")}
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "notifications" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
            >
              <Bell size={20} /> {t("notificationSettings")}
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "appearance" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
            >
              <Globe size={20} /> {t("appearanceSettings")}
            </button>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === "account" && (
                <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-4">
                    Account Information
                  </h2>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                          {firstName ? firstName[0] : "U"}
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 p-2 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 shadow-lg transition">
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadAvatar}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-4">
                    Telegram Setup
                  </h2>
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-600 dark:text-slate-300 space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      How to get your Chat ID?
                    </p>
                    <p>
                      1. Open Telegram and search for{" "}
                      <code className="bg-gray-200 dark:bg-slate-900 px-1 rounded">
                        @userinfobot
                      </code>
                      .
                    </p>
                    <p>2. Send any message to it.</p>
                    <p>3. Copy the ID it replies with and paste it below.</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                      Telegram Chat ID
                    </label>
                    <input
                      type="text"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-3 text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none"
                      placeholder="e.g. 123456789"
                    />
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-4">
                    Appearance & Language
                  </h2>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Toggle between light and dark theme.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${theme === "dark" ? "bg-teal-500" : "bg-gray-300"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Language
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Current language:{" "}
                        {lang === "ar" ? "العربية" : "English"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleLang}
                      className="px-4 py-2 bg-teal-500 text-slate-900 font-bold rounded-lg hover:bg-teal-400 transition"
                    >
                      Switch
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {message.text && (
                  <div
                    className={`p-3 rounded-xl flex items-center gap-2 text-sm ${message.type === "success" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}{" "}
                    {message.text}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="ml-auto bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-teal-500/20"
                >
                  {loading ? t("saving") : t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
