import React, { useMemo, useRef, useState } from 'react';
import { AppShell } from '../../dashboard/shell/AppShell';
import { initialAlerts } from '../../dashboard/data/alerts';
import { getDashboardUseCase } from '../../dashboard/data/useCases';
import { LOGIN_PREVIEW_PATH } from '../../login/paths';

/** The GENERIC product shell (Dashboard template) around every form pattern. */
export const FormShell: React.FC<{ fillViewport: boolean; children: React.ReactNode }> = ({ fillViewport, children }) => {
  const useCase = getDashboardUseCase('generic');
  const alerts = useMemo(() => initialAlerts('generic', false), []);
  const searchRef = useRef<HTMLInputElement>(null);
  const [site, setSite] = useState(useCase.site);
  const [live, setLive] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`@container w-full ${fillViewport ? 'h-screen' : 'h-full'}`}>
      <AppShell
        useCase={useCase}
        userCollapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        searchRef={searchRef}
        onSearch={() => undefined}
        site={site}
        onSiteChange={setSite}
        live={live}
        onToggleLive={() => setLive((l) => !l)}
        alerts={alerts}
        unread={alerts.length}
        signOutHref={`${LOGIN_PREVIEW_PATH}?usecase=generic`}
        newTab={!fillViewport}
        anatomy={{ sidebar: null, topBar: null }}
        landmarkMain={fillViewport}
        activeNavId={null}
        contentLabel="Form content"
      >
        {children}
      </AppShell>
    </div>
  );
};

interface FormLayoutProps {
  /** ["Records", "New record"]: the last item is the current page. */
  breadcrumb: string[];
  title: string;
  description: string;
  /** Header actions (e.g. Edit in read-only mode). */
  headerAction?: React.ReactNode;
  /** "All fields are required unless marked (optional)." */
  requiredNote?: boolean;
  /** Error summary, duplicate or server alerts above the form. */
  alerts?: React.ReactNode;
  /** Sticky action bar. */
  actionBar?: React.ReactNode;
  /** Wider body (sectioned form with its index). Default: 720px form. */
  wide?: boolean;
  /** Extra line under the description (e.g. "Last updated by …"). */
  meta?: React.ReactNode;
  marker?: (n: number) => React.ReactNode;
  children: React.ReactNode;
}

/**
 * Form page inside the shell: breadcrumb, H1, description and the required note, then sections
 * (max 720px), with the sticky action bar along the bottom of the content area.
 */
export const FormLayout: React.FC<FormLayoutProps> = ({ breadcrumb, title, description, headerAction, requiredNote = true, alerts, actionBar, wide = false, meta, marker, children }) => {
  const m = marker ?? (() => null);
  return (
    <div className="min-h-full flex flex-col">
      <div className={`flex-1 w-full mx-auto p-4 @min-[768px]:p-6 @min-[1280px]:p-8 ${wide ? 'max-w-[1264px]' : 'max-w-[784px]'}`}>
        <nav aria-label="Breadcrumb" className="relative inline-block">
          {m(1)}
          <ol className="flex flex-wrap items-center gap-1.5 text-[12px] leading-[16px] text-[#4B5465]">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={b}>
                {i > 0 && <li aria-hidden="true">/</li>}
                <li aria-current={i === breadcrumb.length - 1 ? 'page' : undefined} className={i === breadcrumb.length - 1 ? 'font-medium text-[#353D4C]' : ''}>
                  {i < breadcrumb.length - 1 ? (
                    <a href="#records" onClick={(e) => e.preventDefault()} className="hover:text-[#1E63FF] hover:underline rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF]">
                      {b}
                    </a>
                  ) : (
                    b
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <header className="relative mt-3 flex flex-col @min-[640px]:flex-row @min-[640px]:items-start justify-between gap-3">
          {m(2)}
          <div className="min-w-0">
            <h1 className="text-[24px] leading-[32px] font-semibold text-[#121722]">{title}</h1>
            <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">{description}</p>
            {meta && <p className="mt-1 text-[12px] leading-[16px] text-[#6B7485]">{meta}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </header>
        {requiredNote && (
          <p className="relative mt-2 inline-block text-[12px] leading-[16px] text-[#6B7485]">
            {m(3)}
            All fields are required unless marked (optional).
          </p>
        )}

        {alerts && <div className="mt-6 space-y-3">{alerts}</div>}
        <div className="mt-6">{children}</div>
      </div>
      {actionBar}
    </div>
  );
};
