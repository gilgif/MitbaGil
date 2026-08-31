'use client';

import type { ScheduleEvent } from '@/lib/scheduleLogic';
import { TYPE_LABEL, illustrationForEvent } from '@/lib/scheduleLogic';
import { IllustrationStage } from '@/components/Illustrations';
import ActivityDetails from './ActivityDetails';

const TYPE_BG: Record<string, string> = {
  eat: 'var(--c-eat-bg)',
  cook: 'var(--c-cook-bg)',
  prep: 'var(--c-prep-bg)',
  shop: 'var(--c-shop-bg)',
  sport: 'var(--c-sport-bg)',
  recv: 'var(--c-recv-bg)',
  baby: 'var(--c-baby-bg)',
};

export default function ActivityPopup({
  event,
  onClose,
}: {
  event: ScheduleEvent | null;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.45)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          width: '100%',
          maxWidth: 480,
          borderRadius: '24px 24px 0 0',
          maxHeight: '85dvh',
          overflowY: 'auto',
          padding: '20px 20px calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 4,
            background: 'var(--border)',
            margin: '0 auto 16px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <IllustrationStage kind={illustrationForEvent(event)} size={52} bg={TYPE_BG[event.type]} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)' }}>
              {event.time} · {TYPE_LABEL[event.type]}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.3 }}>{event.title}</div>
          </div>
        </div>

        <ActivityDetails event={event} />

        <button onClick={onClose} className="btn btn-ghost" style={{ width: '100%', marginTop: 20 }}>
          סגירה
        </button>
      </div>
    </div>
  );
}
