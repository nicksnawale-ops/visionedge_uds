import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToastProvider } from '../../../components/common/Toast';
import { AnatomyMarker } from './AnatomyOverlay';
import type { FormStateId, PatternId } from './formStates';
import type { RecordData } from './data/sampleRecord';
import { FormShell } from './foundations/FormLayout';
import { SinglePageForm } from './patterns/SinglePageForm';
import { SectionedForm } from './patterns/SectionedForm';
import { WizardForm } from './patterns/WizardForm';
import { DrawerForm } from './patterns/DrawerForm';
import { ModalForm } from './patterns/ModalForm';
import { EditRecordForm } from './patterns/EditRecordForm';
import { BulkImport } from './patterns/BulkImport/BulkImport';

export interface FormsScreenProps {
  pattern: PatternId;
  state: FormStateId;
  /** Drawer → "Open full form" switches to the single-page pattern. */
  onPatternChange?: (pattern: PatternId) => void;
  fillViewport?: boolean;
  showAnatomy?: boolean;
}

/** One form pattern inside the generic product shell, with its own toasts (bottom-right). */
export const FormsScreen: React.FC<FormsScreenProps> = ({ pattern, state, onPatternChange, fillViewport = false, showAnatomy = false }) => {
  const [active, setActive] = useState<{ pattern: PatternId; initial?: RecordData; n: number }>({ pattern, n: 0 });
  const skipNext = useRef(false);

  // A new pattern or state from the showcase starts fresh (unless it was our own carry-over).
  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    setActive((a) => ({ pattern, n: a.n + 1 }));
  }, [pattern, state]);

  const marker = useCallback((n: number) => <AnatomyMarker n={n} show={showAnatomy} />, [showAnatomy]);

  const openFullForm = (values: RecordData) => {
    skipNext.current = Boolean(onPatternChange);
    setActive((a) => ({ pattern: 'single', initial: values, n: a.n + 1 }));
    onPatternChange?.('single');
  };

  const props = { state: active.initial ? ('partial' as FormStateId) : state, marker, initial: active.initial };
  const key = `${active.pattern}-${active.n}`;

  return (
    <div className={`${fillViewport ? '' : 'h-full'} [&>.fixed]:top-auto! [&>.fixed]:bottom-24!`}>
      <ToastProvider>
        <FormShell fillViewport={fillViewport}>
          {active.pattern === 'single' && <SinglePageForm key={key} {...props} />}
          {active.pattern === 'sectioned' && <SectionedForm key={key} {...props} />}
          {active.pattern === 'wizard' && <WizardForm key={key} {...props} />}
          {active.pattern === 'drawer' && <DrawerForm key={key} {...props} onOpenFullForm={openFullForm} />}
          {active.pattern === 'modal' && <ModalForm key={key} {...props} />}
          {active.pattern === 'edit' && <EditRecordForm key={key} {...props} />}
          {active.pattern === 'import' && <BulkImport key={key} state={state} marker={marker} />}
        </FormShell>
      </ToastProvider>
    </div>
  );
};
