import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// This route is called automatically by Vercel Cron (see vercel.json) once a day.
// It uses the SERVICE ROLE key (server-only, never exposed to the browser) so it can
// read/write across all users, not just one signed-in user.
function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(req: NextRequest) {
  // Protect this endpoint: Vercel Cron sends a secret header matching CRON_SECRET
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceClient();
  webpush.setVapidDetails(
    'mailto:you@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  // 1. Find all reminders due in the next 24h that haven't been sent yet
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: dueReminders, error } = await supabase
    .from('reminders')
    .select('*, user:user_id(*)')
    .eq('sent', false)
    .gte('scheduled_for', now.toISOString())
    .lte('scheduled_for', in24h.toISOString());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sentCount = 0;
  for (const reminder of dueReminders || []) {
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', reminder.user_id);

    for (const sub of subs || []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: reminder.title, body: reminder.body, url: '/now' })
        );
        sentCount++;
      } catch (err) {
        console.error('Push send failed for subscription', sub.id, err);
      }
    }

    await supabase.from('reminders').update({ sent: true }).eq('id', reminder.id);
  }

  return NextResponse.json({ success: true, sent: sentCount });
}
