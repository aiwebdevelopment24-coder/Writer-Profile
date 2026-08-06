import React, { useState } from 'react';
import { Menu, Search, X, ShoppingBag, LogOut } from 'lucide-react';
import { ViewMode, SiteConfig } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  cartCount: number;
  openSearch: () => void;
  openCart: () => void;
  siteConfig: SiteConfig;
  isAdminAuthenticated: boolean;
  onAdminClick: () => void;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  openSearch,
  openCart,
  siteConfig,
  isAdminAuthenticated,
  onAdminClick,
  onAdminLogout,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'author', label: 'জীবন ও দর্শন' },
    { id: 'books', label: 'আমার বইসমূহ' },
    { id: 'blog', label: 'নিউজ ও ব্লগ' },
    { id: 'contact', label: 'যোগাযোগ' }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId as ViewMode);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F8F5]/95 backdrop-blur-md border-b border-[#E6E2D8] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Drawer Toggle & Site Logo/Name */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-[#3A3834] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-md transition-colors md:hidden"
              aria-label="মেনু খুলুন"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-3"
            >
              {siteConfig.siteLogo ? (
                <img
                  src={siteConfig.siteLogo}
                  alt={siteConfig.siteName}
                  className="w-9 h-9 object-contain rounded-md"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-[#1D1E20] text-[#C29B47] flex items-center justify-center font-bold font-serif-bn text-xl group-hover:bg-[#C29B47] group-hover:text-white transition-colors shadow-sm">
                  {siteConfig.siteName ? siteConfig.siteName.charAt(0) : 'আ'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-serif-bn text-xl font-bold tracking-tight text-[#1D1E20] group-hover:text-[#C29B47] transition-colors leading-tight">
                  {siteConfig.siteName || 'আহমেদ শরীফ'}
                </span>
                <span className="text-[10px] tracking-wider text-[#8C887B] font-medium">
                  {siteConfig.authorDesignation || 'সাহিত্যিক ও প্রাবন্ধিক'}
                </span>
              </div>
            </button>
          </div>

          {/* Center Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors py-1 border-b-2 ${
                  currentView === item.id
                    ? 'text-[#C29B47] border-[#C29B47] font-semibold'
                    : 'text-[#5C584E] border-transparent hover:text-[#1D1E20] hover:border-[#C29B47]/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={openSearch}
              className="p-2 text-[#3A3834] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-full transition-colors"
              title="খুঁজুন"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Logout button if logged in as Admin */}
            {isAdminAuthenticated && (
              <button
                onClick={onAdminLogout}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
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
              <div className="flex items-center gap-2">
                {siteConfig.siteLogo ? (
                  <img src={siteConfig.siteLogo} alt={siteConfig.siteName} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded bg-[#C29B47] text-white flex items-center justify-center font-bold font-serif-bn">
                    {siteConfig.siteName ? siteConfig.siteName.charAt(0) : 'আ'}
                  </div>
                )}
                <div>
                  <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">
                    {siteConfig.siteName}
                  </h3>
                  <p className="text-xs text-[#8C887B]">{siteConfig.authorDesignation}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-[#5C584E] hover:text-[#1D1E20] rounded-md hover:bg-[#E2DDD3]"
              >
                <X className="w-5 h-5" />
              </button>
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
