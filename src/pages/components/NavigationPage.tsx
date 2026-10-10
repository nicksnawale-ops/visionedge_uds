import React from 'react';
import { Info } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DoDontPair } from '../../components/common/DoDont';
import { ExampleFrame } from './navigation/ExampleFrame';
import { OverviewDiagram } from './navigation/OverviewDiagram';
import {
  ACCESSIBILITY,
  BREADCRUMB_RULES,
  CONTENT_RULES,
  CONTENT_TABLE,
  HIERARCHY,
  PAGE_HEADER_RULES,
  PAGINATION_RULES,
  SIDEBAR_RULES,
  SPEC_ROWS,
  TOPBAR_RULES,
} from './navigation/navigationSpec';
import { SidebarPlayground } from './navigation/demos/SidebarPlayground';
import { NESTED_CODE, NestedNavDemo } from './navigation/demos/NestedNavDemo';
import { CollapsedRailDemo, RAIL_CODE } from './navigation/demos/CollapsedRailDemo';
import { SidebarAnatomy, TopBarAnatomy } from './navigation/demos/Anatomy';
import { TopBarPlayground } from './navigation/demos/TopBarPlayground';
import { CommandPaletteDemo, PALETTE_CODE, ShortcutList } from './navigation/demos/CommandPaletteDemo';
import { NOTIFICATIONS_CODE, NotificationsDemo } from './navigation/demos/NotificationsDemo';
import { USER_MENU_CODE, UserMenuDemo } from './navigation/demos/UserMenuDemo';
import { BREADCRUMBS_CODE, BreadcrumbsDemo } from './navigation/demos/BreadcrumbsDemo';
import { DetailHeaderDemo, EditHeaderDemo, ListDetailDemo, PAGE_HEADER_CODE } from './navigation/demos/PageHeaderDemo';
import { HorizontalStepperDemo, STEPPER_CODE, StepStates, VerticalStepperDemo } from './navigation/demos/StepperDemo';
import { CompactDemo, InfiniteFeedDemo, LoadMoreDemo, NumberedDemo, PAGINATION_CODE } from './navigation/demos/PaginationDemo';
import { IN_PAGE_CODE, InPageNavDemo } from './navigation/demos/InPageNavDemo';
import { MOBILE_CODE, MobileNavDemo } from './navigation/demos/MobileNavDemo';
import { DoDontVisuals } from './navigation/demos/DoDontVisuals';

const H2 = 'text-[20px] leading-[28px] font-semibold text-[#121722] mb-1';
const H3 = 'text-[16px] font-semibold text-[#121722] mt-8 mb-3';
const LEAD = 'text-[14px] leading-[20px] text-[#4B5465] mb-5 max-w-2xl';
const TH = 'py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-left';
const TABLE_WRAP = 'overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]';

const Section: React.FC<{ id: string; title: string; lead?: string; children: React.ReactNode }> = ({ id, title, lead, children }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="mb-14 scroll-mt-24">
    <h2 id={`${id}-h`} className={H2}>
      {title}
    </h2>
    {lead ? <p className={LEAD}>{lead}</p> : <div className="mb-5" />}
    {children}
  </section>
);

/** Two-column list of written rules. */
const Rules: React.FC<{ title?: string; rows: [string, string][] }> = ({ title = 'Rules', rows }) => (
  <>
    <h3 className={H3}>{title}</h3>
    <dl className="rounded-[12px] border border-[#DDE2EA] bg-white divide-y divide-[#DDE2EA]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-1 sm:gap-4 px-4 py-3">
          <dt className="text-[14px] font-semibold text-[#121722]">{k}</dt>
          <dd className="text-[14px] leading-[20px] text-[#4B5465]">{v}</dd>
        </div>
      ))}
    </dl>
  </>
);

/** Same-tab navigation through the app's own history handling (no change to routes). */
const goTo = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
};

const TabsLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <a href="/components/tabs" onClick={(e) => goTo(e, '/components/tabs')} className="font-medium text-[#1E63FF] hover:underline rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2">
    {children}
  </a>
);

export const NavigationPage: React.FC = () => (
  <div>
    <PageHeader
      category="COMPONENTS"
      title="Navigation"
      description="How users move around VisionEdge: the left sidebar, top bar, breadcrumbs, page headers, steppers, pagination and search. Tabs are documented separately."
    />

    {/* Where the tabs example used to be */}
    <div className="mb-10 flex items-start gap-3 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] px-4 py-3">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
      <p className="text-[14px] text-[#353D4C]">
        Looking for tabs? See the <TabsLink>Tabs page</TabsLink> for all tab types and rules.
      </p>
    </div>

    <Section id="overview" title="Navigation Overview" lead="Every VisionEdge screen uses the same frame. Each level of navigation has one component.">
      <OverviewDiagram />
      <h3 className={H3}>Navigation hierarchy</h3>
      <div className={TABLE_WRAP}>
        <table className="w-full min-w-[560px] border-collapse text-[14px]">
          <caption className="sr-only">Navigation hierarchy</caption>
          <thead>
            <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
              <th scope="col" className={TH}>
                Level
              </th>
              <th scope="col" className={TH}>
                Component
              </th>
              <th scope="col" className={TH}>
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EA]">
            {HIERARCHY.map(([level, comp, ex]) => (
              <tr key={level}>
                <th scope="row" className="py-3 px-4 text-left font-semibold text-[#121722]">
                  {level}
                </th>
                <td className="py-3 px-4 text-[#353D4C]">{comp}</td>
                <td className="py-3 px-4 text-[#4B5465]">{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section id="sidebar" title="Left Sidebar" lead="Global navigation. Try every mode and option; the replica follows all the rules below.">
      <SidebarPlayground />
      <h3 className={H3}>Anatomy</h3>
      <SidebarAnatomy />
      <h3 className={H3}>Nested items and collapsed rail</h3>
      <div className="space-y-8">
        <ExampleFrame title="Nested items" useWhen="an area has 2–5 closely related pages. Never more than 2 levels." code={NESTED_CODE}>
          <NestedNavDemo />
        </ExampleFrame>
        <ExampleFrame title="Collapsed rail" useWhen="people need more room for content, such as live view walls. Every icon has a tooltip." code={RAIL_CODE}>
          <CollapsedRailDemo />
        </ExampleFrame>
      </div>
      <Rules title="Sidebar standards" rows={SIDEBAR_RULES} />
    </Section>

    <Section id="top-bar" title="Top Bar" lead="Utilities that stay the same on every page. Change the width to see what moves.">
      <TopBarPlayground />
      <h3 className={H3}>Anatomy</h3>
      <TopBarAnatomy />
      <Rules title="Top bar standards" rows={TOPBAR_RULES} />
    </Section>

    <Section id="command-palette" title="Command Palette" lead="Search for pages, actions and settings from anywhere. Opens with Ctrl K (Cmd K) or “/”.">
      <ExampleFrame title="Command palette" useWhen="the product has more pages than the sidebar shows, or people repeat actions often." code={PALETTE_CODE} maxWidth="max-w-[880px]">
        <CommandPaletteDemo />
      </ExampleFrame>
      <h3 className={H3}>Keyboard shortcuts</h3>
      <div className="rounded-[12px] border border-[#DDE2EA] bg-white px-4 py-2">
        <ShortcutList />
      </div>
      <p className="mt-3 text-[13px] text-[#4B5465]">Single-key shortcuts never fire while typing in a field. In these demos, shortcuts only work while focus is inside the demo.</p>
    </Section>

    <Section id="notifications" title="Notifications & User Menu">
      <div className="space-y-8">
        <ExampleFrame title="Notifications" useWhen="events need attention but not an interruption. Urgent alerts use a banner or toast instead." code={NOTIFICATIONS_CODE}>
          <NotificationsDemo />
        </ExampleFrame>
        <ExampleFrame title="User menu" useWhen="always, at the right end of the top bar: profile, settings, shortcuts, help and sign out." code={USER_MENU_CODE}>
          <UserMenuDemo />
        </ExampleFrame>
      </div>
    </Section>

    <Section id="breadcrumbs" title="Breadcrumbs" lead="Show where a page sits and link to its ancestors.">
      <ExampleFrame title="Breadcrumbs" useWhen="pages are 3 or more levels deep. Not on top-level pages." code={BREADCRUMBS_CODE}>
        <BreadcrumbsDemo />
      </ExampleFrame>
      <Rules rows={BREADCRUMB_RULES} />
    </Section>

    <Section id="page-header" title="Page Header & Back Navigation" lead="Every page starts the same way. Detail pages add a back link to their list.">
      <div className="space-y-8">
        <ExampleFrame title="List page" useWhen="showing a collection. Open a row, then use the back link: the filter and scroll are kept." code={PAGE_HEADER_CODE}>
          <ListDetailDemo />
        </ExampleFrame>
        <ExampleFrame title="Detail page" useWhen="showing one record. Back link, status badge, 1 Primary + 2 Secondary, the rest in a menu." code={PAGE_HEADER_CODE}>
          <DetailHeaderDemo />
        </ExampleFrame>
        <ExampleFrame title="Edit page" useWhen="editing a record. The back link names where you return to; Save is the only Primary." code={PAGE_HEADER_CODE}>
          <EditHeaderDemo />
        </ExampleFrame>
      </div>
      <Rules rows={PAGE_HEADER_RULES} />
    </Section>

    <Section id="stepper" title="Stepper" lead="Progress through a sequential process of up to 5 steps.">
      <div className="space-y-8">
        <ExampleFrame title="Horizontal stepper" useWhen="a short sequential flow (2–5 steps) such as registering a vehicle." code={STEPPER_CODE}>
          <HorizontalStepperDemo />
        </ExampleFrame>
        <ExampleFrame title="Vertical stepper" useWhen="a long setup flow where each step needs a short description." code={STEPPER_CODE}>
          <VerticalStepperDemo />
        </ExampleFrame>
        <ExampleFrame title="Step states" useWhen="checking a custom step against the system." code={STEPPER_CODE}>
          <StepStates />
        </ExampleFrame>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC] px-4 py-3">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#1E63FF]" aria-hidden="true" />
        <p className="text-[14px] text-[#353D4C]">
          A stepper is for sequential processes only. For switching views, see the <TabsLink>Tabs page</TabsLink>.
        </p>
      </div>
    </Section>

    <Section id="pagination" title="Pagination" lead="Move through large sets of data.">
      <div className="space-y-8">
        <ExampleFrame title="Numbered" useWhen="tables and long lists where people jump to a page. Change the filter: it resets to page 1." code={PAGINATION_CODE}>
          <NumberedDemo />
        </ExampleFrame>
        <ExampleFrame title="Compact" useWhen="cards and mobile views with little room." code={PAGINATION_CODE}>
          <CompactDemo />
        </ExampleFrame>
        <ExampleFrame title="Load more" useWhen="people browse casually and rarely need a specific page." code={PAGINATION_CODE}>
          <LoadMoreDemo />
        </ExampleFrame>
        <ExampleFrame title="Infinite scroll" useWhen="live feeds and logs only. Scroll down, wait: new events collect in a pill." code={PAGINATION_CODE}>
          <InfiniteFeedDemo />
        </ExampleFrame>
      </div>
      <Rules rows={PAGINATION_RULES} />
    </Section>

    <Section id="in-page-nav" title="In-Page Navigation" lead="Help people move within a long page.">
      <ExampleFrame title="On this page, anchors, back to top, skip link" useWhen="a page has 4 or more sections. Tab into the frame first to see the skip link." code={IN_PAGE_CODE} maxWidth="max-w-[880px]">
        <InPageNavDemo />
      </ExampleFrame>
    </Section>

    <Section id="mobile-nav" title="Mobile Navigation" lead="Below 768px the sidebar becomes a drawer; operator views may add bottom navigation.">
      <ExampleFrame title="Drawer and bottom navigation" useWhen="screens under 768px. Bottom navigation only for operator and field views with 3–5 frequent destinations." code={MOBILE_CODE}>
        <MobileNavDemo />
      </ExampleFrame>
    </Section>

    <Section id="specs" title="Specifications">
      <div className={TABLE_WRAP}>
        <table className="w-full min-w-[760px] border-collapse text-[14px]">
          <caption className="sr-only">Navigation specifications</caption>
          <thead>
            <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
              {['Component', 'Property', 'Value', 'Token / Class'].map((h) => (
                <th key={h} scope="col" className={TH}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EA]">
            {SPEC_ROWS.map(([comp, prop, value, token]) => (
              <tr key={comp + prop} className="hover:bg-[#F7F9FC]">
                <td className="py-3 px-4 text-[#4B5465] whitespace-nowrap">{comp}</td>
                <th scope="row" className="py-3 px-4 text-left font-medium text-[#121722] whitespace-nowrap">
                  {prop}
                </th>
                <td className="py-3 px-4 text-[#353D4C]">{value}</td>
                <td className="py-3 px-4">
                  <code className="px-2 py-0.5 rounded bg-[#F7F9FC] border border-[#DDE2EA] font-mono text-[12px] text-[#1E63FF] font-medium">{token}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section id="do-dont" title="Do & Don’t">
      <DoDontPair
        className="mt-0"
        doTitle="Do use 3px Cyan left indicator on Deep Navy sidebar items"
        doDescription="Cyan provides maximum contrast against Deep Navy without overwhelming the visual rhythm of the drawer."
        doExample={
          <div className="bg-[#0B2D6B] p-2 rounded w-48 relative">
            <div className="bg-white/10 text-white p-2 rounded text-[13px] font-medium flex items-center gap-2">
              <span className="w-1 h-4 bg-[#00C6FF] rounded-r -ml-2" />
              <span>Command Center</span>
            </div>
          </div>
        }
        dontTitle="Don't use gradients or multi-colored active bars"
        dontDescription="Gradients introduce visual noise that conflicts with camera video monitoring screens."
        dontExample={
          <div className="bg-[#0B2D6B] p-2 rounded w-48">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded text-[13px]">Command Center</div>
          </div>
        }
      />
      <DoDontVisuals />
    </Section>

    <Section id="accessibility" title="Accessibility" lead="Every demo on this page implements these rules.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACCESSIBILITY.map((a) => (
          <div key={a.title} className="rounded-[12px] border border-[#DDE2EA] bg-white p-5">
            <h3 className="text-[14px] font-semibold text-[#121722]">{a.title}</h3>
            <p className="mt-1 text-[14px] leading-[20px] text-[#4B5465]">{a.text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="content" title="Content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ul className="space-y-2.5 list-disc pl-5 marker:text-[#1E63FF]">
          {CONTENT_RULES.map((r) => (
            <li key={r} className="text-[14px] leading-[20px] text-[#353D4C]">
              {r}
            </li>
          ))}
        </ul>
        <div className={TABLE_WRAP}>
          <table className="w-full border-collapse text-[14px]">
            <caption className="sr-only">Navigation label examples</caption>
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th scope="col" className={TH}>
                  Instead of
                </th>
                <th scope="col" className={TH}>
                  Write
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {CONTENT_TABLE.map(([bad, good]) => (
                <tr key={bad}>
                  <td className="py-3 px-4 text-[#4B5465]">{bad}</td>
                  <td className="py-3 px-4 font-medium text-[#121722]">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  </div>
);
