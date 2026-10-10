import React from 'react';
import { Info } from 'lucide-react';
import { InfoAlert } from '../../shared/authUi';
import { HealthBulletBars } from '../../dashboard/charts/HealthBulletBars';
import { BUTTON, Badge, MONO, OVERLINE } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { LICENSE, LICENSED_MODULES, MODULES } from '../data/system';
import { CardBody, SectionCard } from '../patterns/SectionCard';
import { SettingRow } from '../patterns/SettingRow';

export const License: React.FC = () => {
  const { viewOnly, toast, marker } = useSettings();
  const nearLimit = LICENSE.usage.filter((u) => u.value / u.max >= 0.9);

  return (
    <>
      <SectionCard
        title="Plan"
        settingId="license.plan"
        overlay={marker(5)}
        actions={
          !viewOnly && (
            <button type="button" onClick={() => toast('Your account manager will contact you within 1 business day', 'info')} className={BUTTON.secondary}>
              Contact account manager
            </button>
          )
        }
      >
        <CardBody>
          <dl className="grid grid-cols-1 @min-[640px]:grid-cols-3 gap-4">
            <div>
              <dt className={OVERLINE}>Plan</dt>
              <dd className="mt-1">
                <Badge tone="info">{LICENSE.plan}</Badge>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className={OVERLINE}>License ID</dt>
              <dd className={`mt-1 ${MONO} break-all`}>{LICENSE.id}</dd>
            </div>
            <div>
              <dt className={OVERLINE}>Valid until</dt>
              <dd className="mt-1 text-[14px] text-[#121722]">{LICENSE.validUntil}</dd>
            </div>
          </dl>
        </CardBody>
      </SectionCard>

      <SectionCard title="Usage" description="The marker shows 90%, where we warn you." settingId="license.usage">
        <CardBody className="space-y-4">
          {nearLimit.length > 0 && (
            <InfoAlert icon={Info}>You're close to your {nearLimit[0].label.toLowerCase()} limit.</InfoAlert>
          )}
          <HealthBulletBars
            title="Usage against your plan"
            bars={LICENSE.usage.map((u) => ({
              label: `${u.label} · ${u.value}${u.unit} / ${u.max}${u.unit}`,
              value: u.value,
              max: u.max,
              target: 90,
              detail: `${u.value}${u.unit} of ${u.max}${u.unit}`,
            }))}
          />
        </CardBody>
      </SectionCard>

      <SectionCard title="Enabled modules" description="Managed by your license. Contact your account manager to add a module." settingId="license.modules">
        {MODULES.map((m, i) => (
          <SettingRow
            key={m.id}
            label={m.label}
            description={m.description}
            locked="Managed by your VisionEdge license"
            overlay={i === 0 ? marker(8, true) : undefined}
          >
            {() => (LICENSED_MODULES.has(m.id) ? <Badge tone="live">Enabled</Badge> : <Badge tone="neutral">Not licensed</Badge>)}
          </SettingRow>
        ))}
      </SectionCard>
    </>
  );
};
