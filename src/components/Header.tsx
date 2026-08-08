import React, { useState } from 'react';
import { Menu, Search, X, LogOut, User as UserIcon, Heart, LayoutDashboard } from 'lucide-react';
import { ViewMode, SiteConfig, UserProfile } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  cartCount?: number;
  wishlistCount: number;
  openSearch: () => void;
  openCart?: () => void;
  siteConfig: SiteConfig;
  isAdminAuthenticated: boolean;
  onAdminClick: () => void;
  onAdminLogout: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: (tab?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  wishlistCount,
  openSearch,
  siteConfig,
  isAdminAuthenticated,
  onAdminLogout,
  currentUser,
  onOpenAuthModal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'author', label: 'আমার সম্পর্কে' },
    { id: 'books', label: 'আমার বইসমূহ' },
    { id: 'blog', label: 'নিউজ ও ব্লগ' },
    ...(currentUser ? [{ id: 'wishlist', label: 'উইশলিস্ট' }] : []),
    { id: 'contact', label: 'যোগাযোগ' }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId as ViewMode);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F8F5]/95 backdrop-blur-md border-b border-[#E6E2D8] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Left: Drawer Toggle & Site Logo/Name */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse min-w-0 shrink">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 sm:p-2 text-[#3A3834] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-md transition-colors md:hidden cursor-pointer shrink-0"
              aria-label="মেনু খুলুন"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0"
            >
              {siteConfig.siteLogo ? (
                <img
                  src={siteConfig.siteLogo}
                  alt={siteConfig.siteName}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1D1E20] text-[#C29B47] flex items-center justify-center font-bold font-serif-bn text-lg sm:text-xl group-hover:bg-[#C29B47] group-hover:text-white transition-colors shadow-sm shrink-0">
                  {siteConfig.siteName ? siteConfig.siteName.charAt(0) : 'জু'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-serif-bn text-base sm:text-xl font-bold tracking-tight text-[#1D1E20] group-hover:text-[#C29B47] transition-colors leading-tight whitespace-nowrap truncate">
                  {siteConfig.siteName || 'জুবায়ের আহমেদ'}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-[#8C887B] font-medium whitespace-nowrap truncate">
                  {siteConfig.authorDesignation || 'লেখক ও গবেষক'}
                </span>
              </div>
            </button>
          </div>

          {/* Center Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors py-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  currentView === item.id
                    ? 'text-[#C29B47] border-[#C29B47] font-semibold'
                    : 'text-[#5C584E] border-transparent hover:text-[#1D1E20] hover:border-[#C29B47]/40'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'wishlist' && wishlistCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#C29B47] text-white text-[10px] rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <button
              onClick={openSearch}
              className="p-1.5 sm:p-2 text-[#3A3834] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer"
              title="খুঁজুন"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account / Dashboard Button (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-1.5">
              {currentUser ? (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center gap-2 py-1 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-[#1D1E20] text-white border-[#1D1E20]'
                      : 'bg-[#EFECE6] hover:bg-[#E2DDD3] text-[#1D1E20] border-[#D9D3C7]'
                  }`}
                  title="আপনার ড্যাশবোর্ড"
                >
                  <div className="w-5 h-5 rounded-full bg-[#C29B47] text-white flex items-center justify-center text-[10px] font-serif-bn font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'প'}
                  </div>
                  <span className="max-w-[90px] truncate">{currentUser.name}</span>
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#C29B47]" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-[#C29B47] hover:bg-[#a88338] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  title="লগইন / একাউন্ট"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>লগইন / একাউন্ট</span>
                </button>
              )}
            </div>

            {/* Logout button if logged in as Admin */}
            {isAdminAuthenticated && (
              <button
                onClick={onAdminLogout}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                title="এডমিন লগআউট"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Side Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-80 max-w-[85vw] bg-[#F9F8F5] h-full shadow-2xl flex flex-col z-10 border-r border-[#E6E2D8]">
            <div className="p-5 border-b border-[#E6E2D8] flex items-center justify-between bg-[#EFECE6]">
              <div className="flex items-center gap-2 min-w-0">
                {siteConfig.siteLogo ? (
                  <img src={siteConfig.siteLogo} alt={siteConfig.siteName} className="w-8 h-8 object-contain shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded bg-[#C29B47] text-white flex items-center justify-center font-bold font-serif-bn shrink-0">
                    {siteConfig.siteName ? siteConfig.siteName.charAt(0) : 'আ'}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20] truncate">
                    {siteConfig.siteName}
                  </h3>
                  <p className="text-xs text-[#8C887B] truncate">{siteConfig.authorDesignation}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-[#5C584E] hover:text-[#1D1E20] rounded-md hover:bg-[#E2DDD3] shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile User Account Banner inside Drawer */}
            <div className="px-4 py-3 border-b border-[#E6E2D8] bg-[#EFECE6]">
              {currentUser ? (
                <button
                  onClick={() => { setCurrentView('dashboard'); setIsDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-[#D9D3C7] shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#C29B47] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'প'}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-[#1D1E20] truncate">{currentUser.name || 'শ্রদ্ধেয় পাঠক'}</p>
                      <p className="text-[10px] text-[#8C887B] truncate">{currentUser.emailOrPhone}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C29B47] shrink-0">ড্যাশবোর্ড</span>
                </button>
              ) : (
                <button
                  onClick={() => { onOpenAuthModal('login'); setIsDrawerOpen(false); }}
                  className="w-full py-2.5 px-4 bg-[#C29B47] hover:bg-[#a88338] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>লগইন / একাউন্ট খুলুন</span>
                </button>
              )}
            </div>

            <div className="p-4 space-y-1 flex-1 overflow-y-auto">
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8C887B]">
                মেনু নেভিগেশন
              </p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                    currentView === item.id
                      ? 'bg-[#C29B47] text-white font-semibold shadow-sm'
                      : 'text-[#3A3834] hover:bg-[#EFECE6]'
                  }`}
                >
                  <span>{item.label}</span>
                  {currentView === item.id && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-[#E6E2D8] bg-[#EFECE6] text-xs text-[#8C887B] text-center">
              {siteConfig.footerText}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
