import React from 'react';
import { Pencil } from 'lucide-react';
import { BUTTON } from '../../profile/ui';
import type { FormStateId } from '../formStates';
import type { RecordData } from '../data/sampleRecord';
import type { RecordScope } from '../foundations/validators';
import { FormLayout } from '../foundations/FormLayout';
import { ActionBar } from '../foundations/ActionBar';
import { ErrorSummary } from '../foundations/ErrorSummary';
import { DiscardGuard, FlowAlerts, LiveRegion, RecordFlow, SuccessCard, useRecordFlow } from './RecordFlow';
import { AddressSection, AttachmentsSection, BasicSection, ContactSection, NotesSection, RecordReadOnly, idFor } from './RecordSections';

export interface PatternProps {
  state: FormStateId;
  marker: (n: number) => React.ReactNode;
  /** Values carried over from another pattern (Drawer → "Open full form"). */
  initial?: RecordData;
}

const SCOPES: RecordScope[] = ['basic', 'contact', 'address', 'notes'];
const P = 'single';

/** Status for the action bar: saved / saving / unsaved / not saved yet. */
export const barStatus = (flow: RecordFlow) => (flow.form.dirty && flow.autosave.status === 'idle' ? 'unsaved' : flow.autosave.status);
export const barLabel = (flow: RecordFlow) => (flow.form.dirty && flow.autosave.status === 'idle' ? 'Unsaved changes' : flow.autosave.label);

/** Pattern 1 — Single-page form: "New record" with five sections and the sticky action bar. */
export const SinglePageForm: React.FC<PatternProps> = ({ state, marker, initial }) => {
  const flow = useRecordFlow(state, SCOPES, { initial });
  const { form } = flow;

  if (flow.done) return <SuccessCard onAnother={flow.restart} />;

  const ro = flow.readOnly;
  return (
    <>
      <FormLayout
        breadcrumb={['Records', ro ? form.values.referenceId : 'New record']}
        title={ro ? form.values.name : 'New record'}
        description={ro ? `${form.values.referenceId} · Created 28 Sep 2026` : 'Add a vendor, contractor, partner or facility. You can change these details later.'}
        requiredNote={!ro}
        marker={marker}
        headerAction={
          ro && (
            <button type="button" onClick={() => flow.setReadOnly(false)} className={BUTTON.secondary}>
              <Pencil className="w-4 h-4" aria-hidden="true" />
              Edit
            </button>
          )
        }
        alerts={
          !ro && (flow.errorKeys.length > 0 || flow.duplicate || flow.serverError) ? (
            <>
              <ErrorSummary keys={flow.errorKeys} errors={form.allErrors} idFor={(k) => idFor(P, k)} attempt={flow.attempt} overlay={marker(4)} />
              <FlowAlerts flow={flow} />
            </>
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
        {ro ? (
          <RecordReadOnly v={form.values} />
        ) : (
          <form noValidate onSubmit={(e) => (e.preventDefault(), flow.submit())} className="space-y-6" aria-busy={flow.busy || undefined}>
            <BasicSection form={form} p={P} readOnly={flow.busy} marker={marker} />
            <ContactSection form={form} p={P} readOnly={flow.busy} />
            <AddressSection form={form} p={P} readOnly={flow.busy} announce={flow.announce} marker={marker} />
            <NotesSection form={form} p={P} readOnly={flow.busy} />
            <AttachmentsSection form={form} p={P} readOnly={flow.busy} />
          </form>
        )}
      </FormLayout>
      <DiscardGuard
        open={flow.guardOpen}
        onKeep={() => flow.setGuardOpen(false)}
        onDiscard={() => {
          flow.setGuardOpen(false);
          flow.restart();
          flow.announce('New record discarded');
        }}
      />
      <LiveRegion message={flow.live} />
    </>
  );
};
