import React from 'react';
import { X, UserPlus, LogIn, Lock } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: (initialTab?: 'login' | 'register') => void;
  actionMessage?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
  actionMessage = 'এই সুবিধাটি ব্যবহার করার জন্য আপনাকে লগইন করতে হবে।',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E2D8] z-10 text-center space-y-5 animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8C887B] hover:text-[#1D1E20] hover:bg-[#F9F8F5] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-[#C29B47]/10 text-[#C29B47] flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
            একাউন্ট প্রয়োজন
          </h3>
          <p className="text-sm font-bold text-[#C29B47]">
            একাউন্ট প্রয়োজন, এখনই একাউন্ট খুলে ফেলুন।
          </p>
          <p className="text-xs text-[#5C584E] leading-relaxed pt-1">
            {actionMessage}
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenAuthModal('register');
            }}
            className="w-full py-3.5 px-5 bg-[#C29B47] hover:bg-[#a88338] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>এখনই একাউন্ট তৈরি করুন</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAuthModal('login');
            }}
            className="w-full py-3 px-5 bg-[#F9F8F5] hover:bg-[#EFECE6] border border-[#D9D3C7] text-[#1D1E20] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#8C887B]" />
            <span>ইতিমধ্যে একাউন্ট আছে? লগইন করুন</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-[#8C887B] hover:text-[#1D1E20] underline transition-colors cursor-pointer pt-1"
        >
          পরে করব
        </button>
      </div>
    </div>
  );
};
