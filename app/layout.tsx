import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./context/SidebarContext"; // <-- تمت الإضافة
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
              <SidebarProvider>
                {" "}
                {/* <-- تمت الإضافة */}
                {children}
                <Toaster position="bottom-right" richColors />
              </SidebarProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
