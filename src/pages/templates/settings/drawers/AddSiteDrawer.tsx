import React, { useId, useState } from 'react';
import { Field } from '../../shared/authUi';
import { SelectField } from '../parts/SelectField';
import { BUTTON } from '../../profile/ui';
import { Drawer } from '../patterns/Drawer';
import { ChipsInput } from '../patterns/ChipsInput';
import { OPTIONS } from '../data/settingsIndex';
import type { Site } from '../data/sites';

interface AddSiteDrawerProps {
  /** Editing an existing site, or adding a new one. */
  site?: Site;
  onSave: (site: Site) => void;
  onClose: () => void;
  overlay?: React.ReactNode;
}

const LABEL = 'block mb-1.5 text-[14px] leading-[20px] font-medium text-[#121722]';

/** Add or edit a site: name, address, optional coordinates, zones as chips and the default time zone. */
export const AddSiteDrawer: React.FC<AddSiteDrawerProps> = ({ site, onSave, onClose, overlay }) => {
  const uid = useId();
  const [name, setName] = useState(site?.name ?? '');
  const [address, setAddress] = useState(site?.address ?? '');
  const [coords, setCoords] = useState('');
  const [zones, setZones] = useState<string[]>(site?.zones ?? ['Gate 1']);
  const [tz, setTz] = useState('Asia/Kolkata');
  const [errors, setErrors] = useState<{ name?: string; address?: string; coords?: string }>({});

  const save = () => {
    const next = {
      name: name.trim() ? undefined : 'Enter a site name',
      address: address.trim() ? undefined : 'Enter the site address',
      coords: !coords.trim() || /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/.test(coords.trim()) ? undefined : 'Use latitude, longitude, like 18.5913, 73.7389',
    };
    setErrors(next);
    const first = (['name', 'address', 'coords'] as const).find((k) => next[k]);
    if (first) return document.getElementById(`${uid}-${first}`)?.focus();
    onSave({ id: site?.id ?? `site-${name.trim().toLowerCase().replace(/\s+/g, '-')}`, name: name.trim(), address: address.trim(), cameras: site?.cameras ?? 0, zones, status: site?.status ?? 'active' });
  };

  return (
    <Drawer
      title={site ? `Edit ${site.name}` : 'Add site'}
      description="Sites group cameras by campus or building. Zones are used by rules and reports."
      onClose={onClose}
      overlay={overlay}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.ghost}>
            Cancel
          </button>
          <button type="button" onClick={save} className={BUTTON.primary}>
            {site ? 'Save site' : 'Add site'}
          </button>
        </>
      }
    >
      <form noValidate onSubmit={(e) => (e.preventDefault(), save())} className="space-y-5">
        <Field id={`${uid}-name`} label="Site name" value={name} error={errors.name} placeholder="e.g. North campus" onChange={(e) => setName(e.target.value)} />
        <Field id={`${uid}-address`} label="Address" value={address} error={errors.address} autoComplete="street-address" onChange={(e) => setAddress(e.target.value)} />
        <Field
          id={`${uid}-coords`}
          label="Geo-coordinates"
          optional
          helper="Latitude, longitude. Used for the site map."
          placeholder="18.5913, 73.7389"
          value={coords}
          error={errors.coords}
          onChange={(e) => setCoords(e.target.value)}
        />
        <div>
          <span id={`${uid}-zones-label`} className={LABEL}>
            Zones
          </span>
          <ChipsInput
            id={`${uid}-zones`}
            labelledBy={`${uid}-zones-label`}
            values={zones}
            onChange={setZones}
            noun="zone"
            placeholder="Type a zone, like Gate 2, and press Enter"
            validate={(v) => (v.length > 24 ? 'Use 24 characters or fewer for a zone name' : undefined)}
          />
          <p className="mt-1.5 text-[12px] leading-[16px] text-[#4B5465]">Gates, blocks or counters cameras are assigned to.</p>
        </div>
        <SelectField id={`${uid}-tz`} label="Default time zone" options={[...OPTIONS.timezone]} value={tz} onChange={setTz} placeholder="Choose a time zone" />
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Drawer>
  );
};
