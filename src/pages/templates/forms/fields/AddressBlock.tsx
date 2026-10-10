import React, { useState } from 'react';
import { STATE_OPTIONS } from '../data/indianStates';
import { lookupPin } from '../data/pinLookup';
import { FieldPair } from '../foundations/FormSection';
import { SelectField } from './SelectField';
import { TextField } from './TextField';
import { BARE_INPUT, FieldShell, describedBy, segmented } from './FieldShell';

export interface AddressValue {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
}

interface AddressBlockProps {
  idPrefix: string;
  value: AddressValue;
  onChange: (patch: Partial<AddressValue>) => void;
  errors: Partial<Record<keyof AddressValue, string>>;
  onBlur: (field: keyof AddressValue) => void;
  readOnly?: boolean;
  /** Screen-reader announcement when the PIN fills city and state. */
  announce?: (message: string) => void;
  overlay?: React.ReactNode;
}

/**
 * Indian address: Line 1, Line 2 (optional), City / PIN code pair, State select.
 * A known 6-digit PIN (demo: 411001) fills City and State; people can still change them.
 */
export const AddressBlock: React.FC<AddressBlockProps> = ({ idPrefix, value, onChange, errors, onBlur, readOnly, announce, overlay }) => {
  const [filled, setFilled] = useState('');
  const pinId = `${idPrefix}-pin`;
  const pinHelper = filled ? `City and state filled from PIN code ${filled}.` : '6 digits. Try 411001 to fill city and state.';
  return (
    <div className="space-y-4">
      <TextField id={`${idPrefix}-line1`} label="Address line 1" placeholder="Building, street" autoComplete="address-line1" value={value.line1} onChange={(v) => onChange({ line1: v })} onBlur={() => onBlur('line1')} error={errors.line1} readOnly={readOnly} />
      <TextField id={`${idPrefix}-line2`} label="Address line 2" optional placeholder="Area, landmark" autoComplete="address-line2" value={value.line2} onChange={(v) => onChange({ line2: v })} readOnly={readOnly} />
      <FieldPair overlay={overlay}>
        <TextField id={`${idPrefix}-city`} label="City" autoComplete="address-level2" value={value.city} onChange={(v) => onChange({ city: v })} onBlur={() => onBlur('city')} error={errors.city} readOnly={readOnly} />
        <FieldShell id={pinId} label="PIN code" helper={pinHelper} error={errors.pin}>
          <div className={segmented({ error: errors.pin, readOnly })}>
            <input
              id={pinId}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={value.pin}
              readOnly={readOnly}
              aria-invalid={errors.pin ? true : undefined}
              aria-describedby={describedBy(pinId, pinHelper, errors.pin)}
              onChange={(e) => {
                const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
                const hit = pin.length === 6 ? lookupPin(pin) : null;
                onChange(hit ? { pin, city: hit.city, state: hit.state } : { pin });
                setFilled(hit ? pin : '');
                if (hit) announce?.(`City and state filled: ${hit.city}, ${hit.state}`);
              }}
              onBlur={() => onBlur('pin')}
              className={`${BARE_INPUT} font-mono tracking-[0.1em]`}
            />
          </div>
        </FieldShell>
      </FieldPair>
      <SelectField
        id={`${idPrefix}-state`}
        label="State or union territory"
        options={STATE_OPTIONS}
        value={value.state}
        onChange={(v) => {
          onChange({ state: v });
          onBlur('state');
        }}
        onBlur={() => onBlur('state')}
        placeholder="Choose a state"
        error={errors.state}
        readOnly={readOnly}
      />
    </div>
  );
};
