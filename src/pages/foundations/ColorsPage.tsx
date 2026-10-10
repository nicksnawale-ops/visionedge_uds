import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { BRAND_COLORS, NEUTRAL_COLORS } from '../../theme/tokens';
import { useToast } from '../../components/common/Toast';
import { DoDontPair } from '../../components/common/DoDont';
import { Copy, Check, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

export const ColorsPage: React.FC = () => {
  const { copyToClipboard } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Contrast Checker State
  const [fgColorHex, setFgColorHex] = useState<string>('#0B2D6B');
  const [bgColorHex, setBgColorHex] = useState<string>('#FFFFFF');

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text, label);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper for luminance calculation
  const getLuminance = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastRatio = getContrastRatio(fgColorHex, bgColorHex);
  const ratioFormatted = contrastRatio.toFixed(2);
  const passAANormal = contrastRatio >= 4.5;
  const passAALarge = contrastRatio >= 3.0;
  const passAAA = contrastRatio >= 7.0;

  const allPaletteColors = [...BRAND_COLORS, ...NEUTRAL_COLORS];

  return (
    <div>
      <PageHeader
        category="FOUNDATIONS"
        title="Colors"
        description="A closed palette of three high-intent brand colors and eleven calibrated neutrals. No other hues are permitted in VisionEdge production applications."
        updatedBadge
      />

      {/* 60-30-10 Usage Bar */}
      <section id="distribution-rule" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            60 · 30 · 10 Enterprise Distribution
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            VisionEdge maintains strict visual discipline. Color is concentrated at points of deliberate action, rather than decorative scatter.
          </p>
        </div>

        {/* Visual Bar */}
        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <div className="h-8 w-full rounded-[8px] overflow-hidden flex shadow-inner border border-[#DDE2EA] mb-4">
            <div className="w-[60%] bg-[#F7F9FC] border-r border-[#DDE2EA] flex items-center justify-center text-[11px] font-mono font-semibold text-[#4B5465]">
              60% Neutrals & Canvas
            </div>
            <div className="w-[30%] bg-[#0B2D6B] flex items-center justify-center text-[11px] font-mono font-semibold text-white">
              30% Deep Navy
            </div>
            <div className="w-[10%] bg-gradient-to-r from-[#1E63FF] to-[#00C6FF] flex items-center justify-center text-[10px] font-mono font-bold text-white">
              10%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-[13px]">
            <div className="flex items-start gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#F7F9FC] border border-[#DDE2EA] mt-1 shrink-0" />
              <div>
                <strong className="text-[#121722]">60% Neutrals:</strong> White canvas, subtle table headers, borders, secondary text, and spacious layouts.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#0B2D6B] mt-1 shrink-0" />
              <div>
                <strong className="text-[#121722]">30% Deep Navy:</strong> Sidebar, primary navigation, page headings, and critical warning alerts.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#1E63FF] mt-1 shrink-0" />
              <div>
                <strong className="text-[#121722]">10% Royal Blue &amp; Cyan:</strong> Interactive buttons, focus outlines, selection bars, and live sensor dots.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Colors (Large Cards) */}
      <section id="brand-colors" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Brand Palette
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Click any color tile to instantly copy its HEX code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRAND_COLORS.map((color) => (
            <div
              key={color.name}
              className="rounded-[12px] border border-[#DDE2EA] bg-white overflow-hidden shadow-[0_1px_3px_rgba(11,45,107,0.08)] hover:shadow-[0_4px_12px_rgba(11,45,107,0.12)] transition-all flex flex-col justify-between"
            >
              {/* 128px Swatch on top */}
              <div
                className="h-[128px] w-full p-4 flex flex-col justify-between relative cursor-pointer group"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleCopy(color.hex, color.name)}
                title={`Click to copy ${color.hex}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                      color.name === 'Cyan'
                        ? 'bg-[#0B2D6B]/15 text-[#0B2D6B]'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {color.usagePercent}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded bg-black/40 text-white text-[11px] font-mono">
                    <Copy className="w-3 h-3" />
                    <span>Copy HEX</span>
                  </div>
                </div>

                <div
                  className={`text-[12px] font-mono ${
                    color.name === 'Cyan' ? 'text-[#0B2D6B]' : 'text-white/80'
                  }`}
                >
                  RGB {color.rgb}
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] mb-0.5">
                    {color.description}
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#121722]">
                    {color.name}
                  </h3>
                </div>

                {/* Color Box + Hex Display */}
                <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#F7F9FC] border border-[#DDE2EA]">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-[4px] border border-[#DDE2EA] shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <code className="font-mono text-[14px] font-bold text-[#121722]">
                      {color.hex}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(color.hex, color.hex)}
                    className="p-1 text-[#6B7485] hover:text-[#1E63FF] transition-colors"
                    title="Copy hex"
                  >
                    {copiedKey === color.hex ? (
                      <Check className="w-4 h-4 text-[#00C6FF]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Role Description */}
                <div className="text-[13px] text-[#4B5465] leading-relaxed">
                  <span className="font-medium text-[#121722]">Role:</span> {color.role}
                </div>

                {/* CSS Variable & Contrast tag */}
                <div className="pt-2 border-t border-[#DDE2EA] flex items-center justify-between text-[11px] font-mono text-[#6B7485]">
                  <span
                    className="hover:text-[#1E63FF] cursor-pointer"
                    onClick={() => handleCopy(`var(${color.variable})`, color.variable)}
                  >
                    var({color.variable})
                  </span>
                  <span>Contrast: {color.textContrastOnWhite}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Neutrals (6-Column Grid) */}
      <section id="neutral-colors" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Neutrals Palette
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Eleven strictly calibrated cool neutrals. Light swatches feature a 1px #DDE2EA containment border.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {NEUTRAL_COLORS.map((neutral) => (
            <div
              key={neutral.name}
              onClick={() => handleCopy(neutral.hex, neutral.name)}
              className="rounded-[10px] border border-[#DDE2EA] bg-white p-2.5 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(11,45,107,0.08)] cursor-pointer group transition-all"
              title={`Click to copy ${neutral.hex}`}
            >
              <div
                className="h-16 w-full rounded-[6px] border border-[#DDE2EA] mb-2 flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: neutral.hex }}
              >
                {copiedKey === neutral.hex && (
                  <Check className="w-4 h-4 text-[#1E63FF]" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[12px] font-semibold text-[#121722] block truncate">
                  {neutral.name}
                </span>
                <code className="text-[11px] font-mono text-[#6B7485] block mt-0.5">
                  {neutral.hex}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Color Roles Table */}
      <section id="color-roles" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            System Color Roles
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Semantic mapping between interface functions and prescribed token values.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DDE2EA] bg-[#F7F9FC]">
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Role
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Color Swatch
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Token &amp; Value
                </th>
                <th className="py-2.5 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                  Application Example
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE2EA]">
              {[
                {
                  role: 'Primary Action',
                  hex: '#1E63FF',
                  name: 'Royal Blue',
                  spec: 'bg-[#1E63FF] text-white',
                  example: 'Submit, Save vehicle, Primary buttons, Focus rings',
                },
                {
                  role: 'Navigation / Structure',
                  hex: '#0B2D6B',
                  name: 'Deep Navy',
                  spec: 'bg-[#0B2D6B] text-white',
                  example: 'Sidebar background, Section headers, App Title',
                },
                {
                  role: 'Live / Online / Present',
                  hex: '#00C6FF',
                  name: 'Cyan',
                  spec: 'bg-[#00C6FF]/15 text-[#0B2D6B] + Cyan dot',
                  example: 'Active camera feeds, Students present, Active gates',
                },
                {
                  role: 'Info / Processing',
                  hex: '#1E63FF',
                  name: 'Royal Blue (8% Tint)',
                  spec: 'bg-[#1E63FF]/[0.08] text-[#1E63FF]',
                  example: 'Processing license plate OCR, Syncing logs',
                },
                {
                  role: 'Critical Alert',
                  hex: '#0B2D6B',
                  name: 'Deep Navy Fill',
                  spec: 'bg-[#0B2D6B] text-white + alert icon',
                  example: 'Blacklisted vehicle detected, Gate forced open',
                },
                {
                  role: 'Neutral / Offline',
                  hex: '#EEF1F6',
                  name: 'Gray 100',
                  spec: 'bg-[#EEF1F6] text-[#353D4C]',
                  example: 'Offline sensor, Inactive gate, Archived camera',
                },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F7F9FC]">
                  <td className="py-3 px-4 font-semibold text-[#121722] whitespace-nowrap">
                    {item.role}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-[4px] border border-[#DDE2EA]"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="text-[13px] font-medium text-[#121722]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-[12px] font-mono text-[#1E63FF] px-2 py-0.5 rounded bg-[#F7F9FC] border border-[#DDE2EA]">
                      {item.spec}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-[13px] text-[#4B5465]">
                    {item.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monitoring Screens Spec Card (Documentation Tile Only) */}
      <section id="monitoring-screens" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Dedicated Monitoring Screen Specification
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            For dedicated multi-screen surveillance walls (ANPR CCTV video grids). Note: This documents end-device CCTV video surfaces only; the web application UI remains 100% bright light theme.
          </p>
        </div>

        <div className="p-6 rounded-[12px] border border-[#DDE2EA] bg-[#F7F9FC] flex flex-col md:flex-row items-center gap-6">
          {/* Mini Dark CCTV Spec Tile Preview */}
          <div className="w-full md:w-[280px] shrink-0 rounded-[8px] bg-[#121722] border border-[#1F2633] p-4 text-white shadow-md">
            <div className="flex items-center justify-between border-b border-[#1F2633] pb-2 mb-3">
              <span className="text-[11px] font-mono font-medium text-[#C3CAD5]">
                CCTV FEED 04 · NORTH GATE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00C6FF] animate-pulse" />
            </div>
            <div className="h-20 bg-black rounded flex items-center justify-center text-[12px] font-mono text-[#C3CAD5]">
              [ 1080p RTSP Stream ]
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-[#C3CAD5]">Status: LIVE</span>
              <span className="text-[#00C6FF] font-semibold">99.8% ANPR</span>
            </div>
          </div>

          <div className="space-y-2 text-[13px] text-[#4B5465]">
            <p>
              <strong className="text-[#121722]">Surface:</strong> Video tile background is pure Black (<code className="text-[#121722] font-mono">#000000</code>) or Gray 900 (<code className="text-[#121722] font-mono">#121722</code>).
            </p>
            <p>
              <strong className="text-[#121722]">Cards:</strong> Surrounding feed control frames use Gray 800 (<code className="text-[#121722] font-mono">#1F2633</code>).
            </p>
            <p>
              <strong className="text-[#121722]">Text:</strong> Primary feed label is White (<code className="text-[#121722] font-mono">#FFFFFF</code>), secondary metadata in Gray 300 (<code className="text-[#121722] font-mono">#C3CAD5</code>).
            </p>
            <p>
              <strong className="text-[#121722]">Live Dots &amp; Controls:</strong> Cyan (<code className="text-[#121722] font-mono">#00C6FF</code>) live pulsing indicator; primary action buttons in Royal Blue (<code className="text-[#121722] font-mono">#1E63FF</code>).
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Contrast Checker */}
      <section id="contrast-checker" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Interactive WCAG Contrast Checker
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Validate color pairings directly against WCAG 2.2 AA (4.5:1 text, 3:1 graphical elements) and AAA (7:1) criteria.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Foreground picker */}
            <div>
              <label className="text-[13px] font-semibold text-[#121722] block mb-2">
                Foreground Color (Text / Icon)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {allPaletteColors.slice(0, 10).map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setFgColorHex(c.hex)}
                    className={`h-9 rounded-[6px] border flex items-center justify-center transition-all ${
                      fgColorHex === c.hex ? 'ring-2 ring-[#1E63FF] ring-offset-2' : 'border-[#DDE2EA]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  >
                    {fgColorHex === c.hex && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#F7F9FC' ? 'text-[#121722]' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[12px] font-mono text-[#6B7485]">
                Selected: <span className="font-bold text-[#121722]">{fgColorHex}</span>
              </div>
            </div>

            {/* Background picker */}
            <div>
              <label className="text-[13px] font-semibold text-[#121722] block mb-2">
                Background Surface
              </label>
              <div className="grid grid-cols-5 gap-2">
                {allPaletteColors.slice(0, 10).map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setBgColorHex(c.hex)}
                    className={`h-9 rounded-[6px] border flex items-center justify-center transition-all ${
                      bgColorHex === c.hex ? 'ring-2 ring-[#1E63FF] ring-offset-2' : 'border-[#DDE2EA]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  >
                    {bgColorHex === c.hex && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#F7F9FC' ? 'text-[#121722]' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[12px] font-mono text-[#6B7485]">
                Selected: <span className="font-bold text-[#121722]">{bgColorHex}</span>
              </div>
            </div>
          </div>

          {/* Test Canvas & Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 rounded-[8px] border border-[#DDE2EA] bg-[#F7F9FC]">
            {/* Live rendered specimen */}
            <div
              className="md:col-span-2 p-6 rounded-[8px] border border-[#DDE2EA] flex flex-col justify-center min-h-[120px]"
              style={{ backgroundColor: bgColorHex, color: fgColorHex }}
            >
              <span className="text-[20px] font-semibold tracking-tight">
                VisionEdge Access Control
              </span>
              <p className="text-[14px] mt-1 leading-snug">
                License plate MH-12-DE-4482 verified at Gate North-04.
              </p>
            </div>

            {/* Scorecard */}
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] block">
                  Contrast Ratio
                </span>
                <span className="text-[32px] font-bold text-[#0B2D6B] font-mono">
                  {ratioFormatted}:1
                </span>
              </div>

              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span>WCAG AA Normal Text (≥4.5:1)</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${passAANormal ? 'bg-[#00C6FF]/15 text-[#0B2D6B]' : 'bg-[#121722]/10 text-[#121722]'}`}>
                    {passAANormal ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>WCAG AA Large Text (≥3.0:1)</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${passAALarge ? 'bg-[#00C6FF]/15 text-[#0B2D6B]' : 'bg-[#121722]/10 text-[#121722]'}`}>
                    {passAALarge ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>WCAG AAA Enhanced (≥7.0:1)</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${passAAA ? 'bg-[#00C6FF]/15 text-[#0B2D6B]' : 'bg-[#121722]/10 text-[#121722]'}`}>
                    {passAAA ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Color Usage Rules
        </h2>
        <DoDontPair
          doTitle="Do place Cyan on Deep Navy or Dark Surfaces"
          doDescription="Cyan achieves 6.6:1 contrast against Deep Navy and 15.0:1 against Black, rendering live indicators with crisp optical presence."
          doExample={
            <div className="p-3 bg-[#0B2D6B] rounded-[6px] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C6FF] animate-pulse" />
              <span className="text-[13px] font-medium text-[#00C6FF]">ANPR Engine Live</span>
            </div>
          }
          dontTitle="Don't use Cyan text or icons on White"
          dontDescription="Cyan on pure White provides only a 2.0:1 contrast ratio, failing both WCAG AA and AAA standards. Never set Cyan text on white."
          dontExample={
            <div className="p-3 bg-white border border-[#DDE2EA] rounded-[6px] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C6FF]" />
              <span className="text-[13px] font-medium text-[#00C6FF]">Unreadable Live Status</span>
            </div>
          }
        />

        <DoDontPair
          doTitle="Do use White text on Royal Blue & Deep Navy"
          doDescription="White on Deep Navy yields a flawless 13.1:1 ratio. White on Royal Blue produces 4.9:1, surpassing the WCAG AA minimum."
          doExample={
            <button className="px-4 py-2 bg-[#1E63FF] text-white text-[13px] font-semibold rounded-[6px]">
              Confirm Gate Entry
            </button>
          }
          dontTitle="Don't put Royal Blue text directly on Deep Navy"
          dontDescription="Royal Blue (#1E63FF) against Deep Navy (#0B2D6B) delivers a failing 2.7:1 contrast ratio. Use White or Cyan on Deep Navy."
          dontExample={
            <div className="p-3 bg-[#0B2D6B] rounded-[6px]">
              <span className="text-[13px] font-medium text-[#1E63FF]">Failing 2.7:1 Blue on Navy</span>
            </div>
          }
        />
      </section>
    </div>
  );
};
