/**
 * VisionEdge Design System
 * Enterprise UI Standards Documentation & Component Showcase
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ToastProvider } from './components/common/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { PAGES } from './data/pages';
import { TocItem } from './components/layout/OnThisPage';

// Foundations Pages
import { OverviewPage } from './pages/foundations/OverviewPage';
import { BrandLogoPage } from './pages/foundations/BrandLogoPage';
import { ColorsPage } from './pages/foundations/ColorsPage';
import { TypographyPage } from './pages/foundations/TypographyPage';
import { SpacingLayoutPage } from './pages/foundations/SpacingLayoutPage';
import { IconographyPage } from './pages/foundations/IconographyPage';

// Components Pages
import { ButtonsPage } from './pages/components/ButtonsPage';
import { LinksPage } from './pages/components/LinksPage';
import { FormInputsPage } from './pages/components/FormInputsPage';
import { SelectionControlsPage } from './pages/components/SelectionControlsPage';
import { DatePickersPage } from './pages/components/date-pickers/DatePickersPage';
import { CardsKpiPage } from './pages/components/CardsKpiPage';
import { TablesPage } from './pages/components/TablesPage';
import { BadgesStatusPage } from './pages/components/BadgesStatusPage';
import { AlertsModalsPage } from './pages/components/AlertsModalsPage';
import { NavigationPage } from './pages/components/NavigationPage';
import { TabsPage } from './pages/components/tabs/TabsPage';
import { ChartsPage } from './pages/components/ChartsPage';

// Guidelines Pages
import { AccessibilityPage } from './pages/guidelines/AccessibilityPage';
import { ContentWritingPage } from './pages/guidelines/ContentWritingPage';
import { DesignTokensPage } from './pages/guidelines/DesignTokensPage';
import { ReviewChecklistPage } from './pages/guidelines/ReviewChecklistPage';

// Templates Pages (loaded on demand)
import { LOGIN_PAGE_PATH, LOGIN_PREVIEW_PATH } from './pages/templates/login/paths';
const LoginTemplatePage = lazy(() => import('./pages/templates/login/LoginTemplatePage'));
const LoginPreviewRoute = lazy(() => import('./pages/templates/login/LoginPreviewRoute'));
import { REGISTER_PAGE_PATH, REGISTER_PREVIEW_PATH } from './pages/templates/register/paths';
const RegisterTemplatePage = lazy(() => import('./pages/templates/register/RegisterTemplatePage'));
const RegisterPreviewRoute = lazy(() => import('./pages/templates/register/RegisterPreviewRoute'));
import { DASHBOARD_PAGE_PATH, DASHBOARD_PREVIEW_PATH } from './pages/templates/dashboard/paths';
const DashboardTemplatePage = lazy(() => import('./pages/templates/dashboard/DashboardTemplatePage'));
const DashboardPreviewRoute = lazy(() => import('./pages/templates/dashboard/DashboardPreviewRoute'));
import { PROFILE_PAGE_PATH, PROFILE_PREVIEW_PATH } from './pages/templates/profile/paths';
const ProfileTemplatePage = lazy(() => import('./pages/templates/profile/ProfileTemplatePage'));
const ProfilePreviewRoute = lazy(() => import('./pages/templates/profile/ProfilePreviewRoute'));
import { SETTINGS_PAGE_PATH, SETTINGS_PREVIEW_PATH } from './pages/templates/settings/paths';
const SettingsTemplatePage = lazy(() => import('./pages/templates/settings/SettingsTemplatePage'));
const SettingsPreviewRoute = lazy(() => import('./pages/templates/settings/SettingsPreviewRoute'));
import { ERRORS_PAGE_PATH, ERRORS_PREVIEW_PATH } from './pages/templates/errors/paths';
const ErrorsTemplatePage = lazy(() => import('./pages/templates/errors/ErrorsTemplatePage'));
const ErrorPreviewRoute = lazy(() => import('./pages/templates/errors/ErrorPreviewRoute'));
import { FORMS_PAGE_PATH, FORMS_PREVIEW_PATH } from './pages/templates/forms/paths';
const FormsTemplatePage = lazy(() => import('./pages/templates/forms/FormsTemplatePage'));
const FormsPreviewRoute = lazy(() => import('./pages/templates/forms/FormsPreviewRoute'));
import { LIVE_VIEW_PAGE_PATH, LIVE_VIEW_PREVIEW_PATH } from './pages/templates/live-view/paths';
const LiveViewTemplatePage = lazy(() => import('./pages/templates/live-view/LiveViewTemplatePage'));
const LiveViewPreviewRoute = lazy(() => import('./pages/templates/live-view/LiveViewPreviewRoute'));

// Table of contents mapping by path
const TOC_MAP: Record<string, TocItem[]> = {
  '/foundations/overview': [
    { id: 'golden-rule', title: 'The Golden Rule' },
    { id: 'principles', title: 'Core Principles' },
    { id: 'quick-links', title: 'Standards Directory' },
    { id: 'release-notes', title: "What's New in v1.0" },
  ],
  '/foundations/brand-logo': [
    { id: 'approved-backgrounds', title: 'Approved Backgrounds' },
    { id: 'clear-space-sizing', title: 'Clear Space & Sizing' },
    { id: 'never-rules', title: 'Logo Misuse Rules' },
    { id: 'specs', title: 'Logo Specifications' },
    { id: 'do-dont', title: 'Guidelines' },
  ],
  '/foundations/colors': [
    { id: 'distribution-rule', title: '60·30·10 Distribution' },
    { id: 'brand-colors', title: 'Brand Palette' },
    { id: 'neutral-colors', title: 'Neutrals Palette' },
    { id: 'color-roles', title: 'System Roles' },
    { id: 'monitoring-screens', title: 'Monitoring Screens' },
    { id: 'contrast-checker', title: 'Contrast Checker' },
    { id: 'do-dont', title: 'Usage Rules' },
  ],
  '/foundations/typography': [
    { id: 'font-stacks', title: 'Font Stacks' },
    { id: 'type-scale', title: 'Type Scale' },
    { id: 'typographic-rules', title: 'Formatting Rules' },
    { id: 'do-dont', title: 'Typography Rules' },
  ],
  '/foundations/spacing-layout': [
    { id: 'spacing-ruler', title: '4px Spatial Scale' },
    { id: 'grid-system', title: 'Grid System' },
    { id: 'radius-tokens', title: 'Border Radius' },
    { id: 'elevation-tokens', title: 'Elevation & Shadows' },
    { id: 'do-dont', title: 'Spatial Rules' },
  ],
  '/foundations/iconography': [
    { id: 'icon-rules', title: 'Optical Rules' },
    { id: 'icon-gallery', title: 'Icon Gallery' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Guidelines' },
  ],
  '/components/buttons': [
    { id: 'preview', title: 'Button Variants' },
    { id: 'matrix-playground', title: 'Variant × State Matrix' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Usage Rules' },
  ],
  '/components/links': [
    { id: 'preview', title: 'Link Variants' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Link Guidelines' },
  ],
  '/components/form-inputs': [
    { id: 'preview', title: 'Input States' },
    { id: 'live-form-demo', title: 'Live Vehicle Form' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Form Rules' },
  ],
  '/components/selection-controls': [
    { id: 'preview', title: 'Selection Controls' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Selection Rules' },
  ],
  '/components/date-pickers': [ {id:'showcase',title:'Picker Showcase'}, {id:'types',title:'Picker Types'}, {id:'anatomy',title:'Calendar Anatomy'}, {id:'states',title:'States'}, {id:'formats',title:'Formats & Time Zone'}, {id:'choosing',title:'Choosing a Picker'}, {id:'specs',title:'Specifications'}, {id:'do-dont',title:'Do & Don’t'}, {id:'accessibility',title:'Accessibility'} ],
  '/components/cards-kpi': [
    { id: 'preview', title: 'Cards & KPI Demo' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Card Guidelines' },
  ],
  '/components/tables': [
    { id: 'table-demo', title: 'Vehicle Log Table' },
    { id: 'patterns', title: 'Table Patterns' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Table Rules' },
  ],
  '/components/badges-status': [
    { id: 'preview', title: 'Status Badges' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Badge Rules' },
  ],
  '/components/alerts-toasts': [
    { id: 'inline-banners', title: 'Inline Banners' },
    { id: 'toasts', title: 'System Toasts' },
    { id: 'modals', title: 'Modals & Drawers' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Dialog Guidelines' },
  ],
  '/components/navigation': [
    { id: 'overview', title: 'Navigation Overview' },
    { id: 'sidebar', title: 'Left Sidebar' },
    { id: 'top-bar', title: 'Top Bar' },
    { id: 'command-palette', title: 'Command Palette' },
    { id: 'notifications', title: 'Notifications & User Menu' },
    { id: 'breadcrumbs', title: 'Breadcrumbs' },
    { id: 'page-header', title: 'Page Header & Back Navigation' },
    { id: 'stepper', title: 'Stepper' },
    { id: 'pagination', title: 'Pagination' },
    { id: 'in-page-nav', title: 'In-Page Navigation' },
    { id: 'mobile-nav', title: 'Mobile Navigation' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  '/components/tabs': [ {id:'showcase',title:'Tab Showcase'}, {id:'types',title:'Tab Types'}, {id:'sizes',title:'Sizes'}, {id:'anatomy',title:'Anatomy'}, {id:'states',title:'States'}, {id:'behavior',title:'Behavior'}, {id:'choosing',title:'Choosing the Right Tab'}, {id:'specs',title:'Specifications'}, {id:'do-dont',title:'Do & Don’t'}, {id:'accessibility',title:'Accessibility'}, {id:'content',title:'Content'} ],
  '/components/charts': [
    { id: 'preview', title: 'Chart Showcase' },
    { id: 'choosing', title: 'Choosing the Right Chart' },
    { id: 'chart-states', title: 'Chart States' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Visualization Rules' },
  ],
  '/guidelines/accessibility': [
    { id: 'contrast-table', title: 'Contrast Matrix' },
    { id: 'pillars', title: 'Accessibility Tenets' },
    { id: 'do-dont', title: 'Accessibility Rules' },
  ],
  '/guidelines/content-writing': [
    { id: 'before-after', title: 'Before & After Benchmarks' },
    { id: 'do-dont', title: 'Writing Guidelines' },
  ],
  '/guidelines/design-tokens': [
    { id: 'tokens-export', title: 'Tokens Export' },
    { id: 'integration', title: 'Integration Guide' },
  ],
  '/guidelines/review-checklist': [
    { id: 'progress-card', title: 'Compliance Scorecard' },
    { id: 'checklist-items', title: 'Audit Checklist' },
  ],
  [LOGIN_PAGE_PATH]: [
    { id: 'showcase', title: 'Login Showcase' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'states', title: 'States' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  [REGISTER_PAGE_PATH]: [
    { id: 'showcase', title: 'Register Showcase' },
    { id: 'flow', title: 'Flow Overview' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'states', title: 'States' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  [DASHBOARD_PAGE_PATH]: [
    { id: 'showcase', title: 'Dashboard Showcase' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'grid', title: 'Grid & Spacing' },
    { id: 'catalog', title: 'Widget Catalog' },
    { id: 'states', title: 'States' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  [PROFILE_PAGE_PATH]: [
    { id: 'showcase', title: 'Profile Showcase' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'sections', title: 'Sections' },
    { id: 'viewer-modes', title: 'Viewer Modes' },
    { id: 'states', title: 'States' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  [SETTINGS_PAGE_PATH]: [
    { id: 'showcase', title: 'Settings Showcase' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'row-pattern', title: 'Setting Row Pattern' },
    { id: 'sections-overview', title: 'Sections Overview' },
    { id: 'roles', title: 'Roles' },
    { id: 'states', title: 'States' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  [ERRORS_PAGE_PATH]: [
    { id: 'showcase', title: 'Error Showcase' },
    { id: 'catalog', title: 'Error Catalog' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'static', title: 'Static Fallback Pages' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'content', title: 'Content' },
  ],
  [LIVE_VIEW_PAGE_PATH]: [
    { id: 'showcase', title: 'Live View Showcase' },
    { id: 'anatomy', title: 'Layout Anatomy' },
    { id: 'tile', title: 'Camera Tile' },
    { id: 'feed', title: 'Detection Feed' },
    { id: 'states', title: 'States' },
    { id: 'overlays', title: 'Use-case Overlays' },
    { id: 'specs', title: 'Specifications' },
    { id: 'do-dont', title: 'Do & Don’t' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'performance', title: 'Performance' },
  ],
};

// Full-screen template previews render outside the documentation shell.
const IS_LOGIN_PREVIEW = window.location.pathname === LOGIN_PREVIEW_PATH;
const IS_REGISTER_PREVIEW = window.location.pathname === REGISTER_PREVIEW_PATH;
const IS_DASHBOARD_PREVIEW = window.location.pathname === DASHBOARD_PREVIEW_PATH;
const IS_PROFILE_PREVIEW = window.location.pathname === PROFILE_PREVIEW_PATH;
const IS_SETTINGS_PREVIEW = window.location.pathname === SETTINGS_PREVIEW_PATH;
const IS_ERRORS_PREVIEW = window.location.pathname === ERRORS_PREVIEW_PATH;
const IS_FORMS_PREVIEW = window.location.pathname === FORMS_PREVIEW_PATH;
const IS_LIVE_VIEW_PREVIEW = window.location.pathname === LIVE_VIEW_PREVIEW_PATH;

/** Pages loaded on demand; their "On this page" items wait until the page has rendered. */
const LAZY_PAGES = [LOGIN_PAGE_PATH, REGISTER_PAGE_PATH, DASHBOARD_PAGE_PATH, PROFILE_PAGE_PATH, SETTINGS_PAGE_PATH, ERRORS_PAGE_PATH, FORMS_PAGE_PATH, LIVE_VIEW_PAGE_PATH];

/** Calls onMount once its Suspense boundary has resolved, i.e. after the lazy page is in the DOM. */
const MountSignal: React.FC<{ onMount: () => void }> = ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, []); // once per mount
  return null;
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    const isValid = PAGES.some((p) => p.path === path);
    return isValid ? path : '/foundations/overview';
  });
  // "On this page" looks up section ids when it mounts, so a lazy page gets its items once it has rendered.
  const [readyLazyPath, setReadyLazyPath] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const isValid = PAGES.some((p) => p.path === path);
      if (isValid) {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentPath) {
      case '/foundations/overview':
        return <OverviewPage onNavigate={handleNavigate} />;
      case '/foundations/brand-logo':
        return <BrandLogoPage />;
      case '/foundations/colors':
        return <ColorsPage />;
      case '/foundations/typography':
        return <TypographyPage />;
      case '/foundations/spacing-layout':
        return <SpacingLayoutPage />;
      case '/foundations/iconography':
        return <IconographyPage />;

      case '/components/buttons':
        return <ButtonsPage />;
      case '/components/links':
        return <LinksPage />;
      case '/components/form-inputs':
        return <FormInputsPage />;
      case '/components/selection-controls':
        return <SelectionControlsPage />;
      case '/components/date-pickers': return <DatePickersPage />;
      case '/components/cards-kpi':
        return <CardsKpiPage />;
      case '/components/tables':
        return <TablesPage />;
      case '/components/badges-status':
        return <BadgesStatusPage />;
      case '/components/alerts-toasts':
        return <AlertsModalsPage />;
      case '/components/navigation':
        return <NavigationPage />;
      case '/components/tabs': return <TabsPage />;
      case '/components/charts':
        return <ChartsPage />;

      case '/guidelines/accessibility':
        return <AccessibilityPage />;
      case '/guidelines/content-writing':
        return <ContentWritingPage />;
      case '/guidelines/design-tokens':
        return <DesignTokensPage />;
      case '/guidelines/review-checklist':
        return <ReviewChecklistPage />;

      case LOGIN_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <LoginTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(LOGIN_PAGE_PATH)} />
          </Suspense>
        );
      case REGISTER_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <RegisterTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(REGISTER_PAGE_PATH)} />
          </Suspense>
        );
      case DASHBOARD_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <DashboardTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(DASHBOARD_PAGE_PATH)} />
          </Suspense>
        );
      case PROFILE_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <ProfileTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(PROFILE_PAGE_PATH)} />
          </Suspense>
        );
      case SETTINGS_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <SettingsTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(SETTINGS_PAGE_PATH)} />
          </Suspense>
        );
      case ERRORS_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <ErrorsTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(ERRORS_PAGE_PATH)} />
          </Suspense>
        );
      case FORMS_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <FormsTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(FORMS_PAGE_PATH)} />
          </Suspense>
        );
      case LIVE_VIEW_PAGE_PATH:
        return (
          <Suspense fallback={<div role="status" className="min-h-[60vh]" aria-label="Loading page" />}>
            <LiveViewTemplatePage />
            <MountSignal onMount={() => setReadyLazyPath(LIVE_VIEW_PAGE_PATH)} />
          </Suspense>
        );

      default:
        return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  const currentToc = LAZY_PAGES.includes(currentPath) && readyLazyPath !== currentPath ? [] : TOC_MAP[currentPath] || [];

  if (IS_LOGIN_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <LoginPreviewRoute />
      </Suspense>
    );
  }

  if (IS_REGISTER_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <RegisterPreviewRoute />
      </Suspense>
    );
  }

  if (IS_DASHBOARD_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <DashboardPreviewRoute />
      </Suspense>
    );
  }

  if (IS_PROFILE_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <ProfilePreviewRoute />
      </Suspense>
    );
  }

  if (IS_SETTINGS_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <SettingsPreviewRoute />
      </Suspense>
    );
  }

  if (IS_ERRORS_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <ErrorPreviewRoute />
      </Suspense>
    );
  }

  if (IS_FORMS_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <FormsPreviewRoute />
      </Suspense>
    );
  }
  if (IS_LIVE_VIEW_PREVIEW) {
    return (
      <Suspense fallback={null}>
        <LiveViewPreviewRoute />
      </Suspense>
    );
  }

  return (
    <ToastProvider>
      <AppLayout
        currentPath={currentPath}
        onNavigate={handleNavigate}
        tocItems={currentToc}
      >
        {renderActivePage()}
      </AppLayout>
    </ToastProvider>
  );
}
