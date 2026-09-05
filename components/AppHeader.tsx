'use client';

import Link from 'next/link';
import { Illustration, CircledIcon } from '@/components/Illustrations';

// The header used across every page — icon-only, matching the design handoff (option C).
// The brand mark sits centered; the opposite corner holds either a settings button (on
// the main tabs) or a back button (on settings itself, since a settings button there
// would point at the page you're already on).
export default function AppHeader({ variant = 'settings' }: { variant?: 'settings' | 'back' }) {
  return (
    <div className="top-bar" style={{ position: 'relative', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, overflow: 'hidden' }}>
        <Illustration kind="brand" />
      </div>

      {variant === 'settings' ? (
        <Link href="/settings" style={cornerBtnStyle} aria-label="הגדרות">
          <CircledIcon kind="settings" size={36} />
        </Link>
      ) : (
        <Link href="/menu" style={cornerBtnStyle} aria-label="חזרה">
          <CircledIcon kind="close" size={36} />
        </Link>
      )}
    </div>
  );
}

const cornerBtnStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  textDecoration: 'none',
  display: 'flex',
};
