export type PageCategory = 'FOUNDATIONS' | 'COMPONENTS' | 'GUIDELINES' | 'TEMPLATES';

export interface PageMeta {
  id: string;
  title: string;
  category: PageCategory;
  path: string;
  description: string;
  updated?: boolean;
  isNew?: boolean;
}

export const PAGES: PageMeta[] = [
  // Foundations
  {
    id: 'overview',
    title: 'Overview',
    category: 'FOUNDATIONS',
    path: '/foundations/overview',
    description: 'Core principles, architecture, golden rules, and release highlights for the VisionEdge Design System.',
  },
  {
    id: 'brand-logo',
    title: 'Brand & Logo',
    category: 'FOUNDATIONS',
    path: '/foundations/brand-logo',
    description: 'The official VisionEdge ribbon "V" mark, clear space rules, size constraints, and placement standards.',
  },
  {
    id: 'colors',
    title: 'Colors',
    category: 'FOUNDATIONS',
    path: '/foundations/colors',
    description: 'Closed brand palette, neutrals, 60·30·10 usage rules, role mapping, and interactive WCAG contrast checker.',
    updated: true,
  },
  {
    id: 'typography',
    title: 'Typography',
    category: 'FOUNDATIONS',
    path: '/foundations/typography',
    description: 'Inter and JetBrains Mono typographic hierarchy, px scales, line heights, and data formatting standards.',
  },
  {
    id: 'spacing-layout',
    title: 'Spacing & Layout',
    category: 'FOUNDATIONS',
    path: '/foundations/spacing-layout',
    description: '4px baseline grid, spacing tokens, responsive column layouts, radius system, and elevation scales.',
  },
  {
    id: 'iconography',
    title: 'Iconography',
    category: 'FOUNDATIONS',
    path: '/foundations/iconography',
    description: 'Lucide outline 1.5px stroke system, sizing conventions, and searchable enterprise IoT asset icon gallery.',
  },

  // Components
  {
    id: 'buttons',
    title: 'Buttons',
    category: 'COMPONENTS',
    path: '/components/buttons',
    description: 'Interactive button matrix: Primary, Secondary, Ghost, Accent, Destructive, and on-dark variants across all states.',
    updated: true,
  },
  {
    id: 'links',
    title: 'Links',
    category: 'COMPONENTS',
    path: '/components/links',
    description: 'Inline, standalone, navigation, on-dark, and external link styling standards with accessible focus outlines.',
  },
  {
    id: 'form-inputs',
    title: 'Form Inputs',
    category: 'COMPONENTS',
    path: '/components/form-inputs',
    description: 'Input fields, validation states, helper text, password reveals, search boxes, and live vehicle registration demo.',
  },
  {
    id: 'selection-controls',
    title: 'Selection Controls',
    category: 'COMPONENTS',
    path: '/components/selection-controls',
    description: '16px checkboxes, radio buttons, 36×20 toggle switches, segmented controls, and interactive filter chips.',
  },
  {
    id: 'date-pickers',
    title: 'Date & Time Pickers',
    category: 'COMPONENTS',
    path: '/components/date-pickers',
    description: 'Single date, date range with presets, date & time, time, month and inline calendar pickers with IST formats and keyboard support.',
    isNew: true,
  },
  {
    id: 'cards-kpi',
    title: 'Cards & KPI Tiles',
    category: 'COMPONENTS',
    path: '/components/cards-kpi',
    description: 'Surface cards, metric KPI summary tiles with trend bars, and dedicated CCTV camera monitoring viewports.',
    updated: true,
  },
  {
    id: 'tables',
    title: 'Tables',
    category: 'COMPONENTS',
    path: '/components/tables',
    description: 'High-density enterprise data grid, ANPR vehicle movement log, row selection, bulk actions, and sorting.',
  },
  {
    id: 'badges-status',
    title: 'Badges & Status',
    category: 'COMPONENTS',
    path: '/components/badges-status',
    description: '24px status pills: Live/online (Cyan), Info/processing (Royal Blue), Critical (Deep Navy), and Neutral (Gray 100).',
  },
  {
    id: 'alerts-toasts',
    title: 'Alerts, Toasts & Modals',
    category: 'COMPONENTS',
    path: '/components/alerts-toasts',
    description: 'Inline notification banners, interactive auto-dismiss toasts, centered dialog modals, and slide-over drawers.',
  },
  {
    id: 'navigation',
    title: 'Navigation',
    category: 'COMPONENTS',
    path: '/components/navigation',
    description: 'Deep Navy responsive sidebar, sticky 64px top bar, tabs with blue indicator, breadcrumbs, and steppers.',
  },
  {
    id: 'tabs',
    title: 'Tabs',
    category: 'COMPONENTS',
    path: '/components/tabs',
    description: 'Line, contained, segmented, vertical, scrollable, closable, full-width and dark-surface tabs, with keyboard, URL sync and accessibility rules.',
    isNew: true,
  },
  {
    id: 'charts',
    title: 'Charts',
    category: 'COMPONENTS',
    path: '/components/charts',
    description: 'Data visualization palette sequence: Deep Navy, Royal Blue, Cyan, Gray 400 with line, bar, and donut charts.',
  },

  // Guidelines
  {
    id: 'accessibility',
    title: 'Accessibility',
    category: 'GUIDELINES',
    path: '/guidelines/accessibility',
    description: 'WCAG 2.2 AA compliance standards, color contrast proofs, keyboard interaction, zoom tolerance, and reduced motion.',
  },
  {
    id: 'content-writing',
    title: 'Content & Writing',
    category: 'GUIDELINES',
    path: '/guidelines/content-writing',
    description: 'Voice and tone, sentence case rules, verb-first actions, error phrasing, and numeric/date formatting guides.',
  },
  {
    id: 'design-tokens',
    title: 'Design Tokens',
    category: 'GUIDELINES',
    path: '/guidelines/design-tokens',
    description: 'Machine-readable tokens in CSS variables, JSON payload, and Tailwind configuration snippets with copy utilities.',
    updated: true,
  },
  {
    id: 'review-checklist',
    title: 'Review Checklist',
    category: 'GUIDELINES',
    path: '/guidelines/review-checklist',
    description: 'Interactive QA audit checklist for designers and front-end engineers with persistent local progress tracking.',
  },

  // Templates
  {
    id: 'login-page',
    title: 'Login Page',
    category: 'TEMPLATES',
    path: '/templates/login',
    description: 'Reference sign-in screen: centered card on use-case backgrounds, form states, two-step verification, password reset and full-screen demo.',
  },
  {
    id: 'register-page',
    title: 'Register Page',
    category: 'TEMPLATES',
    path: '/templates/register',
    description: 'Reference sign-up and access-request flow: 3-step form, password strength, email verification, approval and invitations.',
  },
  {
    id: 'dashboard-page',
    title: 'Dashboard Page',
    category: 'TEMPLATES',
    path: '/templates/dashboard',
    description: 'Reference operations dashboard: product app shell, KPIs, live alerts and cameras, charts, events table and every widget state.',
  },
  {
    id: 'live-view-page',
    title: 'Live View Page',
    category: 'TEMPLATES',
    path: '/templates/live-view',
    description: 'Real-time CCTV monitoring with live detections and alerts for every VisionEdge product.',
  },
  {
    id: 'profile-page',
    title: 'User Profile Page',
    category: 'TEMPLATES',
    path: '/templates/profile',
    description: 'Reference profile and account settings: personal details, security and two-step verification, sessions, notifications, access and the admin view of another user.',
  },
  {
    id: 'settings-page',
    title: 'Settings Page',
    category: 'TEMPLATES',
    path: '/templates/settings',
    description: 'Reference organization settings: the setting-row pattern, search, sites, cameras, detection, alert rules, users and roles, integrations, privacy, audit log and system.',
  },
  {
    id: 'error-pages',
    title: 'Error Pages',
    category: 'TEMPLATES',
    path: '/templates/errors',
    description: 'Generic error and availability pages: 400–504, maintenance, offline, unreachable and unsupported browser, plus static fallback pages.',
  },
  {
    id: 'form-pages',
    title: 'Form Pages',
    category: 'TEMPLATES',
    path: '/templates/forms',
    description: 'Generic create and registration patterns: single-page, sectioned, wizard, drawer, modal, edit record and bulk import, with a full field catalog.',
  },
];

export const NAV_GROUPS: { name: PageCategory; items: PageMeta[] }[] = [
  {
    name: 'FOUNDATIONS',
    items: PAGES.filter((p) => p.category === 'FOUNDATIONS'),
  },
  {
    name: 'COMPONENTS',
    items: PAGES.filter((p) => p.category === 'COMPONENTS'),
  },
  {
    name: 'GUIDELINES',
    items: PAGES.filter((p) => p.category === 'GUIDELINES'),
  },
  {
    name: 'TEMPLATES',
    items: PAGES.filter((p) => p.category === 'TEMPLATES'),
  },
];
