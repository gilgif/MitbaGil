'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import ActivityPopup from '@/components/ActivityPopup';
import type { ScheduleEvent } from '@/lib/scheduleLogic';
import { TYPE_LABEL } from '@/lib/scheduleLogic';

const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const HE_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

const TYPE_BG: Record<string, string> = {
  eat: 'var(--c-eat-bg)',
  cook: 'var(--c-cook-bg)',
  prep: 'var(--c-prep-bg)',
  shop: 'var(--c-shop-bg)',
  sport: 'var(--c-sport-bg)',
  recv: 'var(--c-recv-bg)',
  baby: 'var(--c-baby-bg)',
};

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/schedule?year=${today.getFullYear()}&month=${today.getMonth()}`);
      if (res.ok) setEvents(await res.json());
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group events by date so we can render a header per day
  const byDate = new Map<string, ScheduleEvent[]>();
  (events || []).forEach((e) => {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date)!.push(e);
  });
  const dates = Array.from(byDate.keys()).sort();

  return (
    <div className="app-shell">
      <div className="top-bar" style={{ position: 'relative' }}>
        <div className="app-logo">
          מטב<span>גיל</span>
        </div>
        <Link href="/settings" style={settingsBtnStyle}>
          ⚙️
        </Link>
      </div>

      <div className="page-content" style={{ padding: '16px' }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
          לו״ז — {HE_MONTHS[today.getMonth()]} {today.getFullYear()}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          כל הפעילויות: ארוחות, בישול, הכנות, קניות, משלוחים ואימונים
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && dates.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            אין עדיין תפריט לחודש הזה — עברי לטאב תפריט כדי ליצור אחד
          </div>
        )}

        {!loading &&
          dates.map((date) => {
            const d = new Date(date);
            const isToday = date === todayStr;
            const dayEvents = byDate.get(date)!;
            return (
              <div key={date} style={{ marginBottom: 22 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: isToday ? 'var(--ink)' : 'var(--text-3)',
                    marginBottom: 8,
                    letterSpacing: 0.3,
                  }}
                >
                  {HE_DAYS[d.getDay()]}, {d.getDate()} ב{HE_MONTHS[d.getMonth()]}
                  {isToday && ' · היום'}
                </div>

                {dayEvents.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '11px 14px',
                      marginBottom: 7,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--text-3)',
                        width: 38,
                        flexShrink: 0,
                      }}
                    >
                      {e.time}
                    </div>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: TYPE_BG[e.type] || 'var(--bg2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                        flexShrink: 0,
                      }}
                    >
                      {e.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)' }}>
                        {TYPE_LABEL[e.type]}
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 800,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {e.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
      </div>

      <ActivityPopup event={selected} onClose={() => setSelected(null)} />
      <BottomNav />
    </div>
  );
}

const settingsBtnStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'var(--bg2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  fontSize: 16,
};
