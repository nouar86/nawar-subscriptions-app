"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  User,
  Phone,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "../context/LanguageContext";

export default function LoginView() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage(); // أضفنا t هنا

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // حقول النموذج
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            country: country,
            phone: phone,
          },
        },
      });
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0b1120] p-4 transition-colors duration-300 relative overflow-hidden">
      {/* تأثيرات الإضاءة في الخلفية */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] dark:block hidden pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] dark:block hidden pointer-events-none"></div>

      <div className="bg-white/90 dark:bg-[#1e293b]/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl dark:shadow-[0_0_40px_rgba(45,212,191,0.1)] border border-gray-200 dark:border-slate-700/50 w-full max-w-md relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Nawar Logo"
            className="w-24 h-24 object-contain drop-shadow-xl mb-4"
          />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
            Nawar
          </h1>
          <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
            Subscriptions reminder
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User
                    className="absolute right-3 top-3 text-gray-400 dark:text-slate-500"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 rounded-xl py-2.5 pr-10 pl-3 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder={t("firstName")}
                  />
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 rounded-xl py-2.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder={t("lastName")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Globe
                    className="absolute right-3 top-3 text-gray-400 dark:text-slate-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 rounded-xl py-2.5 pr-10 pl-3 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder={t("country")}
                  />
                </div>
                <div className="relative">
                  <Phone
                    className="absolute right-3 top-3 text-gray-400 dark:text-slate-500"
                    size={18}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 rounded-xl py-2.5 pr-10 pl-3 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder={t("phone")}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute right-3 top-3 text-gray-400 dark:text-slate-500"
              size={18}
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 rounded-xl py-3 pr-10 pl-4 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              placeholder={t("email")}
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute right-3 top-3 text-gray-400 dark:text-slate-500"
              size={18}
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 rounded-xl py-3 pr-10 pl-4 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              placeholder={t("password")}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] flex justify-center items-center mt-6"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isLogin ? (
              t("login")
            ) : (
              t("signup")
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-300 dark:border-slate-700" />
          <span className="px-3 text-sm text-gray-500 dark:text-slate-500">
            {t("or")}
          </span>
          <hr className="w-full border-gray-300 dark:border-slate-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="mt-4 w-full bg-white dark:bg-[#0f172a]/50 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-[#0f172a] text-gray-700 dark:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
          </svg>
          {t("googleLogin")}
        </button>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-slate-700/50 flex items-center justify-between text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors font-medium text-right max-w-[60%]"
          >
            {isLogin ? t("noAccount") : t("hasAccount")}
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="text-gray-500 dark:text-slate-400 hover:text-teal-500 transition-colors flex items-center gap-1"
            >
              <Globe size={16} /> {lang === "ar" ? "EN" : "AR"}
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-500 dark:text-slate-400 hover:text-teal-500 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
