import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, ImagePlus, ZoomIn, ZoomOut } from 'lucide-react';
import { BUTTON, Modal } from '../ui';

const MAX_BYTES = 2 * 1024 * 1024;
const MIN_PX = 256;
/** Crop area size in px (fits a 320px screen inside the modal). */
const AREA = 240;
const OUTPUT = 256;
const NUDGE = 8;

/**
 * Decorative sample image for the "Photo upload & crop" state: abstract shapes in palette colors,
 * never a photo of a person.
 */
export const SAMPLE_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#0B2D6B"/>
    <circle cx="380" cy="120" r="150" fill="#1E63FF"/>
    <circle cx="120" cy="400" r="190" fill="#1E63FF" opacity="0.55"/>
    <circle cx="256" cy="256" r="96" fill="#00C6FF" opacity="0.85"/>
    <rect x="300" y="330" width="150" height="150" rx="24" fill="#FFFFFF" opacity="0.18"/>
  </svg>`
)}`;

interface LoadedImage {
  src: string;
  width: number;
  height: number;
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

interface AvatarCropModalProps {
  /** Opens straight on the crop step with this image (demo state). */
  initialImage?: string | null;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

/**
 * 640px modal: choose a JPG or PNG (≤2 MB, ≥256 × 256 px), then crop it in a circle mask.
 * Zoom with the slider; drag or use the arrow keys to reposition.
 */
export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({ initialImage, onSave, onClose }) => {
  const uid = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  // The demo image is loading: keep the crop layout instead of flashing the file chooser.
  const pending = Boolean(initialImage) && !image;

  // Move focus to the crop area once an image is ready (the chooser it replaced had focus).
  useEffect(() => {
    if (image) areaRef.current?.focus();
  }, [image]);

  useEffect(() => {
    if (!initialImage) return;
    loadImage(initialImage).then((img) => setImage({ src: initialImage, width: img.naturalWidth || 512, height: img.naturalHeight || 512 }));
  }, [initialImage]);

  // Release the object URL when the modal closes.
  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  // Cover the crop area at zoom 1, then scale.
  const base = image ? AREA / Math.min(image.width, image.height) : 1;
  const k = base * zoom;
  const clamp = (x: number, y: number) => {
    if (!image) return { x: 0, y: 0 };
    const maxX = (image.width * k - AREA) / 2;
    const maxY = (image.height * k - AREA) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  };

  // Keep the image covering the circle when zooming out.
  useEffect(() => setOffset((o) => clamp(o.x, o.y)), [zoom]); // clamp only changes with zoom

  const choose = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError("This file isn't a JPG or PNG. Choose a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('This file is larger than 2 MB. Choose a smaller image.');
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const src = URL.createObjectURL(file);
    objectUrl.current = src;
    try {
      const img = await loadImage(src);
      if (img.naturalWidth < MIN_PX || img.naturalHeight < MIN_PX) {
        setError(`This image is ${img.naturalWidth} × ${img.naturalHeight} px. Choose one at least 256 × 256 px.`);
        return;
      }
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setImage({ src, width: img.naturalWidth, height: img.naturalHeight });
    } catch {
      setError("This image couldn't be opened. Choose another JPG or PNG.");
    }
  };

  const save = async () => {
    if (!image) return;
    const img = await loadImage(image.src);
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = AREA / k;
    const sx = image.width / 2 - offset.x / k - size / 2;
    const sy = image.height / 2 - offset.y / k - size / 2;
    ctx.drawImage(img, sx, sy, size, size, 0, 0, OUTPUT, OUTPUT);
    onSave(canvas.toDataURL('image/png'));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, [number, number]> = { ArrowLeft: [NUDGE, 0], ArrowRight: [-NUDGE, 0], ArrowUp: [0, NUDGE], ArrowDown: [0, -NUDGE] };
    const m = moves[e.key];
    if (m) {
      e.preventDefault();
      setOffset((o) => clamp(o.x + m[0], o.y + m[1]));
    } else if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, z + 0.1));
    else if (e.key === '-') setZoom((z) => Math.max(1, z - 0.1));
  };

  return (
    <Modal
      title={image || pending ? 'Crop your photo' : 'Upload photo'}
      description={image || pending ? 'Drag the image or use the arrow keys to position it in the circle.' : 'JPG or PNG, square, at least 256 × 256 px, max 2 MB.'}
      size={640}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={BUTTON.secondary}>
            Cancel
          </button>
          {image && (
            <button type="button" onClick={() => fileRef.current?.click()} className={BUTTON.ghost}>
              Choose another
            </button>
          )}
          {image && (
            <button type="button" onClick={save} className={BUTTON.primary}>
              Save photo
            </button>
          )}
        </>
      }
    >
      <input
        ref={fileRef}
        id={`${uid}-file`}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          choose(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {error && (
        <p role="alert" className="mb-4 flex items-start gap-2 p-3 rounded-[8px] border-2 border-[#0B2D6B] bg-white text-[14px] leading-[20px] font-medium text-[#0B2D6B]">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {pending ? (
        <div className="mx-auto rounded-[12px] bg-[#EEF1F6]" style={{ width: AREA, height: AREA }} aria-hidden="true" />
      ) : !image ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            choose(e.dataTransfer.files[0]);
          }}
          className="flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-[12px] border-2 border-dashed border-[#C3CAD5] bg-[#F7F9FC] text-center"
        >
          <span className="w-12 h-12 rounded-full bg-[#1E63FF]/[0.08] text-[#1E63FF] flex items-center justify-center" aria-hidden="true">
            <ImagePlus className="w-6 h-6" />
          </span>
          <p className="text-[14px] leading-[20px] text-[#353D4C]">Drag an image here, or</p>
          <button type="button" onClick={() => fileRef.current?.click()} className={BUTTON.secondary}>
            Choose image
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div
            ref={areaRef}
            role="group"
            tabIndex={0}
            aria-label="Crop area. Arrow keys move the image, plus and minus zoom."
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              setOffset(clamp(drag.current.ox + e.clientX - drag.current.x, drag.current.oy + e.clientY - drag.current.y));
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            className="relative overflow-hidden rounded-[12px] bg-[#1F2633] cursor-move touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
            style={{ width: AREA, height: AREA }}
          >
            <img
              src={image.src}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
              style={{
                width: image.width * k,
                height: image.height * k,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
            {/* Circle mask: everything outside the circle is dimmed with Black 50% */}
            <span className="absolute inset-0 rounded-full shadow-[0_0_0_200px_rgba(0,0,0,0.5)] ring-2 ring-white/80 pointer-events-none" aria-hidden="true" />
          </div>

          <div className="w-full max-w-[320px] flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-[#4B5465] shrink-0" aria-hidden="true" />
            <label htmlFor={`${uid}-zoom`} className="sr-only">
              Zoom
            </label>
            <input
              id={`${uid}-zoom`}
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              aria-valuetext={`${Math.round(zoom * 100)}%`}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-11 accent-[#1E63FF] cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-[#4B5465] shrink-0" aria-hidden="true" />
          </div>
        </div>
      )}
    </Modal>
  );
};
