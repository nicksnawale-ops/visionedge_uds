import type { ChartTableData } from './ChartDataTable';

/** "View as table" data for the two original Charts page examples (Line and Donut). */

export interface HourlyEntriesRow {
  hour: string;
  regular: number;
  commercial: number;
  vip: number;
}

/** Built from the Line chart's own data so the table always matches the chart. */
export const buildLineChartTable = (rows: HourlyEntriesRow[]): ChartTableData => ({
  caption: 'Vehicle gate entries by hour, today',
  columns: [
    { key: 'hour', label: 'Hour' },
    { key: 'regular', label: 'Regular', numeric: true },
    { key: 'commercial', label: 'Commercial', numeric: true },
    { key: 'vip', label: 'VIP fleet', numeric: true },
  ],
  rows: rows.map((d) => ({ ...d })),
});

/** Mirrors the values shown in the Donut chart. */
export const DONUT_CHART_TABLE: ChartTableData = {
  caption: 'Vehicle classification breakdown',
  columns: [
    { key: 'label', label: 'Vehicle class' },
    { key: 'value', label: 'Vehicles', numeric: true },
    { key: 'share', label: 'Share', numeric: true },
  ],
  rows: [
    { label: 'Four Wheeler Passenger', value: 706, share: '55%' },
    { label: 'Heavy Logistics Truck', value: 385, share: '30%' },
    { label: 'Campus Staff Bus / EV', value: 193, share: '15%' },
  ],
};
