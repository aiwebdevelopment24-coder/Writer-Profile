import React, { useState } from 'react';
import { Book, ViewMode } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Heart, BookOpen, Sun, Moon } from 'lucide-react';

interface SampleReaderViewProps {
  book: Book;
  setCurrentView: (view: ViewMode) => void;
  onOpenOrderModal: (book?: Book) => void;
}

export const SampleReaderView: React.FC<SampleReaderViewProps> = ({
  book,
  setCurrentView,
  onOpenOrderModal
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);

  const sampleData = book.sampleChapter || {
    chapterTitle: 'অধ্যায় এক: প্রারম্ভ - সমুদ্রের শেষ সীমানায়',
    chapterSubtitle: 'একটি মহাজাগতিক মায়ার গল্প যা সময়ের সীমানা ছাড়িয়ে যায়।',
    pages: [
      `নীল দিগন্ত যেখানে এসে মিশেছে লবণাক্ত জলের গভীরে, সেখানে এক অদ্ভুত স্তব্ধতা বিরাজ করে। বাতাস সেখানে অন্য এক ভাষায় কথা বলে—যে ভাষা কেবল ক্লান্ত পথিকরাই বুঝতে পারে। আকাশ আর সমুদ্রের সেই চিরকালীন মিলনের স্থলে দাঁড়িয়ে জয় এক অদ্ভুত শিহরণ অনুভব করল। আজ পনেরো বছর পর সে আবার এখানে ফিরে এসেছে, যেখানে সবকিছু শুরু হয়েছিল।`,
      `সে জানত, নীল সীমানার ওপারেও এক জগৎ আছে। এমন এক জগৎ যেখানে হারিয়ে যাওয়া মুহূর্তগুলো আবার নতুন করে ডানা মেলে। কিন্তু সেই জগতে পৌঁছানোর পথ সবার জানা নেই।`,
      `আকাশে তখন গোধূলির রং জমেছে। গাঢ় নীল থেকে ধীরে ধীরে বেগুনি আর সোনাঝরা এক আভা ছড়িয়ে পড়ছে চারদিকে। এই সেই সময়, যখন বাস্তবতা আর কল্পনার সীমারেখা মুছে যায়।`,
      `গল্পের সমাপ্তি ঘটে কিন্তু অনুভূতির সৃষ্টি চিরন্তন। নীল সীমানার ওপারে উপন্যাসের পূর্ণাঙ্গ অভিজ্ঞতার জন্য মূল বইটি সংগ্রহ করুন।`
    ]
  };

  const totalPages = sampleData.pages.length;

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#F9F8F5] text-[#1D1E20]'}`}>
      
      {/* Reader Fixed Top Bar (Image 6) */}
      <header className={`sticky top-0 z-40 border-b px-4 h-14 flex items-center justify-between backdrop-blur-md ${
        isDarkMode ? 'bg-[#1D1D1D]/90 border-[#2A2A2A]' : 'bg-[#EFECE6]/90 border-[#E6E2D8]'
      }`}>
        <button
          onClick={() => setCurrentView('single-book')}
          className="flex items-center gap-2 text-xs font-semibold hover:text-[#C29B47] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>নমুনা পাঠ - {book.title}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Font Controls */}
          <div className="flex items-center gap-1 text-xs font-bold border rounded-lg px-2 py-1">
            <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="px-1 hover:text-[#C29B47]">A-</button>
            <span className="text-[10px] text-[#8C887B]">|</span>
            <button onClick={() => setFontSize(prev => Math.min(22, prev + 2))} className="px-1 hover:text-[#C29B47]">A+</button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg border hover:text-[#C29B47]"
            title="থিম পরিবর্তন"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Book Reading Container */}
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        
        {/* Book Cover Thumbnail Badge */}
        <div className="text-center space-y-4">
          <div className="w-24 h-36 mx-auto rounded-lg overflow-hidden shadow-lg border border-[#E6E2D8]">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-block px-3 py-1 bg-[#C29B47]/10 text-[#C29B47] text-[11px] font-bold rounded-full uppercase tracking-wider">
            অধ্যায় এক: প্রারম্ভ
          </div>

          <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl leading-tight">
            সমুদ্রের শেষ সীমানায়
          </h1>

          <p className="text-xs sm:text-sm text-[#8C887B] italic font-serif-bn">
            {sampleData.chapterSubtitle}
          </p>

          <div className="w-16 h-0.5 bg-[#C29B47] mx-auto rounded-full" />
        </div>

        {/* Page Content Body */}
        <div 
          className="font-serif-bn leading-relaxed space-y-6 text-justify"
          style={{ fontSize: `${fontSize}px` }}
        >
          {currentPage === 0 && (
            <p className="first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:pr-2 first-letter:text-[#C29B47] first-letter:font-serif-bn">
              {sampleData.pages[0]}
            </p>
          )}

          {currentPage > 0 && (
            <p className="whitespace-pre-line">
              {sampleData.pages[currentPage]}
            </p>
          )}
        </div>

        {/* Pagination Navigation Footer (Image 6) */}
        <div className="pt-8 border-t border-[#E6E2D8] flex items-center justify-between text-xs font-semibold">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            className="flex items-center gap-1 text-[#8C887B] hover:text-[#1D1E20] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী</span>
          </button>

          <span className="text-[#8C887B]">
            পৃষ্ঠা {currentPage + 1} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            className="flex items-center gap-1 text-[#C29B47] hover:text-[#a88338] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>পরবর্তী</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Purchase Prompt Box (Image 6) */}
        <div className="p-8 bg-[#EFECE6] border border-[#E2DDD3] rounded-3xl text-center space-y-4 shadow-sm text-[#1D1E20]">
          <h3 className="font-serif-bn font-bold text-xl sm:text-2xl">
            গল্পের বাকি অংশ পড়তে চান?
          </h3>
          <p className="text-xs text-[#6B6659] max-w-sm mx-auto">
            পুরো বইটি এখনই সংগ্রহ করুন এবং সুন্দর নীল সীমানার ওপারে হারিয়ে যান।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenOrderModal(book)}
              className="px-6 py-3 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>বইটি কিনুন</span>
            </button>

            <button
              onClick={() => setCurrentView('single-book')}
              className="px-6 py-3 bg-white border border-[#D9D3C7] text-[#1D1E20] text-xs font-semibold rounded-xl hover:bg-[#F9F8F5]"
            >
              বিস্তারিত বিবরণ
            </button>
          </div>
        </div>

      </main>

    </div>
  );
};
