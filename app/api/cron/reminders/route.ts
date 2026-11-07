import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  // تم تفعيل شرط الحماية
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 1. جلب جميع الاشتراكات النشطة
  const { data: subscriptions, error: subsError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true);

  if (subsError) {
    return NextResponse.json({ error: subsError.message }, { status: 500 });
  }

  // 2. جلب جميع الملفات الشخصية (التي تحتوي على Chat ID)
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, telegram_chat_id");

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // 3. إنشاء خريطة (Map) للوصول السريع إلى Chat ID لكل مستخدم
  const profileMap = new Map(
    profiles?.map((p) => [p.id, p.telegram_chat_id]) || [],
  );

  const todayStr = new Date().toISOString().split("T")[0];
  let sentCount = 0;

  // 4. فحص كل اشتراك
  for (const sub of subscriptions) {
    // جلب Chat ID الخاص بصاحب الاشتراك من الخريطة
    const chatId = profileMap.get(sub.user_id);

    // تخطي إذا لم يكن المستخدم قد ربط تيليغرام
    if (!chatId) continue;

    if (sub.last_reminded_at === todayStr) continue;

    const today = new Date(todayStr);
    const renewalDate = new Date(sub.next_renewal_date);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === sub.remind_days_before) {
      const message = `🔔 تذكير بالاشتراك:\n\n📦 ${sub.name}\n💰 المبلغ: ${sub.amount} ${sub.currency || "USD"}\n📅 تاريخ التجديد: ${sub.next_renewal_date}\n\nلديك ${diffDays} أيام قبل التجديد.`;

      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      const tgResponse = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (tgResponse.ok) {
        await supabase
          .from("subscriptions")
          .update({ last_reminded_at: todayStr })
          .eq("id", sub.id);

        sentCount++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: `تم فحص ${subscriptions.length} اشتراك، وتم إرسال ${sentCount} تذكير.`,
  });
}
