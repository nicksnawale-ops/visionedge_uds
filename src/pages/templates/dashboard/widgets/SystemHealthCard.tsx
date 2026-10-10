import React, { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { RadialGauge } from '../../../../components/charts/RadialGauge';
import { ChartState, ChartStatus } from '../../../../components/charts/ChartState';
import { ChartFrame } from '../charts/ChartFrame';
import { HealthBulletBars } from '../charts/HealthBulletBars';
import { Card } from '../primitives';
import { systemHealth } from '../data/series';

interface SystemHealthCardProps {
  degraded: boolean;
  status: ChartStatus;
  className?: string;
  anatomy?: React.ReactNode;
}

/** Camera network uptime gauge + 3 health bullet bars + last sync (4 columns on desktop). */
export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ degraded, status, className = '', anatomy }) => {
  const health = useMemo(() => systemHealth(degraded), [degraded]);
  const table = {
    caption: 'System health',
    columns: [
      { key: 'metric', label: 'Metric' },
      { key: 'value', label: 'Value', numeric: true },
      { key: 'target', label: 'Target', numeric: true },
    ],
    rows: [
      { metric: 'Camera network uptime', value: `${health.uptime.toFixed(1)}%`, target: `${health.target}%` },
      ...health.bars.map((b) => ({
        metric: b.label,
        value: `${Math.round((b.value / b.max) * 100)}% (${b.detail})`,
        target: `${b.target}%`,
      })),
    ],
  };

  return (
    <Card title="System health" subtitle={degraded ? '2 cameras offline' : 'All systems normal'} className={className} overlay={anatomy}>
      <ChartState status={status} height={360}>
        <ChartFrame
          table={table}
          after={
            <div className="mt-2">
              <HealthBulletBars title="Infrastructure" bars={health.bars} />
            </div>
          }
        >
          <RadialGauge title="Camera network uptime" value={health.uptime} target={health.target} valueLabel="Uptime" />
        </ChartFrame>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#4B5465]">
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          {health.lastSync}
        </p>
      </ChartState>
    </Card>
  );
};
