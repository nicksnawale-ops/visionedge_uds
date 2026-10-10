import React, { useState, useEffect } from 'react';

export interface TocItem {
  id: string;
  title: string;
}

interface OnThisPageProps {
  items: TocItem[];
}

export const OnThisPage: React.FC<OnThisPageProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <aside className="hidden xl:block w-[220px] shrink-0 sticky top-[88px] max-h-[calc(100vh-100px)] overflow-y-auto pl-4 border-l border-[#DDE2EA]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7485] mb-3">
        On this page
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left py-1 text-[13px] transition-colors relative pl-3 ${
                isActive
                  ? 'text-[#1E63FF] font-medium'
                  : 'text-[#4B5465] hover:text-[#121722]'
              }`}
            >
              {isActive && (
                <span className="absolute left-[-17px] top-1 bottom-1 w-[2px] bg-[#1E63FF]" />
              )}
              <span className="truncate block">{item.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
