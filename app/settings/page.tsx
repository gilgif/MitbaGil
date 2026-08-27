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
            ימי אימון: שני, שלישי, חמישי, שישי · בשלישי וחמישי אפשר ריצה במקום · בשלישי גם ריקוד
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

        <SectionTitle>מטרות־על</SectionTitle>
        <InfoCard note="מה שהאפליקציה כולה משרתת — כל הצעת ארוחה נשקלת מולן">
          {(settings.core_goals || []).map((g, i) => (
            <div key={i} style={{ padding: '5px 0', fontSize: 13, color: 'var(--text-2)' }}>
              • {g}
            </div>
          ))}
        </InfoCard>

        <SectionTitle>כללי בניית התפריט</SectionTitle>
        <InfoCard note="קבוע בקוד — משפיע ישירות על התפריט שנוצר">
          <Rule label="מבנה יומי">
            היום מתוכנן כמכלול — כל שילוב של 3 ארוחות מנוקד יחד מול יעדי החלבון,
            הקלוריות והאיזון, ולא ארוחה-ארוחה בנפרד
          </Rule>
          <Rule label="מנות טריות ליום">לפחות 1, בכל עונה</Rule>
          <Rule label="מאמץ מול יום">
            ימי משרד ואימון — ארוחות קלות · שישי-שבת — מקום לבישול מורכב
          </Rule>
          <Rule label="בישול מרוכז">
            מנות מורכבות מסומנות כמתאימות לבישול פעם אחת ואכילה מספר ימים,
            לפי כמה שהן נשמרות בקירור
          </Rule>
          <Rule label="מנות מבושלות ליום">לפחות 1</Rule>
          <Rule label="ימי משרד">בוקר וצהריים קבועים ולא ניתנים להחלפה</Rule>
          <Rule label="נשנוש אחה״צ">
            אופציונלי לגמרי — לא נספר בחלבון ולא בקלוריות, ולא משמש לסגירת פערים
          </Rule>
          <Rule label="נשנושי חירום (21:00)">לעיון ידני בלבד — לא נבחרים אוטומטית</Rule>
          <Rule label="עדיפות בהתנגשות">
            חלבון קודם לדיוק קלורי — יום שעומד בחלבון עדיף על יום קלורי מושלם
          </Rule>
        </InfoCard>

        <SectionTitle>שעות קבועות</SectionTitle>
        <InfoCard note="קבוע בקוד — קובע את הלו״ז">
          <Rule label="ארוחות">בוקר 09:15 · צהריים 13:00 · ערב 18:00</Rule>
          <Rule label="נשנוש">15:00</Rule>
          <Rule label="בישול">45 דק׳ לפני הארוחה</Rule>
          <Rule label="הכנה מראש">90 דק׳ לפני הארוחה</Rule>
          <Rule label="הפשרה מהקפאה">18:00, בערב שלפני הבישול</Rule>
          <Rule label="הזמנת ירקות">שני 10:30 · רביעי 10:00</Rule>
          <Rule label="קבלת משלוח">שלישי וחמישי 19:00</Rule>
          <Rule label="קניית בשר/דגים/יבשים">09:00 ביום הקנייה</Rule>
        </InfoCard>

        <SectionTitle>העדפות מזון</SectionTitle>
        <InfoCard note="מנחה חיפוש והוספה של מתכונים חדשים">
          {settings.disliked_foods?.length > 0 && (
            <Rule label="🚫 לא נכלל">{settings.disliked_foods.join(' · ')}</Rule>
          )}
          {settings.preferred_fish?.length > 0 && (
            <Rule label="🐟 דגים מועדפים">{settings.preferred_fish.join(' · ')}</Rule>
          )}
          {settings.always_available_fruit?.length > 0 && (
            <Rule label="🍎 פירות תמיד בבית">{settings.always_available_fruit.join(' · ')}</Rule>
          )}
          {settings.preferred_cuisine && <Rule label="🫒 סגנון מועדף">{settings.preferred_cuisine}</Rule>}
        </InfoCard>

        <SectionTitle>הנחיות תזונאית</SectionTitle>
        <InfoCard note="שאיפה כללית, לא כלל נוקשה">
          {(settings.dietitian_guidelines || []).map((g, i) => (
            <div key={i} style={{ padding: '5px 0', fontSize: 13, color: 'var(--text-2)' }}>
              • {g}
            </div>
          ))}
        </InfoCard>

        <SectionTitle>אילוצי חיים</SectionTitle>
        <InfoCard note="נלקח בחשבון בבחירת סוג המתכונים">
          {(settings.lifestyle_notes || []).map((n, i) => (
            <div key={i} style={{ padding: '5px 0', fontSize: 13, color: 'var(--text-2)' }}>
              • {n}
            </div>
          ))}
        </InfoCard>

        {saving && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>שומרת...</div>}
      </div>
    </div>
  );
}

// A read-only card for rules the user can't edit here, with a short line explaining
// where the rule actually lives (code vs. reference-only) so nothing looks editable
// when it isn't.
function InfoCard({ note, children }: { note: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 16, marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10 }}>{note}</div>
      {children}
    </div>
  );
}

function Rule({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '6px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{children}</div>
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
