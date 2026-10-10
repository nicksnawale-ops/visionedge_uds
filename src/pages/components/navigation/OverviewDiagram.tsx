import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Logo } from '../../../components/brand/Logo';
import { Legend, Marker } from './shared/Marker';

const PARTS: [string, string][] = [
  ['Left sidebar', 'Global navigation between product areas.'],
  ['Top bar', 'Utilities: search, site, status, help, notifications, user.'],
  ['Breadcrumbs', 'Where this page sits; links to its ancestors.'],
  ['Page header', 'Title, status, back link and page actions.'],
  ['Content', 'The page itself.'],
  ['In-page navigation', '"On this page" for long pages.'],
];

/** Scaled mini VisionEdge frame with numbered markers and a legend. */
export const OverviewDiagram: React.FC = () => (
  <figure className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden">
    <div className="preview-grid-canvas p-5 md:p-8 overflow-x-auto">
      <div aria-hidden="true" className="relative min-w-[600px] max-w-[760px] mx-auto h-[360px] flex rounded-[8px] border border-[#DDE2EA] bg-white overflow-visible">
        {/* 1 sidebar */}
        <div className="relative w-[120px] shrink-0 bg-[#0B2D6B] rounded-l-[8px] p-2.5 space-y-1.5">
          <Marker n={1} className="-top-2.5 -left-2.5" />
          <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-white/10">
            <Logo size={16} />
            <span className="h-2 w-12 rounded bg-white/70" />
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`relative block h-5 rounded-[4px] ${i === 2 ? 'bg-white/10' : ''}`}>
              {i === 2 && <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#00C6FF]" />}
              <span className={`absolute left-2 top-2 h-1 rounded ${i === 2 ? 'w-14 bg-white' : 'w-12 bg-white/50'}`} />
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {/* 2 top bar */}
          <div className="relative h-10 shrink-0 px-3 flex items-center gap-2 border-b border-[#DDE2EA]">
            <Marker n={2} className="-top-2.5 right-24" />
            {/* 3 breadcrumbs */}
            <span className="relative flex items-center gap-1 text-[9px] text-[#4B5465]">
              <Marker n={3} className="-bottom-6 left-0" />
              Reports <span className="text-[#C3CAD5]">/</span> Vehicle log <span className="text-[#C3CAD5]">/</span> <span className="text-[#121722] font-medium">Export</span>
            </span>
            <span className="ml-auto w-32 h-6 rounded-[4px] border border-[#8C95A6] flex items-center px-1.5 gap-1">
              <Search className="w-2.5 h-2.5 text-[#6B7485]" />
              <span className="h-1 w-10 rounded bg-[#DDE2EA]" />
            </span>
            <Bell className="w-3.5 h-3.5 text-[#4B5465]" />
            <span className="w-5 h-5 rounded-full bg-[#1E63FF]" />
          </div>
          <div className="flex-1 min-h-0 flex gap-4 p-4">
            <div className="flex-1 min-w-0 space-y-3">
              {/* 4 page header */}
              <div className="relative pt-1">
                <Marker n={4} className="-top-1 -left-2.5" />
                <span className="block text-[8px] font-medium text-[#1E63FF]">← Back to vehicle log</span>
                <span className="mt-1 flex items-center justify-between">
                  <span className="h-3 w-28 rounded bg-[#121722]" />
                  <span className="h-4 w-14 rounded-[4px] bg-[#1E63FF]" />
                </span>
                <span className="mt-1.5 block h-1.5 w-40 rounded bg-[#C3CAD5]" />
              </div>
              {/* 5 content */}
              <div className="relative grid grid-cols-2 gap-2">
                <Marker n={5} className="-top-2.5 -left-2.5" />
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[72px] rounded-[6px] border border-[#DDE2EA] bg-[#F7F9FC]" />
                ))}
              </div>
            </div>
            {/* 6 in-page navigation */}
            <div className="relative w-[90px] shrink-0 pl-2 border-l border-[#DDE2EA] space-y-1.5">
              <Marker n={6} className="-top-2.5 -left-2.5" />
              <span className="block h-1 w-12 rounded bg-[#8C95A6]" />
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`block h-1.5 rounded ${i === 1 ? 'w-14 bg-[#1E63FF]' : 'w-12 bg-[#DDE2EA]'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <figcaption className="sr-only">Navigation layout of a VisionEdge page. The legend below describes each numbered part.</figcaption>
    <Legend parts={PARTS} />
  </figure>
);
