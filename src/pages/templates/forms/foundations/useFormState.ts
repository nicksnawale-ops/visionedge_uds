import { useCallback, useMemo, useState } from 'react';

export interface FormState<T extends object> {
  values: T;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  patch: (patch: Partial<T>) => void;
  /** Errors for touched fields (all fields after a submit attempt). */
  errors: Partial<Record<string, string>>;
  /** Every current error, touched or not. */
  allErrors: Partial<Record<string, string>>;
  touch: (key: string) => void;
  /** Marks every field as touched (submit) and returns the error keys in form order. */
  submitAttempt: () => string[];
  submitted: boolean;
  /** Field keys whose value differs from the baseline. */
  changed: (keyof T)[];
  dirty: boolean;
  /** Replace values and baseline (after save or discard). */
  reset: (values: T) => void;
  /** Back to the baseline. */
  discard: () => void;
  /** Clear touched/submitted (e.g. moving to the next wizard step) without touching values or baseline. */
  resetValidation: () => void;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Local form state with typed values, touched-on-blur errors and change tracking.
 * No form library: validation is a pure function of the values.
 */
export function useFormState<T extends object>(
  initial: T,
  validate: (values: T) => Partial<Record<string, string>>,
  options: { baseline?: T; touched?: string[]; submitted?: boolean } = {}
): FormState<T> {
  const [values, setValues] = useState<T>(initial);
  const [baseline, setBaseline] = useState<T>(options.baseline ?? initial);
  const [touched, setTouched] = useState<string[]>(options.touched ?? []);
  const [submitted, setSubmitted] = useState(options.submitted ?? false);

  const allErrors = useMemo(() => validate(values), [values, validate]);
  const errors = useMemo(
    () => (submitted ? allErrors : Object.fromEntries(Object.entries(allErrors).filter(([k]) => touched.includes(k)))),
    [allErrors, touched, submitted]
  );
  const changed = useMemo(() => (Object.keys(values) as (keyof T)[]).filter((k) => !same(values[k], baseline[k])), [values, baseline]);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => setValues((v) => ({ ...v, [key]: value })), []);
  const patch = useCallback((p: Partial<T>) => setValues((v) => ({ ...v, ...p })), []);
  const touch = useCallback((key: string) => setTouched((t) => (t.includes(key) ? t : [...t, key])), []);

  return {
    values,
    set,
    patch,
    errors,
    allErrors,
    touch,
    submitAttempt: () => {
      setSubmitted(true);
      return Object.keys(allErrors);
    },
    submitted,
    changed,
    dirty: changed.length > 0,
    reset: (v: T) => {
      setValues(v);
      setBaseline(v);
      setTouched([]);
      setSubmitted(false);
    },
    discard: () => {
      setValues(baseline);
      setTouched([]);
      setSubmitted(false);
    },
    resetValidation: () => {
      setTouched([]);
      setSubmitted(false);
    },
  };
}
