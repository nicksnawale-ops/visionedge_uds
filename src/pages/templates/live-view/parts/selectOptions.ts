import {
  Bike,
  Bus,
  Car,
  Coffee,
  IdCard,
  LayoutGrid,
  LogIn,
  LogOut,
  MapPin,
  Truck,
  User,
  Utensils,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { LiveCamera } from '../data/cameras';
import type { Detection } from '../data/detections';
import type { LiveSelectOption } from './LiveSelect';

/** Default camera groups that span several zones in the data. "All cameras" covers every zone. */
const GROUP_ZONES: Record<string, string[]> = {
  'Block A–C': ['Block A', 'Block B', 'Block C'],
  'Reception & gates': ['Reception', 'Gates'],
};

export const ALL_CAMERAS = 'All cameras';

export const inGroup = (camera: LiveCamera, group: string): boolean =>
  group === ALL_CAMERAS || (GROUP_ZONES[group] ?? [group]).includes(camera.zone);

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Sites with "7/8 online" and a dot: Cyan when every camera is online, Royal Blue when some are not. */
export const siteOptions = (sites: string[], cameras: LiveCamera[]): LiveSelectOption<string>[] =>
  sites.map((site) => {
    const inSite = cameras.filter((c) => c.site === site);
    const online = inSite.filter((c) => c.status === 'online').length;
    const all = online === inSite.length;
    return {
      value: site,
      label: site,
      meta: `${online}/${inSite.length} online`,
      dot: all ? 'bg-[#00C6FF]' : 'bg-[#1E63FF]',
      srText: all ? `all ${inSite.length} cameras online` : `${online} of ${inSite.length} cameras online`,
    };
  });

/** The use case's default group, then every zone; counts are within the selected site. */
export const groupOptions = (defaultGroup: string, zones: string[], cameras: LiveCamera[], site: string): LiveSelectOption<string>[] => {
  const count = (g: string) => cameras.filter((c) => c.site === site && inGroup(c, g)).length;
  const zoneList = zones.filter((z) => z !== defaultGroup);
  const opt = (g: string, group: string, icon: LucideIcon): LiveSelectOption<string> => {
    const n = count(g);
    return { value: g, label: g, meta: plural(n, 'camera'), icon, group, disabled: n === 0, srText: n === 0 ? `no cameras at ${site}` : undefined };
  };
  return [opt(defaultGroup, defaultGroup === ALL_CAMERAS ? 'All' : 'Default view', LayoutGrid), ...zoneList.map((z) => opt(z, 'Zones', MapPin))];
};

const TYPE_ICONS: Record<string, LucideIcon> = {
  person: User,
  vehicle: Car,
  car: Car,
  'two-wheeler': Bike,
  truck: Truck,
  bus: Bus,
  in: LogIn,
  out: LogOut,
  breakfast: Coffee,
  lunch: Utensils,
  dinner: UtensilsCrossed,
  checkin: IdCard,
  checkout: LogOut,
};

/** "All types" + the use case's types, each with an icon and its live count in the feed. */
export const typeOptions = (types: { value: string; label: string }[], items: Detection[], AllIcon: LucideIcon): LiveSelectOption<string>[] => [
  { value: 'all', label: 'All types', icon: AllIcon, meta: String(items.length), srText: plural(items.length, 'detection') },
  ...types.map((tp) => {
    const n = items.filter((d) => d.type === tp.value).length;
    return { value: tp.value, label: tp.label, icon: TYPE_ICONS[tp.value] ?? User, meta: String(n), srText: plural(n, 'detection') };
  }),
];
