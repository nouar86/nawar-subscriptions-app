import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "sonner"; // <-- استيراد مكتبة التنبيهات

const inter = Inter({ subsets: ["latin"] });

// تم تحديث الـ Metadata هنا
export const metadata: Metadata = {
  title: "Nawar Subscription Manager",
  description: "Smart app to track subscriptions.",
  icons: {
    icon: "/logo.png", // أيقونة المتصفح
    apple: "/logo.png", // أيقونة الآيفون
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-[#0f172a] text-gray-800 dark:text-slate-200 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <LanguageProvider>
              {children}
              {/* مكتبة التنبيهات */}
              <Toaster position="bottom-right" richColors />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
