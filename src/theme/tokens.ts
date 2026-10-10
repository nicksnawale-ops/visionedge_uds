/**
 * VisionEdge Design System Tokens
 * Single source of truth for all design tokens: colors, typography, spacing, radius, shadows, and rules.
 */

export interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  rgb: string;
  category: 'brand' | 'neutral' | 'semantic';
  description: string;
  role: string;
  usagePercent?: string;
  textContrastOnWhite?: string;
  whiteContrastOnColor?: string;
}

export const BRAND_COLORS: ColorToken[] = [
  {
    name: 'Deep Navy',
    variable: '--ve-deep-navy',
    hex: '#0B2D6B',
    rgb: '11, 45, 107',
    category: 'brand',
    description: 'Trust, Stability, Depth',
    role: 'Sidebar, headers, headings, primary hover, critical alerts',
    usagePercent: '~30%',
    textContrastOnWhite: '13.1:1',
    whiteContrastOnColor: '13.1:1',
  },
  {
    name: 'Royal Blue',
    variable: '--ve-royal-blue',
    hex: '#1E63FF',
    rgb: '30, 99, 255',
    category: 'brand',
    description: 'Innovation, Technology, Confidence',
    role: 'Primary buttons, links, focus rings, selected states, active tabs',
    usagePercent: '~10% (with Cyan)',
    textContrastOnWhite: '4.9:1',
    whiteContrastOnColor: '4.9:1',
  },
  {
    name: 'Cyan',
    variable: '--ve-cyan',
    hex: '#00C6FF',
    rgb: '0, 198, 255',
    category: 'brand',
    description: 'Intelligence, Clarity, Progress',
    role: 'Live/online indicators, progress, accents on dark surfaces',
    usagePercent: '~10% (with Royal Blue)',
    textContrastOnWhite: '2.0:1 (Do NOT use on white)',
    whiteContrastOnColor: '2.0:1',
  },
];

export const NEUTRAL_COLORS: ColorToken[] = [
  {
    name: 'White',
    variable: '--ve-white',
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    category: 'neutral',
    description: 'Primary canvas',
    role: 'Page background, cards, text on Deep Navy/Royal Blue',
  },
  {
    name: 'Gray 50',
    variable: '--ve-gray-50',
    hex: '#F7F9FC',
    rgb: '247, 249, 252',
    category: 'neutral',
    description: 'Subtle background',
    role: 'Subtle sections, table headers, hover rows, preview canvas',
  },
  {
    name: 'Gray 100',
    variable: '--ve-gray-100',
    hex: '#EEF1F6',
    rgb: '238, 241, 246',
    category: 'neutral',
    description: 'Secondary surface',
    role: 'Disabled fills, secondary surfaces, ghost hover',
  },
  {
    name: 'Gray 200',
    variable: '--ve-gray-200',
    hex: '#DDE2EA',
    rgb: '221, 226, 234',
    category: 'neutral',
    description: 'Border standard',
    role: 'Card borders, dividers, row lines',
  },
  {
    name: 'Gray 300',
    variable: '--ve-gray-300',
    hex: '#C3CAD5',
    rgb: '195, 202, 213',
    category: 'neutral',
    description: 'Decorative border',
    role: 'Decorative borders, skeleton loaders, muted captions on dark',
  },
  {
    name: 'Gray 400',
    variable: '--ve-gray-400',
    hex: '#8C95A6',
    rgb: '140, 149, 166',
    category: 'neutral',
    description: 'Inputs & borders (3:1)',
    role: 'Input borders (meets 3:1 graphical requirement), disabled text, inactive icons',
  },
  {
    name: 'Gray 500',
    variable: '--ve-gray-500',
    hex: '#6B7485',
    rgb: '107, 116, 133',
    category: 'neutral',
    description: 'Placeholder & caption',
    role: 'Placeholders, captions (lightest readable text gray: 4.7:1)',
  },
  {
    name: 'Gray 600',
    variable: '--ve-gray-600',
    hex: '#4B5465',
    rgb: '75, 84, 101',
    category: 'neutral',
    description: 'Secondary text',
    role: 'Secondary/helper text, default icons',
  },
  {
    name: 'Gray 700',
    variable: '--ve-gray-700',
    hex: '#353D4C',
    rgb: '53, 61, 76',
    category: 'neutral',
    description: 'Body text',
    role: 'Body text (10.9:1 contrast)',
  },
  {
    name: 'Gray 800',
    variable: '--ve-gray-800',
    hex: '#1F2633',
    rgb: '31, 38, 51',
    category: 'neutral',
    description: 'Tooltips & dark monitoring',
    role: 'Tooltips, dark monitoring surfaces',
  },
  {
    name: 'Gray 900',
    variable: '--ve-gray-900',
    hex: '#121722',
    rgb: '18, 23, 34',
    category: 'neutral',
    description: 'Headings & primary text',
    role: 'Headings, labels, primary text, destructive action buttons',
  },
  {
    name: 'Black',
    variable: '--ve-black',
    hex: '#000000',
    rgb: '0, 0, 0',
    category: 'neutral',
    description: 'Media only',
    role: 'CCTV video backgrounds, modal scrim at 50%; never for body text',
  },
];

export const SPACING_TOKENS = [
  { name: 'space-1', value: '4px', rem: '0.25rem', variable: '--ve-space-1', use: 'Tight gap, micro spacing, icon padding' },
  { name: 'space-2', value: '8px', rem: '0.5rem', variable: '--ve-space-2', use: 'Button icon gap, input vertical padding, chip spacing' },
  { name: 'space-3', value: '12px', rem: '0.75rem', variable: '--ve-space-3', use: 'Nav padding, input horizontal padding' },
  { name: 'space-4', value: '16px', rem: '1.0rem', variable: '--ve-space-4', use: 'Card inner padding mobile, button padding, field gap' },
  { name: 'space-6', value: '24px', rem: '1.5rem', variable: '--ve-space-6', use: 'Card padding desktop, section gap, gutter' },
  { name: 'space-8', value: '32px', rem: '2.0rem', variable: '--ve-space-8', use: 'Form group gap, component spacing' },
  { name: 'space-12', value: '48px', rem: '3.0rem', variable: '--ve-space-12', use: 'Major section breaks, hero spacing' },
  { name: 'space-16', value: '64px', rem: '4.0rem', variable: '--ve-space-16', use: 'Page header spacing, full container padding' },
];

export const RADIUS_TOKENS = [
  { name: 'radius-sm', value: '4px', variable: '--ve-radius-sm', use: 'Checkbox, tag, tooltip' },
  { name: 'radius-md', value: '8px', variable: '--ve-radius-md', use: 'Buttons, inputs, dropdowns' },
  { name: 'radius-lg', value: '12px', variable: '--ve-radius-lg', use: 'Cards, panels, camera tiles' },
  { name: 'radius-xl', value: '16px', variable: '--ve-radius-xl', use: 'Modals, drawers, hero banners' },
  { name: 'radius-full', value: '999px', variable: '--ve-radius-full', use: 'Badges, avatars, status dots, toggles' },
];

export const SHADOW_TOKENS = [
  {
    name: 'elevation-0',
    value: 'none',
    variable: '--ve-shadow-0',
    description: 'Flat surface with 1px #DDE2EA border (Default cards, panels)',
  },
  {
    name: 'elevation-1',
    value: '0 1px 3px rgba(11, 45, 107, 0.08)',
    variable: '--ve-shadow-1',
    description: 'Hover cards, sticky headers, table headers',
  },
  {
    name: 'elevation-2',
    value: '0 4px 12px rgba(11, 45, 107, 0.12)',
    variable: '--ve-shadow-2',
    description: 'Dropdowns, popovers, toasts, hover elevated tiles',
  },
  {
    name: 'elevation-3',
    value: '0 12px 32px rgba(11, 45, 107, 0.18)',
    variable: '--ve-shadow-3',
    description: 'Modals, slide-over drawers, command palettes',
  },
];

export const TYPOGRAPHY_SPECIMENS = [
  {
    name: 'Display',
    size: '32px',
    lineHeight: '40px',
    weight: '700 (Bold)',
    color: '#0B2D6B (Deep Navy)',
    tailwind: 'text-[32px] leading-[40px] font-bold text-[#0B2D6B]',
    sample: 'Every Asset. Every Location. Real-Time.',
    use: 'Login hero, report cover, public landing display',
  },
  {
    name: 'H1',
    size: '28px',
    lineHeight: '36px',
    weight: '600 (SemiBold)',
    color: '#121722 (Gray 900)',
    tailwind: 'text-[28px] leading-[36px] font-semibold text-[#121722]',
    sample: 'Vehicle Access & Movement Intelligence',
    use: 'Page title (strictly one per page)',
  },
  {
    name: 'H2',
    size: '24px',
    lineHeight: '32px',
    weight: '600 (SemiBold)',
    color: '#121722 (Gray 900)',
    tailwind: 'text-[24px] leading-[32px] font-semibold text-[#121722]',
    sample: 'Real-Time Telemetry & Active Gateways',
    use: 'Major section titles',
  },
  {
    name: 'H3',
    size: '20px',
    lineHeight: '28px',
    weight: '600 (SemiBold)',
    color: '#121722 (Gray 900)',
    tailwind: 'text-[20px] leading-[28px] font-semibold text-[#121722]',
    sample: 'Camera Cluster Performance',
    use: 'Card & panel titles',
  },
  {
    name: 'H4',
    size: '16px',
    lineHeight: '24px',
    weight: '600 (SemiBold)',
    color: '#121722 (Gray 900)',
    tailwind: 'text-[16px] leading-[24px] font-semibold text-[#121722]',
    sample: 'Confirm Gate Decommissioning',
    use: 'Sub-section, dialog title, drawer heading',
  },
  {
    name: 'Body Large',
    size: '16px',
    lineHeight: '24px',
    weight: '400 (Regular)',
    color: '#353D4C (Gray 700)',
    tailwind: 'text-[16px] leading-[24px] font-normal text-[#353D4C]',
    sample: 'Review the high-precision detection threshold settings before initiating sensor calibration.',
    use: 'Forms, editorial reading, mobile primary text',
  },
  {
    name: 'Body (Default)',
    size: '14px',
    lineHeight: '20px',
    weight: '400 (Regular)',
    color: '#353D4C (Gray 700)',
    tailwind: 'text-[14px] leading-[20px] font-normal text-[#353D4C]',
    sample: 'High-throughput ANPR optical stream linked to Gate North-04 with 99.82% detection accuracy.',
    use: 'Dashboards, table cells, general application content',
  },
  {
    name: 'Label',
    size: '14px',
    lineHeight: '20px',
    weight: '500 (Medium)',
    color: '#121722 (Gray 900)',
    tailwind: 'text-[14px] leading-[20px] font-medium text-[#121722]',
    sample: 'Vehicle Registration Plate Number',
    use: 'Form field labels, menu items, table sorting labels',
  },
  {
    name: 'Button',
    size: '14px',
    lineHeight: '20px',
    weight: '600 (SemiBold)',
    color: '#FFFFFF / #1E63FF',
    tailwind: 'text-[14px] leading-[20px] font-semibold',
    sample: 'Register New Asset',
    use: 'Interactive buttons, action pills, segmented controls',
  },
  {
    name: 'Small',
    size: '12px',
    lineHeight: '16px',
    weight: '400 (Regular)',
    color: '#4B5465 (Gray 600)',
    tailwind: 'text-[12px] leading-[16px] font-normal text-[#4B5465]',
    sample: 'Last calibrated 30 Sep 2026 at 14:05:32 IST',
    use: 'Helper text, timestamps, captions, badge text',
  },
  {
    name: 'Overline',
    size: '11px',
    lineHeight: '16px',
    weight: '500 (Medium)',
    color: '#6B7485 (Gray 500)',
    tailwind: 'text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#6B7485]',
    sample: 'FOUNDATION TOKENS · ANPR MODULE',
    use: 'Table headers, tags, KPI metric labels',
  },
  {
    name: 'Data (Monospace)',
    size: '13px',
    lineHeight: '20px',
    weight: '500 (Medium)',
    color: '#121722 (Gray 900)',
    font: 'JetBrains Mono',
    tailwind: 'font-mono text-[13px] leading-[20px] font-medium text-[#121722] tracking-tight',
    sample: 'MH-12-DE-4482 · CAM_GATE_04_R1',
    use: 'Plate numbers, student IDs, camera identifiers, telemetry values',
  },
  {
    name: 'KPI Number',
    size: '32px',
    lineHeight: '40px',
    weight: '700 (Bold)',
    color: '#0B2D6B (Deep Navy)',
    tailwind: 'text-[32px] leading-[40px] font-bold text-[#0B2D6B] tabular-nums',
    sample: '1,284',
    use: 'Dashboard KPI metric cards, high-level summary counters',
  },
];

export const CSS_TOKENS_RAW = `:root {
  --ve-deep-navy: #0B2D6B;
  --ve-royal-blue: #1E63FF;
  --ve-cyan: #00C6FF;
  --ve-white: #FFFFFF;
  --ve-gray-50: #F7F9FC;
  --ve-gray-100: #EEF1F6;
  --ve-gray-200: #DDE2EA;
  --ve-gray-300: #C3CAD5;
  --ve-gray-400: #8C95A6;
  --ve-gray-500: #6B7485;
  --ve-gray-600: #4B5465;
  --ve-gray-700: #353D4C;
  --ve-gray-800: #1F2633;
  --ve-gray-900: #121722;
  --ve-black: #000000;

  --ve-font-sans: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
  --ve-font-mono: "JetBrains Mono", Consolas, "Courier New", monospace;

  --ve-space-1: 4px;
  --ve-space-2: 8px;
  --ve-space-3: 12px;
  --ve-space-4: 16px;
  --ve-space-6: 24px;
  --ve-space-8: 32px;
  --ve-space-12: 48px;
  --ve-space-16: 64px;

  --ve-radius-sm: 4px;
  --ve-radius-md: 8px;
  --ve-radius-lg: 12px;
  --ve-radius-xl: 16px;
  --ve-radius-full: 999px;

  --ve-shadow-0: none;
  --ve-shadow-1: 0 1px 3px rgba(11, 45, 107, 0.08);
  --ve-shadow-2: 0 4px 12px rgba(11, 45, 107, 0.12);
  --ve-shadow-3: 0 12px 32px rgba(11, 45, 107, 0.18);

  --ve-focus-ring: 0 0 0 2px #FFFFFF, 0 0 0 4px #1E63FF;
}`;

export const JSON_TOKENS = {
  version: '1.0.0',
  name: 'VisionEdge Design Tokens',
  updated: '2026-09-30',
  colors: {
    brand: {
      deepNavy: '#0B2D6B',
      royalBlue: '#1E63FF',
      cyan: '#00C6FF',
    },
    neutral: {
      white: '#FFFFFF',
      gray50: '#F7F9FC',
      gray100: '#EEF1F6',
      gray200: '#DDE2EA',
      gray300: '#C3CAD5',
      gray400: '#8C95A6',
      gray500: '#6B7485',
      gray600: '#4B5465',
      gray700: '#353D4C',
      gray800: '#1F2633',
      gray900: '#121722',
      black: '#000000',
    },
  },
  typography: {
    fonts: {
      sans: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
      mono: '"JetBrains Mono", Consolas, "Courier New", monospace',
    },
    scale: {
      display: { size: '32px', lineHeight: '40px', weight: 700 },
      h1: { size: '28px', lineHeight: '36px', weight: 600 },
      h2: { size: '24px', lineHeight: '32px', weight: 600 },
      h3: { size: '20px', lineHeight: '28px', weight: 600 },
      h4: { size: '16px', lineHeight: '24px', weight: 600 },
      bodyLarge: { size: '16px', lineHeight: '24px', weight: 400 },
      body: { size: '14px', lineHeight: '20px', weight: 400 },
      label: { size: '14px', lineHeight: '20px', weight: 500 },
      button: { size: '14px', lineHeight: '20px', weight: 600 },
      small: { size: '12px', lineHeight: '16px', weight: 400 },
      overline: { size: '11px', lineHeight: '16px', weight: 500, letterSpacing: '0.08em' },
      data: { size: '13px', lineHeight: '20px', weight: 500, font: 'mono' },
      kpi: { size: '32px', lineHeight: '40px', weight: 700 },
    },
  },
  spacing: {
    space1: '4px',
    space2: '8px',
    space3: '12px',
    space4: '16px',
    space6: '24px',
    space8: '32px',
    space12: '48px',
    space16: '64px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '999px',
  },
  shadows: {
    elevation0: 'none',
    elevation1: '0 1px 3px rgba(11, 45, 107, 0.08)',
    elevation2: '0 4px 12px rgba(11, 45, 107, 0.12)',
    elevation3: '0 12px 32px rgba(11, 45, 107, 0.18)',
  },
};
