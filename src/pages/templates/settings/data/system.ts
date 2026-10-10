/** System: versions, edge devices, backups and data requests. Fixed sample data. */

export const VERSION = { app: 'VisionEdge v1.0.0', firmware: 'Edge firmware 3.8.1', available: 'v1.1.0 · Edge firmware 3.9.0' };

export interface EdgeDevice {
  id: string;
  site: string;
  cameras: number;
  cpu: number;
  gpu: number;
  temperature: number;
  status: 'online' | 'offline';
}

export const EDGE_DEVICES: EdgeDevice[] = [
  { id: 'EDGE-01', site: 'Main campus', cameras: 8, cpu: 42, gpu: 61, temperature: 54, status: 'online' },
  { id: 'EDGE-02', site: 'Main campus', cameras: 8, cpu: 38, gpu: 57, temperature: 51, status: 'online' },
  { id: 'EDGE-03', site: 'Main campus', cameras: 8, cpu: 71, gpu: 88, temperature: 68, status: 'online' },
  { id: 'EDGE-04', site: 'North campus', cameras: 6, cpu: 35, gpu: 49, temperature: 49, status: 'online' },
  { id: 'EDGE-05', site: 'North campus', cameras: 5, cpu: 29, gpu: 44, temperature: 47, status: 'online' },
  { id: 'EDGE-06', site: 'South campus', cameras: 3, cpu: 0, gpu: 0, temperature: 0, status: 'offline' },
];

export interface DataRequest {
  id: string;
  type: 'Access' | 'Erasure' | 'Correction';
  status: 'Open' | 'In review' | 'Completed';
  due: string;
}

export const DATA_REQUESTS: DataRequest[] = [
  { id: 'DSR-0142', type: 'Access', status: 'Open', due: '07 Oct 2026' },
  { id: 'DSR-0139', type: 'Erasure', status: 'In review', due: '03 Oct 2026' },
  { id: 'DSR-0131', type: 'Correction', status: 'Completed', due: '22 Sep 2026' },
];

export const HOLIDAYS = [
  { date: '02 Oct 2026', name: 'Gandhi Jayanti' },
  { date: '20 Oct 2026', name: 'Dussehra' },
  { date: '08 Nov 2026', name: 'Diwali' },
  { date: '25 Dec 2026', name: 'Christmas' },
  { date: '26 Jan 2027', name: 'Republic Day' },
];

export const LICENSE = {
  plan: 'Enterprise',
  id: 'VE-ENT-2025-PIT-00417',
  validUntil: '31 Mar 2027',
  usage: [
    { label: 'Cameras', value: 38, max: 50, unit: '' },
    { label: 'Users', value: 124, max: 200, unit: '' },
    { label: 'Storage', value: 2.1, max: 5, unit: ' TB' },
    { label: 'Edge devices', value: 6, max: 10, unit: '' },
  ],
};

export const MODULES = [
  { id: 'anpr', label: 'ANPR', description: 'Number plate reading, watchlists and gate logs.' },
  { id: 'hosteltrack', label: 'HostelTrack', description: 'Hostel entries, attendance and outpasses.' },
  { id: 'mealpulse', label: 'Meal Pulse', description: 'Meal counts, queues and duplicate attempts.' },
  { id: 'visitor', label: 'Visitor Management', description: 'Visitor check-in, passes and pre-approvals.' },
] as const;

export type ModuleId = (typeof MODULES)[number]['id'];

/** Modules included in the sample license. */
export const LICENSED_MODULES: ReadonlySet<ModuleId> = new Set<ModuleId>(['anpr', 'hosteltrack']);
