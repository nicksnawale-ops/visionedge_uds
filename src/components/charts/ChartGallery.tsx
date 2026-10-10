import React from 'react';
import { ChartEntry, ChartShowcase } from './ChartShowcase';
import { NEW_CHART_ENTRIES, orderByCategory } from './chartCatalog';

/**
 * The full chart showcase. Lazy-loaded by the Charts page so the chart components and
 * code snippets ship in their own chunk instead of the main bundle.
 */
const ChartGallery: React.FC<{ existing: ChartEntry[] }> = ({ existing }) => (
  <ChartShowcase charts={orderByCategory([...existing, ...NEW_CHART_ENTRIES])} />
);

export default ChartGallery;
