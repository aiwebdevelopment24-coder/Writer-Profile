import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { SiteConfig } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email.trim().toLowerCase() === siteConfig.adminEmail.toLowerCase() &&
      password === siteConfig.adminPassword
    ) {
      setError('');
      onLoginSuccess();
      onClose();
    } else {
      setError('ভুল ইমেইল অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#E6E2D8] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#8C887B] hover:text-[#1D1E20] rounded-full hover:bg-[#EFECE6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1D1E20] text-[#C29B47] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
            এডমিন লগইন
          </h2>
          <p className="text-xs text-[#8C887B]">
            এডমিন প্যানেলে প্রবেশের জন্য আপনার ইমেইল ও পাসওয়ার্ড দিন।
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#3A3834]">
              ইমেইল অ্যাড্রেস
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="আপনার ইমেইল অ্যাড্রেস"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
              <Mail className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#3A3834]">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
              <Lock className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>লগইন করুন</span>
          </button>
        </form>
      </div>
    </div>
  );
};
