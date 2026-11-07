"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const translations = {
  ar: {
    dashboard: "لوحة التحكم",
    subscriptions: "الاشتراكات",
    reports: "التقارير",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    welcome: "مرحباً",
    subsCount: "لديك {count} اشتراكات مسجلة حتى الآن.",
    addSub: "إضافة اشتراك",
    totalSubs: "إجمالي الاشتراكات",
    nextRenewal: "التجديد القادم",
    monthlyCost: "التكلفة الشهرية",
    savings: "فرص التوفير",
    spendingByCategory: "الإنفاق حسب الفئة",
    activeSubs: "الاشتراكات النشطة",
    noSubs: "لا توجد اشتراكات مسجلة.",
    loading: "جاري التحميل...",
    service: "الخدمة",
    dueDate: "تاريخ التجديد",
    cost: "التكلفة",
    addNewSub: "إضافة اشتراك جديد",
    subName: "اسم الخدمة",
    amount: "المبلغ ($)",
    remindBefore: "تنبيه قبل (أيام)",
    nextDate: "تاريخ التجديد القادم",
    save: "حفظ",
    saving: "جاري الحفظ...",
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات جديدة",
    active: "الفعالة",
    upcoming: "القادمة",
    cancelled: "الملغاة",
    editProfile: "إعدادات الملف الشخصي",
    logout: "تسجيل الخروج",
    subManager: "إدارة الاشتراكات",
    subsList: "قائمة الاشتراكات",
    sampleData: "بيانات تجريبية",
    search: "بحث...",
    reportsTitle: "التقارير المالية",
    totalSpent: "إجمالي الإنفاق",
    monthlyTrend: "الإنفاق الشهري",
    categoryBreakdown: "الإنفاق حسب الفئة",
    accountSettings: "إعدادات الحساب",
    notificationSettings: "إشعارات تيليغرام",
    appearanceSettings: "المظهر واللغة",
    saveChanges: "حفظ التغييرات",
    actions: "الإجراءات",
    edit: "تعديل",
    delete: "حذف",
    confirmDelete: "هل أنت متأكد من حذف هذا الاشتراك؟",
    cancel: "إلغاء",
    update: "تحديث الاشتراك",
    editSub: "تعديل الاشتراك",
    websiteUrl: "رابط صفحة التجديد (اختياري)",
    renewNow: "تجديد الآن",
    goToAccount: "الذهاب للحساب",
    subsOverview: "نظرة عامة على الاشتراكات",
    activeDesc: "الاشتراكات التي تعمل حالياً",
    upcomingDesc: "اشتراكات ستجدد خلال 30 يوماً",
    cancelledDesc: "الاشتراكات التي تم إيقافها",
    cancelSub: "إلغاء الاشتراك",
    reactivate: "إعادة تفعيل",
    viewList: "عرض القائمة",
    category: "التصنيف",
    catEnt: "ترفيه",
    catProd: "عمل وإنتاجية",
    catUtil: "أدوات وبرامج",
    catOther: "أخرى",
    subAdded: "تمت إضافة الاشتراك بنجاح",
    subUpdated: "تم تحديث الاشتراك بنجاح",
    subDeleted: "تم حذف الاشتراك",
    welcomeBack: "مرحباً بعودتك! سجل دخولك للمتابعة",
    createAccountDesc: "أنشئ حساباً جديداً لإدارة اشتراكاتك",
    firstName: "الاسم الأول",
    lastName: "الكنية",
    country: "البلد",
    phone: "رقم الهاتف (اختياري)",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    or: "أو",
    googleLogin: "الدخول باستخدام Google",
    noAccount: "ليس لديك حساب؟ أنشئ حساباً جديداً",
    hasAccount: "لديك حساب بالفعل؟ سجل دخولك",

    // الكلمة الجديدة المضافة الآن
    addFirstSubDesc: "أضف اشتراكك الأول لتبدأ في تتبع مصاريفك.",
  },
  en: {
    dashboard: "Dashboard",
    subscriptions: "Subscriptions",
    reports: "Reports",
    settings: "Settings",
    profile: "Profile",
    welcome: "Welcome",
    subsCount: "You have {count} subscriptions registered so far.",
    addSub: "Add Subscription",
    totalSubs: "Total Subscriptions",
    nextRenewal: "Next Renewal",
    monthlyCost: "Monthly Cost",
    savings: "Savings Opportunity",
    spendingByCategory: "Spending by Category",
    activeSubs: "Active Subscriptions",
    noSubs: "No subscriptions found.",
    loading: "Loading...",
    service: "Service",
    dueDate: "Due Date",
    cost: "Cost",
    addNewSub: "Add New Subscription",
    subName: "Service Name",
    amount: "Amount ($)",
    remindBefore: "Remind Before (Days)",
    nextDate: "Next Renewal Date",
    save: "Save",
    saving: "Saving...",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    active: "Active",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
    editProfile: "Profile Settings",
    logout: "Log out",
    subManager: "Subscription Manager",
    subsList: "Subscriptions List",
    sampleData: "Sample data",
    search: "Search...",
    reportsTitle: "Financial Reports",
    totalSpent: "Total Spent",
    monthlyTrend: "Monthly Spending",
    categoryBreakdown: "Category Breakdown",
    accountSettings: "Account Settings",
    notificationSettings: "Telegram Notifications",
    appearanceSettings: "Appearance & Language",
    saveChanges: "Save Changes",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this subscription?",
    cancel: "Cancel",
    update: "Update Subscription",
    editSub: "Edit Subscription",
    websiteUrl: "Renewal Page URL (Optional)",
    renewNow: "Renew Now",
    goToAccount: "Go to Account",
    subsOverview: "Subscriptions Overview",
    activeDesc: "Currently running subscriptions",
    upcomingDesc: "Subscriptions renewing in 30 days",
    cancelledDesc: "Subscriptions you stopped",
    cancelSub: "Cancel Subscription",
    reactivate: "Reactivate",
    viewList: "View List",
    category: "Category",
    catEnt: "Entertainment",
    catProd: "Productivity",
    catUtil: "Utilities",
    catOther: "Other",
    subAdded: "Subscription added successfully",
    subUpdated: "Subscription updated successfully",
    subDeleted: "Subscription deleted",
    welcomeBack: "Welcome back! Sign in to continue",
    createAccountDesc: "Create a new account to manage your subscriptions",
    firstName: "First Name",
    lastName: "Last Name",
    country: "Country",
    phone: "Phone (Optional)",
    email: "Email Address",
    password: "Password",
    login: "Sign In",
    signup: "Create Account",
    or: "Or",
    googleLogin: "Continue with Google",
    noAccount: "Don't have an account? Sign up",
    hasAccount: "Already have an account? Sign in",

    // الكلمة الجديدة المضافة الآن
    addFirstSubDesc:
      "Add your first subscription to start tracking your expenses.",
  },
};

type Language = "ar" | "en";
type TranslationKeys = keyof typeof translations.ar;

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  const t = (key: TranslationKeys) => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
