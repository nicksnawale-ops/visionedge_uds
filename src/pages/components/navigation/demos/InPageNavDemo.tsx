import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUp, Link2 } from 'lucide-react';
import { ELEV2, FOCUS_LIGHT, reducedMotion } from '../shared/navStyles';

const SECTIONS = ['Overview', 'Gate activity', 'Alerts', 'Visitors', 'Cameras', 'Settings'];

/**
 * In-page navigation inside a scrollable demo frame: skip link (first focusable), sticky 220px "On this page"
 * with scroll-spy, anchor headings with "Copy link", and a Back to top button after two screens.
 */
export const InPageNavDemo: React.FC = () => {
  const base = useId().replace(/:/g, '');
  const ids = useMemo(() => SECTIONS.map((s) => `${base}-${s.toLowerCase().replace(/\s+/g, '-')}`), [base]);
  const scroller = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ids[0]);
  const [showTop, setShowTop] = useState(false);
  const [copied, setCopied] = useState('');
  const copyTimer = useRef<number | undefined>(undefined);

  const onScroll = useCallback(() => {
    const sc = scroller.current;
    if (!sc) return;
    setShowTop(sc.scrollTop > sc.clientHeight * 2);
    const top = sc.getBoundingClientRect().top;
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top - top <= 48) current = id;
    }
    // At the very bottom, the last section is current.
    if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2) current = ids[ids.length - 1];
    setActive(current);
  }, [ids]);

  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    sc.addEventListener('scroll', onScroll, { passive: true });
    return () => sc.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const go = (id: string) => {
    const sc = scroller.current;
    const el = document.getElementById(id);
    if (!sc || !el) return;
    const y = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 8;
    sc.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
    el.focus({ preventScroll: true });
    setActive(id);
    // Update the hash without letting the browser jump the page.
    window.history.replaceState(window.history.state, '', `#${id}`);
  };

  const copy = async (id: string, label: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(`Link to “${label}” copied`);
    } catch {
      setCopied(`Copy failed. Link: ${url}`);
    }
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(''), 2500);
  };

  return (
    <div className="relative rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden">
      {/* Skip link: the first focusable element; visible only on focus */}
      <a
        href={`#${base}-main`}
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:top-2 focus:left-2 focus:h-10 focus:px-4 focus:inline-flex focus:items-center focus:rounded-[8px] focus:bg-[#1E63FF] focus:text-white focus:text-[14px] focus:font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
      >
        Skip to main content
      </a>
      <div className="h-14 px-4 flex items-center gap-4 border-b border-[#DDE2EA] text-[14px]">
        <span className="font-semibold text-[#121722] mr-auto">Gate report</span>
        {['Dashboard', 'Reports', 'Help'].map((l) => (
          <a key={l} href="#in-page-nav" onClick={(e) => e.preventDefault()} className={`text-[#4B5465] hover:text-[#1E63FF] rounded-[4px] ${FOCUS_LIGHT}`}>
            {l}
          </a>
        ))}
      </div>
      <div ref={scroller} className="@container h-[440px] overflow-y-auto">
        <div className="flex gap-8 p-5">
          <div ref={mainRef} id={`${base}-main`} tabIndex={-1} className="flex-1 min-w-0 outline-none space-y-8">
            {SECTIONS.map((s, i) => (
              <section key={s} aria-labelledby={ids[i]}>
                <div className="group flex items-center gap-1">
                  <h4 id={ids[i]} tabIndex={-1} className="scroll-mt-2 text-[18px] font-semibold text-[#121722] outline-none">
                    {s}
                  </h4>
                  <button
                    type="button"
                    onClick={() => copy(ids[i], s)}
                    aria-label={`Copy link to ${s}`}
                    className={`w-8 h-8 rounded-[8px] inline-flex items-center justify-center text-[#4B5465] hover:bg-[#EEF1F6] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 ${FOCUS_LIGHT}`}
                  >
                    <Link2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-2 text-[14px] leading-[22px] text-[#4B5465]">
                  {s} for North campus. Scroll and watch the list on the right follow along; hover a heading for its link.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3" aria-hidden="true">
                  {Array.from({ length: 4 }, (_, k) => (
                    <span key={k} className="h-16 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]" />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="hidden @min-[600px]:block w-[220px] shrink-0 self-start sticky top-0 pl-4 border-l border-[#DDE2EA]">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">On this page</p>
            <nav aria-label="On this page">
              <ul className="space-y-1">
                {SECTIONS.map((s, i) => {
                  const on = ids[i] === active;
                  return (
                    <li key={s} className="relative">
                      {on && <span aria-hidden="true" className="absolute -left-[17px] top-1 bottom-1 w-[2px] bg-[#1E63FF]" />}
                      <a
                        href={`#${ids[i]}`}
                        aria-current={on ? 'location' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          go(ids[i]);
                        }}
                        className={`block py-1 text-[14px] rounded-[4px] ${on ? 'text-[#1E63FF] font-medium' : 'text-[#4B5465] hover:text-[#121722]'} ${FOCUS_LIGHT}`}
                      >
                        {s}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      </div>
      {showTop && (
        <button
          type="button"
          onClick={() => {
            scroller.current?.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
            mainRef.current?.focus({ preventScroll: true });
          }}
          aria-label="Back to top"
          className={`absolute bottom-6 right-6 z-10 w-10 h-10 rounded-full bg-white border border-[#DDE2EA] text-[#121722] inline-flex items-center justify-center hover:bg-[#F7F9FC] ${ELEV2} ${FOCUS_LIGHT}`}
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
      <p role="status" className="sr-only">
        {copied}
      </p>
      {copied && <p aria-hidden="true" className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-[8px] bg-[#121722] text-white text-[13px]">{copied}</p>}
    </div>
  );
};

export const IN_PAGE_CODE = `// "On this page": sticky 220px column, scroll-spy, smooth scroll (instant with reduced motion), hash update
<aside className="w-[220px] sticky top-[88px] pl-4 border-l border-[#DDE2EA]">
  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">On this page</p>
  <nav aria-label="On this page">
    <a href="#alerts" aria-current="location" className="relative block py-1 text-[14px] font-medium text-[#1E63FF]">
      <span aria-hidden="true" className="absolute -left-[17px] top-1 bottom-1 w-[2px] bg-[#1E63FF]" />
      Alerts
    </a>
  </nav>
</aside>

// Skip link: first focusable element
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:h-10 focus:px-4 focus:rounded-[8px] focus:bg-[#1E63FF] focus:text-white">
  Skip to main content
</a>

// Back to top: after 2 screen heights
<button aria-label="Back to top" className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(11,45,107,0.12)]">
  <ArrowUp className="w-5 h-5" aria-hidden="true" />
</button>`;
