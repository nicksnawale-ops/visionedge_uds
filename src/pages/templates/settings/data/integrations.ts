/** Integrations (generic names and lucide icons only, no third-party brands) and webhook deliveries. */
import { BarChart3, DoorOpen, GraduationCap, KeyRound, Mail, MessageSquare, Webhook } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type IntegrationStatus = 'connected' | 'not-connected' | 'error';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: IntegrationStatus;
  /** Inline message when status is error. */
  error?: string;
}

export const getIntegrations = (smsError: boolean): Integration[] => [
  { id: 'smtp', name: 'Email (SMTP)', description: 'Sends alert and report emails from your own mail server.', icon: Mail, status: 'connected' },
  {
    id: 'sms',
    name: 'SMS gateway',
    description: 'Sends SMS alerts to on-duty staff.',
    icon: MessageSquare,
    status: smsError ? 'error' : 'connected',
    error: smsError ? 'Authentication failed on 30 Sep, 14:02. Update your API credentials.' : undefined,
  },
  { id: 'webhooks', name: 'Webhooks', description: 'Posts events to your own systems as they happen.', icon: Webhook, status: 'connected' },
  { id: 'sso', name: 'Single sign-on (SAML/OIDC)', description: 'Lets staff sign in with your organization’s identity provider.', icon: KeyRound, status: 'not-connected' },
  { id: 'sis', name: 'Student information system', description: 'Syncs students, rooms and outpasses every night.', icon: GraduationCap, status: 'connected' },
  { id: 'barrier', name: 'Boom barrier / access controller', description: 'Opens barriers and doors on approved detections.', icon: DoorOpen, status: 'not-connected' },
  { id: 'bi', name: 'Data export to BI', description: 'Daily export of events to your reporting tool.', icon: BarChart3, status: 'not-connected' },
];

export const WEBHOOK_EVENTS = [
  { value: 'alert.created', label: 'Alert created' },
  { value: 'alert.acknowledged', label: 'Alert acknowledged' },
  { value: 'camera.offline', label: 'Camera offline' },
  { value: 'detection.created', label: 'Every detection' },
];

export interface Delivery {
  id: string;
  event: string;
  time: string;
  status: 200 | 500;
  duration: string;
}

export const DELIVERIES: Delivery[] = [
  { id: 'd1', event: 'alert.created', time: '30 Sep, 14:01', status: 200, duration: '182 ms' },
  { id: 'd2', event: 'camera.offline', time: '30 Sep, 13:47', status: 200, duration: '201 ms' },
  { id: 'd3', event: 'alert.acknowledged', time: '30 Sep, 12:15', status: 500, duration: '3.0 s' },
  { id: 'd4', event: 'alert.created', time: '30 Sep, 11:58', status: 200, duration: '175 ms' },
];
