import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, FieldErrorText, LABEL } from '../../shared/authUi';
import { SelectField } from '../parts/SelectField';
import { BUTTON, CHECKBOX, RADIO, Spinner } from '../../profile/ui';
import { Drawer } from '../patterns/Drawer';
import { rowField } from '../patterns/SettingRow';
import { getSites } from '../data/sites';
import type { CameraType, SettingsCamera } from '../data/cameras';

interface AddCameraDrawerProps {
  /** Modules the license includes (AI module checkboxes). */
  modules: { id: string; label: string }[];
  camera?: SettingsCamera;
  /** Demo state: open with a filled form. */
  prefilled?: boolean;
  onSave: (camera: SettingsCamera) => void;
  onClose: () => void;
  overlay?: React.ReactNode;
}

type TestResult = { ok: true } | { ok: false } | null;

const TYPES: { value: CameraType; label: string }[] = [
  { value: 'Fixed', label: 'Fixed' },
  { value: 'PTZ', label: 'PTZ (pan, tilt, zoom)' },
  { value: 'ANPR', label: 'ANPR' },
];

const isStreamUrl = (v: string) => /^rtsp:\/\/[^\s/]+(\/\S*)?$/.test(v.trim());

/** Add or edit a camera, with a "Test connection" check of the stream before saving. */
export const AddCameraDrawer: React.FC<AddCameraDrawerProps> = ({ modules, camera, prefilled = false, onSave, onClose, overlay }) => {
  const uid = useId();
  const sites = useMemo(() => getSites().filter((s) => s.status === 'active'), []);
  const [name, setName] = useState(camera?.name ?? (prefilled ? `${sites[0].zones[1]} entry lane` : ''));
  const [site, setSite] = useState(camera?.site ?? sites[0].name);
  const [zone, setZone] = useState(camera?.zone ?? sites[0].zones[prefilled ? 1 : 0]);
  const [type, setType] = useState<CameraType>(camera?.type ?? 'Fixed');
  const [url, setUrl] = useState(prefilled ? 'rtsp://10.20.4.17:554/stream1' : '');
  const [username, setUsername] = useState(prefilled ? 've-cam' : '');
  const [password, setPassword] = useState(prefilled ? 'Gate-2026!' : '');
  const [recording, setRecording] = useState<'continuous' | 'events'>('continuous');
  const [assigned, setAssigned] = useState<string[]>([modules[0]?.id].filter(Boolean));
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult>(null);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const zones = sites.find((s) => s.name === site)?.zones ?? [];
  const urlError = (v: string) => (isStreamUrl(v) ? undefined : 'Enter a valid stream URL starting with rtsp://');

  const test = () => {
    const e = urlError(url);
    setErrors((er) => ({ ...er, url: e }));
    if (e) return document.getElementById(`${uid}-url`)?.focus();
    setTesting(true);
    setResult(null);
    // Demo: any stream on 10.x connects; anything else times out.
    timer.current = window.setTimeout(() => {
      setTesting(false);
      setResult({ ok: /^rtsp:\/\/10\./.test(url.trim()) });
    }, 1200);
  };

  const save = () => {
    const next = { name: name.trim() ? undefined : 'Enter a camera name', url: urlError(url) };
    setErrors(next);
    if (next.name) return document.getElementById(`${uid}-name`)?.focus();
    if (next.url) return document.getElementById(`${uid}-url`)?.focus();
    onSave({
      id: camera?.id ?? 'CAM-39',
      name: name.trim(),
      site,
      zone,
      type,
      resolution: '1920×1080',
      fps: 25,
      status: result?.ok === false ? 'offline' : 'online',
      lastSeen: 'Live',
    });
  };

  return (
    <Drawer
      title={camera ? `Edit ${camera.id}` : 'Add camera'}
      description="Connect a camera stream and choose which AI modules analyse it."
      onClose={onClose}
      overlay={overlay}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.ghost}>
            Cancel
          </button>
          <button type="button" onClick={save} className={BUTTON.primary}>
            {camera ? 'Save camera' : 'Add camera'}
          </button>
        </>
      }
    >
      <form noValidate onSubmit={(e) => (e.preventDefault(), save())} className="space-y-5">
        <Field id={`${uid}-name`} label="Name" value={name} error={errors.name} placeholder="e.g. Gate 2 entry lane" onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-1 @min-[480px]:grid-cols-2 gap-4">
          <SelectField
            id={`${uid}-site`}
            label="Site"
            options={sites.map((s) => ({ value: s.name, label: s.name }))}
            value={site}
            onChange={(v) => {
              setSite(v);
              setZone(sites.find((s) => s.name === v)?.zones[0] ?? '');
            }}
            placeholder="Choose a site"
          />
          <SelectField id={`${uid}-zone`} label="Zone" options={zones.map((z) => ({ value: z, label: z }))} value={zone} onChange={setZone} placeholder="Choose a zone" />
        </div>
        <SelectField id={`${uid}-type`} label="Camera type" options={TYPES} value={type} onChange={(v) => setType(v as CameraType)} placeholder="Choose a type" />

        <div>
          <label htmlFor={`${uid}-url`} className={LABEL}>
            Stream URL
          </label>
          <div className="flex flex-col @min-[480px]:flex-row gap-2">
            <input
              id={`${uid}-url`}
              value={url}
              placeholder="rtsp://10.20.4.17:554/stream1"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={errors.url ? true : undefined}
              aria-describedby={`${uid}-url-msg`}
              onChange={(e) => {
                setUrl(e.target.value);
                setResult(null);
                if (errors.url) setErrors((er) => ({ ...er, url: undefined }));
              }}
              onBlur={() => url && setErrors((er) => ({ ...er, url: urlError(url) }))}
              className={`${rowField(Boolean(errors.url))} max-w-none! flex-1 font-mono`}
            />
            <button type="button" onClick={test} aria-disabled={testing || undefined} className={`${BUTTON.secondary} min-w-[164px]`}>
              {testing ? (
                <>
                  <Spinner />
                  Testing…
                </>
              ) : (
                'Test connection'
              )}
            </button>
          </div>
          <div id={`${uid}-url-msg`} aria-live="polite">
            {errors.url && <FieldErrorText>{errors.url}</FieldErrorText>}
            {result?.ok && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[16px] font-medium text-[#0B2D6B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00C6FF]" aria-hidden="true" />
                Connected · 1920×1080 · 25 FPS
              </p>
            )}
            {result && !result.ok && <FieldErrorText>Couldn't connect. Check the URL and network.</FieldErrorText>}
          </div>
        </div>

        <div className="grid grid-cols-1 @min-[480px]:grid-cols-2 gap-4">
          <Field id={`${uid}-user`} label="Username" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Field id={`${uid}-pass`} label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <fieldset>
          <legend className={LABEL}>Recording</legend>
          <div className="flex flex-wrap gap-x-5">
            {(
              [
                ['continuous', 'Continuous'],
                ['events', 'Events only'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] text-[#121722] cursor-pointer">
                <input type="radio" name={`${uid}-rec`} checked={recording === value} onChange={() => setRecording(value)} className={RADIO} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={LABEL}>Assigned AI modules</legend>
          <p className="-mt-1 mb-1 text-[12px] leading-[16px] text-[#4B5465]">Only licensed modules are listed.</p>
          {modules.map((m) => (
            <label key={m.id} className="flex items-center gap-3 min-h-[44px] text-[14px] text-[#121722] cursor-pointer">
              <input
                type="checkbox"
                checked={assigned.includes(m.id)}
                onChange={() => setAssigned((a) => (a.includes(m.id) ? a.filter((x) => x !== m.id) : [...a, m.id]))}
                className={CHECKBOX}
              />
              {m.label}
            </label>
          ))}
        </fieldset>
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Drawer>
  );
};
