import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { RecordScope } from '../foundations/validators';
import { FormLayout } from '../foundations/FormLayout';
import { ActionBar } from '../foundations/ActionBar';
import { ErrorSummary } from '../foundations/ErrorSummary';
import { ChipSectionIndex, IndexItem, SelectSectionIndex, VerticalSectionIndex } from '../foundations/SectionIndex';
import { DiscardGuard, FlowAlerts, LiveRegion, SuccessCard, useRecordFlow } from './RecordFlow';
import { AdditionalSection, AddressSection, BasicSection, ClassificationSection, ContactSection, DocumentsSection, RecordReadOnly, idFor } from './RecordSections';
import { PatternProps, barLabel, barStatus } from './SinglePageForm';

const SCOPES: RecordScope[] = ['basic', 'contact', 'address', 'classification', 'additional', 'documents'];
const P = 'sectioned';

const SECTIONS: { id: string; label: string; keys: (k: string) => boolean }[] = [
  { id: 'basic', label: 'Basic details', keys: (k) => ['name', 'category'].includes(k) },
  { id: 'contact', label: 'Contact', keys: (k) => ['email', 'phone', 'altContact'].includes(k) },
  { id: 'address', label: 'Address', keys: (k) => ['line1', 'city', 'state', 'pin'].includes(k) },
  { id: 'classification', label: 'Classification', keys: (k) => ['entityType', 'gstin', 'startDate', 'endDate', 'capacity'].includes(k) },
  { id: 'additional', label: 'Additional information', keys: (k) => k.startsWith('contacts.') || k === 'notes' },
  { id: 'documents', label: 'Documents & consent', keys: (k) => k === 'consent' },
];

/**
 * Pattern 2 — Sectioned long form: a sticky section index with completion per section (3 columns),
 * six sections (9 columns), scroll-spy and a progress line. The index becomes chips below 1024px
 * and a select below 768px.
 */
export const SectionedForm: React.FC<PatternProps> = ({ state, marker, initial }) => {
  const flow = useRecordFlow(state, SCOPES, { initial });
  const { form } = flow;
  const [current, setCurrent] = useState('basic');
  const rootRef = useRef<HTMLDivElement>(null);

  const items: IndexItem[] = useMemo(
    () => SECTIONS.map((s) => ({ id: s.id, label: s.label, remaining: Object.keys(form.allErrors).filter(s.keys).length })),
    [form.allErrors]
  );
  const complete = items.filter((i) => i.remaining === 0).length;

  // Scroll-spy: the section whose top has passed 30% of the scroll area is current.
  useEffect(() => {
    const scroller = rootRef.current?.closest<HTMLElement>('.overflow-y-auto');
    if (!scroller) return;
    const onScroll = () => {
      const top = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.3;
      let found = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(`${P}-sec-${s.id}`);
        if (el && el.getBoundingClientRect().top <= top) found = s.id;
      }
      setCurrent(found);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [flow.done, flow.readOnly]);

  const jump = (id: string) => {
    const el = document.getElementById(`${P}-sec-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrent(id);
    // Move focus to the section's first field.
    window.setTimeout(() => el?.querySelector<HTMLElement>('input, button, select, textarea')?.focus({ preventScroll: true }), 350);
  };

  if (flow.done) return <SuccessCard onAnother={flow.restart} />;
  const ro = flow.readOnly;
  const indexProps = { items, current, onJump: jump };

  return (
    <>
      <FormLayout
        breadcrumb={['Records', 'Detailed registration']}
        title="Detailed registration"
        description="Everything we need to register an organization or person. Fill the sections in any order."
        wide
        requiredNote={!ro}
        marker={marker}
        alerts={
          !ro && (flow.errorKeys.length > 0 || flow.duplicate || flow.serverError) ? (
            <div className="max-w-[720px] @min-[1024px]:ml-[calc(33.333%+8px)] @min-[1280px]:ml-[calc(25%+6px)] space-y-3">
              <ErrorSummary keys={flow.errorKeys} errors={form.allErrors} idFor={(k) => idFor(P, k)} attempt={flow.attempt} overlay={marker(4)} />
              <FlowAlerts flow={flow} />
            </div>
          ) : undefined
        }
        actionBar={
          !ro && (
            <ActionBar
              status={barStatus(flow)}
              statusLabel={barLabel(flow)}
              primaryLabel="Create record"
              busyLabel="Creating…"
              busy={flow.busy}
              onPrimary={flow.submit}
              onCancel={flow.cancel}
              onSaveDraft={flow.saveDraft}
              markers={{ bar: marker(10), status: marker(11) }}
            />
          )
        }
      >
        <div ref={rootRef}>
          {ro ? (
            <div className="max-w-[720px]">
              <RecordReadOnly v={form.values} extended />
            </div>
          ) : (
            <>
              {/* Progress line */}
              <div className="mb-6">
                <p className="text-[13px] leading-[20px] font-medium text-[#353D4C]" aria-live="polite">
                  {complete} of {SECTIONS.length} sections complete
                </p>
                <div className="mt-2 h-1 rounded-full bg-[#DDE2EA] overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-[#1E63FF] transition-[width] duration-300" style={{ width: `${(complete / SECTIONS.length) * 100}%` }} />
                </div>
              </div>
              <div className="relative mb-4 @min-[1024px]:hidden">
                {marker(9)}
                <div className="hidden @min-[768px]:block">
                  <ChipSectionIndex {...indexProps} />
                </div>
                <div className="@min-[768px]:hidden">
                  <SelectSectionIndex {...indexProps} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-6">
                <div className="relative hidden @min-[1024px]:block col-span-4 @min-[1280px]:col-span-3 self-start sticky top-6">
                  {marker(9)}
                  <VerticalSectionIndex {...indexProps} />
                </div>
                <form noValidate onSubmit={(e) => (e.preventDefault(), flow.submit())} className="col-span-12 @min-[1024px]:col-span-8 @min-[1280px]:col-span-9 min-w-0 max-w-[720px] space-y-6" aria-busy={flow.busy || undefined}>
                  <BasicSection form={form} p={P} readOnly={flow.busy} marker={marker} title="Basic details" />
                  <ContactSection form={form} p={P} readOnly={flow.busy} />
                  <AddressSection form={form} p={P} readOnly={flow.busy} announce={flow.announce} marker={marker} />
                  <ClassificationSection form={form} p={P} readOnly={flow.busy} />
                  <AdditionalSection form={form} p={P} readOnly={flow.busy} announce={flow.announce} marker={marker} />
                  <DocumentsSection form={form} p={P} readOnly={flow.busy} />
                </form>
              </div>
            </>
          )}
        </div>
      </FormLayout>
      <DiscardGuard
        open={flow.guardOpen}
        onKeep={() => flow.setGuardOpen(false)}
        onDiscard={() => {
          flow.setGuardOpen(false);
          flow.restart();
        }}
      />
      <LiveRegion message={flow.live} />
    </>
  );
};
