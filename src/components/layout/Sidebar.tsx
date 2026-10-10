import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  Palette,
  Type,
  LayoutGrid,
  Sparkles,
  MousePointerClick,
  Link2,
  FormInput,
  CheckSquare,
  CalendarDays,
  CreditCard,
  Table2,
  BadgeAlert,
  BellRing,
  Navigation,
  PanelTop,
  BarChart3,
  ShieldCheck,
  FileEdit,
  Code,
  ListTodo,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Cctv,
  UserCircle,
  Settings,
  AlertTriangle,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { NAV_GROUPS, PageMeta } from '../../data/pages';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// Map page ids to Lucide icons
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  overview: Compass,
  'brand-logo': BookOpen,
  colors: Palette,
  typography: Type,
  'spacing-layout': LayoutGrid,
  iconography: Sparkles,
  buttons: MousePointerClick,
  links: Link2,
  'form-inputs': FormInput,
  'selection-controls': CheckSquare,
  'date-pickers': CalendarDays,
  'cards-kpi': CreditCard,
  tables: Table2,
  'badges-status': BadgeAlert,
  'alerts-toasts': BellRing,
  navigation: Navigation,
  tabs: PanelTop,
  charts: BarChart3,
  accessibility: ShieldCheck,
  'content-writing': FileEdit,
  'design-tokens': Code,
  'review-checklist': ListTodo,
  'login-page': LogIn,
  'register-page': UserPlus,
  'dashboard-page': LayoutDashboard,
  'live-view-page': Cctv,
  'profile-page': UserCircle,
  'settings-page': Settings,
  'error-pages': AlertTriangle,
  'form-pages': ClipboardList,
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isMobileOpen,
  onMobileClose,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('ve_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ve_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const handleItemClick = (path: string) => {
    onNavigate(path);
    if (isMobileOpen) {
      onMobileClose();
    }
  };

  const renderNavGroup = (name: string, items: PageMeta[]) => {
    return (
      <div key={name} className="py-2">
        {!collapsed && (
          <div className="px-4 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C3CAD5]">
            {name}
          </div>
        )}
        <div className="space-y-0.5 px-2">
          {items.map((item) => {
            const Icon = ICON_MAP[item.id] || Compass;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.path)}
                title={collapsed ? `${item.title} — ${item.description}` : undefined}
                className={`w-full h-[40px] flex items-center rounded-[8px] text-[14px] font-medium transition-all group relative ${
                  collapsed ? 'justify-center px-0' : 'px-3 justify-between'
                } ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {/* 3px Cyan Left Bar for active state */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#00C6FF] rounded-r" />
                )}

                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#00C6FF]' : 'text-white/70 group-hover:text-white'}`} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </div>

                {!collapsed && item.updated && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#00C6FF]/15 text-[#00C6FF] border border-[#00C6FF]/30 uppercase tracking-wider">
                    Updated
                  </span>
                )}

                {!collapsed && item.isNew && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#00C6FF]/15 text-[#00C6FF] border border-[#00C6FF]/30 uppercase tracking-wider">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Drawer Backdrop (50% Black Scrim) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0B2D6B] text-white flex flex-col transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        } ${
          isMobileOpen
            ? 'translate-x-0 !w-[280px]'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Logo Section */}
        <div className="h-[64px] flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          {collapsed && !isMobileOpen ? (
            <div className="w-full flex justify-center cursor-pointer" onClick={() => onNavigate('/foundations/overview')}>
              <Logo size={32} />
            </div>
          ) : (
            <div
              className="cursor-pointer flex items-center gap-3"
              onClick={() => onNavigate('/foundations/overview')}
            >
              <Logo size={32} />
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-white tracking-tight leading-tight">
                  VisionEdge
                </span>
                <span className="text-[11px] font-normal text-[#C3CAD5] leading-tight">
                  Design System v1.0
                </span>
              </div>
            </div>
          )}

          {/* Mobile close button */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto sidebar-scroll py-2 divide-y divide-white/5">
          {NAV_GROUPS.map((group) => renderNavGroup(group.name, group.items))}
        </div>

        {/* Footer Collapse Toggle */}
        <div className="p-3 border-t border-white/10 shrink-0 hidden md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 h-[40px] px-3 rounded-[8px] text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-5 h-5 shrink-0" />
                <span className="truncate">Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
