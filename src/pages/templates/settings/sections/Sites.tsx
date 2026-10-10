import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { BUTTON, Badge } from '../../profile/ui';
import { useSettings } from '../SettingsContext';
import { Site, getSites } from '../data/sites';
import { SectionCard } from '../patterns/SectionCard';
import { TABLE } from '../patterns/table';
import { AddSiteDrawer } from '../drawers/AddSiteDrawer';

export const Sites: React.FC = () => {
  const { state, viewOnly, toast, undoToast, announce, marker } = useSettings();
  const [sites, setSites] = useState<Site[]>(() => (state === 'empty' ? [] : getSites()));
  const [drawer, setDrawer] = useState<{ site?: Site } | null>(null);

  const addButton = !viewOnly && (
    <button type="button" onClick={() => setDrawer({})} className={BUTTON.secondary}>
      <Plus className="w-4 h-4" aria-hidden="true" />
      Add site
    </button>
  );

  const deactivate = (site: Site) => {
    const before = sites;
    setSites((list) => list.map((s) => (s.id === site.id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s)));
    undoToast(`${site.name} ${site.status === 'active' ? 'deactivated' : 'activated'}`, () => setSites(before));
  };

  return (
    <>
      <SectionCard
        title="Sites"
        description={sites.length ? `${sites.length} sites · ${sites.reduce((n, s) => n + s.cameras, 0)} cameras` : 'No sites yet'}
        settingId="sites.table"
        overlay={marker(5)}
        actions={sites.length ? addButton : undefined}
      >
        {sites.length === 0 ? (
          <div className="px-6 py-14 flex flex-col items-center text-center gap-3">
            <span className="w-12 h-12 rounded-full bg-[#1E63FF]/[0.08] text-[#1E63FF] flex items-center justify-center" aria-hidden="true">
              <MapPin className="w-6 h-6" />
            </span>
            <p className="max-w-[360px] text-[14px] leading-[20px] text-[#353D4C]">No sites yet. Add your first site to start connecting cameras.</p>
            {addButton}
          </div>
        ) : (
          <div className={TABLE.scroll}>
            <table className={`${TABLE.table} min-w-[820px]`}>
              <caption className="sr-only">Sites</caption>
              <thead>
                <tr className={TABLE.headRow}>
                  {['Site', 'Address', 'Cameras', 'Gates / zones', 'Status'].map((h) => (
                    <th key={h} scope="col" className={`${TABLE.th} ${h === 'Cameras' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                  <th scope="col" className={TABLE.th}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={TABLE.body}>
                {sites.map((s) => (
                  <tr key={s.id} className={TABLE.row}>
                    <th scope="row" className={`${TABLE.td} text-left font-medium text-[#121722]`}>
                      {s.name}
                    </th>
                    <td className={`${TABLE.td} whitespace-normal min-w-[220px] text-[13px]`}>{s.address}</td>
                    <td className={`${TABLE.td} text-right tabular-nums`}>{s.cameras}</td>
                    <td className={`${TABLE.td} whitespace-normal min-w-[180px] text-[13px]`}>{s.zones.join(', ')}</td>
                    <td className={TABLE.td}>{s.status === 'active' ? <Badge tone="live">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}</td>
                    <td className={`${TABLE.td} text-right`}>
                      {!viewOnly && (
                        <span className="inline-flex gap-1">
                          <button type="button" onClick={() => setDrawer({ site: s })} className={BUTTON.ghostSm} aria-label={`Edit ${s.name}`}>
                            Edit
                          </button>
                          <button type="button" onClick={() => deactivate(s)} className={BUTTON.ghostSm} aria-label={`${s.status === 'active' ? 'Deactivate' : 'Activate'} ${s.name}`}>
                            {s.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {drawer && (
        <AddSiteDrawer
          site={drawer.site}
          overlay={marker(10, true)}
          onClose={() => setDrawer(null)}
          onSave={(site) => {
            setSites((list) => (list.some((s) => s.id === site.id) ? list.map((s) => (s.id === site.id ? site : s)) : [...list, site]));
            setDrawer(null);
            const message = drawer.site ? `${site.name} updated` : `${site.name} added. Assign cameras to it from Cameras & devices.`;
            toast(message, 'success');
            announce(message);
          }}
        />
      )}
    </>
  );
};
