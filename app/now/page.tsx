'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import AppHeader from '@/components/AppHeader';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Set while a programmatic scroll (initial position, dot click, arrow click) is in
  // flight, so the scroll-driven observer below doesn't fight over activeIdx with a
  // click that's already mid-animation.
  const programmaticScroll = useRef(false);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const scrollToIndex = useCallback((idx: number, smooth: boolean) => {
    const el = cardRefs.current[idx];
    if (!el) return;
    programmaticScroll.current = true;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
    // scrollIntoView doesn't have a completion callback — release the guard after a
    // duration comfortably longer than the smooth-scroll animation itself.
    window.setTimeout(() => {
      programmaticScroll.current = false;
    }, smooth ? 500 : 50);
  }, []);

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
        // Position on the right card immediately, no animation — this is the initial
        // load, not a user-triggered move.
        requestAnimationFrame(() => scrollToIndex(idx, false));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tracks which card is most visible inside the scroll container as the person swipes
  // — this is what makes the card's motion feel like genuine scrolling (native momentum,
  // a visible slide, an eventual snap) rather than an instant swap the instant a touch
  // gesture crosses some pixel threshold.
  useEffect(() => {
    if (!containerRef.current || events.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticScroll.current) return;
        const best = entries.reduce<IntersectionObserverEntry | null>((acc, entry) => {
          if (entry.isIntersecting && (!acc || entry.intersectionRatio > acc.intersectionRatio)) {
            return entry;
          }
          return acc;
        }, null);
        if (best) {
          const idx = Number((best.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActiveIdx(idx);
        }
      },
      { root: containerRef.current, threshold: [0.6] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [events.length]);

  const go = useCallback(
    (delta: number) => {
      const next = activeIdx + delta;
      if (next < 0 || next >= events.length) return;
      setActiveIdx(next);
      scrollToIndex(next, true);
    },
    [activeIdx, events.length, scrollToIndex]
  );

  const current = events[activeIdx];
  const currentDate = current ? new Date(current.date) : today;
  const isToday = current?.date === todayStr;

  return (
    <div className="app-shell">
      <AppHeader />

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

        {!loading && events.length > 0 && (
          <>
            {/* A real horizontally-scrolling, snapping row of cards — one full-width
                card at a time, but genuinely SLIDING between them via native scroll
                rather than an instant state swap. This is what makes it visually clear
                a card is being dismissed and replaced, rather than just flickering. */}
            <div
              ref={containerRef}
              className="scroll-snap-row"
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                flex: 1,
                minHeight: 0,
                gap: 0,
              }}
            >
              {events.map((event, i) => (
                <div
                  key={event.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  data-idx={i}
                  style={{
                    flex: '0 0 100%',
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always',
                    minWidth: 0,
                    padding: '0 2px',
                  }}
                >
                  <div
                    className="card"
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 20,
                      overflowY: 'auto',
                    }}
                  >
                    {/* Large illustration stage in its own tinted rounded box. Capped
                        with an absolute max-width (not just a percentage) — the app
                        shell itself widens on desktop (480px → 860px, see
                        globals.css), and a box sized at 100% of that would balloon
                        into something enormous relative to the card's actual text
                        content. */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 340,
                        aspectRatio: '1.35',
                        margin: '0 auto',
                        borderRadius: 24,
                        background: TYPE_BG[event.type] || 'var(--bg2)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        marginBottom: 18,
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ width: '62%', height: '78%' }}>
                        <Illustration kind={illustrationForEvent(event)} />
                      </div>
                    </div>

                    {/* Category tag on one side, time on the other — same row. */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '5px 12px',
                          borderRadius: 50,
                          background: TYPE_BG[event.type] || 'var(--bg2)',
                          color: 'var(--text-2)',
                        }}
                      >
                        {TYPE_LABEL[event.type]}
                      </span>
                      <span style={{ fontSize: 24, fontWeight: 900 }}>{event.time}</span>
                    </div>

                    <div style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.3, marginBottom: 10 }}>
                      {event.title}
                    </div>

                    {/* Details are always shown open — no tap needed, matching the
                        original prototype's design. Only rendered for the active card
                        and its immediate neighbours, so a month's worth of cards
                        doesn't all compute their full detail body at once. */}
                    {Math.abs(i - activeIdx) <= 1 && <ActivityDetails event={event} />}
                  </div>
                </div>
              ))}
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
                .filter(({ e }) => e.date === current?.date)
                .map(({ i }) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveIdx(i);
                      scrollToIndex(i, true);
                    }}
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
