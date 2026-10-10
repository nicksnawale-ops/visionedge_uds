import { Bus, Car, DoorOpen, MapPin, Truck, Zap } from 'lucide-react';
import type { FormSelectOption } from './FormSelect';

/** Option labels and values are unchanged from the original native selects; icons and descriptions are new. */

export const ACCESS_ZONE_OPTIONS: ReadonlyArray<FormSelectOption<string>> = [
  { value: 'North Perimeter Gate - Cluster 01', label: 'North Perimeter Gate - Cluster 01', description: 'Main entry, all vehicles', icon: MapPin },
  { value: 'South Campus Gate - Commercial', label: 'South Campus Gate - Commercial', description: 'Delivery and service vehicles', icon: MapPin },
  { value: 'Executive VIP Barrier - Tower A', label: 'Executive VIP Barrier - Tower A', description: 'Pre-approved vehicles only', icon: MapPin },
  { value: 'Hostel Track Main Gate', label: 'Hostel Track Main Gate', description: 'Residents and staff', icon: MapPin },
];

export const VEHICLE_OPTIONS: ReadonlyArray<FormSelectOption<string>> = [
  { value: 'car', label: 'Four Wheeler / Sedan / SUV', description: 'Private and staff cars', icon: Car },
  { value: 'truck', label: 'Heavy Commercial Truck', description: 'Goods and delivery vehicles', icon: Truck },
  { value: 'bus', label: 'Campus Staff Bus', description: 'Scheduled staff transport', icon: Bus },
  { value: 'ev', label: 'Electric Fleet Vehicle', description: 'Charging bay access', icon: Zap },
];

export const ENTRY_GATE_OPTIONS: ReadonlyArray<FormSelectOption<string>> = [
  { value: 'North Gate - Cluster A', label: 'North Gate - Cluster A', description: 'Main entry, all vehicles', icon: DoorOpen },
  { value: 'South Campus Commercial', label: 'South Campus Commercial', description: 'Delivery and service vehicles', icon: DoorOpen },
  { value: 'Perimeter Service Barrier', label: 'Perimeter Service Barrier', description: 'Maintenance and utility vehicles', icon: DoorOpen },
];
