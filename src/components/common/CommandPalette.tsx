import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Hash, Layers, FileText, ArrowRight } from 'lucide-react';
import { PAGES, PageMeta } from '../../data/pages';
import { BRAND_COLORS, NEUTRAL_COLORS, SPACING_TOKENS, RADIUS_TOKENS, SHADOW_TOKENS } from '../../theme/tokens';
import { Logo } from '../brand/Logo';
import { useToast } from './Toast';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'page' | 'token' | 'color';
  payload: string; // path or copy value
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { copyToClipboard } = useToast();

  // Aggregate searchable items
  const allItems: SearchItem[] = useMemo(() => {
    const list: SearchItem[] = [];

    // Pages
    PAGES.forEach((page) => {
      list.push({
        id: `page-${page.id}`,
        title: page.title,
        subtitle: `${page.category} · ${page.description}`,
        category: 'Pages',
        type: 'page',
        payload: page.path,
      });
    });

    // Colors
    [...BRAND_COLORS, ...NEUTRAL_COLORS].forEach((c) => {
      list.push({
        id: `color-${c.name}`,
        title: `${c.name} (${c.hex})`,
        subtitle: `${c.variable} · ${c.role}`,
        category: 'Colors',
        type: 'color',
        payload: c.hex,
      });
    });

    // Spacing
    SPACING_TOKENS.forEach((s) => {
      list.push({
        id: `space-${s.name}`,
        title: `${s.name} (${s.value})`,
        subtitle: `${s.variable} · ${s.use}`,
        category: 'Spacing Tokens',
        type: 'token',
        payload: s.variable,
      });
    });

    // Radius
    RADIUS_TOKENS.forEach((r) => {
      list.push({
        id: `radius-${r.name}`,
        title: `${r.name} (${r.value})`,
        subtitle: `${r.variable} · ${r.use}`,
        category: 'Radius Tokens',
        type: 'token',
        payload: r.variable,
      });
    });

    // Shadows
    SHADOW_TOKENS.forEach((sh) => {
      list.push({
        id: `shadow-${sh.name}`,
        title: `${sh.name}`,
        subtitle: `${sh.variable} · ${sh.description}`,
        category: 'Elevation Tokens',
        type: 'token',
        payload: sh.value,
      });
    });

    return list;
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'page') {
      onNavigate(item.payload);
      onClose();
    } else {
      copyToClipboard(item.payload, item.title);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* 50% Black Scrim Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-xl bg-white rounded-[16px] border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#DDE2EA] gap-3">
          <Search className="w-5 h-5 text-[#8C95A6] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, tokens, colors, components..."
            className="w-full text-[15px] text-[#121722] placeholder-[#6B7485] bg-transparent outline-none border-none focus:ring-0 p-0"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#6B7485] hover:text-[#121722] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-[#6B7485] bg-[#F7F9FC] border border-[#DDE2EA]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#F7F9FC]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#6B7485] text-[14px]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-[8px] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F7F9FC] border-l-2 border-[#1E63FF]' : 'hover:bg-[#F7F9FC]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${
                        item.type === 'page'
                          ? 'bg-[#1E63FF]/10 text-[#1E63FF]'
                          : item.type === 'color'
                          ? 'border border-[#DDE2EA]'
                          : 'bg-[#F7F9FC] text-[#4B5465]'
                      }`}
                      style={
                        item.type === 'color'
                          ? { backgroundColor: item.payload }
                          : undefined
                      }
                    >
                      {item.type === 'page' && <FileText className="w-4 h-4" />}
                      {item.type === 'token' && <Hash className="w-4 h-4" />}
                      {item.type === 'color' && null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium text-[#121722] truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7485] px-1.5 py-0.5 rounded bg-[#EEF1F6]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#4B5465] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-[12px] text-[#1E63FF]">
                    <span>{item.type === 'page' ? 'Jump' : 'Copy'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Key hints */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#DDE2EA] bg-[#F7F9FC] text-[11px] text-[#6B7485]">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Logo size={14} />
            <span>VisionEdge Design System v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
