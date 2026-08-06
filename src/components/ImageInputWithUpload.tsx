import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageInputWithUploadProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
}

export const ImageInputWithUpload: React.FC<ImageInputWithUploadProps> = ({
  label,
  sublabel,
  value,
  onChange,
  required = false,
  placeholder = 'https://... বা ছবি আপলোড করুন',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবিটির সাইজ ৫ মেগাবাইটের বেশি। অনুগ্রহ করে ছোট ছবি নির্বাচন করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 p-4 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#1D1E20]">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 bg-[#C29B47] hover:bg-[#a88338] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>ছবি বেছে নিন / আপলোড</span>
        </button>
      </div>

      {sublabel && <p className="text-[11px] text-[#8C887B]">{sublabel}</p>}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
          />
          <ImageIcon className="w-4 h-4 text-[#8C887B] absolute left-3 top-3" />
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            title="ছবি রিমুভ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {value && (
        <div className="relative w-24 h-28 rounded-xl overflow-hidden border border-[#D9D3C7] bg-white shadow-sm mt-2">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};
