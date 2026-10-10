import React, { useRef } from 'react';

interface OtpInputProps {
  /** Digits entered so far (0–length characters). */
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** id of the visible label for the group. */
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Focus the first box on mount (only after an in-app transition, never on page load). */
  autoFocus?: boolean;
}

/**
 * One box per digit, 48×56, JetBrains Mono 20px.
 * Typing auto-advances, paste fills every box, Backspace on an empty box moves back.
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  labelledBy,
  describedBy,
  invalid = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
}) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const focusBox = (index: number) => {
    const box = refs.current[Math.max(0, Math.min(length - 1, index))];
    box?.focus();
    box?.select();
  };

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    // Keep the value contiguous: stop at the first empty box.
    const firstEmpty = next.indexOf('');
    onChange((firstEmpty === -1 ? next : next.slice(0, firstEmpty)).join(''));
  };

  const handleChange = (index: number, raw: string) => {
    let typed = raw.replace(/\D/g, '');
    // Typing next to an existing digit: keep only the new one.
    if (digits[index] && typed.length === 2 && typed.startsWith(digits[index])) typed = typed.slice(1);
    if (!typed) return;
    // Typing into a box past the filled run lands in the next free box.
    const target = Math.min(index, value.length);

    if (typed.length === 1) {
      setDigit(target, typed);
      focusBox(target + 1);
      return;
    }

    // Several digits at once (SMS one-time-code autofill, IME, dictation): fill from here like a paste.
    const next = (value.slice(0, target) + typed).slice(0, length);
    onChange(next);
    focusBox(next.length >= length ? length - 1 : next.length);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        onChange(value.slice(0, index));
        focusBox(index);
      } else if (index > 0) {
        onChange(value.slice(0, index - 1));
        focusBox(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusBox(pasted.length >= length ? length - 1 : pasted.length);
  };

  const boxClass = `flex-1 min-w-0 max-w-12 h-14 rounded-[8px] bg-white text-center font-mono text-[20px] font-medium text-[#121722] transition-all focus:outline-none focus:border-[#1E63FF] focus:ring-[3px] focus:ring-[#1E63FF]/20 disabled:bg-[#EEF1F6] disabled:text-[#8C95A6] disabled:border-[#DDE2EA] disabled:cursor-not-allowed ${
    invalid ? 'border-2 border-[#0B2D6B]' : 'border border-[#8C95A6]'
  }`;

  return (
    <div role="group" aria-labelledby={labelledBy} aria-describedby={describedBy} className="flex justify-between gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={digit}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={boxClass}
        />
      ))}
    </div>
  );
};
