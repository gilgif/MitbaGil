'use client';

// ═══════════════════════════════════════════════════════════════════════════
// THE APP'S VISUAL LANGUAGE — one file, one place to change.
//
// These are the professionally-designed assets (built via Claude Design), converted
// from their original SVG files into inline React components. Converted
// programmatically from the original export (see the design handoff) rather than
// hand-transcribed, to avoid transcription errors across 40 files — each one was
// verified to render identically to the source before being pasted in here.
//
// Every illustration in the app comes from here: activity types on the schedule,
// meal categories on the menu, shopping-trip types, status badges, and the action
// buttons. Nothing pulls icons from the database, so restyling the whole app means
// editing this file only.
// ═══════════════════════════════════════════════════════════════════════════

const S = { width: '100%', height: '100%', display: 'block' } as const;

export type IllustrationKind =
  | 'eat' | 'cook' | 'prep' | 'shop' | 'sport' | 'recv' | 'baby' | 'defrost'
  | 'salad' | 'fish' | 'meat' | 'chicken' | 'eggs' | 'soup' | 'legumes' | 'snack' | 'shake'
  | 'burger' | 'vegetables' | 'cucumber'
  | 'done' | 'swap' | 'dislike' | 'settings' | 'close'
  | 'shop-produce' | 'shop-meat' | 'shop-fish' | 'shop-dairy' | 'shop-pantry'
  | 'status-favorite' | 'status-forbidden' | 'status-warning'
  | 'brand';


export function Illustration({ kind }: { kind: IllustrationKind }) {
  switch (kind) {
    case 'eat':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M37 74 C23 78 15 88 19 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M93 74 C107 78 115 88 111 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 112 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 112 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <circle cx="65" cy="66" r="46" fill="#F5A623"></circle>
                    <circle cx="65" cy="66" r="31" fill="none" stroke="#B87313" strokeWidth="4" opacity=".35"></circle>
                    <circle cx="54" cy="60" r="4.6" fill="#171717"></circle><circle cx="76" cy="60" r="4.6" fill="#171717"></circle>
                    <path d="M54 78 Q65 89 76 78" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'cook':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M37 74 C23 78 13 88 17 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M93 74 C107 78 117 88 113 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 112 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 112 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M49 20 C43 14 50 4 57 10" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M73 18 C67 12 74 2 81 8" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <rect x="23" y="32" width="84" height="13" rx="6.5" fill="#B32A73"></rect>
                    <path d="M29 47 H101 L95 106 C94 111 90 114 85 114 H45 C40 114 36 111 35 106 Z" fill="#E8419C"></path>
                    <circle cx="55" cy="74" r="4.6" fill="#171717"></circle><circle cx="75" cy="74" r="4.6" fill="#171717"></circle>
                    <path d="M55 90 Q65 99 75 90" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'prep':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M39 70 C25 74 17 84 21 94" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M91 70 C105 74 113 84 109 94" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 108 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 108 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <rect x="25" y="24" width="80" height="14" rx="7" fill="#2E8F5E"></rect>
                    <path d="M31 40 H99 L93 104 C92 109 88 112 83 112 H47 C42 112 38 109 37 104 Z" fill="#4CAF7D"></path>
                    <circle cx="55" cy="70" r="4.6" fill="#171717"></circle><circle cx="75" cy="70" r="4.6" fill="#171717"></circle>
                    <path d="M55 86 Q65 95 75 86" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'shop':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M41 74 C27 78 19 88 23 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M89 74 C103 78 111 88 107 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 110 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 110 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M47 40 C47 24 55 14 65 14 C75 14 83 24 83 40" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round"></path>
                    <path d="M31 38 H99 L93 108 C92 113 88 116 83 116 H47 C42 116 38 113 37 108 Z" fill="#5B8CE8"></path>
                    <circle cx="55" cy="70" r="4.6" fill="#171717"></circle><circle cx="75" cy="70" r="4.6" fill="#171717"></circle>
                    <path d="M55 86 Q65 96 75 86" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'sport':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M34 56 C20 48 12 38 10 30" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M10 30 L4 34 M10 30 L14 24" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M96 56 C110 48 118 38 120 30" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M120 30 L114 24 M120 30 L126 34" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M51 102 L47 128 M39 130 H55" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M79 102 L83 128 M75 130 H91" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <ellipse cx="65" cy="62" rx="42" ry="46" fill="#4CAF7D"></ellipse>
                    <path d="M23 42 H107" stroke="#171717" strokeWidth="10" opacity=".2"></path>
                    <circle cx="53" cy="64" r="4.6" fill="#171717"></circle><circle cx="77" cy="64" r="4.6" fill="#171717"></circle>
                    <path d="M53 80 Q65 91 77 80" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'recv':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M39 72 C25 76 17 86 21 96" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M91 72 C105 76 113 86 109 96" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 110 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 110 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <rect x="51" y="16" width="28" height="16" rx="6" fill="#F0C33E"></rect>
                    <rect x="27" y="30" width="76" height="80" rx="14" fill="#F0C33E"></rect>
                    <path d="M27 50 H103" stroke="#8A6A00" strokeWidth="4.5" opacity=".3"></path>
                    <path d="M65 30 V110" stroke="#8A6A00" strokeWidth="4.5" opacity=".3"></path>
                    <circle cx="53" cy="76" r="4.6" fill="#171717"></circle><circle cx="77" cy="76" r="4.6" fill="#171717"></circle>
                    <path d="M53 90 Q65 100 77 90" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'baby':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M41 86 C29 90 23 98 26 106" stroke="#171717" strokeWidth="2.8" fill="none" strokeLinecap="round"></path>
                    <path d="M89 86 C101 90 107 98 104 106" stroke="#171717" strokeWidth="2.8" fill="none" strokeLinecap="round"></path>
                    <path d="M55 114 L52 130 M45 132 H59" stroke="#171717" strokeWidth="2.8" fill="none" strokeLinecap="round"></path>
                    <path d="M75 114 L78 130 M71 132 H85" stroke="#171717" strokeWidth="2.8" fill="none" strokeLinecap="round"></path>
                    <circle cx="65" cy="74" r="40" fill="#F2A671"></circle>
                    <path d="M56 30 Q65 14 74 30" stroke="#171717" strokeWidth="4.2" fill="none" strokeLinecap="round"></path>
                    <circle cx="54" cy="72" r="4.4" fill="#171717"></circle><circle cx="76" cy="72" r="4.4" fill="#171717"></circle>
                    <path d="M55 88 Q65 97 75 88" stroke="#171717" strokeWidth="4.2" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'defrost':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M39 72 C25 76 17 86 21 96" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M91 72 C105 76 113 86 109 96" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 112 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 112 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <rect x="29" y="28" width="72" height="82" rx="20" fill="#7FC8F5"></rect>
                    <path d="M39 44 L52 30" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".7"></path>
                    <path d="M39 62 L64 32" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".5"></path>
                    <circle cx="55" cy="72" r="4.6" fill="#171717"></circle><circle cx="75" cy="72" r="4.6" fill="#171717"></circle>
                    <path d="M55 88 Q65 97 75 88" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
                    <path d="M65 118 C61 123 63 129 67 129 C71 129 73 123 69 118 Z" fill="#7FC8F5"></path>
        </svg>
      );
    case 'salad':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M34 52 C26 40 30 26 42 24 C52 22 60 32 56 44 C54 50 44 56 34 52 Z" fill="#4CAF7D"></path>
                    <path d="M86 50 C96 40 94 26 82 24 C72 22 64 32 68 44 C70 50 78 54 86 50 Z" fill="#7ED09B"></path>
                    <path d="M60 46 C50 44 46 34 54 28 C62 22 74 26 74 36 C74 43 68 48 60 46 Z" fill="#D9534F"></path>
                    <circle cx="60" cy="36" r="4" fill="#EE8A87" opacity=".8"></circle>
                    <path d="M18 54 C18 49 24 47 32 47 H88 C96 47 102 49 102 54 C102 62 100 68 96 68 H24 C20 68 18 62 18 54 Z" fill="#F7F2E6"></path>
                    <path d="M24 66 H96 C94 88 80 100 60 100 C40 100 26 88 24 66 Z" fill="#EFE7D8"></path>
                    <path d="M46 76 Q52 69 58 76" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M64 76 Q70 69 76 76" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M52 86 Q61 93 70 85" stroke="#171717" strokeWidth="3.8" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M18 62 C20 40 44 26 66 32 C82 36 92 48 90 62 C88 78 72 90 52 88 C32 86 16 76 18 62 Z" fill="#5B8CE8"></path>
                    <path d="M90 56 C96 48 104 42 110 42 C112 52 112 66 108 76 C100 74 92 66 90 56 Z" fill="#7FA8F0"></path>
                    <path d="M44 40 C52 34 62 34 68 38 C60 44 50 46 44 40 Z" fill="#3E6BC4" opacity=".6"></path>
                    <path d="M34 58 Q40 51 46 58" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M30 70 Q38 77 46 68" stroke="#171717" strokeWidth="3.6" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'meat':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M28 46 C28 28 46 18 66 22 C88 27 102 42 98 62 C94 84 72 96 50 92 C32 88 28 66 28 46 Z" fill="#D9534F"></path>
                    <path d="M40 44 C48 34 62 32 70 38 C62 46 50 50 40 44 Z" fill="#EE8A87" opacity=".7"></path>
                    <path d="M78 62 C86 62 92 68 92 76 C92 84 86 88 78 88 C70 88 64 84 64 76 C64 68 70 62 78 62 Z" fill="#F3B3B1" opacity=".55"></path>
                    <path d="M46 64 Q52 57 58 64" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M64 66 Q70 59 76 66" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M50 78 Q59 86 68 77" stroke="#171717" strokeWidth="3.8" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'chicken':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M30 92 C24 92 20 88 20 82 C20 76 25 72 31 73 C29 67 32 61 39 60 C46 59 51 64 50 71 L58 79 C62 83 62 89 58 93 C54 97 48 97 44 93 L36 85 C35 89 33 92 30 92 Z" fill="#DCC79C"></path>
                    <path d="M72 18 C92 18 106 34 104 54 C102 72 88 82 72 78 C64 76 58 70 56 62 L48 70 C44 74 38 74 34 70 C30 66 30 60 34 56 L46 44 C42 28 54 18 72 18 Z" fill="#E8B04E"></path>
                    <path d="M78 30 C90 32 96 42 94 54 C86 50 78 42 78 30 Z" fill="#F2C878" opacity=".85"></path>
                    <path d="M68 44 Q74 37 80 44" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M86 48 Q91 42 96 49" stroke="#171717" strokeWidth="3.2" fill="none" strokeLinecap="round"></path>
                    <path d="M72 58 Q80 65 88 57" stroke="#171717" strokeWidth="3.6" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'eggs':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M60 14 C82 14 96 44 96 68 C96 92 80 106 60 106 C40 106 24 92 24 68 C24 44 38 14 60 14 Z" fill="#FFFCF2"></path>
                    <path d="M60 50 C76 50 86 60 86 74 C86 88 76 96 60 96 C44 96 34 88 34 74 C34 60 44 50 60 50 Z" fill="#F5A623"></path>
                    <path d="M46 70 Q52 63 58 70" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M64 70 Q70 63 76 70" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M52 82 Q61 90 70 81" stroke="#171717" strokeWidth="3.8" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'soup':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M46 24 C40 18 46 8 53 13" stroke="#B9AFA2" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M68 22 C62 16 68 6 75 11" stroke="#B9AFA2" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M16 44 C16 39 21 36 28 36 H92 C99 36 104 39 104 44 C104 50 99 53 92 53 H28 C21 53 16 50 16 44 Z" fill="#E08A1E"></path>
                    <path d="M22 52 C22 48 26 47 32 47 H88 C94 47 98 48 98 52 C98 80 82 98 60 98 C38 98 22 80 22 52 Z" fill="#F5A623"></path>
                    <path d="M46 66 Q52 59 58 66" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M64 66 Q70 59 76 66" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M52 78 Q61 86 70 77" stroke="#171717" strokeWidth="3.8" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'legumes':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M22 58 C22 52 28 50 36 50 H84 C92 50 98 52 98 58 C98 84 82 100 60 100 C38 100 22 84 22 58 Z" fill="#EFE7D8"></path>
                    <path d="M28 62 C28 58 34 56 42 56 H78 C86 56 92 58 92 62 C92 82 78 94 60 94 C42 94 28 82 28 62 Z" fill="#D9C9A8"></path>
                    <path d="M42 34 C50 34 55 39 55 45 C55 51 50 55 42 55 C34 55 29 51 29 45 C29 39 34 34 42 34 Z" fill="#C98A4B"></path>
                    <path d="M74 30 C82 30 88 35 88 42 C88 49 82 53 74 53 C66 53 60 49 60 42 C60 35 66 30 74 30 Z" fill="#E0A566"></path>
                    <path d="M58 52 C66 52 72 57 72 63 C72 69 66 73 58 73 C50 73 44 69 44 63 C44 57 50 52 58 52 Z" fill="#8FA84E"></path>
                    <path d="M36 66 C43 66 48 70 48 75 C48 80 43 84 36 84 C29 84 24 80 24 75 C24 70 29 66 36 66 Z" fill="#C25E4A"></path>
                    <path d="M80 62 C87 62 92 66 92 71 C92 76 87 80 80 80 C73 80 68 76 68 71 C68 66 73 62 80 62 Z" fill="#B8763F"></path>
                    <path d="M35 44 Q40 39 45 44" stroke="#171717" strokeWidth="2.8" fill="none" strokeLinecap="round"></path>
                    <path d="M68 41 Q73 36 78 41" stroke="#171717" strokeWidth="2.8" fill="none" strokeLinecap="round"></path>
                    <path d="M52 62 Q59 68 66 61" stroke="#171717" strokeWidth="3.2" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'snack':
      return (
        <svg viewBox="0 0 130 145" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M37 74 C23 78 15 88 19 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M93 74 C107 78 115 88 111 98" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M53 112 L49 130 M41 132 H57" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <path d="M77 112 L81 130 M73 132 H89" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path>
                    <circle cx="65" cy="66" r="46" fill="#F5A623"></circle>
                    <circle cx="65" cy="66" r="31" fill="none" stroke="#B87313" strokeWidth="4" opacity=".35"></circle>
                    <circle cx="54" cy="60" r="4.6" fill="#171717"></circle><circle cx="76" cy="60" r="4.6" fill="#171717"></circle>
                    <path d="M54 78 Q65 89 76 78" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'shake':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M28 40 C24 40 22 36 24 32 C30 22 42 16 60 16 C78 16 90 22 96 32 C98 36 96 40 92 40 Z" fill="#EFE7D8"></path>
                    <path d="M24 42 C22 42 21 40 22 38 H98 C99 40 98 42 96 42 Z" fill="#D9C9A8"></path>
                    <path d="M96 6 C101 6 104 11 101 15 L76 46 C73 49 67 47 68 42 L88 10 C90 7 93 6 96 6 Z" fill="#B32A73"></path>
                    <path d="M22 44 H98 L88 100 C86 108 74 112 60 112 C46 112 34 108 32 100 Z" fill="#F79FC4"></path>
                    <path d="M26 52 C34 48 42 56 50 52 C58 48 66 56 74 52 C82 48 90 56 96 52 L92 72 C86 76 78 68 70 72 C62 76 54 68 46 72 C38 76 32 68 28 72 Z" fill="#FFD6EA" opacity=".8"></path>
                    <path d="M44 26 C48 20 56 18 64 20 C56 24 50 26 46 30 Z" fill="#fff" opacity=".5"></path>
                    <path d="M46 78 Q52 71 58 78" stroke="#171717" strokeWidth="3.2" fill="none" strokeLinecap="round"></path>
                    <path d="M64 78 Q70 71 76 78" stroke="#171717" strokeWidth="3.2" fill="none" strokeLinecap="round"></path>
                    <path d="M53 92 Q61 99 69 91" stroke="#171717" strokeWidth="3.6" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'burger':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M22 50 C22 30 38 18 60 18 C82 18 98 30 98 50 C98 55 94 58 88 58 H32 C26 58 22 55 22 50 Z" fill="#F0B24E"></path>
                    <path d="M26 60 C34 56 40 64 48 60 C56 56 62 64 70 60 C78 56 86 64 94 60 C98 62 98 70 94 72 C86 76 78 68 70 72 C62 76 56 68 48 72 C40 76 32 68 26 72 C22 70 22 62 26 60 Z" fill="#7ED09B"></path>
                    <path d="M30 74 C30 68 36 66 44 66 H76 C84 66 90 68 90 74 C90 80 84 84 76 84 H44 C36 84 30 80 30 74 Z" fill="#A9683C"></path>
                    <path d="M26 88 C26 84 30 82 36 82 H84 C90 82 94 84 94 88 C94 98 82 104 60 104 C38 104 26 98 26 88 Z" fill="#E8A64A"></path>
                    <path d="M46 38 Q52 31 58 38" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M64 38 Q70 31 76 38" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'vegetables':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M48 66 H72 C76 66 78 70 77 76 C75 92 72 104 60 104 C48 104 45 92 43 76 C42 70 44 66 48 66 Z" fill="#A8D8B8"></path>
                    <path d="M60 68 C46 68 38 70 34 66 C24 64 20 52 28 44 C26 34 34 26 44 28 C48 18 62 16 68 24 C78 18 90 24 90 34 C98 38 100 50 92 56 C94 64 86 70 76 68 C72 70 66 68 60 68 Z" fill="#4CAF7D"></path>
                    <circle cx="38" cy="46" r="9" fill="#3E9B6C" opacity=".55"></circle>
                    <circle cx="60" cy="36" r="10" fill="#5CBC8B" opacity=".7"></circle>
                    <circle cx="82" cy="46" r="9" fill="#3E9B6C" opacity=".55"></circle>
                    <circle cx="48" cy="60" r="7" fill="#5CBC8B" opacity=".5"></circle>
                    <circle cx="74" cy="60" r="7" fill="#5CBC8B" opacity=".5"></circle>
                    <path d="M50 52 Q56 45 62 52" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M68 52 Q74 45 80 52" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M56 62 Q64 68 72 61" stroke="#171717" strokeWidth="3.6" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'cucumber':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M78 12 C82 12 84 16 82 20 C80 23 76 23 74 20 C72 16 74 12 78 12 Z" fill="#3E9B6C"></path>
                    <path d="M84 24 C96 32 96 52 86 74 C76 96 58 108 44 104 C30 100 26 82 34 62 C42 40 62 16 78 20 C81 20 83 22 84 24 Z" fill="#5CBC8B"></path>
                    <path d="M76 30 C86 38 84 56 76 72 C72 58 70 42 76 30 Z" fill="#82D6A8" opacity=".75"></path>
                    <path d="M48 92 C40 84 40 68 46 56" stroke="#3E9B6C" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".45"></path>
                    <path d="M44 62 Q50 55 56 62" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M62 66 Q68 59 74 66" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
                    <path d="M48 78 Q56 85 64 77" stroke="#171717" strokeWidth="3.6" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'done':
      return (
        <svg viewBox="0 0 24 24" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 12.5 L9.5 17.5 L19.5 6" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      );
    case 'swap':
      return (
        <svg viewBox="0 0 24 24" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10 C4 6 7.5 3.5 11.5 3.5 C15 3.5 17.5 5.2 19 7.8" stroke="#171717" strokeWidth="2.6" fill="none" strokeLinecap="round"></path><path d="M19 7.8 L19.4 3.6 M19 7.8 L15 7" stroke="#171717" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 14 C20 18 16.5 20.5 12.5 20.5 C9 20.5 6.5 18.8 5 16.2" stroke="#171717" strokeWidth="2.6" fill="none" strokeLinecap="round"></path><path d="M5 16.2 L4.6 20.4 M5 16.2 L9 17" stroke="#171717" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      );
    case 'dislike':
      return (
        <svg viewBox="0 0 24 24" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M7 3.5 H15.5 C17 3.5 18 4.6 18 6 V12.5 C18 13.6 17.4 14.4 16.4 15.2 L12.6 20.2 C11.6 21.4 9.6 20.8 9.6 19.2 V15.2 H7 C5.6 15.2 4.5 14.1 4.5 12.7 V6 C4.5 4.6 5.6 3.5 7 3.5 Z" fill="none" stroke="#171717" strokeWidth="2.4" strokeLinejoin="round"></path>
        </svg>
      );

    case 'settings':
      return (
        <svg viewBox="0 0 24 24" style={S} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="7" fill="none" stroke="#171717" strokeWidth="3.2"></circle><circle cx="12" cy="12" r="2.6" fill="none" stroke="#171717" strokeWidth="2.2"></circle><path d="M19 12 H22.5M16.95 7.05 L19.42 4.58M12 5 V1.5M7.05 7.05 L4.58 4.58M5 12 H1.5M7.05 16.95 L4.58 19.42M12 19 V22.5M16.95 16.95 L19.42 19.42" stroke="#171717" strokeWidth="3"></path>
        </svg>
      );
    case 'close':
      return (
        <svg viewBox="0 0 24 24" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="#171717" strokeWidth="3.2" strokeLinecap="round"></path>
        </svg>
      );
    case 'shop-produce':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M46 42 C44 26 51 16 60 16 C69 16 76 26 74 42" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round"></path>
                    <path d="M30 44 C30 40 33 37 37 37 H83 C87 37 90 40 90 44 L86 98 C85 107 78 113 69 113 H51 C42 113 35 107 34 98 Z" fill="#4CAF7D"></path>
                    <path d="M60 58 C60 48 68 42 79 43 C78 55 70 62 60 62 Z" fill="#fff" opacity=".92"></path>
                    <path d="M60 62 C60 52 52 46 41 47 C42 59 50 66 60 66 Z" fill="#fff" opacity=".72"></path>
                    <path d="M60 64 C60 74 60 82 60 90" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".9"></path>
        </svg>
      );
    case 'shop-meat':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M46 42 C44 26 51 16 60 16 C69 16 76 26 74 42" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round"></path>
                    <path d="M30 44 C30 40 33 37 37 37 H83 C87 37 90 40 90 44 L86 98 C85 107 78 113 69 113 H51 C42 113 35 107 34 98 Z" fill="#D9534F"></path>
                    <path d="M44 66 C44 55 54 48 65 50 C77 53 84 62 81 73 C78 85 66 91 54 87 C47 84 44 76 44 66 Z" fill="#fff" opacity=".92"></path>
                    <path d="M64 62 C71 62 75 66 75 71 C75 76 71 79 65 79 C59 79 55 75 55 70 C55 65 59 62 64 62 Z" fill="#D9534F" opacity=".5"></path>
        </svg>
      );
    case 'shop-fish':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M46 42 C44 26 51 16 60 16 C69 16 76 26 74 42" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round"></path>
                    <path d="M30 44 C30 40 33 37 37 37 H83 C87 37 90 40 90 44 L86 98 C85 107 78 113 69 113 H51 C42 113 35 107 34 98 Z" fill="#5B8CE8"></path>
                    <path d="M38 74 C44 60 60 56 72 66 C66 82 48 86 38 74 Z" fill="#fff" opacity=".92"></path>
                    <path d="M72 66 C78 61 84 59 87 61 C88 67 86 75 82 79 C77 77 73 72 72 66 Z" fill="#fff" opacity=".8"></path>
                    <circle cx="50" cy="71" r="3" fill="#5B8CE8"></circle>
        </svg>
      );
    case 'shop-dairy':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M46 42 C44 26 51 16 60 16 C69 16 76 26 74 42" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round"></path>
                    <path d="M30 44 C30 40 33 37 37 37 H83 C87 37 90 40 90 44 L86 98 C85 107 78 113 69 113 H51 C42 113 35 107 34 98 Z" fill="#F0C33E"></path>
                    <path d="M42 88 C40 74 44 64 56 58 C68 52 78 58 82 70 C86 84 78 92 66 93 C55 94 44 94 42 88 Z" fill="#fff" opacity=".92"></path>
                    <circle cx="56" cy="76" r="4.5" fill="#F0C33E" opacity=".8"></circle>
                    <circle cx="71" cy="81" r="3.2" fill="#F0C33E" opacity=".8"></circle>
        </svg>
      );
    case 'shop-pantry':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M46 42 C44 26 51 16 60 16 C69 16 76 26 74 42" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round"></path>
                    <path d="M30 44 C30 40 33 37 37 37 H83 C87 37 90 40 90 44 L86 98 C85 107 78 113 69 113 H51 C42 113 35 107 34 98 Z" fill="#B98A5E"></path>
                    <path d="M46 62 C46 57 50 54 56 54 H66 C72 54 76 57 76 62 C78 74 79 84 78 92 C77 96 70 96 61 96 C52 96 45 96 44 92 C43 84 44 74 46 62 Z" fill="#fff" opacity=".92"></path>
                    <path d="M52 76 C58 74 66 74 70 76" stroke="#B98A5E" strokeWidth="4" fill="none" strokeLinecap="round"></path>
        </svg>
      );

    case 'status-favorite':
      return (
        <svg viewBox="0 0 60 60" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M30 5 C33 5 34.5 8 36 14 C37.5 20 40 22 46 23 C52 24 55 25.5 55 28.5 C55 31.5 52 33.5 47 37 C42 40.5 41 43.5 42 49 C43 54.5 41.5 57 38.5 57 C35.5 57 33 55 30 51.5 C27 55 24.5 57 21.5 57 C18.5 57 17 54.5 18 49 C19 43.5 18 40.5 13 37 C8 33.5 5 31.5 5 28.5 C5 25.5 8 24 14 23 C20 22 22.5 20 24 14 C25.5 8 27 5 30 5 Z" fill="#F5A623"></path><path d="M22 30 Q27 24 32 30" stroke="#171717" strokeWidth="3.2" fill="none" strokeLinecap="round"></path><path d="M37 31 Q41 26 45 31" stroke="#171717" strokeWidth="3" fill="none" strokeLinecap="round"></path><path d="M26 40 Q32 46 38 39" stroke="#171717" strokeWidth="3.4" fill="none" strokeLinecap="round"></path>
        </svg>
      );
    case 'status-forbidden':
      return (
        <svg viewBox="0 0 60 60" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M30 6 C43 6 54 17 54 30 C54 43 43 54 30 54 C17 54 6 43 6 30 C6 17 17 6 30 6 Z" fill="#D9534F"></path><path d="M19.5 36.5 C18 35 18 32.5 19.5 31 L31 19.5 C32.5 18 35 18 36.5 19.5 C38 21 38 23.5 36.5 25 L25 36.5 C23.5 38 21 38 19.5 36.5 Z" fill="#fff"></path>
        </svg>
      );
    case 'status-warning':
      return (
        <svg viewBox="0 0 60 60" style={S} xmlns="http://www.w3.org/2000/svg">
          <path d="M24.5 11 C27 6.6 33 6.6 35.5 11 L54 43 C56.5 47.4 53.5 53 48.5 53 H11.5 C6.5 53 3.5 47.4 6 43 Z" fill="#F0C33E"></path><path d="M30 22 C31.8 22 33.2 23.6 33 25.4 L32 35.4 C31.9 36.8 30.9 37.8 30 37.8 C29.1 37.8 28.1 36.8 28 35.4 L27 25.4 C26.8 23.6 28.2 22 30 22 Z" fill="#171717"></path><circle cx="30" cy="44" r="3.2" fill="#171717"></circle>
        </svg>
      );

    case 'brand':
      return (
        <svg viewBox="0 0 120 120" style={S} xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="34" fill="#E8419C"></rect><g transform="translate(11,14) scale(0.83)"><path d="M44 20 C38 13 45 3 52 9" stroke="#ffffff" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity=".7"></path><path d="M70 18 C64 11 71 1 78 7" stroke="#ffffff" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity=".7"></path><path d="M22 32 C22 27 26 24 31 24 H89 C94 24 98 28 97 33 L95 42 H24 Z" fill="#ffffff"></path><path d="M26 46 C26 43 28 41 31 41 H89 C92 41 94 43 94 46 L89 100 C88 110 80 116 70 116 H50 C40 116 32 110 31 100 Z" fill="#FFD6EA"></path><circle cx="48" cy="70" r="5" fill="#171717"></circle><circle cx="72" cy="70" r="5" fill="#171717"></circle><path d="M48 86 Q60 97 72 86" stroke="#171717" strokeWidth="4.4" fill="none" strokeLinecap="round"></path></g>
        </svg>
      );
    default:
      return <Illustration kind="eat" />;
  }
}

// ── Mapping helpers ─────────────────────────────────────────────────────────
// The illustration is derived from what a thing IS, rather than stored per row.
// That's what makes a restyle a one-file change.

// Meal category → illustration. Falls back to a generic meal mark.
export function illustrationForMeal(opts: {
  tags?: string[] | null;
  mealSlot?: string | null;
  name?: string | null;
}): IllustrationKind {
  const hay = `${opts.name || ''} ${(opts.tags || []).join(' ')}`;

  if (opts.mealSlot === 'snack') return 'snack';
  if (/שייק|סמות׳י|smoothie/i.test(hay)) return 'shake';
  // "X עם סלט" ("X with salad") is a side addition, not a salad-style meal — only a
  // name that OPENS with סלט genuinely reads as one. Mirrors the same distinction
  // menuLogic.ts uses for the day-planning category rules, kept in sync deliberately.
  if (/^סלט\b/.test((opts.name || '').trim())) return 'salad';
  if (/מרק|soup/.test(hay)) return 'soup';
  if (/דג|סלמון|לברק|דניס|פורל|לוקוס|טונה|סרדינים/.test(hay)) return 'fish';
  if (/המבורגר/.test(hay)) return 'burger';
  if (/עוף|הודו|שניצל/.test(hay)) return 'chicken';
  if (/בשר|בקר|קציצ|שומר/.test(hay)) return 'meat';
  if (/ביצ|חבית|שקשוקה|פריטטה|אומלט/.test(hay)) return 'eggs';
  if (/עדש|חומוס|קטני|קינואה|כוסמת|אמרנט|דוחן/.test(hay)) return 'legumes';
  if (/מלפפון/.test(hay)) return 'cucumber';
  if (/ירק/.test(hay)) return 'vegetables';
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

// ── Action button icons ──

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

export function SettingsIcon({ size = 22 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Illustration kind="settings" />
    </div>
  );
}

export function CloseIcon({ size = 22 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Illustration kind="close" />
    </div>
  );
}
