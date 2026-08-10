'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { UserSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function updateField(key: keyof UserSettings, value: any) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    });
    setSaving(false);
  }

  if (!settings) {
    return (
      <div className="app-shell">
        <div className="page-content" style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
          טוענת...
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="top-bar" style={{ position: 'relative' }}>
        <Link
          href="/menu"
          style={{
            position: 'absolute',
            left: 16,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--bg2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-2)',
            textDecoration: 'none',
          }}
        >
          ✕
        </Link>
        <div style={{ fontSize: 17, fontWeight: 900 }}>הגדרות</div>
      </div>

      <div className="page-content" style={{ padding: 16 }}>
        <SectionTitle>יעד משקל ואימונים</SectionTitle>
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <SettingRow label="משקל נוכחי (ק״ג)">
            <input
              type="number"
              value={settings.weight_kg}
              onChange={(e) => updateField('weight_kg', parseFloat(e.target.value))}
              style={inputStyle}
            />
          </SettingRow>
          <SettingRow label="יעד קלורי יומי">
            <input
              type="number"
              value={settings.daily_cal_target}
              onChange={(e) => updateField('daily_cal_target', parseInt(e.target.value))}
              style={inputStyle}
            />
          </SettingRow>
          <SettingRow label="יעד חלבון יומי (גר')">
            <input
              type="number"
              value={settings.daily_protein_target}
              onChange={(e) => updateField('daily_protein_target', parseInt(e.target.value))}
              style={inputStyle}
            />
          </SettingRow>
        </div>

        <SectionTitle>אימונים</SectionTitle>
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <SettingRow label="שעת התעוררות">
            <input
              type="time"
              value={settings.wake_time}
              onChange={(e) => updateField('wake_time', e.target.value)}
              style={inputStyle}
            />
          </SettingRow>
          <SettingRow label="שעת אימון כוח">
            <input
              type="time"
              value={settings.strength_time}
              onChange={(e) => updateField('strength_time', e.target.value)}
              style={inputStyle}
            />
          </SettingRow>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
            ימי אימון כוח: שני, שלישי, חמישי, שישי — ריצה יכולה להחליף בשלישי או חמישי
          </div>
        </div>

        <SectionTitle>אילוצי לו״ז</SectionTitle>
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <SettingRow label="שעת ארוחת ערב אחרונה">
            <input
              type="time"
              value={settings.dinner_cutoff_time}
              onChange={(e) => updateField('dinner_cutoff_time', e.target.value)}
              style={inputStyle}
            />
          </SettingRow>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
            3 שעות לפני שינה — עדיפות ל-18:00 עם הילדה
          </div>
        </div>

        <SectionTitle>קניות ומזווה</SectionTitle>
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <SettingRow label="קצב קניית ירקות">
            <select
              value={settings.produce_mode}
              onChange={(e) => updateField('produce_mode', e.target.value)}
              style={inputStyle}
            >
              <option value="weekly">שבועי (שלישי/חמישי)</option>
              <option value="cycle">כל {settings.produce_cycle_days} ימים</option>
            </select>
          </SettingRow>
          <SettingRow label="ריכוז קניית בשר/עוף (ימים)">
            <input
              type="number"
              value={settings.meat_batch_days}
              onChange={(e) => updateField('meat_batch_days', parseInt(e.target.value))}
              style={inputStyle}
            />
          </SettingRow>
          <SettingRow label="תזכורת הוצאה מהקפאה (ימים לפני)">
            <input
              type="number"
              value={settings.thaw_lead_days}
              onChange={(e) => updateField('thaw_lead_days', parseInt(e.target.value))}
              style={inputStyle}
            />
          </SettingRow>
        </div>

        <SectionTitle>הנחיות תזונה אישיות</SectionTitle>
        <div className="card" style={{ padding: 16, marginBottom: 20, fontSize: 13, lineHeight: 1.8, color: 'var(--text-2)' }}>
          <p>🎯 <strong>מטרה:</strong> ירידה הדרגתית וקלילה במשקל + בניית מסת שריר מתונה</p>
          <p>🫒 <strong>השראה:</strong> מטבח ים-תיכוני ויווני</p>
          <p>🍽️ <strong>מבנה יומי:</strong> חלבון עיקרי בצהריים, ערב קליל</p>
          <p>🚫 לא אוהבת: זיתים, ליצ׳י, כוסמת, פירות ים</p>
          <p>🐟 דגים מועדפים: לברק, דניס, סלמון, טונה, לוקוס, פורל</p>
        </div>

        {saving && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>שומרת...</div>}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>{children}</div>;
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1.5px solid var(--border)',
  fontFamily: 'Heebo, sans-serif',
  fontSize: 13,
  width: 120,
  textAlign: 'center',
};
