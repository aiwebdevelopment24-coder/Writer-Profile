import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, KeyRound, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'reset';
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>(initialTab);

  // Login Form
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Reset Password Form
  const [resetName, setResetName] = useState('');
  const [resetEmailOrPhone, setResetEmailOrPhone] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Helper: Get stored users
  const getStoredUsers = (): UserProfile[] => {
    try {
      const saved = localStorage.getItem('as_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (users: UserProfile[]) => {
    try {
      localStorage.setItem('as_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmailOrPhone.trim() || !loginPassword.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল/মোবাইল নাম্বার এবং পাসওয়ার্ড লিখুন।');
      return;
    }

    const users = getStoredUsers();
    const cleanInput = loginEmailOrPhone.trim().toLowerCase();
    
    const user = users.find(u => 
      u.emailOrPhone.toLowerCase() === cleanInput && u.password === loginPassword
    );

    if (user) {
      setSuccessMsg('লগইন সফল হয়েছে!');
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
        resetForms();
      }, 800);
    } else {
      // If user doesn't exist, create a instant quick account for convenience
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: loginEmailOrPhone.split('@')[0] || 'শ্রদ্ধেয় পাঠক',
        emailOrPhone: loginEmailOrPhone.trim(),
        password: loginPassword,
        createdAt: new Date().toISOString()
      };
      saveStoredUsers([...users, newUser]);
      setSuccessMsg('নতুন একাউন্ট সফলভাবে তৈরি ও লগইন করা হয়েছে!');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
        resetForms();
      }, 800);
    }
  };

  // 2. Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmailOrPhone.trim() || !regPassword) {
      setErrorMsg('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('পাসওয়ার্ড দুটো মিলছে না। আবার চেষ্টা করুন।');
      return;
    }

    const users = getStoredUsers();
    const cleanInput = regEmailOrPhone.trim().toLowerCase();

    const existingUser = users.find(u => u.emailOrPhone.toLowerCase() === cleanInput);
    if (existingUser) {
      setErrorMsg('এই ইমেইল বা মোবাইল নাম্বার দিয়ে ইতিমধ্যে একাউন্ট আছে। লগইন করুন।');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      emailOrPhone: regEmailOrPhone.trim(),
      password: regPassword,
      createdAt: new Date().toISOString()
    };

    saveStoredUsers([...users, newUser]);
    setSuccessMsg('একাউন্ট তৈরি সফল হয়েছে!');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
      resetForms();
    }, 800);
  };

  // 3. Handle Password Reset
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetName.trim() || !resetEmailOrPhone.trim() || !resetNewPassword) {
      setErrorMsg('অনুগ্রহ করে নাম, ইমেইল/মোবাইল এবং নতুন পাসওয়ার্ড লিখুন।');
      return;
    }

    if (resetNewPassword.length < 4) {
      setErrorMsg('নতুন পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMsg('নতুন পাসওয়ার্ড দুটো মিলছে না।');
      return;
    }

    const users = getStoredUsers();
    const cleanInput = resetEmailOrPhone.trim().toLowerCase();

    const userIndex = users.findIndex(u => 
      u.emailOrPhone.toLowerCase() === cleanInput || 
      u.name.toLowerCase().includes(resetName.trim().toLowerCase())
    );

    if (userIndex !== -1) {
      users[userIndex].password = resetNewPassword;
      users[userIndex].name = resetName.trim() || users[userIndex].name;
      saveStoredUsers(users);

      setSuccessMsg('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করা হয়েছে।');
      setTimeout(() => {
        onLoginSuccess(users[userIndex]);
        onClose();
        resetForms();
      }, 1200);
    } else {
      // If user not found by exact string, create or update user
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: resetName.trim(),
        emailOrPhone: resetEmailOrPhone.trim(),
        password: resetNewPassword,
        createdAt: new Date().toISOString()
      };
      saveStoredUsers([...users, newUser]);
      setSuccessMsg('আপনার তথ্যানুযায়ী পাসওয়ার্ড রিসেট করে নতুন একাউন্ট তৈরি করা হয়েছে!');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
        resetForms();
      }, 1200);
    }
  };

  const resetForms = () => {
    setLoginEmailOrPhone('');
    setLoginPassword('');
    setRegName('');
    setRegEmailOrPhone('');
    setRegPassword('');
    setRegConfirmPassword('');
    setResetName('');
    setResetEmailOrPhone('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E6E2D8] overflow-hidden z-10 animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#EFECE6] px-6 py-5 border-b border-[#E6E2D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C29B47] text-white flex items-center justify-center font-bold shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
                {currentUser ? 'আপনার প্রোফাইল' : 'পাঠক একাউন্ট'}
              </h3>
              <p className="text-[11px] text-[#8C887B]">
                {currentUser ? `স্বাগতম, ${currentUser.name}` : 'লগইন বা নতুন একাউন্ট তৈরি করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5C584E] hover:text-[#1D1E20] rounded-full hover:bg-[#E2DDD3] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If User is Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#C29B47] text-white font-serif-bn font-bold text-3xl flex items-center justify-center mx-auto shadow-md">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <h4 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
                {currentUser.name}
              </h4>
              <p className="text-xs font-semibold text-[#8C887B]">
                {currentUser.emailOrPhone}
              </p>
              <p className="text-[11px] text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full inline-block font-bold border border-emerald-200 mt-2">
                ✓ নিবন্ধিত সদস্য (Active Reader)
              </p>
            </div>

            <div className="pt-4 border-t border-[#E6E2D8] space-y-3">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
              >
                একাউন্ট থেকে লগআউট করুন
              </button>
            </div>
          </div>
        ) : (
          /* Tabbed Form for Unauthenticated Users */
          <div className="p-6 space-y-5">
            
            {/* Tabs */}
            <div className="grid grid-cols-3 bg-[#F9F8F5] p-1 rounded-2xl border border-[#E6E2D8] text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'login' ? 'bg-white text-[#1D1E20] shadow-sm' : 'text-[#8C887B] hover:text-[#1D1E20]'
                }`}
              >
                লগইন
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'register' ? 'bg-white text-[#1D1E20] shadow-sm' : 'text-[#8C887B] hover:text-[#1D1E20]'
                }`}
              >
                নতুন একাউন্ট
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('reset'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'reset' ? 'bg-white text-[#1D1E20] shadow-sm' : 'text-[#8C887B] hover:text-[#1D1E20]'
                }`}
              >
                পাসওয়ার্ড রিসেট
              </button>
            </div>

            {/* Status Messages */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    ইমেইল অথবা মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="যেমন: example@gmail.com বা 01700000000"
                      value={loginEmailOrPhone}
                      onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <Mail className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-[#3A3834]">
                      পাসওয়ার্ড *
                    </label>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('reset'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-[11px] font-bold text-[#C29B47] hover:underline cursor-pointer"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <Lock className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C29B47] hover:bg-[#a88338] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    আপনার পূর্ণ নাম *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="আপনার পুরো নাম লিখুন"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <User className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    ইমেইল অথবা মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ইমেইল বা মোবাইল নাম্বার"
                      value={regEmailOrPhone}
                      onChange={(e) => setRegEmailOrPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <Mail className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">
                      পাসওয়ার্ড *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="পাসওয়ার্ড"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">
                      পাসওয়ার্ড নিশ্চিতকরণ *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="পুনরায় পাসওয়ার্ড"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C29B47] hover:bg-[#a88338] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>নতুন একাউন্ট তৈরি করুন</span>
                </button>
              </form>
            )}

            {/* TAB 3: RESET PASSWORD */}
            {activeTab === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-3.5">
                <p className="text-[11px] text-[#5C584E] leading-relaxed bg-[#F9F8F5] p-3 rounded-xl border border-[#E6E2D8]">
                  পাসওয়ার্ড মনে না থাকলে আপনার নিবন্ধিত নাম এবং ইমেইল অথবা মোবাইল নম্বর দিয়ে নিচে নতুন পাসওয়ার্ড সেট করে নিতে পারেন।
                </p>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    আপনার নিবন্ধিত নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="আপনার পুরো নাম লিখুন"
                    value={resetName}
                    onChange={(e) => setResetName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    ইমেইল অথবা মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="নিবন্ধিত ইমেইল বা মোবাইল নাম্বার"
                    value={resetEmailOrPhone}
                    onChange={(e) => setResetEmailOrPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">
                      নতুন পাসওয়ার্ড *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="নতুন পাসওয়ার্ড"
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">
                      নিশ্চিত করুন *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="পুনরায় পাসওয়ার্ড"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1D1E20] hover:bg-[#3A3834] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <KeyRound className="w-4 h-4 text-[#C29B47]" />
                  <span>পাসওয়ার্ড আপডেট করুন</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
