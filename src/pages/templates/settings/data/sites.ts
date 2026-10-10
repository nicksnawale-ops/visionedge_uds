/** Sites and their zones. Fixed sample data. */

export interface Site {
  id: string;
  name: string;
  address: string;
  cameras: number;
  zones: string[];
  status: 'active' | 'inactive';
}

const SITES: Site[] = [
  { id: 'site-main', name: 'Main campus', address: 'Survey No. 27, Hinjawadi Phase 2, Pune 411057', cameras: 24, zones: ['Gate 1', 'Gate 3', 'Parking B', 'Library'], status: 'active' },
  { id: 'site-north', name: 'North campus', address: 'Plot 14, Baner Road, Pune 411045', cameras: 11, zones: ['Gate 4', 'Sports complex'], status: 'active' },
  { id: 'site-south', name: 'South campus', address: 'Sinhgad Road, Pune 411041', cameras: 3, zones: ['Gate 6'], status: 'inactive' },
];

export const getSites = (): Site[] => SITES.map((s) => ({ ...s, zones: [...s.zones] }));

/** All zone names, for camera and rule selects. */
export const allZones = (): string[] => SITES.flatMap((s) => s.zones);
