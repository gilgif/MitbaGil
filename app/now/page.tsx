'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import ActivityDetails from '@/components/ActivityDetails';
import type { ScheduleEvent } from '@/lib/scheduleLogic';
import { TYPE_LABEL, illustrationForEvent } from '@/lib/scheduleLogic';
import { Illustration } from '@/components/Illustrations';

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

export default function NowPage() {
  // Holds the WHOLE month, not just today — swiping past midnight should carry on into
  // tomorrow's first activity rather than hitting a wall at the end of the day.
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/schedule?year=${today.getFullYear()}&month=${today.getMonth()}`);
      if (res.ok) {
        const all: ScheduleEvent[] = await res.json();
        setEvents(all);

        // Open on whatever is current right now: the last activity today whose time has
        // already passed. Falls back to the first activity of today, then to the very first.
        const nowStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
        let idx = all.findIndex((e) => e.date === todayStr);
        if (idx < 0) idx = 0;
        all.forEach((e, i) => {
          if (e.date === todayStr && e.time <= nowStr) idx = i;
        });
        setActiveIdx(idx);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback(
    (delta: number) => {
      setActiveIdx((cur) => {
        const next = cur + delta;
        if (next < 0 || next >= events.length) return cur;
        setExpanded(false); // moving to a new activity always starts collapsed
        return next;
      });
    },
    [events.length]
  );

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    // Ignore mostly-vertical gestures so the expanded card can still be scrolled
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
    // RTL: swiping right goes back to the previous activity
    go(dx > 0 ? -1 : 1);
  }

  const current = events[activeIdx];
  const currentDate = current ? new Date(current.date) : today;
  const isToday = current?.date === todayStr;

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

      <div className="page-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', marginBottom: 2 }}>
          {HE_DAYS[currentDate.getDay()]}
          {isToday ? ' · היום' : ''}, {currentDate.getDate()} ב{HE_MONTHS[currentDate.getMonth()]}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            אין פעילויות — עברי לטאב תפריט כדי ליצור ולאשר תפריט
          </div>
        )}

        {!loading && current && (
          <>
            <div
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}
            >
              {/* Tapping anywhere on the card toggles the details open/closed — the card
                  grows downward rather than opening a separate overlay. */}
              <div
                className="card"
                onClick={() => setExpanded((v) => !v)}
                style={{ padding: 24, cursor: 'pointer', marginTop: 12, position: 'relative' }}
              >
                {/* A big illustration stage, like the prototype — the character is the
                    focal point of the card, not a small side icon. */}
                <div
                  style={{
                    width: 128,
                    height: 128,
                    margin: '0 auto 14px',
                    borderRadius: '50%',
                    background: TYPE_BG[current.type] || 'var(--bg2)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ width: '84%', height: '84%' }}>
                    <Illustration kind={illustrationForEvent(current)} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-3)' }}>
                      {current.time} · {TYPE_LABEL[current.type]}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.3 }}>{current.title}</div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: 24,
                      fontSize: 18,
                      color: 'var(--text-3)',
                      transform: expanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform .2s',
                    }}
                  >
                    ⌄
                  </div>
                </div>

                {/* Meal events get proper icon chips for protein/calories instead of the
                    plain "480 קק״ל · 38g חלבון" text — same style as the schedule cards. */}
                {!expanded && current.meal && (
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14 }}>
                    <span style={macroChip}>🥩 {current.meal.protein_g}g חלבון</span>
                    <span style={macroChip}>🔥 {current.meal.cal} קק״ל</span>
                  </div>
                )}

                {!expanded && !current.meal && current.detail && (
                  <div
                    style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginTop: 14, textAlign: 'center' }}
                  >
                    {current.detail}
                  </div>
                )}

                {expanded && (
                  <div style={{ marginTop: 14, borderTop: '1px solid var(--border-soft)', paddingTop: 6 }}>
                    <ActivityDetails event={current} />
                  </div>
                )}

                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 16 }}>
                  {expanded ? 'הקישי לסגירה' : 'הקישי לפרטים מלאים'}
                </div>
              </div>
            </div>

            {/* Arrows + position. Dots are per-day so the row doesn't become unreadable
                across a whole month of activities. */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                padding: '18px 0 6px',
              }}
            >
              <button onClick={(e) => { e.stopPropagation(); go(1); }} disabled={activeIdx >= events.length - 1} style={arrowStyle}>
                ‹
              </button>
              <div style={{ display: 'flex', gap: 6 }}>
                {events
                  .map((e, i) => ({ e, i }))
                  .filter(({ e }) => e.date === current.date)
                  .map(({ i }) => (
                    <div
                      key={i}
                      onClick={(ev) => { ev.stopPropagation(); setActiveIdx(i); setExpanded(false); }}
                      style={{
                        width: i === activeIdx ? 20 : 7,
                        height: 7,
                        borderRadius: 50,
                        background: i === activeIdx ? 'var(--ink)' : 'var(--border)',
                        transition: 'all .2s',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} disabled={activeIdx <= 0} style={arrowStyle}>
                ›
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-3)' }}>
              החליקי לפעילות הבאה — גם לימים אחרים
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

const macroChip: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-2)',
  background: 'var(--bg2)',
  padding: '5px 12px',
  borderRadius: 50,
  whiteSpace: 'nowrap',
};

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
