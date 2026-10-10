import React from 'react';
import type { IllustrationKind } from '../errorTypes';
import { NotFoundIllustration } from './NotFound';
import { ForbiddenIllustration } from './Forbidden';
import { SessionIllustration } from './Session';
import { BrowserIssueIllustration } from './BrowserIssue';
import { ServerIllustration } from './Server';
import { MaintenanceIllustration } from './Maintenance';
import { OfflineIllustration } from './Offline';
import { UnreachableIllustration } from './Unreachable';
import { UnsupportedIllustration } from './Unsupported';

/** The illustration for an error type; 200 × 160 on full pages, 160 × 128 in-app. */
export const ErrorIllustration: React.FC<{ kind: IllustrationKind; size?: number }> = ({ kind, size = 200 }) => {
  switch (kind) {
    case 'not-found':
      return <NotFoundIllustration size={size} />;
    case 'forbidden':
      return <ForbiddenIllustration size={size} />;
    case 'session':
      return <SessionIllustration size={size} />;
    case 'bad-request':
      return <BrowserIssueIllustration size={size} variant="warning" />;
    case 'request-timeout':
      return <BrowserIssueIllustration size={size} variant="hourglass" />;
    case 'rate-limit':
      return <BrowserIssueIllustration size={size} variant="speedometer" />;
    case 'server-error':
      return <ServerIllustration size={size} variant="alert" />;
    case 'bad-gateway':
      return <ServerIllustration size={size} variant="cable" />;
    case 'gateway-timeout':
      return <ServerIllustration size={size} variant="hourglass" />;
    case 'maintenance':
      return <MaintenanceIllustration size={size} />;
    case 'offline':
      return <OfflineIllustration size={size} />;
    case 'unreachable':
      return <UnreachableIllustration size={size} />;
    case 'unsupported':
      return <UnsupportedIllustration size={size} />;
  }
};
