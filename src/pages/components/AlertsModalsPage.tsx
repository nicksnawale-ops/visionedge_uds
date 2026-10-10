import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { useToast } from '../../components/common/Toast';
import {
  Info,
  ShieldAlert,
  AlertTriangle,
  X,
  Bell,
  CheckCircle2,
  Trash2,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export const AlertsModalsPage: React.FC = () => {
  const { showToast } = useToast();

  // Dialog State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalWidth, setModalWidth] = useState<'480' | '640' | '880'>('480');
  const [isCriticalConfirm, setIsCriticalConfirm] = useState(false);

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenModal = (width: '480' | '640' | '880', critical = false) => {
    setModalWidth(width);
    setIsCriticalConfirm(critical);
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Alerts, Toasts & Modals"
        description="Inline notification banners with 4px left accent bars, non-intrusive auto-dismiss system toasts, accessible modal dialogs, and slide-over inspection drawers."
      />

      {/* Inline Notification Banners */}
      <section id="inline-banners" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Inline Notification Banners
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Persistent in-page banners with a 4px left bar. Info banners use Royal Blue 8% fill; Critical banners use solid Deep Navy fill with White text.
          </p>
        </div>

        <div className="space-y-4">
          {/* Info Banner */}
          <div className="p-4 rounded-[8px] bg-[#EFF6FF] border border-[#DBEAFE] border-l-4 border-l-[#1E63FF] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#1E63FF] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-semibold text-[#121722]">
                  Scheduled ANPR Optical Stream Maintenance
                </h4>
                <p className="text-[13px] text-[#353D4C] mt-0.5 leading-relaxed">
                  Gate North-04 optical cameras will undergo automatic calibration at 02:00 UTC. Secondary RFID backup barrier is active.
                </p>
                <a
                  href="#inline-banners"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1E63FF] hover:underline mt-2"
                >
                  <span>View maintenance schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <button className="text-[#6B7485] hover:text-[#121722] p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Critical Banner: Deep Navy Fill, White Text */}
          <div className="p-4 rounded-[8px] bg-[#0B2D6B] border border-[#0B2D6B] border-l-4 border-l-[#00C6FF] text-white flex items-start justify-between gap-3 shadow-[0_4px_12px_rgba(11,45,107,0.15)]">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#00C6FF] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-semibold text-white">
                  Critical Security Alert: Blacklisted Vehicle Detected
                </h4>
                <p className="text-[13px] text-white/80 mt-0.5 leading-relaxed">
                  License plate MH-12-DE-4482 flagged on police watchlist entered Gate North Barrier at 14:02:45. Automated barrier lock engaged.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => showToast('Dispatching campus security unit', 'critical')}
                    className="px-3 py-1.5 bg-[#00C6FF] text-[#0B2D6B] font-semibold text-[12px] rounded-[6px] hover:bg-white transition-colors"
                  >
                    Dispatch Security Unit
                  </button>
                  <button
                    onClick={() => showToast('Alert acknowledged by operator', 'info')}
                    className="px-3 py-1.5 bg-white/10 text-white font-medium text-[12px] rounded-[6px] hover:bg-white/20 transition-colors"
                  >
                    Acknowledge Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Toast Triggers */}
      <section id="toasts" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            System Toast Notifications
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Compact top-right notifications with auto-dismiss timers (5s for informational feedback; critical security toasts require explicit operator dismissal). Click below to trigger test toasts.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)]">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => showToast('Gate barrier permit updated successfully', 'success', 4000)}
              className="px-4 py-2 bg-white border border-[#DDE2EA] text-[#121722] font-semibold text-[13px] rounded-[8px] hover:bg-[#F7F9FC] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00C6FF]" />
              <span>Trigger Success Toast</span>
            </button>

            <button
              onClick={() => showToast('Syncing 2,400 sensor records with cloud server...', 'info', 4000)}
              className="px-4 py-2 bg-white border border-[#DDE2EA] text-[#121722] font-semibold text-[13px] rounded-[8px] hover:bg-[#F7F9FC] flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-[#1E63FF]" />
              <span>Trigger Info Toast</span>
            </button>

            <button
              onClick={() => showToast('Sensor telemetry signal degraded on Gate West-03', 'warning', 4000)}
              className="px-4 py-2 bg-white border border-[#DDE2EA] text-[#121722] font-semibold text-[13px] rounded-[8px] hover:bg-[#F7F9FC] flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>Trigger Warning Toast</span>
            </button>

            <button
              onClick={() => showToast('Perimeter breach reported on East Fence Sensor 08', 'critical', 0)}
              className="px-4 py-2 bg-[#0B2D6B] text-white font-semibold text-[13px] rounded-[8px] hover:bg-black flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#00C6FF]" />
              <span>Trigger Critical Persistent Toast</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal Dialogs & Slide-Over Drawer */}
      <section id="modals" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Modals &amp; Slide-Over Drawers
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            White dialog frames with 16px radius, elevation-3 shadow, 50% Black backdrop scrim, and strict action-repetition labeling.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 shadow-[0_1px_3px_rgba(11,45,107,0.08)] flex flex-wrap items-center gap-4">
          <button
            onClick={() => handleOpenModal('480', false)}
            className="px-4 py-2 bg-white border border-[#1E63FF] text-[#1E63FF] font-semibold text-[13px] rounded-[8px] hover:bg-[#F7F9FC]"
          >
            Open 480px Dialog
          </button>
          <button
            onClick={() => handleOpenModal('640', false)}
            className="px-4 py-2 bg-white border border-[#1E63FF] text-[#1E63FF] font-semibold text-[13px] rounded-[8px] hover:bg-[#F7F9FC]"
          >
            Open 640px Form Modal
          </button>
          <button
            onClick={() => handleOpenModal('480', true)}
            className="px-4 py-2 bg-[#121722] text-white font-semibold text-[13px] rounded-[8px] hover:bg-black flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirmation: &ldquo;Delete record&rdquo;</span>
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-4 py-2 bg-[#1E63FF] text-white font-semibold text-[13px] rounded-[8px] hover:bg-[#0B2D6B] flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Slide-Over Drawer</span>
          </button>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Modal &amp; Toast Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Modal Radius', value: '16px (radius-xl)', token: 'rounded-[16px]' },
            { property: 'Modal Elevation', value: 'Elevation 3: 0 12px 32px rgba(11,45,107,0.18)', token: 'shadow-[0_12px_32px_rgba(11,45,107,0.18)]' },
            { property: 'Backdrop Scrim', value: '50% Black (#000000/50)', token: 'bg-black/50' },
            { property: 'Dialog Widths', value: '480px (Confirmations), 640px (Standard Forms), 880px (Data Details)', token: 'max-w-[480px] / max-w-2xl / max-w-4xl' },
            { property: 'Toast Position', value: 'Top-Right (Fixed top: 20px, right: 20px)', token: 'fixed top-5 right-5 z-50' },
            { property: 'Confirmation Button Phrasing', value: 'Must repeat the verb action: "Delete record", never "Yes" or "OK"', token: 'text: "Delete record"' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Dialog Guidelines
        </h2>
        <DoDontPair
          doTitle="Do label confirmation buttons with explicit verbs"
          doDescription="When prompting operators to discard access rights or purge logs, write 'Delete vehicle record' so intent is unmistakable."
          doExample={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border rounded text-[12px]">Cancel</button>
              <button className="px-3 py-1.5 bg-[#121722] text-white rounded text-[12px] font-semibold">
                Delete vehicle record
              </button>
            </div>
          }
          dontTitle="Don't use generic 'Yes' or 'OK' confirmation buttons"
          dontDescription="Generic affirmative labels increase accidental destructive clicks during rapid operations."
          dontExample={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border rounded text-[12px]">Cancel</button>
              <button className="px-3 py-1.5 bg-[#121722] text-white rounded text-[12px] font-semibold">
                Yes
              </button>
            </div>
          }
        />
      </section>

      {/* Live Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />

          <div
            className={`relative w-full bg-white rounded-[16px] border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 ${
              modalWidth === '480' ? 'max-w-[480px]' : modalWidth === '640' ? 'max-w-2xl' : 'max-w-4xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE2EA]">
              <h4 className="text-[17px] font-semibold text-[#121722]">
                {isCriticalConfirm ? 'Confirm Vehicle Record Deletion' : 'Edit ANPR Gate Calibration'}
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#6B7485] hover:text-[#121722] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-[14px] text-[#353D4C] leading-relaxed">
              {isCriticalConfirm ? (
                <div>
                  <p className="mb-2">
                    Are you sure you want to permanently delete vehicle permit{' '}
                    <strong className="text-[#121722] font-mono">MH-12-DE-4482</strong> from the active gate whitelist?
                  </p>
                  <p className="text-[13px] text-[#0B2D6B] font-medium bg-[#EEF1F6] p-3 rounded-[6px]">
                    This action will immediately disable RFID transponder dispatch and trigger an automated security alert on the next approach.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium text-[#121722] block mb-1">
                      Gate Identifier
                    </label>
                    <input
                      type="text"
                      defaultValue="Gate North-04"
                      className="w-full h-[38px] px-3 border border-[#8C95A6] rounded-[6px]"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#121722] block mb-1">
                      OCR Confidence Threshold (%)
                    </label>
                    <input
                      type="number"
                      defaultValue="98.5"
                      className="w-full h-[38px] px-3 border border-[#8C95A6] rounded-[6px] font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#DDE2EA] bg-[#F7F9FC]">
              <button
                onClick={() => setModalOpen(false)}
                className="h-[36px] px-4 rounded-[6px] bg-white border border-[#DDE2EA] text-[#4B5465] font-semibold text-[13px] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              {isCriticalConfirm ? (
                <button
                  onClick={() => {
                    setModalOpen(false);
                    showToast('Vehicle permit MH-12-DE-4482 permanently deleted', 'critical');
                  }}
                  className="h-[36px] px-4 rounded-[6px] bg-[#121722] text-white font-semibold text-[13px] hover:bg-black"
                >
                  Delete vehicle record
                </button>
              ) : (
                <button
                  onClick={() => {
                    setModalOpen(false);
                    showToast('Gate calibration saved', 'success');
                  }}
                  className="h-[36px] px-4 rounded-[6px] bg-[#1E63FF] text-white font-semibold text-[13px] hover:bg-[#0B2D6B]"
                >
                  Save changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Drawer Demo */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.18)] flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="h-[64px] px-6 border-b border-[#DDE2EA] flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#121722]">
                    Vehicle Log Inspection
                  </h3>
                  <span className="text-[11px] font-mono text-[#6B7485]">
                    LOG-8812 · 14:05:32
                  </span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-[#6B7485] hover:text-[#121722] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[14px]">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B7485] block mb-1">
                    CAPTURED PLATE SNAPSHOT
                  </span>
                  <div className="h-32 bg-[#F7F9FC] border border-[#DDE2EA] rounded-[8px] flex items-center justify-center font-mono text-[18px] font-bold text-[#121722]">
                    MH-12-DE-4482
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#F7F9FC]">
                    <span className="text-[#4B5465]">Driver Name</span>
                    <span className="font-semibold text-[#121722]">Rajesh Sharma</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F7F9FC]">
                    <span className="text-[#4B5465]">Entry Gate</span>
                    <span className="font-semibold text-[#121722]">Gate North-04</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F7F9FC]">
                    <span className="text-[#4B5465]">Detection Accuracy</span>
                    <span className="font-mono text-[#0B2D6B] font-bold">99.8%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F7F9FC]">
                    <span className="text-[#4B5465]">Approach Velocity</span>
                    <span className="font-mono text-[#353D4C]">18 km/h</span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#DDE2EA] bg-[#F7F9FC] flex justify-end gap-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="h-[36px] px-4 rounded-[6px] bg-white border border-[#DDE2EA] text-[#4B5465] font-semibold text-[13px]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    showToast('Vehicle permit re-verified', 'success');
                  }}
                  className="h-[36px] px-4 rounded-[6px] bg-[#1E63FF] text-white font-semibold text-[13px]"
                >
                  Verify Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
