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
    // Ignore mostly-vertical gestures so the card's own content can still be scrolled
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

      <div
        className="page-content"
        style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}
      >
        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            אין פעילויות — עברי לטאב תפריט כדי ליצור ולאשר תפריט
          </div>
        )}

        {!loading && current && (
          <>
            {/* The card fills nearly the whole screen, matching the original design —
                this is the single focal point of the page, not one card among several. */}
            <div
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="card"
              style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: 20,
                overflowY: 'auto',
              }}
            >
              {/* Large illustration stage in its own tinted rounded box. */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1.35',
                  borderRadius: 24,
                  background: TYPE_BG[current.type] || 'var(--bg2)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: 18,
                }}
              >
                <div style={{ width: '62%', height: '78%' }}>
                  <Illustration kind={illustrationForEvent(current)} />
                </div>
              </div>

              {/* Category tag on one side, time on the other — same row. */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: 50,
                    background: TYPE_BG[current.type] || 'var(--bg2)',
                    color: 'var(--text-2)',
                  }}
                >
                  {TYPE_LABEL[current.type]}
                </span>
                <span style={{ fontSize: 24, fontWeight: 900 }}>{current.time}</span>
              </div>

              <div style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.3, marginBottom: 10 }}>{current.title}</div>

              {/* Details are always shown open — no tap needed, matching the original
                  prototype's design. */}
              <ActivityDetails event={current} />
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--text-3)', textAlign: 'center', marginTop: 6 }}>
              {HE_DAYS[currentDate.getDay()]}
              {isToday ? ' · היום' : ''}, {currentDate.getDate()} ב{HE_MONTHS[currentDate.getMonth()]}
            </div>

            {/* Small scroll/position dots, matching the prototype — a subtle indicator
                rather than large arrows-plus-dots. */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8 }}>
              {events
                .map((e, i) => ({ e, i }))
                .filter(({ e }) => e.date === current.date)
                .map(({ i }) => (
                  <div
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      width: i === activeIdx ? 16 : 6,
                      height: 6,
                      borderRadius: 50,
                      background: i === activeIdx ? 'var(--ink)' : 'var(--border)',
                      transition: 'all .2s',
                      cursor: 'pointer',
                    }}
                  />
                ))}
            </div>
          </>
        )}
      </div>

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
