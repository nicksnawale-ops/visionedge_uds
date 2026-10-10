/** Demo PIN code lookup (a real product would call a postal API). Fixed sample entries. */
const PINS: Record<string, { city: string; state: string }> = {
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '411057': { city: 'Pune', state: 'Maharashtra' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
};

export const lookupPin = (pin: string): { city: string; state: string } | null => PINS[pin] ?? null;
