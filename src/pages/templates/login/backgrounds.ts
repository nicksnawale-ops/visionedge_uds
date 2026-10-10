/**
 * Login backgrounds: one entry per VisionEdge use case.
 * Each use case has a line-art illustration (always available) and an optional photo.
 */

export type UseCaseId = 'generic' | 'anpr' | 'hosteltrack' | 'mealpulse' | 'visitor';
export type BackgroundStyle = 'illustration' | 'photo';

export interface UseCaseConfig {
  id: UseCaseId;
  /** Label in the reference page switcher. */
  label: string;
  /** Product chip under the logo; null = no chip. */
  chip: string | null;
  /** Product name used in "Sign in to continue to …". */
  productName: string;
  /** What the illustration (and photo) shows. */
  scene: string;
  /**
   * Optional full-bleed photo. 1920×1080 WebP under 300 KB, see public/login-bg/README.txt.
   * When the file is missing or fails to load, the illustration is used instead.
   */
  photo?: string;
}

export const USE_CASES: UseCaseConfig[] = [
  {
    id: 'generic',
    label: 'Generic',
    chip: null,
    productName: 'VisionEdge',
    scene: 'Camera lens and camera-feed grid',
    photo: '/login-bg/generic.webp',
  },
  {
    id: 'anpr',
    label: 'ANPR',
    chip: 'ANPR system',
    productName: 'VisionEdge ANPR',
    scene: 'Vehicle with number plate, boom barrier',
    photo: '/login-bg/anpr.webp',
  },
  {
    id: 'hosteltrack',
    label: 'HostelTrack',
    chip: 'HostelTrack',
    productName: 'VisionEdge HostelTrack',
    scene: 'Hostel block, door with card reader',
    photo: '/login-bg/hosteltrack.webp',
  },
  {
    id: 'mealpulse',
    label: 'Meal Pulse',
    chip: 'Meal Pulse',
    productName: 'VisionEdge Meal Pulse',
    scene: 'Canteen tray, dome camera above a counter',
    photo: '/login-bg/mealpulse.webp',
  },
  {
    id: 'visitor',
    label: 'Visitor Management',
    chip: 'Visitor management',
    productName: 'VisionEdge Visitor Management',
    scene: 'Entry turnstile, visitor ID badge',
    photo: '/login-bg/visitor.webp',
  },
];

export const DEFAULT_USE_CASE: UseCaseId = 'generic';

export const getUseCase = (id: string | null | undefined): UseCaseConfig =>
  USE_CASES.find((u) => u.id === id) ?? USE_CASES[0];

export const isBackgroundStyle = (value: string | null | undefined): value is BackgroundStyle =>
  value === 'illustration' || value === 'photo';

/** Default style: photo when one is configured (it falls back automatically if the file is missing). */
export const defaultBackgroundStyle = (useCase: UseCaseConfig): BackgroundStyle =>
  useCase.photo ? 'photo' : 'illustration';
