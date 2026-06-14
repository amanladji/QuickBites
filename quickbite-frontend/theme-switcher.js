/**
 * QuickBite — Palette Switcher
 * ─────────────────────────────────────────────────────────────
 * A floating, accessible theme switcher with 6 palettes.
 * Applies palettes via CSS custom properties + section overrides.
 * Persists selection in localStorage.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── STORAGE KEY ─────────────────────────────────────────── */
  const STORAGE_KEY = 'qb-palette';
  const DEFAULT_ID  = 'midnight-slate';


  /* ═══════════════════════════════════════════════════════════
     PALETTE DEFINITIONS
     Each palette has:
     • id       — machine name
     • name     — display name
     • desc     — short descriptor
     • swatches — 3 hex colors [brand, bg, text]
     • vars     — CSS custom property overrides for :root
     • css      — extra CSS for section-specific hardcoded values
     ════════════════════════════════════════════════ */

  const PALETTES = [

    /* ── 1. Midnight Slate (default — Electric Indigo on Deep Dark) ── */
    {
      id   : 'midnight-slate',
      name : 'Midnight Slate',
      desc : 'Electric Indigo · Deep Dark',
      swatches: ['#6366F1', '#0A0A0F', '#F1F5F9'],
      vars : {
        '--brand-orange' : '#6366F1',
        '--brand-deep'   : '#4F46E5',
        '--brand-light'  : '#1E1E3A',
        '--bg-main'      : '#0A0A0F',
        '--bg-section'   : '#0F0F1A',
        '--surface-white': '#111118',
        '--surface-cream': '#1A1A2E',
        '--text-primary' : '#F1F5F9',
        '--text-secondary':'#94A3B8',
        '--text-muted'   : '#475569',
        '--border-light' : '#1E293B',
        '--border-medium': '#243044',
        '--green'     : '#10B981',
        '--green-bg'  : '#022C22',
        '--red'       : '#F87171',
        '--red-bg'    : '#2D1515',
        '--amber'     : '#F59E0B',
        '--amber-bg'  : '#2D2000',
        '--blue'      : '#38BDF8',
        '--blue-bg'   : '#0C1A2E',
        '--purple'    : '#A78BFA',
        '--purple-bg' : '#1A1030',
        '--shadow-sm'  : '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        '--shadow-md'  : '0 4px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
        '--shadow-lg'  : '0 10px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
        '--shadow-card': '0 2px 8px rgba(0,0,0,0.4)',
      },
      css: `
        body { background-color: #0A0A0F; }
        .announcement-bar { background: linear-gradient(90deg,#4F46E5,#6366F1,#4F46E5); }
        .site-footer { background: #05050A; }
        .hero::before { background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%); }
        .hero-title .highlight { background: linear-gradient(135deg,#6366F1,#38BDF8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .loyalty-strip { background: linear-gradient(135deg,#F59E0B,#D97706); }
        .night-owl { background: #0A0808; border-color: #1C1917; }
        .night-card { background: #141210; border-color: #292524; }
        .offer-card-2 { background: linear-gradient(135deg,#1C1917,#292524); }
        .offer-card-3 { background: linear-gradient(135deg,#16A34A,#15803D); }
        .app-section { background: linear-gradient(135deg,#4F46E5,#3730A3,#1E1B8A); border-color:#3730A3; }
        .partner-card-restaurant { background: linear-gradient(135deg,#1A1A2E,#1A1A40); border-color:rgba(99,102,241,0.2); }
        .partner-card-rider { background: linear-gradient(135deg,#0C1A2E,#0A2440); border-color:rgba(56,189,248,0.2); }
        .newsletter-section { background: #0F0F1A; }
        .logo-icon { background: linear-gradient(135deg,#6366F1,#4F46E5); }
      `,
    },

    /* ── 2. Sunrise Orange ── */
    {
      id   : 'sunrise-orange',
      name : 'Sunrise Orange',
      desc : 'Warm Tangerine · Light Cream',
      swatches: ['#FF6B35', '#FFFBF7', '#1C0A00'],
      vars : {
        '--brand-orange' : '#FF6B35',
        '--brand-deep'   : '#E85D04',
        '--brand-light'  : '#FFF3EE',
        '--bg-main'      : '#FFFBF7',
        '--bg-section'   : '#FFF8F3',
        '--surface-white': '#FFFFFF',
        '--surface-cream': '#FFF3EE',
        '--text-primary' : '#1C0A00',
        '--text-secondary':'#78350F',
        '--text-muted'   : '#B45309',
        '--border-light' : '#FDE8D8',
        '--border-medium': '#FDCFB0',
        '--green'     : '#16A34A',
        '--green-bg'  : '#DCFCE7',
        '--red'       : '#DC2626',
        '--red-bg'    : '#FEE2E2',
        '--amber'     : '#D97706',
        '--amber-bg'  : '#FEF3C7',
        '--blue'      : '#2563EB',
        '--blue-bg'   : '#DBEAFE',
        '--purple'    : '#7C3AED',
        '--purple-bg' : '#EDE9FE',
        '--shadow-sm'  : '0 1px 3px rgba(255,107,53,0.12)',
        '--shadow-md'  : '0 4px 16px rgba(255,107,53,0.15)',
        '--shadow-lg'  : '0 10px 40px rgba(255,107,53,0.2)',
        '--shadow-card': '0 2px 8px rgba(255,107,53,0.1)',
      },
      css: `
        body { background-color: #FFFBF7; }
        .announcement-bar { background: linear-gradient(90deg,#FF6B35,#E85D04,#FF6B35); }
        .site-header { background: rgba(255,251,247,0.95); border-color:#FDE8D8; }
        .site-footer { background: #1C0A00; }
        .hero::before { background: radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%); }
        .hero-title .highlight { background: linear-gradient(135deg,#FF6B35,#D97706); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .loyalty-strip { background: linear-gradient(135deg,#F59E0B,#D97706); }
        .night-owl { background: #1C0A00; border-color:#3C1A0A; }
        .night-card { background: #2C1408; border-color:#4A2010; }
        .offer-card-2 { background: linear-gradient(135deg,#3C1A0A,#4A2010); }
        .app-section { background: linear-gradient(135deg,#E85D04,#C2410C,#9A3412); border-color:#C2410C; }
        .partner-card-restaurant { background: linear-gradient(135deg,#FFF3EE,#FDE8D8); border-color:rgba(255,107,53,0.2); }
        .partner-card-rider { background: linear-gradient(135deg,#DBEAFE,#BFDBFE); border-color:rgba(37,99,235,0.2); }
        .newsletter-section { background: #FFF8F3; }
        .logo-icon { background: linear-gradient(135deg,#FF6B35,#E85D04); }
        .hero-float-card { background: #FFFFFF; border-color:#FDE8D8; }
        .search-input { background: #FFF3EE; color: #1C0A00; }
        .hero-location-input { color: #1C0A00; }
        .category-chip { background: #FFF3EE; border-color:#FDE8D8; color:#78350F; }
        .food-card,.restaurant-card,.step-card,.stat-card,.trust-card,.testimonial-card,.blog-card,.referral-strip,.faq-item { background:#FFFFFF; border-color:#FDE8D8; }
        .data-table { border-color:#FDE8D8; }
        .data-table th,.data-table caption { background:#FFF3EE; }
        .data-table tbody tr:hover { background:#FFF8F3; }
        .nav-link { color:#78350F; }
        .nav-link:hover { background:#FFF3EE; }
      `,
    },

    /* ── 3. Forest Green ── */
    {
      id   : 'forest-green',
      name : 'Forest Green',
      desc : 'Sage & Emerald · Natural White',
      swatches: ['#16A34A', '#F0FFF4', '#052E16'],
      vars : {
        '--brand-orange' : '#16A34A',
        '--brand-deep'   : '#15803D',
        '--brand-light'  : '#DCFCE7',
        '--bg-main'      : '#F0FFF4',
        '--bg-section'   : '#ECFDF5',
        '--surface-white': '#FFFFFF',
        '--surface-cream': '#DCFCE7',
        '--text-primary' : '#052E16',
        '--text-secondary':'#166534',
        '--text-muted'   : '#4ADE80',
        '--border-light' : '#BBF7D0',
        '--border-medium': '#86EFAC',
        '--green'     : '#16A34A',
        '--green-bg'  : '#DCFCE7',
        '--red'       : '#DC2626',
        '--red-bg'    : '#FEE2E2',
        '--amber'     : '#D97706',
        '--amber-bg'  : '#FEF3C7',
        '--blue'      : '#2563EB',
        '--blue-bg'   : '#DBEAFE',
        '--purple'    : '#7C3AED',
        '--purple-bg' : '#EDE9FE',
        '--shadow-sm'  : '0 1px 3px rgba(22,163,74,0.12)',
        '--shadow-md'  : '0 4px 16px rgba(22,163,74,0.15)',
        '--shadow-lg'  : '0 10px 40px rgba(22,163,74,0.2)',
        '--shadow-card': '0 2px 8px rgba(22,163,74,0.1)',
      },
      css: `
        body { background-color:#F0FFF4; }
        .announcement-bar { background:linear-gradient(90deg,#16A34A,#15803D,#16A34A); }
        .site-header { background:rgba(240,255,244,0.95); border-color:#BBF7D0; }
        .site-footer { background:#052E16; }
        .hero::before { background:radial-gradient(circle,rgba(22,163,74,0.08) 0%,transparent 70%); }
        .hero-title .highlight { background:linear-gradient(135deg,#16A34A,#0D9488); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .loyalty-strip { background:linear-gradient(135deg,#15803D,#166534); }
        .night-owl { background:#052E16; border-color:#14532D; }
        .night-card { background:#064E3B; border-color:#065F46; }
        .app-section { background:linear-gradient(135deg,#15803D,#14532D,#052E16); border-color:#14532D; }
        .partner-card-restaurant { background:linear-gradient(135deg,#DCFCE7,#BBF7D0); border-color:rgba(22,163,74,0.2); }
        .partner-card-rider { background:linear-gradient(135deg,#DBEAFE,#BFDBFE); border-color:rgba(37,99,235,0.2); }
        .newsletter-section { background:#ECFDF5; }
        .logo-icon { background:linear-gradient(135deg,#16A34A,#15803D); }
        .hero-float-card { background:#FFFFFF; border-color:#BBF7D0; }
        .search-input { background:#DCFCE7; color:#052E16; }
        .hero-location-input { color:#052E16; }
        .category-chip { background:#DCFCE7; border-color:#BBF7D0; color:#166534; }
        .food-card,.restaurant-card,.step-card,.stat-card,.trust-card,.testimonial-card,.blog-card,.referral-strip,.faq-item { background:#FFFFFF; border-color:#BBF7D0; }
        .data-table { border-color:#BBF7D0; }
        .data-table th,.data-table caption { background:#DCFCE7; }
        .nav-link { color:#166534; }
        .nav-link:hover { background:#DCFCE7; }
      `,
    },

    /* ── 4. Ocean Blue ── */
    {
      id   : 'ocean-blue',
      name : 'Ocean Blue',
      desc : 'Deep Azure · Sky White',
      swatches: ['#2563EB', '#F0F9FF', '#0C1A4A'],
      vars : {
        '--brand-orange' : '#2563EB',
        '--brand-deep'   : '#1D4ED8',
        '--brand-light'  : '#DBEAFE',
        '--bg-main'      : '#F0F9FF',
        '--bg-section'   : '#EFF6FF',
        '--surface-white': '#FFFFFF',
        '--surface-cream': '#DBEAFE',
        '--text-primary' : '#0C1A4A',
        '--text-secondary':'#1E40AF',
        '--text-muted'   : '#60A5FA',
        '--border-light' : '#BFDBFE',
        '--border-medium': '#93C5FD',
        '--green'     : '#16A34A',
        '--green-bg'  : '#DCFCE7',
        '--red'       : '#DC2626',
        '--red-bg'    : '#FEE2E2',
        '--amber'     : '#D97706',
        '--amber-bg'  : '#FEF3C7',
        '--blue'      : '#2563EB',
        '--blue-bg'   : '#DBEAFE',
        '--purple'    : '#7C3AED',
        '--purple-bg' : '#EDE9FE',
        '--shadow-sm'  : '0 1px 3px rgba(37,99,235,0.12)',
        '--shadow-md'  : '0 4px 16px rgba(37,99,235,0.15)',
        '--shadow-lg'  : '0 10px 40px rgba(37,99,235,0.2)',
        '--shadow-card': '0 2px 8px rgba(37,99,235,0.1)',
      },
      css: `
        body { background-color:#F0F9FF; }
        .announcement-bar { background:linear-gradient(90deg,#2563EB,#1D4ED8,#2563EB); }
        .site-header { background:rgba(240,249,255,0.95); border-color:#BFDBFE; }
        .site-footer { background:#0C1A4A; }
        .hero::before { background:radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 70%); }
        .hero-title .highlight { background:linear-gradient(135deg,#2563EB,#0EA5E9); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .loyalty-strip { background:linear-gradient(135deg,#2563EB,#1D4ED8); }
        .night-owl { background:#0C1A4A; border-color:#1E3A8A; }
        .night-card { background:#1E3A8A; border-color:#1E40AF; }
        .app-section { background:linear-gradient(135deg,#1D4ED8,#1E40AF,#1E3A8A); border-color:#1E40AF; }
        .partner-card-restaurant { background:linear-gradient(135deg,#DBEAFE,#BFDBFE); border-color:rgba(37,99,235,0.2); }
        .partner-card-rider { background:linear-gradient(135deg,#EDE9FE,#DDD6FE); border-color:rgba(124,58,237,0.2); }
        .newsletter-section { background:#EFF6FF; }
        .logo-icon { background:linear-gradient(135deg,#2563EB,#1D4ED8); }
        .hero-float-card { background:#FFFFFF; border-color:#BFDBFE; }
        .search-input { background:#DBEAFE; color:#0C1A4A; }
        .hero-location-input { color:#0C1A4A; }
        .category-chip { background:#DBEAFE; border-color:#BFDBFE; color:#1E40AF; }
        .food-card,.restaurant-card,.step-card,.stat-card,.trust-card,.testimonial-card,.blog-card,.referral-strip,.faq-item { background:#FFFFFF; border-color:#BFDBFE; }
        .data-table { border-color:#BFDBFE; }
        .data-table th,.data-table caption { background:#DBEAFE; }
        .nav-link { color:#1E40AF; }
        .nav-link:hover { background:#DBEAFE; }
      `,
    },

    /* ── 5. Royal Purple ── */
    {
      id   : 'royal-purple',
      name : 'Royal Purple',
      desc : 'Deep Violet · Lavender Mist',
      swatches: ['#7C3AED', '#FAF5FF', '#2E1065'],
      vars : {
        '--brand-orange' : '#7C3AED',
        '--brand-deep'   : '#6D28D9',
        '--brand-light'  : '#EDE9FE',
        '--bg-main'      : '#FAF5FF',
        '--bg-section'   : '#F5F3FF',
        '--surface-white': '#FFFFFF',
        '--surface-cream': '#EDE9FE',
        '--text-primary' : '#2E1065',
        '--text-secondary':'#5B21B6',
        '--text-muted'   : '#A78BFA',
        '--border-light' : '#DDD6FE',
        '--border-medium': '#C4B5FD',
        '--green'     : '#16A34A',
        '--green-bg'  : '#DCFCE7',
        '--red'       : '#DC2626',
        '--red-bg'    : '#FEE2E2',
        '--amber'     : '#D97706',
        '--amber-bg'  : '#FEF3C7',
        '--blue'      : '#2563EB',
        '--blue-bg'   : '#DBEAFE',
        '--purple'    : '#7C3AED',
        '--purple-bg' : '#EDE9FE',
        '--shadow-sm'  : '0 1px 3px rgba(124,58,237,0.12)',
        '--shadow-md'  : '0 4px 16px rgba(124,58,237,0.15)',
        '--shadow-lg'  : '0 10px 40px rgba(124,58,237,0.2)',
        '--shadow-card': '0 2px 8px rgba(124,58,237,0.1)',
      },
      css: `
        body { background-color:#FAF5FF; }
        .announcement-bar { background:linear-gradient(90deg,#7C3AED,#6D28D9,#7C3AED); }
        .site-header { background:rgba(250,245,255,0.95); border-color:#DDD6FE; }
        .site-footer { background:#2E1065; }
        .hero::before { background:radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%); }
        .hero-title .highlight { background:linear-gradient(135deg,#7C3AED,#EC4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .loyalty-strip { background:linear-gradient(135deg,#7C3AED,#6D28D9); }
        .night-owl { background:#2E1065; border-color:#4C1D95; }
        .night-card { background:#3B0764; border-color:#4C1D95; }
        .app-section { background:linear-gradient(135deg,#6D28D9,#5B21B6,#4C1D95); border-color:#5B21B6; }
        .partner-card-restaurant { background:linear-gradient(135deg,#EDE9FE,#DDD6FE); border-color:rgba(124,58,237,0.2); }
        .partner-card-rider { background:linear-gradient(135deg,#FCE7F3,#FBCFE8); border-color:rgba(236,72,153,0.2); }
        .newsletter-section { background:#F5F3FF; }
        .logo-icon { background:linear-gradient(135deg,#7C3AED,#6D28D9); }
        .hero-float-card { background:#FFFFFF; border-color:#DDD6FE; }
        .search-input { background:#EDE9FE; color:#2E1065; }
        .hero-location-input { color:#2E1065; }
        .category-chip { background:#EDE9FE; border-color:#DDD6FE; color:#5B21B6; }
        .food-card,.restaurant-card,.step-card,.stat-card,.trust-card,.testimonial-card,.blog-card,.referral-strip,.faq-item { background:#FFFFFF; border-color:#DDD6FE; }
        .data-table { border-color:#DDD6FE; }
        .data-table th,.data-table caption { background:#EDE9FE; }
        .nav-link { color:#5B21B6; }
        .nav-link:hover { background:#EDE9FE; }
      `,
    },

    /* ── 6. Rose Gold ── */
    {
      id   : 'rose-gold',
      name : 'Rose Gold',
      desc : 'Blush Pink · Champagne',
      swatches: ['#E11D48', '#FFF1F2', '#4C0519'],
      vars : {
        '--brand-orange' : '#E11D48',
        '--brand-deep'   : '#BE123C',
        '--brand-light'  : '#FFE4E6',
        '--bg-main'      : '#FFF1F2',
        '--bg-section'   : '#FFF0F1',
        '--surface-white': '#FFFFFF',
        '--surface-cream': '#FFE4E6',
        '--text-primary' : '#4C0519',
        '--text-secondary':'#9F1239',
        '--text-muted'   : '#FB7185',
        '--border-light' : '#FECDD3',
        '--border-medium': '#FDA4AF',
        '--green'     : '#16A34A',
        '--green-bg'  : '#DCFCE7',
        '--red'       : '#DC2626',
        '--red-bg'    : '#FEE2E2',
        '--amber'     : '#D97706',
        '--amber-bg'  : '#FEF3C7',
        '--blue'      : '#2563EB',
        '--blue-bg'   : '#DBEAFE',
        '--purple'    : '#7C3AED',
        '--purple-bg' : '#EDE9FE',
        '--shadow-sm'  : '0 1px 3px rgba(225,29,72,0.12)',
        '--shadow-md'  : '0 4px 16px rgba(225,29,72,0.15)',
        '--shadow-lg'  : '0 10px 40px rgba(225,29,72,0.2)',
        '--shadow-card': '0 2px 8px rgba(225,29,72,0.1)',
      },
      css: `
        body { background-color:#FFF1F2; }
        .announcement-bar { background:linear-gradient(90deg,#E11D48,#BE123C,#E11D48); }
        .site-header { background:rgba(255,241,242,0.95); border-color:#FECDD3; }
        .site-footer { background:#4C0519; }
        .hero::before { background:radial-gradient(circle,rgba(225,29,72,0.08) 0%,transparent 70%); }
        .hero-title .highlight { background:linear-gradient(135deg,#E11D48,#F97316); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .loyalty-strip { background:linear-gradient(135deg,#E11D48,#BE123C); }
        .night-owl { background:#4C0519; border-color:#881337; }
        .night-card { background:#4C0519; border-color:#881337; }
        .app-section { background:linear-gradient(135deg,#BE123C,#9F1239,#881337); border-color:#9F1239; }
        .partner-card-restaurant { background:linear-gradient(135deg,#FFE4E6,#FECDD3); border-color:rgba(225,29,72,0.2); }
        .partner-card-rider { background:linear-gradient(135deg,#DBEAFE,#BFDBFE); border-color:rgba(37,99,235,0.2); }
        .newsletter-section { background:#FFF0F1; }
        .logo-icon { background:linear-gradient(135deg,#E11D48,#BE123C); }
        .hero-float-card { background:#FFFFFF; border-color:#FECDD3; }
        .search-input { background:#FFE4E6; color:#4C0519; }
        .hero-location-input { color:#4C0519; }
        .category-chip { background:#FFE4E6; border-color:#FECDD3; color:#9F1239; }
        .food-card,.restaurant-card,.step-card,.stat-card,.trust-card,.testimonial-card,.blog-card,.referral-strip,.faq-item { background:#FFFFFF; border-color:#FECDD3; }
        .data-table { border-color:#FECDD3; }
        .data-table th,.data-table caption { background:#FFE4E6; }
        .nav-link { color:#9F1239; }
        .nav-link:hover { background:#FFE4E6; }
      `,
    },

  ]; // end PALETTES


  /* ═══════════════════════════════════════════════════════════
     STYLE INJECTION
     ════════════════════════════════════════════════════════ */

  /* Injects or replaces the <style> tag that carries palette-specific overrides */
  let styleEl = null;

  function injectPaletteStyles(css) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'qb-palette-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }


  /* ═══════════════════════════════════════════════════════════
     APPLY PALETTE
     ════════════════════════════════════════════════════════ */

  let currentId = null;

  function applyPalette(id) {
    const palette = PALETTES.find(p => p.id === id);
    if (!palette) return;

    currentId = id;

    /* ① Apply CSS custom properties to :root */
    const root = document.documentElement;
    Object.entries(palette.vars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });

    /* ② Apply section-specific CSS overrides */
    injectPaletteStyles(palette.css || '');

    /* ③ Persist to localStorage */
    try { localStorage.setItem(STORAGE_KEY, id); } catch (_) {}

    /* ④ Update switcher UI state */
    updateSwitcherUI(id);
  }


  /* ═══════════════════════════════════════════════════════════
     SWITCHER UI
     ════════════════════════════════════════════════════════ */

  function buildSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'qb-switcher';
    switcher.setAttribute('role', 'region');
    switcher.setAttribute('aria-label', 'Theme palette switcher');

    switcher.innerHTML = `
      <style>
        #qb-switcher {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        #qb-toggle-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--brand-orange, #6366F1);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-left: auto;
        }
        #qb-toggle-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.4); }

        #qb-panel {
          display: none;
          position: absolute;
          bottom: 60px;
          right: 0;
          width: 240px;
          background: #1A1A2E;
          border: 1px solid #2D2D4E;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }
        #qb-panel.open { display: block; animation: qb-slide-up 0.2s ease; }

        @keyframes qb-slide-up {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        #qb-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .qb-panel-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        #qb-close-btn {
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
          padding: 2px;
          transition: color 0.15s;
        }
        #qb-close-btn:hover { color: #F1F5F9; }

        .qb-palette-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: 1.5px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, border-color 0.15s;
          margin-bottom: 4px;
        }
        .qb-palette-btn:hover  { background: rgba(255,255,255,0.06); }
        .qb-palette-btn.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }

        .qb-swatches {
          display: flex;
          gap: 3px;
          flex-shrink: 0;
        }
        .qb-swatch {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .qb-palette-info { flex: 1; min-width: 0; }
        .qb-palette-name { font-size: 0.82rem; font-weight: 700; color: #F1F5F9; display: block; }
        .qb-palette-desc { font-size: 0.7rem; color: #64748B; display: block; margin-top: 1px; }

        .qb-check {
          color: #4ADE80;
          font-size: 0.9rem;
          opacity: 0;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .qb-palette-btn.active .qb-check { opacity: 1; }
      </style>

      <!-- Toggle Button -->
      <button id="qb-toggle-btn" type="button" aria-label="Open theme switcher" aria-expanded="false" aria-controls="qb-panel">
        🎨
      </button>

      <!-- Panel -->
      <div id="qb-panel" role="dialog" aria-label="Choose colour palette" aria-modal="true">
        <div id="qb-panel-header">
          <span class="qb-panel-title">Choose Palette</span>
          <button id="qb-close-btn" type="button" aria-label="Close palette switcher">✕</button>
        </div>

        <div role="list">
          ${PALETTES.map(p => `
            <button
              class="qb-palette-btn"
              type="button"
              data-palette="${p.id}"
              role="listitem"
              aria-label="Apply ${p.name} palette"
              aria-pressed="false"
            >
              <div class="qb-swatches" aria-hidden="true">
                ${p.swatches.map(c => `<span class="qb-swatch" style="background:${c}"></span>`).join('')}
              </div>
              <div class="qb-palette-info">
                <span class="qb-palette-name">${p.name}</span>
                <span class="qb-palette-desc">${p.desc}</span>
              </div>
              <span class="qb-check" aria-hidden="true">✓</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(switcher);
  }


  /* Update switcher UI to reflect currently active palette */
  function updateSwitcherUI(id) {
    document.querySelectorAll('.qb-palette-btn').forEach(btn => {
      const isActive = btn.dataset.palette === id;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    /* Update toggle button colour to match active palette */
    const palette = PALETTES.find(p => p.id === id);
    const toggleBtn = document.getElementById('qb-toggle-btn');
    if (palette && toggleBtn) {
      toggleBtn.style.background = palette.swatches[0];
    }
  }


  /* ═══════════════════════════════════════════════════════════
     EVENTS
     ════════════════════════════════════════════════════════ */

  let panelOpen = false;

  function togglePanel(force) {
    panelOpen = typeof force === 'boolean' ? force : !panelOpen;
    const panel     = document.getElementById('qb-panel');
    const toggleBtn = document.getElementById('qb-toggle-btn');
    if (!panel || !toggleBtn) return;

    panel.classList.toggle('open', panelOpen);
    toggleBtn.setAttribute('aria-expanded', String(panelOpen));
  }

  function initEvents() {
    /* Toggle button */
    document.getElementById('qb-toggle-btn').addEventListener('click', () => togglePanel());

    /* Close button */
    document.getElementById('qb-close-btn').addEventListener('click', () => togglePanel(false));

    /* Palette buttons */
    document.querySelectorAll('.qb-palette-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyPalette(btn.dataset.palette);
        setTimeout(() => togglePanel(false), 220);
      });
    });

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!panelOpen) return;
      if (!document.getElementById('qb-switcher').contains(e.target)) {
        togglePanel(false);
      }
    });

    /* Close on Escape key */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panelOpen) togglePanel(false);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     INIT — Load saved or default palette
     ═══════════════════════════════════════════════════════════ */

  function init() {
    buildSwitcher();
    initEvents();

    /* Load saved palette, fallback to default */
    let saved = DEFAULT_ID;
    try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_ID; } catch (_) {}

    /* Validate saved ID exists */
    if (!PALETTES.find(p => p.id === saved)) saved = DEFAULT_ID;

    applyPalette(saved);
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
