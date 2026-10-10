/** Organization users and pending invitations. Fictional names; initials avatars only. */
import { ROLE_COLUMNS, RoleName } from './permissions';

export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface OrgUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: RoleName;
  sites: string;
  status: UserStatus;
  lastActive: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: RoleName;
  invitedBy: string;
  sent: string;
  expires: string;
}

const PEOPLE: [string, RoleName][] = [
  ['Priya Sharma', 'Administrator'],
  ['Rahul Mehta', 'Security supervisor'],
  ['Anjali Kulkarni', 'Operator'],
  ['Vikram Desai', 'Operator'],
  ['Sneha Patil', 'Viewer'],
  ['Arjun Nair', 'Security supervisor'],
  ['Meera Joshi', 'Operator'],
  ['Karan Gupta', 'Viewer'],
];

const initials = (name: string) => name.split(' ').map((p) => p[0]).join('').slice(0, 2);
const email = (name: string) => `${name.toLowerCase().replace(' ', '.')}@pit.edu.in`;
const LAST = ['Active now', '12 min ago', '1 hour ago', 'Yesterday', '3 days ago', '2 hours ago', 'Today, 09:40', '—'];

export function getOrgUsers(): OrgUser[] {
  return PEOPLE.map(([name, role], i) => ({
    id: `u${i}`,
    name,
    initials: initials(name),
    email: email(name),
    role,
    sites: i === 0 ? 'All sites' : i % 3 === 0 ? 'Main campus, North campus' : 'Main campus',
    status: i === 7 ? 'Invited' : i === 4 ? 'Suspended' : 'Active',
    lastActive: LAST[i],
  }));
}

export function getInvitations(): Invitation[] {
  return [
    { id: 'inv1', email: 'karan.gupta@pit.edu.in', role: 'Viewer', invitedBy: 'Priya Sharma', sent: '25 Sep', expires: 'Expires in 2 days' },
    { id: 'inv2', email: 'divya.rao@pit.edu.in', role: 'Security supervisor', invitedBy: 'Priya Sharma', sent: '28 Sep', expires: 'Expires in 5 days' },
    { id: 'inv3', email: 'nikhil.shah@pit.edu.in', role: 'Operator', invitedBy: 'Rahul Mehta', sent: '29 Sep', expires: 'Expires in 6 days' },
  ];
}

export const ROLE_OPTIONS = ROLE_COLUMNS.map((r) => ({ value: r, label: r }));
