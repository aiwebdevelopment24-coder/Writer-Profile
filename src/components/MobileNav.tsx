import React from 'react';
import { ViewMode } from '../types';
import { Home, BookOpen, Calendar, User, LayoutDashboard, ShoppingCart } from 'lucide-react';

interface MobileNavProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  cartCount: number;
  openOrderModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  setCurrentView
}) => {
  return (
    <>
      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F9F8F5]/95 backdrop-blur-md border-t border-[#E6E2D8] md:hidden px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'home'
                ? 'text-[#C29B47] font-semibold'
                : 'text-[#8C887B] hover:text-[#1D1E20]'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>হোম</span>
          </button>

          <button
            onClick={() => setCurrentView('books')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'books' || currentView === 'single-book'
                ? 'text-[#C29B47] font-semibold'
                : 'text-[#8C887B] hover:text-[#1D1E20]'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span>বই</span>
          </button>

          <button
            onClick={() => setCurrentView('blog')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'blog' || currentView === 'single-blog'
                ? 'text-[#C29B47] font-semibold'
                : 'text-[#8C887B] hover:text-[#1D1E20]'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span>ব্লগ</span>
          </button>

          <button
            onClick={() => setCurrentView('author')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'author'
                ? 'text-[#C29B47] font-semibold'
                : 'text-[#8C887B] hover:text-[#1D1E20]'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>লেখক</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'admin'
                ? 'text-[#C29B47] font-semibold'
                : 'text-[#8C887B] hover:text-[#1D1E20]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>ড্যাশবোর্ড</span>
          </button>

        </div>
      </div>
    </>
  );
};
