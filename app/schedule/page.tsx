'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import ActivityPopup from '@/components/ActivityPopup';
import type { ScheduleEvent } from '@/lib/scheduleLogic';
import { TYPE_LABEL, illustrationForEvent } from '@/lib/scheduleLogic';
import { IllustrationStage } from '@/components/Illustrations';

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
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);
  // Index into the list of dates that have activities — one day is shown at a time,
  // and swiping moves between days across the whole month.
  const [dayIdx, setDayIdx] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/schedule?year=${today.getFullYear()}&month=${today.getMonth()}`);
      if (res.ok) {
        const all: ScheduleEvent[] = await res.json();
        setEvents(all);
        // Open on today when it has activities, otherwise on the first day that does.
        const uniqueDates = Array.from(new Set(all.map((e) => e.date))).sort();
        const todayPos = uniqueDates.indexOf(todayStr);
        setDayIdx(todayPos >= 0 ? todayPos : 0);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dates = Array.from(new Set(events.map((e) => e.date))).sort();
  const currentDate = dates[dayIdx];
  const dayEvents = events.filter((e) => e.date === currentDate);

  const goDay = useCallback(
    (delta: number) => {
      setDayIdx((cur) => {
        const next = cur + delta;
        if (next < 0 || next >= dates.length) return cur;
        return next;
      });
    },
    [dates.length]
  );

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    // Vertical gestures are left alone so the day's list can still be scrolled
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
    // RTL: swiping right goes to the previous day
    goDay(dx > 0 ? -1 : 1);
  }

  const d = currentDate ? new Date(currentDate) : today;
  const isToday = currentDate === todayStr;

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
        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && dates.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            אין עדיין תפריט לחודש הזה — עברי לטאב תפריט כדי ליצור אחד
          </div>
        )}

        {!loading && currentDate && (
          <>
            {/* Day header with arrows */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <button onClick={() => goDay(1)} disabled={dayIdx >= dates.length - 1} style={arrowStyle}>
                ‹
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 900 }}>
                  {HE_DAYS[d.getDay()]}, {d.getDate()} ב{HE_MONTHS[d.getMonth()]}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                  {isToday ? 'היום' : `${dayIdx + 1} מתוך ${dates.length}`}
                </div>
              </div>
              <button onClick={() => goDay(-1)} disabled={dayIdx <= 0} style={arrowStyle}>
                ›
              </button>
            </div>

            <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', width: 38, flexShrink: 0 }}>
                    {e.time}
                  </div>
                  <IllustrationStage kind={illustrationForEvent(e)} size={40} bg={TYPE_BG[e.type]} />
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

            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-3)', marginTop: 14 }}>
              החליקי ימינה או שמאלה למעבר בין ימים
            </div>
          </>
        )}
      </div>

      <ActivityPopup event={selected} onClose={() => setSelected(null)} />
      <BottomNav />
    </div>
  );
}

const arrowStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: 'none',
  background: 'var(--bg2)',
  color: 'var(--text-2)',
  fontSize: 20,
  cursor: 'pointer',
  lineHeight: 1,
  flexShrink: 0,
};

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
