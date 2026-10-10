import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PreviewPanel, TabItem } from '../../components/common/PreviewPanel';
import { SpecTable } from '../../components/common/SpecTable';
import { DoDontPair } from '../../components/common/DoDont';
import { useToast } from '../../components/common/Toast';
import {
  Eye,
  EyeOff,
  Search,
  AlertCircle,
  CheckCircle2,
  Upload,
  Calendar,
  Car,
} from 'lucide-react';
import { FormSelect } from './form-inputs/parts/FormSelect';
import { ACCESS_ZONE_OPTIONS, ENTRY_GATE_OPTIONS, VEHICLE_OPTIONS } from './form-inputs/parts/selectOptions';

export const FormInputsPage: React.FC = () => {
  const { showToast } = useToast();

  // Password toggle demo state
  const [showPassword, setShowPassword] = useState(false);

  // Select demo state (defaults to the first option, as the native select did)
  const [accessZone, setAccessZone] = useState('North Perimeter Gate - Cluster 01');

  // Live Vehicle Registration Form State
  const [plateNumber, setPlateNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [gateZone, setGateZone] = useState('North Gate - Cluster A');

  // Touched and Error States
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isPlateValid = /^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{4}$/i.test(plateNumber.trim());
  const isPhoneValid = /^[0-9]{10}$/.test(driverPhone.replace(/\D/g, ''));
  const isNameValid = driverName.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ plate: true, name: true, phone: true });

    if (!isPlateValid || !isNameValid || !isPhoneValid) {
      showToast('Please correct errors before submitting', 'critical');
      return;
    }

    setFormSubmitted(true);
    showToast(`Vehicle ${plateNumber.toUpperCase()} registered successfully!`, 'success');
  };

  const previewTabs: TabItem[] = [
    {
      id: 'text-states',
      label: 'Input States',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Default */}
          <div>
            <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Standard Field
            </label>
            <input
              type="text"
              placeholder="e.g. MH-12-AB-1234"
              className="w-full h-[40px] px-3 bg-white border border-[#8C95A6] rounded-[8px] text-[14px] text-[#121722] placeholder-[#6B7485] focus:border-[#1E63FF] focus:ring-2 focus:ring-[#1E63FF]/20 focus:outline-none transition-all"
            />
            <span className="text-[12px] text-[#4B5465] block mt-1">
              Enter the official registration number.
            </span>
          </div>

          {/* Success */}
          <div>
            <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Verified Field
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue="MH-12-DE-4482"
                className="w-full h-[40px] pl-3 pr-9 bg-white border border-[#00C6FF] rounded-[8px] text-[14px] font-mono text-[#121722] focus:outline-none"
              />
              <CheckCircle2 className="w-4 h-4 text-[#00C6FF] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[12px] text-[#00C6FF] font-medium block mt-1">
              Plate verified in Vahan database.
            </span>
          </div>

          {/* Error State: 2px Deep Navy border + alert icon + message below */}
          <div>
            <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Error Field <span className="text-[#0B2D6B] font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue="INVALID_123"
                className="w-full h-[40px] pl-3 pr-9 bg-white border-2 border-[#0B2D6B] rounded-[8px] text-[14px] text-[#121722] focus:outline-none"
              />
              <AlertCircle className="w-4 h-4 text-[#0B2D6B] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[12px] font-medium text-[#0B2D6B] block mt-1">
              Enter a valid state code and 4-digit number.
            </span>
          </div>

          {/* Disabled */}
          <div>
            <label className="text-[14px] font-medium text-[#8C95A6] block mb-1.5">
              Disabled Field
            </label>
            <input
              type="text"
              disabled
              value="System Lock (Non-editable)"
              className="w-full h-[40px] px-3 bg-[#F7F9FC] border border-[#DDE2EA] rounded-[8px] text-[14px] text-[#8C95A6] cursor-not-allowed"
            />
            <span className="text-[12px] text-[#8C95A6] block mt-1">
              Restricted to Super Admin role.
            </span>
          </div>
        </div>
      ),
      code: `// Standard Input Field
<div>
  <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
    Vehicle License Plate <span className="text-[#0B2D6B]">*</span>
  </label>
  <input
    type="text"
    placeholder="MH-12-AB-1234"
    className="w-full h-[40px] px-3 bg-white border border-[#8C95A6] rounded-[8px] text-[14px] text-[#121722] placeholder-[#6B7485] focus:border-[#1E63FF] focus:ring-2 focus:ring-[#1E63FF]/20 focus:outline-none transition-all font-mono"
  />
  <span className="text-[12px] text-[#4B5465] block mt-1">
    Auto-formatted in JetBrains Mono.
  </span>
</div>`,
    },
    {
      id: 'password-search',
      label: 'Password & Search',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Password with Show/Hide */}
          <div>
            <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Gate Access Secret PIN
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                defaultValue="Operator@2026"
                className="w-full h-[40px] pl-3 pr-10 bg-white border border-[#8C95A6] rounded-[8px] text-[14px] font-mono text-[#121722] focus:border-[#1E63FF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7485] hover:text-[#121722]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[12px] text-[#4B5465] block mt-1">
              Minimum 8 characters with 1 numeral.
            </span>
          </div>

          {/* Search Input */}
          <div>
            <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Operator Log Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C95A6] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by plate, student ID, gate..."
                className="w-full h-[40px] pl-9 pr-3 bg-white border border-[#8C95A6] rounded-[8px] text-[14px] text-[#121722] placeholder-[#6B7485] focus:border-[#1E63FF] focus:outline-none"
              />
            </div>
            <span className="text-[12px] text-[#4B5465] block mt-1">
              Press slash (/) anytime to focus search.
            </span>
          </div>
        </div>
      ),
      code: `// Password field with Reveal Toggle
<div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    className="w-full h-[40px] pl-3 pr-10 bg-white border border-[#8C95A6] rounded-[8px] text-[14px] font-mono text-[#121722] focus:border-[#1E63FF] focus:outline-none"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7485] hover:text-[#121722]"
  >
    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
</div>`,
    },
    {
      id: 'select-file',
      label: 'Select & File Dropzone',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Custom Select */}
          <div>
            <label id="access-zone-label" className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Assigned Access Zone
            </label>
            <FormSelect labelId="access-zone-label" options={ACCESS_ZONE_OPTIONS} value={accessZone} onChange={setAccessZone} describedBy="access-zone-help" />
            <span id="access-zone-help" className="text-[12px] text-[#4B5465] block mt-1">
              Select gate routing target.
            </span>
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="text-[14px] font-medium text-[#121722] block mb-1.5">
              Upload Vehicle RC Document
            </label>
            <div className="border-2 border-dashed border-[#DDE2EA] hover:border-[#1E63FF] rounded-[8px] p-4 text-center cursor-pointer transition-colors bg-white">
              <Upload className="w-5 h-5 text-[#1E63FF] mx-auto mb-1.5" />
              <span className="text-[13px] font-medium text-[#121722] block">
                Drag PDF or image here
              </span>
              <span className="text-[11px] text-[#6B7485]">
                PDF, PNG, JPG up to 10MB
              </span>
            </div>
          </div>
        </div>
      ),
      code: `// Custom Select (listbox; popover renders in a portal so cards never clip it)
const [accessZone, setAccessZone] = useState('North Perimeter Gate - Cluster 01');

<label id="access-zone-label" className="text-[14px] font-medium text-[#121722] block mb-1.5">
  Assigned Access Zone
</label>
<FormSelect
  labelId="access-zone-label"
  value={accessZone}
  onChange={setAccessZone}
  options={[
    { value: 'North Perimeter Gate - Cluster 01', label: 'North Perimeter Gate - Cluster 01', description: 'Main entry, all vehicles', icon: MapPin },
    { value: 'South Campus Gate - Commercial', label: 'South Campus Gate - Commercial', description: 'Delivery and service vehicles', icon: MapPin },
    { value: 'Executive VIP Barrier - Tower A', label: 'Executive VIP Barrier - Tower A', description: 'Pre-approved vehicles only', icon: MapPin },
    { value: 'Hostel Track Main Gate', label: 'Hostel Track Main Gate', description: 'Residents and staff', icon: MapPin },
  ]}
  // invalid={!!error} describedBy="access-zone-error" disabled readOnly name="accessZone"
/>

// File Upload Dropzone
<div className="border-2 border-dashed border-[#DDE2EA] hover:border-[#1E63FF] rounded-[8px] p-4 text-center cursor-pointer transition-colors bg-white">
  <Upload className="w-5 h-5 text-[#1E63FF] mx-auto mb-1.5" />
  <span className="text-[13px] font-medium text-[#121722] block">
    Drag PDF or image here
  </span>
  <span className="text-[11px] text-[#6B7485]">
    PDF, PNG, JPG up to 10MB
  </span>
</div>`,
    },
  ];

  return (
    <div>
      <PageHeader
        category="COMPONENTS"
        title="Form Inputs"
        description="40px high, 8px radius inputs with explicit top labels, helper text, and high-visibility error states using Deep Navy 2px borders."
      />

      <section id="preview" className="mb-12">
        <PreviewPanel tabs={previewTabs} />
      </section>

      {/* Complete Live Vehicle Registration Form */}
      <section id="live-form-demo" className="mb-12">
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-[#121722] mb-1">
            Complete Form Pattern: Register Access Vehicle
          </h2>
          <p className="text-[14px] text-[#4B5465]">
            Demonstrates one-column layout, live validation on blur, auto-uppercasing license plates, and clear error resolution text.
          </p>
        </div>

        <div className="rounded-[12px] border border-[#DDE2EA] bg-white p-6 md:p-8 shadow-[0_1px_3px_rgba(11,45,107,0.08)] max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: License Plate (Data style) */}
            <div>
              <label className="text-[14px] font-medium text-[#121722] block mb-1">
                Vehicle Registration Plate Number <span className="text-[#0B2D6B] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  onBlur={() => setTouched((prev) => ({ ...prev, plate: true }))}
                  placeholder="e.g. MH-12-DE-4482"
                  className={`w-full h-[40px] px-3 bg-white rounded-[8px] text-[14px] font-mono tracking-wide focus:outline-none transition-all ${
                    touched.plate && !isPlateValid
                      ? 'border-2 border-[#0B2D6B]'
                      : touched.plate && isPlateValid
                      ? 'border border-[#00C6FF]'
                      : 'border border-[#8C95A6] focus:border-[#1E63FF] focus:ring-2 focus:ring-[#1E63FF]/20'
                  }`}
                />
                {touched.plate && !isPlateValid && (
                  <AlertCircle className="w-4 h-4 text-[#0B2D6B] absolute right-3 top-1/2 -translate-y-1/2" />
                )}
                {touched.plate && isPlateValid && (
                  <CheckCircle2 className="w-4 h-4 text-[#00C6FF] absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {touched.plate && !isPlateValid ? (
                <span className="text-[12px] font-medium text-[#0B2D6B] block mt-1">
                  Enter a valid state registration format (e.g. MH-12-AB-1234).
                </span>
              ) : (
                <span className="text-[12px] text-[#4B5465] block mt-1">
                  License plates use JetBrains Mono and auto-convert to uppercase.
                </span>
              )}
            </div>

            {/* Field 2 & 3: Short Pair (Name & Phone) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[14px] font-medium text-[#121722] block mb-1">
                  Driver / Owner Name <span className="text-[#0B2D6B] font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  placeholder="Full legal name"
                  className={`w-full h-[40px] px-3 bg-white rounded-[8px] text-[14px] text-[#121722] focus:outline-none transition-all ${
                    touched.name && !isNameValid
                      ? 'border-2 border-[#0B2D6B]'
                      : 'border border-[#8C95A6] focus:border-[#1E63FF] focus:ring-2 focus:ring-[#1E63FF]/20'
                  }`}
                />
                {touched.name && !isNameValid ? (
                  <span className="text-[12px] font-medium text-[#0B2D6B] block mt-1">
                    Enter at least 3 characters.
                  </span>
                ) : (
                  <span className="text-[12px] text-[#4B5465] block mt-1">
                    As printed on driver license.
                  </span>
                )}
              </div>

              <div>
                <label className="text-[14px] font-medium text-[#121722] block mb-1">
                  Driver Mobile Number <span className="text-[#0B2D6B] font-bold">*</span>
                </label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                  placeholder="10-digit mobile"
                  className={`w-full h-[40px] px-3 bg-white rounded-[8px] text-[14px] text-[#121722] font-mono focus:outline-none transition-all ${
                    touched.phone && !isPhoneValid
                      ? 'border-2 border-[#0B2D6B]'
                      : 'border border-[#8C95A6] focus:border-[#1E63FF] focus:ring-2 focus:ring-[#1E63FF]/20'
                  }`}
                />
                {touched.phone && !isPhoneValid ? (
                  <span className="text-[12px] font-medium text-[#0B2D6B] block mt-1">
                    Enter a 10-digit mobile number.
                  </span>
                ) : (
                  <span className="text-[12px] text-[#4B5465] block mt-1">
                    For SMS arrival dispatch.
                  </span>
                )}
              </div>
            </div>

            {/* Field 4: Vehicle Type & Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label id="vehicle-category-label" className="text-[14px] font-medium text-[#121722] block mb-1">
                  Vehicle Category
                </label>
                <FormSelect labelId="vehicle-category-label" options={VEHICLE_OPTIONS} value={vehicleType} onChange={setVehicleType} />
              </div>

              <div>
                <label id="entry-gate-label" className="text-[14px] font-medium text-[#121722] block mb-1">
                  Authorized Entry Gate
                </label>
                <FormSelect labelId="entry-gate-label" options={ENTRY_GATE_OPTIONS} value={gateZone} onChange={setGateZone} />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#DDE2EA] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPlateNumber('');
                  setDriverName('');
                  setDriverPhone('');
                  setTouched({});
                }}
                className="h-[40px] px-4 rounded-[8px] bg-white border border-[#DDE2EA] text-[#4B5465] font-semibold text-[14px] hover:bg-[#F7F9FC]"
              >
                Reset form
              </button>
              <button
                type="submit"
                className="h-[40px] px-5 rounded-[8px] bg-[#1E63FF] text-white font-semibold text-[14px] hover:bg-[#0B2D6B] transition-all shadow-[0_1px_3px_rgba(30,99,255,0.3)]"
              >
                Register vehicle permit
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="mb-12">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Input Field Specifications
        </h2>
        <SpecTable
          rows={[
            { property: 'Height', value: '40px fixed standard', token: 'h-[40px]' },
            { property: 'Border Radius', value: '8px (radius-md)', token: 'rounded-[8px]' },
            { property: 'Default Border', value: '1px Gray 400 (#8C95A6) — satisfies 3:1 graphical requirement', token: 'border border-[#8C95A6]' },
            { property: 'Focus State', value: '1px Royal Blue (#1E63FF) + 3px ring at 20%', token: 'focus:border-[#1E63FF] focus:ring-2' },
            { property: 'Error State', value: '2px Deep Navy (#0B2D6B) + alert icon + clear resolution message', token: 'border-2 border-[#0B2D6B]' },
            { property: 'Success State', value: '1px Cyan (#00C6FF) + check icon', token: 'border border-[#00C6FF]' },
            { property: 'Label Typography', value: '14px Medium (#121722), 6px above field', token: 'text-[14px] font-medium' },
            { property: 'Helper Text', value: '12px Gray 600 (#4B5465), 4px below field', token: 'text-[12px] text-[#4B5465]' },
          ]}
        />
      </section>

      {/* Do & Don't Guidelines */}
      <section id="do-dont">
        <h2 className="text-[20px] font-semibold text-[#121722] mb-4">
          Form Design Rules
        </h2>
        <DoDontPair
          doTitle="Do position persistent labels above every input field"
          doDescription="Always place a visible 14px Medium label above the input to avoid cognitive dropout when the operator starts typing."
          doExample={
            <div>
              <label className="text-[13px] font-medium text-[#121722] block mb-1">
                Student RFID Card Number
              </label>
              <input
                type="text"
                value="RF-9942-A"
                readOnly
                className="w-full h-[36px] px-3 border border-[#8C95A6] rounded text-[13px]"
              />
            </div>
          }
          dontTitle="Don't use placeholder text as the only field label"
          dontDescription="Placeholders disappear upon entry, confusing users and failing WCAG 2.2 form labeling criteria."
          dontExample={
            <div>
              <input
                type="text"
                placeholder="Student RFID Card Number"
                className="w-full h-[36px] px-3 border border-[#8C95A6] rounded text-[13px]"
              />
            </div>
          }
        />
      </section>
    </div>
  );
};
