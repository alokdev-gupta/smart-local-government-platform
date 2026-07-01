import React from 'react';
import type { SpouseDetails } from '../../../types';

const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim',
] as const;

interface SpouseInfoFormProps {
  data: Partial<SpouseDetails> & Record<string, string>;
  onChange: (field: string, value: string) => void;
}

interface FieldConfig {
  key: string;
  label: string;
  labelNepali?: string;
  type?: 'text' | 'date' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  colSpan?: 2;
}

const SPOUSE_FIELDS: FieldConfig[] = [
  { key: 'fullName',        label: 'Full Name',          labelNepali: 'पूरा नाम',       placeholder: 'Anjali Yadav', required: true },
  { key: 'dateOfBirth',     label: 'Date of Birth',      labelNepali: 'जन्म मिति',      type: 'date', required: true },
  { key: 'citizenshipNumber',label: 'Citizenship/Passport No.', labelNepali: 'नागरिकता/राहदानी नं.', placeholder: '123-456-789' },
  { key: 'gender',          label: 'Gender',             labelNepali: 'लिङ्ग',          type: 'select', options: ['male', 'female', 'other'], required: true },
  { key: 'fatherName',      label: "Father's Name",      labelNepali: 'बुवाको नाम',     placeholder: "Father's full name", required: true },
  { key: 'motherName',      label: "Mother's Name",      labelNepali: 'आमाको नाम',     placeholder: "Mother's full name", required: true },
  { key: 'grandfatherName', label: "Grandfather's Name", labelNepali: 'हजुरबुवाको नाम', placeholder: "Grandfather's full name", required: true },
  { key: 'province',        label: 'Province',           labelNepali: 'प्रदेश',         type: 'select', options: PROVINCES as unknown as string[], required: true },
  { key: 'districtName',    label: 'District',           labelNepali: 'जिल्ला',         placeholder: 'District name', required: true },
  { key: 'municipalityName',label: 'Municipality / VDC', labelNepali: 'नगरपालिका/गा.वि.स.', placeholder: 'Municipality name', required: true },
  { key: 'wardNumber',      label: 'Ward Number',        labelNepali: 'वडा नम्बर',      placeholder: 'e.g. 5', required: true },
  { key: 'permanentAddress',label: 'Permanent Address',  labelNepali: 'स्थायी ठेगाना',  placeholder: 'Full permanent address', colSpan: 2, required: true },
];

const SpouseInfoForm: React.FC<SpouseInfoFormProps> = ({ data, onChange }) => {
  const renderField = (field: FieldConfig) => {
    const value = data[field.key] || '';
    const baseClass = `form-input ${field.colSpan === 2 ? '' : ''}`;

    return (
      <div key={field.key} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
        <label className="form-label">
          <span>{field.label}</span>
          {field.labelNepali && (
            <span className="text-slate-500 text-xs ml-1.5 font-normal">{field.labelNepali}</span>
          )}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>

        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={baseClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={baseClass}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Spouse Information</h2>
        <p className="text-slate-400 text-sm">दुलहा/दुलहीको व्यक्तिगत विवरण भर्नुहोस्</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SPOUSE_FIELDS.map(renderField)}
      </div>
    </div>
  );
};

export default SpouseInfoForm;
