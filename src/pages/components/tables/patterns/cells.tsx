import React from 'react';
import { Eye } from 'lucide-react';
import type { VehicleRow } from './sampleData';
import { StatusBadge } from './StatusBadge';
import { BTN, TABLE } from './tableStyles';

export type ColumnKey = 'plate' | 'driver' | 'gate' | 'vehicleType' | 'status' | 'time' | 'confidence' | 'velocity';

export const COLUMN_LABEL: Record<ColumnKey, string> = {
  plate: 'Plate',
  driver: 'Driver / Subject',
  gate: 'Gate',
  vehicleType: 'Vehicle type',
  status: 'Status',
  time: 'Time (IST)',
  confidence: 'Confidence',
  velocity: 'Velocity',
};

export const NUMERIC: ColumnKey[] = ['time', 'confidence', 'velocity'];

/** One body cell for a column. */
export const Cell: React.FC<{ row: VehicleRow; col: ColumnKey; className?: string }> = ({ row, col, className = '' }) => {
  switch (col) {
    case 'plate':
      return (
        <td className={`${TABLE.td} ${className}`}>
          <span className={TABLE.plate}>{row.plate}</span>
        </td>
      );
    case 'driver':
      return <td className={`${TABLE.td} font-medium ${className}`}>{row.driver}</td>;
    case 'gate':
      return <td className={`${TABLE.td} text-[13px] text-[#4B5465] ${className}`}>{row.gate}</td>;
    case 'vehicleType':
      return <td className={`${TABLE.td} text-[13px] ${className}`}>{row.vehicleType}</td>;
    case 'status':
      return (
        <td className={`${TABLE.td} ${className}`}>
          <StatusBadge status={row.status} />
        </td>
      );
    case 'time':
      return <td className={`${TABLE.num} text-[#6B7485] ${className}`}>{row.time}</td>;
    case 'confidence':
      return <td className={`${TABLE.num} ${className}`}>{row.confidence}%</td>;
    case 'velocity':
      return <td className={`${TABLE.num} ${className}`}>{row.velocity} km/h</td>;
  }
};

/** Row action (Ghost icon button, labelled). */
export const ViewButton: React.FC<{ row: VehicleRow; onView: (row: VehicleRow) => void }> = ({ row, onView }) => (
  <button type="button" onClick={() => onView(row)} aria-label={`View ${row.plate}`} className={BTN.icon}>
    <Eye className="w-4 h-4" aria-hidden="true" />
  </button>
);
