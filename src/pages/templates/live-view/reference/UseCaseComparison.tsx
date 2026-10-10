import React from 'react';
import { USE_CASE_IDS, USE_CASE_LABEL, getLiveUseCase } from '../useCases';
import { getCameras } from '../data/cameras';
import { makeDetection } from '../data/detections';
import { NOW_START, clock } from '../data/seed';
import { LiveTile } from '../wall/LiveTile';
import { DetectionItem } from '../panels/DetectionItem';
import { OVERLINE } from '../ui';

/** 5-column comparison: tile overlay, detection item and drawer facts per use case. */
export const UseCaseComparison: React.FC = () => (
  <div className="overflow-x-auto rounded-[12px] border border-[#DDE2EA] bg-white">
    <div className="grid grid-cols-5 gap-4 p-4 min-w-[1100px]">
      {USE_CASE_IDS.map((id) => {
        const uc = getLiveUseCase(id);
        const cams = getCameras(uc);
        const cam = cams[uc.id === 'anpr' ? 2 : uc.id === 'hosteltrack' ? 0 : 1];
        const d = makeDetection(uc, cams, 4000, NOW_START - 12);
        const det = { ...d, cameraId: cam.id, cameraName: cam.name, zone: cam.zone };
        return (
          <section key={id} aria-labelledby={`uc-${id}`} className="min-w-0">
            <h3 id={`uc-${id}`} className="text-[14px] font-semibold text-[#121722] mb-2">
              {USE_CASE_LABEL[id]}
            </h3>
            <div role="grid" aria-label={`${USE_CASE_LABEL[id]} tile example`}>
              <div role="row">
                <LiveTile
                  uc={uc}
                  camera={cam}
                  slot={0}
                  mode="online"
                  sd={false}
                  paused={false}
                  playback={null}
                  animate={false}
                  hidden={false}
                  selected={false}
                  flash={0}
                  compact
                  detectionLabel={det.chip}
                  detectionExtra={uc.id === 'anpr' ? 'Car' : undefined}
                  recentDetections={2}
                  time={clock(NOW_START)}
                  tick={0}
                  barrierOpen={false}
                  tabIndex={0}
                  onSelect={() => undefined}
                  onToggleFocus={() => undefined}
                  onAction={() => undefined}
                  onBarrier={() => undefined}
                  onDropCamera={() => undefined}
                  onGridKey={() => undefined}
                />
              </div>
            </div>
            <div className="mt-3 rounded-[8px] border border-[#DDE2EA] overflow-hidden">
              <DetectionItem d={det} scene={uc.scene} now={NOW_START} onOpen={() => undefined} tabIndex={0} onKeyDown={() => undefined} />
            </div>
            <dl className="mt-3 space-y-2">
              {det.facts.map((f) => (
                <div key={f.label}>
                  <dt className={`${OVERLINE} text-[#6B7485]`}>{f.label}</dt>
                  <dd className={`text-[13px] text-[#121722] ${f.mono ? 'font-mono' : ''}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[12px] text-[#4B5465]">
              Primary action: <span className="font-semibold text-[#121722]">{uc.primaryAction}</span>
            </p>
          </section>
        );
      })}
    </div>
  </div>
);
