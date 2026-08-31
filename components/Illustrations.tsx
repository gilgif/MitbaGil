'use client';

// ═══════════════════════════════════════════════════════════════════════════
// THE APP'S VISUAL LANGUAGE — one file, one place to change.
//
// Every illustration in the app comes from here: activity types on the schedule,
// meal categories on the menu, and the action buttons. Nothing pulls icons from
// the database any more, so restyling the whole app means editing this file only,
// rather than updating emoji stored across 150+ recipe rows.
//
// The style is the one from the original prototype: simple round blob characters,
// flat colour, thin black limbs poking out, dot eyes and a curved smile.
// ═══════════════════════════════════════════════════════════════════════════

const INK = '#1a1a1a';

// Stick arms and legs, drawn behind the body so they read as limbs poking out.
// Thick, colour-matched limbs — like the sport character's headband-purple arms —
// rather than thin black lines. Each caller passes its own body colour so the limbs
// read as part of the same character instead of a separate black outline.
const Limbs = ({ color = INK, width = 10 }: { color?: string; width?: number }) => (
  <>
    <path d="M24 92 L4 112" stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
    <path d="M112 92 L132 112" stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
    <path d="M48 130 L40 152" stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
    <path d="M88 130 L96 152" stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
  </>
);

// A face at a given vertical position — every character shares the same expression.
const Face = ({ cy, spread = 16 }: { cy: number; spread?: number }) => (
  <>
    <circle cx={68 - spread} cy={cy} r="5" fill={INK} />
    <circle cx={68 + spread} cy={cy} r="5" fill={INK} />
    <path
      d={`M${68 - spread} ${cy + 18} Q68 ${cy + 28} ${68 + spread} ${cy + 18}`}
      stroke={INK}
      strokeWidth="4.5"
      fill="none"
      strokeLinecap="round"
    />
  </>
);

export type IllustrationKind =
  // activity types
  | 'eat' | 'cook' | 'prep' | 'shop' | 'sport' | 'recv' | 'baby'
  // meal categories
  | 'salad' | 'fish' | 'meat' | 'chicken' | 'eggs' | 'soup' | 'legumes' | 'snack' | 'shake'
  // actions
  | 'swap' | 'dislike'
  // states
  | 'done';

const S = { width: '100%', height: '100%', display: 'block' } as const;

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 136 156" style={S} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function Illustration({ kind }: { kind: IllustrationKind }) {
  switch (kind) {
    // ── Completed state ──
    case 'done':
      return (
        <Svg>
          <circle cx="68" cy="68" r="58" fill="#6ee7a0" />
          <path
            d="M42 70 L60 88 L96 48"
            stroke="#16341f"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    // ── Activity: a meal — apple with stem and leaf ──
    case 'eat':
      return (
        <Svg>
          <Limbs color="#F5A623" />
          <path
            d="M68 40 C40 40 24 62 26 86 C28 108 46 122 68 122 C90 122 108 108 110 86 C112 62 96 40 68 40 Z"
            fill="#F5A623"
          />
          <path d="M68 40 C64 32 64 24 68 18" stroke="#7a4a10" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M68 24 C76 18 86 20 88 28 C82 32 72 32 68 24 Z" fill="#4CAF7D" />
          <Face cy={80} />
        </Svg>
      );

    // ── Activity: cooking — flower-shaped pot ──
    case 'cook':
      return (
        <Svg>
          <Limbs color="#E0459B" />
          <path
            d="M68 26 C80 26 85 40 80 49 C94 42 107 56 100 67 C115 64 123 81 112 91 C118 105 104 120 87 114 C84 126 66 130 55 120 C40 128 22 118 26 103 C11 99 6 82 19 73 C11 61 22 44 39 47 C38 32 54 26 68 26 Z"
            fill="#E0459B"
          />
          <Face cy={82} spread={16} />
        </Svg>
      );

    // ── Activity: meal prep — capsule character ──
    case 'prep':
      return (
        <Svg>
          <Limbs color="#4CAF7D" />
          <rect x="30" y="14" width="76" height="116" rx="38" fill="#4CAF7D" />
          <rect x="30" y="44" width="76" height="8" fill={INK} opacity=".18" />
          <Face cy={80} spread={16} />
        </Svg>
      );

    // ── Activity: shopping — bag with handle ──
    case 'shop':
      return (
        <Svg>
          <Limbs color="#5B8CE8" />
          <path
            d="M46 46 C46 30 58 20 68 20 C78 20 90 30 90 46"
            fill="none"
            stroke="#5B8CE8"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d="M34 46 L102 46 L94 122 C93 128 88 132 82 132 L54 132 C48 132 43 128 42 122 Z" fill="#5B8CE8" />
          <Face cy={82} spread={14} />
        </Svg>
      );

    // ── Activity: training — round body with headband ──
    case 'sport':
      return (
        <Svg>
          <path d="M20 104 L4 122" stroke="#8B6FE0" strokeWidth="10" strokeLinecap="round" />
          <path d="M116 104 L132 122" stroke="#8B6FE0" strokeWidth="10" strokeLinecap="round" />
          <path d="M50 132 L42 150" stroke="#8B6FE0" strokeWidth="10" strokeLinecap="round" />
          <path d="M86 132 L94 150" stroke="#8B6FE0" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="68" cy="76" rx="46" ry="50" fill="#8B6FE0" />
          <rect x="22" y="52" width="92" height="14" fill={INK} opacity=".18" />
          <Face cy={86} />
        </Svg>
      );

    // ── Activity: delivery — parcel with tape ──
    case 'recv':
      return (
        <Svg>
          <Limbs color="#F0C33E" />
          <rect x="24" y="42" width="88" height="80" rx="14" fill="#F0C33E" />
          <path d="M24 62 H112" stroke="#7a5a00" strokeWidth="5" opacity=".35" />
          <path d="M68 42 V122" stroke="#7a5a00" strokeWidth="5" opacity=".35" />
          <rect x="52" y="28" width="32" height="18" rx="6" fill="#F0C33E" />
          <Face cy={90} />
        </Svg>
      );

    // ── Activity: the toddler ──
    case 'baby':
      return (
        <Svg>
          <path d="M42 100 L30 118" stroke="#F2A671" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M94 100 L106 118" stroke="#F2A671" strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="68" cy="78" r="48" fill="#F2A671" />
          <path d="M60 26 Q68 12 76 26" stroke="#7a4a10" strokeWidth="5" fill="none" strokeLinecap="round" />
          <Face cy={76} spread={14} />
        </Svg>
      );

    // ── Meal category: salad — leafy bowl ──
    case 'salad':
      return (
        <Svg>
          <Limbs color="#7BC96F" />
          <path d="M50 44 C44 26 62 18 68 32 C76 18 92 28 84 44" fill="#4CAF7D" />
          <path d="M22 56 L114 56 C112 100 94 124 68 124 C42 124 24 100 22 56 Z" fill="#7BC96F" />
          <Face cy={84} />
        </Svg>
      );

    // ── Meal category: fish ──
    case 'fish':
      return (
        <Svg>
          <Limbs color="#5BB8D4" />
          <ellipse cx="62" cy="82" rx="44" ry="34" fill="#5BB8D4" />
          <path d="M104 82 L128 60 L128 104 Z" fill="#5BB8D4" />
          <circle cx="46" cy="74" r="5" fill={INK} />
          <path d="M40 94 Q54 102 66 94" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </Svg>
      );

    // ── Meal category: red meat ──
    case 'meat':
      return (
        <Svg>
          <Limbs color="#D4675B" />
          <path
            d="M34 56 C34 34 58 24 74 32 C96 24 112 44 106 66 C118 78 110 104 90 108 C78 124 48 122 40 104 C22 98 20 70 34 56 Z"
            fill="#D4675B"
          />
          <Face cy={78} />
        </Svg>
      );

    // ── Meal category: chicken/poultry ──
    case 'chicken':
      return (
        <Svg>
          <Limbs color="#E8A87C" />
          <ellipse cx="68" cy="82" rx="44" ry="42" fill="#E8A87C" />
          <path d="M56 40 Q68 22 80 40" fill="#D4675B" />
          <Face cy={82} />
        </Svg>
      );

    // ── Meal category: eggs ──
    case 'eggs':
      return (
        <Svg>
          <Limbs color="#F7EDD4" />
          <path
            d="M68 24 C92 24 106 58 106 82 C106 106 89 122 68 122 C47 122 30 106 30 82 C30 58 44 24 68 24 Z"
            fill="#F7EDD4"
          />
          <circle cx="68" cy="90" r="16" fill="#F5C242" />
          <Face cy={70} spread={13} />
        </Svg>
      );

    // ── Meal category: soup — bowl with steam ──
    case 'soup':
      return (
        <Svg>
          <Limbs color="#E8944A" />
          <path d="M56 26 Q64 16 60 8" stroke="#B0B8C4" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M80 26 Q88 16 84 8" stroke="#B0B8C4" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M20 52 L116 52 C114 98 94 124 68 124 C42 124 22 98 20 52 Z" fill="#E8944A" />
          <rect x="14" y="44" width="108" height="12" rx="6" fill="#D4783A" />
          <Face cy={86} />
        </Svg>
      );

    // ── Meal category: legumes/grains ──
    case 'legumes':
      return (
        <Svg>
          <Limbs color="#C9A961" />
          <path d="M32 60 C32 36 104 36 104 60 L98 116 C97 124 90 128 68 128 C46 128 39 124 38 116 Z" fill="#C9A961" />
          <circle cx="52" cy="52" r="9" fill="#A88B45" />
          <circle cx="84" cy="52" r="9" fill="#A88B45" />
          <Face cy={86} />
        </Svg>
      );

    // ── Meal category: snack ──
    case 'snack':
      return (
        <Svg>
          <Limbs color="#E8B4CB" />
          <circle cx="68" cy="82" r="42" fill="#E8B4CB" />
          <circle cx="52" cy="66" r="6" fill="#C4879E" />
          <circle cx="86" cy="72" r="5" fill="#C4879E" />
          <circle cx="74" cy="98" r="5" fill="#C4879E" />
          <Face cy={82} />
        </Svg>
      );

    // ── Action: swap this meal — character with circular arrows around it ──
    case 'swap':
      return (
        <Svg>
          <Limbs color="#5B8CE8" />
          <circle cx="68" cy="84" r="40" fill="#5B8CE8" />
          <path
            d="M34 40 A34 34 0 0 1 96 34"
            stroke="#5B8CE8"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M98 22 L104 40 L86 42 Z" fill="#5B8CE8" />
          <circle cx="56" cy="80" r="5" fill={INK} />
          <circle cx="80" cy="80" r="5" fill={INK} />
          <path
            d="M54 98 Q68 108 82 98"
            stroke={INK}
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    // ── Action: didn't like it — same character, unimpressed mouth ──
    case 'dislike':
      return (
        <Svg>
          <Limbs color="#E88B8B" />
          <circle cx="68" cy="80" r="42" fill="#E88B8B" />
          <path d="M50 66 L62 74" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M86 66 L74 74" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <circle cx="55" cy="82" r="5" fill={INK} />
          <circle cx="81" cy="82" r="5" fill={INK} />
          <path
            d="M54 106 Q68 96 82 106"
            stroke={INK}
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );

    // ── Meal category: shake/smoothie ──
    case 'shake':
      return (
        <Svg>
          <Limbs color="#9BCB6B" />
          <path d="M40 34 L96 34 L88 120 C87 126 82 130 76 130 L60 130 C54 130 49 126 48 120 Z" fill="#9BCB6B" />
          <rect x="60" y="10" width="8" height="28" rx="4" fill="#5B8CE8" transform="rotate(12 64 24)" />
          <Face cy={84} spread={14} />
        </Svg>
      );

    default:
      return <Illustration kind="eat" />;
  }
}

// ── Mapping helpers ─────────────────────────────────────────────────────────
// The illustration is derived from what a thing IS, rather than stored per row.
// That's what makes a restyle a one-file change.

// Meal category → illustration. Falls back to a generic meal apple.
export function illustrationForMeal(opts: {
  tags?: string[] | null;
  mealSlot?: string | null;
  name?: string | null;
}): IllustrationKind {
  const hay = `${opts.name || ''} ${(opts.tags || []).join(' ')}`;

  if (opts.mealSlot === 'snack') return 'snack';
  if (/שייק|סמות׳י|smoothie/i.test(hay)) return 'shake';
  if (/סלט|salad/.test(hay)) return 'salad';
  if (/מרק|soup/.test(hay)) return 'soup';
  if (/דג|סלמון|לברק|דניס|פורל|לוקוס|טונה/.test(hay)) return 'fish';
  if (/עוף|הודו|שניצל/.test(hay)) return 'chicken';
  if (/בשר|בקר|קציצ|המבורגר|שומר/.test(hay)) return 'meat';
  if (/ביצ|חביתה|שקשוקה|פריטטה|אומלט/.test(hay)) return 'eggs';
  if (/עדש|חומוס|קטני|קינואה|כוסמת|אמרנט|דוחן/.test(hay)) return 'legumes';
  return 'eat';
}

// Small round stage the illustration sits on, matching the card styling.
export function IllustrationStage({
  kind,
  size = 44,
  bg,
}: {
  kind: IllustrationKind;
  size?: number;
  bg?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg || 'var(--bg2)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '82%', height: '82%' }}>
        <Illustration kind={kind} />
      </div>
    </div>
  );
}

// ── Action buttons ─────────────────────────────────────────────────────────
// These use the same blob characters as everything else, so the buttons feel
// part of the app rather than generic UI chrome.

export function SwapIcon({ size = 22 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Illustration kind="swap" />
    </div>
  );
}

export function DislikeIcon({ size = 22 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Illustration kind="dislike" />
    </div>
  );
}

export function ApproveIcon({ size = 22 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Illustration kind="done" />
    </div>
  );
}
