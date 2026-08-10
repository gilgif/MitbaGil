'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/menu', label: 'תפריט', iconClass: 'bnav-icon-menu' },
  { href: '/schedule', label: 'לו״ז', iconClass: 'bnav-icon-schedule' },
  { href: '/now', label: 'עכשיו', iconClass: 'bnav-icon-now' },
];

function TabIcon({ href }: { href: string }) {
  if (href === '/menu') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (href === '/schedule') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.2" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={`bnav-tab ${active ? 'active' : ''}`}>
            <span className={`bnav-icon ${tab.iconClass}`}>
              <TabIcon href={tab.href} />
            </span>
            <span className="bnav-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
