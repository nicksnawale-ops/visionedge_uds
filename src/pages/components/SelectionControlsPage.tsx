import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PreviewPanel, TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { Check } from 'lucide-react';

export const SelectionControlsPage: React.FC = () => {
  // Interactive states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    anpr: true,
    rfid: true,
    facial: false,
    speed: true,
  });

  const [selectedRadio, setSelectedRadio] = useState('daily');
  const [toggleState, setToggleState] = useState(true);
  const [segmentedValue, setSegmentedValue] = useState<'day' | 'week' | 'month'>('day');
  const [activeChips, setActiveChips] = useState<string[]>(['North Gate', 'VIP Only']);

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const previewTabs: TabItem[] = [
    {
      id: 'checkboxes-radios',
      label: 'Checkboxes & Radios',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
          {/* 16px Checkboxes */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#121722] mb-3">
              Gate Sensor Triggers (16px)
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'anpr', label: 'ANPR Optical License Recognition' },
                { id: 'rfid', label: 'UHF RFID Long-Range Transponder' },
                { id: 'facial', label: 'Driver Facial Geometry Verification' },
                { id: 'speed', label: 'Doppler Radar Speed Sensor' },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#353D4C] select-none hover:text-[#121722]"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id] || false}
                    onChange={(e) =>
                      setCheckedItems((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="w-4 h-4 rounded-[4px] border border-[#8C95A6] text-[#1E63FF] focus:ring-[#1E63FF] focus:ring-offset-2 accent-[#1E63FF] cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 16px Radios */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#121722] mb-3">
              Reporting Frequency (2–4 Options)
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'realtime', label: 'Real-time telemetry stream' },
                { id: 'daily', label: 'Daily batch rollup at midnight' },
                { id: 'weekly', label: 'Weekly executive summary' },
              ].map((radio) => (
                <label
                  key={radio.id}
                  className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#353D4C] select-none hover:text-[#121722]"
                >
                  <input
                    type="radio"
                    name="report-freq"
                    checked={selectedRadio === radio.id}
                    onChange={() => setSelectedRadio(radio.id)}
                    className="w-4 h-4 text-[#1E63FF] border border-[#8C95A6] focus:ring-[#1E63FF] focus:ring-offset-2 accent-[#1E63FF] cursor-pointer"
                  />
                  <span>{radio.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ),
      code: `// 16px Checkbox with Royal Blue accent
<label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#353D4C]">
  <input
    type="checkbox"
    className="w-4 h-4 rounded-[4px] border border-[#8C95A6] accent-[#1E63FF] focus:ring-2 focus:ring-[#1E63FF]"
  />
  <span>ANPR Optical License Recognition</span>
</label>`,
    },
    {
      id: 'toggles-chips',
      label: 'Toggles & Segmented Controls',
      component: (
        <div className="flex flex-col gap-6 items-center w-full max-w-md">
          {/* 36×20 Toggle Switch */}
          <div className="flex items-center justify-between w-full p-4 rounded-[8px] border border-[#DDE2EA] bg-white shadow-sm">
            <div>
              <span className="text-[14px] font-medium text-[#121722] block">
                Automatic Gate Barrier Dispatch
              </span>
              <span className="text-[12px] text-[#4B5465]">
                Applies immediate effect upon trigger
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={toggleState}
              onClick={() => setToggleState(!toggleState)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] ${
                toggleState ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  toggleState ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Segmented Control */}
          <div className="w-full">
            <span className="text-[12px] font-semibold text-[#121722] block mb-2 uppercase tracking-wider">
              Telemetry Time Window
            </span>
            <div className="flex p-1 bg-[#EEF1F6] rounded-[8px] border border-[#DDE2EA] w-full">
              {(['day', 'week', 'month'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setSegmentedValue(view)}
                  className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all capitalize ${
                    segmentedValue === view
                      ? 'bg-white text-[#121722] shadow-sm'
                      : 'text-[#4B5465] hover:text-[#121722]'
                  }`}
                >
                  {view} View
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Filter Chips */}
          <div className="w-full">
            <span className="text-[12px] font-semibold text-[#121722] block mb-2 uppercase tracking-wider">
              Active Zone Filters
            </span>
            <div className="flex flex-wrap gap-2">
              {['North Gate', 'South Gate', 'VIP Only', 'High Speed', 'Commercial'].map((chip) => {
                const isActive = activeChips.includes(chip);
                return (
                  <button
                    key={chip}
                    onClick={() => toggleChip(chip)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${
                      isActive
                        ? 'bg-[#1E63FF] text-white border-[#1E63FF]'
                        : 'bg-white text-[#4B5465] border-[#DDE2EA] hover:border-[#8C95A6]'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5" />}
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ),
      code: `// 36×20 Toggle Switch (Instant mutating actions only)
<button
  role="switch"
  aria-checked={enabled}
  onClick={() => setEnabled(!enabled)}
  className={\`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors \${
    enabled ? 'bg-[#1E63FF]' : 'bg-[#C3CAD5]'
  }\`}
>
  <div
    className={\`bg-white w-4 h-4 rounded-full shadow transform transition-transform \${
      enabled ? 'translate-x-4' : 'translate-x-0'
    }\`}
  />
</button>`,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Selection Controls"
        description="Checkboxes for multiple selections, radio groups for 2–4 mutually exclusive choices, 36×20 toggle switches for instant system modes, and filter chips."
      />

      <section id="preview" className="mb-12">
        <PreviewPanel tabs={previewTabs} />
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Selection Control Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Checkbox Size', value: '16×16px, 4px radius, Royal Blue checked', token: 'w-4 h-4 rounded-[4px] accent-[#1E63FF]' },
            { property: 'Radio Button Size', value: '16×16px circular, Royal Blue checked', token: 'w-4 h-4 accent-[#1E63FF]' },
            { property: 'Toggle Dimensions', value: '36×20px track, 16px circular white thumb', token: 'w-9 h-5' },
            { property: 'Toggle Active Track', value: 'Royal Blue (#1E63FF)', token: 'bg-[#1E63FF]' },
            { property: 'Toggle Inactive Track', value: 'Gray 300 (#C3CAD5)', token: 'bg-[#C3CAD5]' },
            { property: 'Filter Chip Height', value: '28px, full radius (pill), 12px Medium font', token: 'h-7 rounded-full text-[12px]' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Selection Rules
        </h2>
        <DoDontPair
          doTitle="Do use Toggles ONLY for instant settings changes"
          doDescription="Toggles take immediate effect without needing a 'Save' button (e.g. enabling live audio feed, hardware relays)."
          doExample={
            <div className="flex items-center gap-2">
              <span className="w-9 h-5 bg-[#1E63FF] rounded-full p-0.5 inline-flex items-center">
                <span className="w-4 h-4 bg-white rounded-full translate-x-4 shadow" />
              </span>
              <span className="text-[13px] font-medium text-[#121722]">Instant relay active</span>
            </div>
          }
          dontTitle="Don't use Toggles inside forms that require a Submit button"
          dontDescription="Using a toggle inside a multi-step form misleads users into expecting instant execution without submitting."
          dontExample={
            <div className="flex items-center gap-2">
              <span className="w-9 h-5 bg-[#1E63FF] rounded-full p-0.5 inline-flex items-center">
                <span className="w-4 h-4 bg-white rounded-full translate-x-4 shadow" />
              </span>
              <span className="text-[13px] text-[#4B5465]">Send notification on submit</span>
            </div>
          }
        />
      </section>
    </div>
  );
};
