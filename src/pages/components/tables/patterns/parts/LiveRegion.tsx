import React from 'react';

/** Polite announcements (result counts, sort changes). Visually hidden. */
export const LiveRegion: React.FC<{ message: string }> = ({ message }) => (
  <p role="status" aria-live="polite" className="sr-only">
    {message}
  </p>
);
