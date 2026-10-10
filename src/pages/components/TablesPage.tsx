import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { useToast } from '../../components/common/Toast';
import { TablePatterns } from './tables/patterns/TablePatterns';
import { PATTERN_SPEC_ROWS, PatternRules } from './tables/patterns/patternGuidance';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
} from 'lucide-react';

interface VehicleLog {
  id: string;
  plate: string;
  driver: string;
  gate: string;
  timestamp: string;
  speed: string;
  status: 'verified' | 'blacklisted' | 'processing' | 'guest';
}

const MOCK_VEHICLE_LOGS: VehicleLog[] = [
  {
    id: 'LOG-8812',
    plate: 'MH-12-DE-4482',
    driver: 'Rajesh Sharma',
    gate: 'Gate North-04 (Commercial)',
    timestamp: '14:05:32',
    speed: '18 km/h',
    status: 'verified',
  },
  {
    id: 'LOG-8813',
    plate: 'DL-01-AB-1290',
    driver: 'Ananya Deshmukh',
    gate: 'Gate South-02 (Staff)',
    timestamp: '14:04:19',
    speed: '22 km/h',
    status: 'verified',
  },
  {
    id: 'LOG-8814',
    plate: 'KA-05-MM-9910',
    driver: 'Unknown Subject',
    gate: 'Gate North-01 (VIP Barrier)',
    timestamp: '14:02:45',
    speed: '41 km/h',
    status: 'blacklisted',
  },
  {
    id: 'LOG-8815',
    plate: 'TS-08-EF-4321',
    driver: 'Vikram Mehta',
    gate: 'Hostel Track Main Gate',
    timestamp: '13:58:12',
    speed: '12 km/h',
    status: 'processing',
  },
  {
    id: 'LOG-8816',
    plate: 'GJ-06-HK-7721',
    driver: 'Sunita Patel',
    gate: 'Gate West-03 (Service)',
    timestamp: '13:55:04',
    speed: '15 km/h',
    status: 'guest',
  },
  {
    id: 'LOG-8817',
    plate: 'MH-14-GH-3391',
    driver: 'Kiran Kulkarni',
    gate: 'Gate South-02 (Staff)',
    timestamp: '13:51:28',
    speed: '19 km/h',
    status: 'verified',
  },
];

export const TablesPage: React.FC = () => {
  const { showToast } = useToast();
  const [isCompact, setIsCompact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['LOG-8814']);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = MOCK_VEHICLE_LOGS.filter(
    (log) =>
      log.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.gate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredLogs.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSimulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('ANPR log synchronized with central telemetry server', 'success');
    }, 1200);
  };

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Tables"
        description="High-density enterprise data tables with sticky headers, multi-row selection, bulk actions, density toggles, tabular numbers, and loading skeletons."
      />

      {/* Main Interactive Table Demo: ANPR Vehicle Movement Log */}
      <section id="table-demo" className="mb-12">
        <div className="rounded-[12px] border border-[#DDE2EA] bg-white shadow-[0_1px_3px_rgba(11,45,107,0.08)] overflow-hidden">
          {/* Table Header Controls Bar */}
          <div className="p-4 border-b border-[#DDE2EA] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C95A6] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by plate, driver, or gate..."
                  className="w-full h-[36px] pl-9 pr-3 bg-white border border-[#8C95A6] rounded-[6px] text-[13px] text-[#121722] focus:border-[#1E63FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Density Toggle Button */}
              <button
                onClick={() => setIsCompact(!isCompact)}
                className={`px-3 py-1.5 h-[36px] text-[13px] font-medium rounded-[6px] border transition-colors ${
                  isCompact
                    ? 'bg-[#1E63FF]/10 text-[#1E63FF] border-[#1E63FF]'
                    : 'bg-white text-[#4B5465] border-[#DDE2EA] hover:bg-[#F7F9FC]'
                }`}
              >
                {isCompact ? 'Compact (40px)' : 'Standard (48px)'}
              </button>

              {/* Refresh / Skeleton simulation button */}
              <button
                onClick={handleSimulateLoad}
                className="px-3 py-1.5 h-[36px] text-[13px] font-medium bg-white text-[#1E63FF] border border-[#1E63FF] rounded-[6px] hover:bg-[#F7F9FC] transition-colors"
              >
                Simulate Reload
              </button>
            </div>
          </div>

          {/* Bulk Action Bar (When rows selected) */}
          {selectedIds.length > 0 && (
            <div className="px-4 py-2.5 bg-[#EFF6FF] border-b border-[#DBEAFE] flex items-center justify-between text-[13px] animate-in fade-in duration-150">
              <span className="font-semibold text-[#0B2D6B]">
                {selectedIds.length} {selectedIds.length === 1 ? 'vehicle record' : 'vehicle records'} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Exported ${selectedIds.length} records to CSV`, 'info')}
                  className="px-2.5 py-1 bg-white border border-[#DDE2EA] text-[#1E63FF] rounded-[6px] font-medium hover:bg-[#F7F9FC] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Selected</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`Dismissed alert for ${selectedIds.length} items`, 'critical');
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 bg-[#121722] text-white rounded-[6px] font-medium hover:bg-black flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Flag</span>
                </button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="h-[40px] border-b border-[#DDE2EA] bg-[#F8FAFC] sticky top-0 z-10">
                  <th className="w-10 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredLogs.length && filteredLogs.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#8C95A6] accent-[#1E63FF]"
                      aria-label="Select all rows"
                    />
                  </th>
                  <th className="py-2 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    Plate Number
                  </th>
                  <th className="py-2 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    Driver / Subject
                  </th>
                  <th className="py-2 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    Access Gate
                  </th>
                  <th className="py-2 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485]">
                    Status
                  </th>
                  <th className="py-2 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-right">
                    Velocity
                  </th>
                  <th className="py-2 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-right">
                    Time (24h)
                  </th>
                  <th className="w-16 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DDE2EA]">
                {isLoading ? (
                  /* Loading Skeletons */
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className={isCompact ? 'h-[40px]' : 'h-[48px]'}>
                      <td className="px-4"><div className="w-4 h-4 bg-[#EEF1F6] rounded animate-pulse" /></td>
                      <td className="px-4"><div className="w-24 h-4 bg-[#EEF1F6] rounded animate-pulse" /></td>
                      <td className="px-4"><div className="w-32 h-4 bg-[#EEF1F6] rounded animate-pulse" /></td>
                      <td className="px-4"><div className="w-40 h-4 bg-[#EEF1F6] rounded animate-pulse" /></td>
                      <td className="px-4"><div className="w-20 h-5 bg-[#EEF1F6] rounded-full animate-pulse" /></td>
                      <td className="px-4 text-right"><div className="w-12 h-4 bg-[#EEF1F6] rounded ml-auto animate-pulse" /></td>
                      <td className="px-4 text-right"><div className="w-16 h-4 bg-[#EEF1F6] rounded ml-auto animate-pulse" /></td>
                      <td className="px-4 text-center"><div className="w-6 h-6 bg-[#EEF1F6] rounded mx-auto animate-pulse" /></td>
                    </tr>
                  ))
                ) : filteredLogs.length === 0 ? (
                  /* Empty state */
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="max-w-xs mx-auto flex flex-col items-center">
                        <Car className="w-8 h-8 text-[#8C95A6] mb-2" />
                        <h4 className="text-[14px] font-semibold text-[#121722] mb-1">
                          No matching vehicle logs found
                        </h4>
                        <p className="text-[12px] text-[#4B5465] mb-3">
                          Try searching for a different plate code or reset your filter.
                        </p>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="px-3 py-1.5 text-[12px] font-semibold text-[#1E63FF] border border-[#1E63FF] rounded-[6px] hover:bg-[#F7F9FC]"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((row) => {
                    const isSelected = selectedIds.includes(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`group transition-colors relative ${
                          isCompact ? 'h-[40px]' : 'h-[48px]'
                        } ${
                          isSelected
                            ? 'bg-[#EFF6FF] border-l-[3px] border-[#1E63FF]'
                            : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(row.id)}
                            className="w-4 h-4 rounded border-[#8C95A6] accent-[#1E63FF]"
                            aria-label={`Select vehicle ${row.plate}`}
                          />
                        </td>

                        {/* Plate in JetBrains Mono Data style */}
                        <td className="px-4">
                          <span className="font-mono text-[13px] font-semibold text-[#121722] bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#DDE2EA] whitespace-nowrap">
                            {row.plate}
                          </span>
                        </td>

                        {/* Driver */}
                        <td className="px-4 text-[#353D4C] font-medium whitespace-nowrap">
                          {row.driver}
                        </td>

                        {/* Gate */}
                        <td className="px-4 text-[#4B5465] text-[13px] whitespace-nowrap">
                          {row.gate}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 whitespace-nowrap">
                          {row.status === 'verified' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#00C6FF]/15 text-[#0B2D6B]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF]" />
                              <span>Verified</span>
                            </span>
                          )}
                          {row.status === 'blacklisted' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#0B2D6B] text-white">
                              <AlertTriangle className="w-3 h-3 text-[#00C6FF]" />
                              <span>Blacklisted</span>
                            </span>
                          )}
                          {row.status === 'processing' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#1E63FF]/[0.08] text-[#1E63FF]">
                              <Clock className="w-3 h-3 text-[#1E63FF]" />
                              <span>Processing</span>
                            </span>
                          )}
                          {row.status === 'guest' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#EEF1F6] text-[#353D4C]">
                              <span>Guest Permit</span>
                            </span>
                          )}
                        </td>

                        {/* Speed right-aligned tabular */}
                        <td className="px-4 text-right font-mono text-[13px] tabular-nums text-[#353D4C] whitespace-nowrap">
                          {row.speed}
                        </td>

                        {/* Time 24h format */}
                        <td className="px-4 text-right font-mono text-[13px] tabular-nums text-[#6B7485] whitespace-nowrap">
                          {row.timestamp}
                        </td>

                        {/* Row Actions (Ghost on hover) */}
                        <td className="px-4 text-center">
                          <button
                            onClick={() => showToast(`Inspecting logs for ${row.plate}`, 'info')}
                            className="p-1 rounded text-[#6B7485] hover:text-[#1E63FF] hover:bg-[#EEF1F6] transition-colors"
                            title="Inspect log details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 border-t border-[#DDE2EA] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-[#4B5465]">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-8 px-2 bg-white border border-[#DDE2EA] rounded text-[13px] text-[#121722]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>Showing 1–{filteredLogs.length} of {filteredLogs.length} records</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                disabled={currentPage === 1}
                className="p-1.5 bg-white border border-[#DDE2EA] rounded text-[#4B5465] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F9FC]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-[#121722] px-2">Page 1 of 1</span>
              <button
                disabled
                className="p-1.5 bg-white border border-[#DDE2EA] rounded text-[#4B5465] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F9FC]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Table Patterns */}
      <section id="patterns" className="mb-12 scroll-mt-24">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-1">Table Patterns</h2>
        <p className="text-[14px] leading-[20px] text-[#4B5465] mb-5 max-w-2xl">Common table behaviors used across VisionEdge. Pick the pattern your screen needs.</p>
        <TablePatterns />
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Data Table Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Header Row', value: '40px, Gray 50 (#F8FAFC), sticky, Overline Gray 600', token: 'h-[40px] bg-[#F8FAFC]' },
            { property: 'Standard Body Row', value: '48px height, 1px bottom border #DDE2EA', token: 'h-[48px]' },
            { property: 'Compact Mode', value: '40px height for high-density tabular scanning', token: 'h-[40px]' },
            { property: 'Row Hover', value: 'Gray 50 (#F8FAFC)', token: 'hover:bg-[#F8FAFC]' },
            { property: 'Selected Row State', value: 'Royal Blue 8% (#EFF6FF) + 3px solid #1E63FF left bar', token: 'bg-[#EFF6FF] border-l-[3px] border-[#1E63FF]' },
            { property: 'Numbers & Timestamps', value: 'Right-aligned with tabular numerals in JetBrains Mono', token: 'text-right font-mono tabular-nums' },
            ...PATTERN_SPEC_ROWS,
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Table Design Rules
        </h2>
        <DoDontPair
          doTitle="Do align numbers to the right and text to the left"
          doDescription="Right-aligning numerical data allows instant optical scanning of decimal points and magnitude differences."
          doExample={
            <div className="flex justify-between w-48 font-mono text-[13px] border-b pb-1">
              <span>Velocity</span>
              <span className="tabular-nums">24 km/h</span>
            </div>
          }
          dontTitle="Don't center-align numbers in multi-row datasets"
          dontDescription="Center-aligned numbers break decimal alignment, forcing the operator to read each digit individually."
          dontExample={
            <div className="text-center font-mono text-[13px] border-b pb-1 w-48">
              <span>24 km/h</span>
            </div>
          }
        />
        <PatternRules />
      </section>
    </div>
  );
};
