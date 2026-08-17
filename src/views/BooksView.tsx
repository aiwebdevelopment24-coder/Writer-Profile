import React, { useState, useMemo } from 'react';
import { Book, ViewMode, SiteConfig } from '../types';
import { Search, BookOpen, ShoppingCart, FileText, Heart, Filter, X, Tag } from 'lucide-react';
import { PdfReaderModal } from '../components/PdfReaderModal';
import { BookCoverImage } from '../components/BookCoverImage';

interface BooksViewProps {
  books: Book[];
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onOpenOrderModal: (book?: Book) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (bookId: string) => void;
  siteConfig?: SiteConfig;
}

export const BooksView: React.FC<BooksViewProps> = ({
  books,
  onSelectBook,
  onOpenOrderModal,
  wishlistIds = [],
  onToggleWishlist,
  siteConfig,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সবগুলো');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePdfBook, setActivePdfBook] = useState<Book | null>(null);

  // Derive categories dynamically from books and configured categories
  const categoriesWithCounts = useMemo(() => {
    const rawCategories: string[] = [];
    
    // Configured categories from Admin/SiteConfig
    if (siteConfig?.bookCategories && siteConfig.bookCategories.length > 0) {
      rawCategories.push(...siteConfig.bookCategories);
    }
    
    // Categories from current books
    books.forEach(b => {
      if (b.category && !rawCategories.includes(b.category)) {
        rawCategories.push(b.category);
      }
    });

    // Calculate count for each category
    const list = rawCategories.map(cat => {
      const count = books.filter(b => b.category.trim() === cat.trim()).length;
      return { name: cat, count };
    });

    // Sort: categories with books first, then others
    list.sort((a, b) => b.count - a.count);

    return [
      { name: 'সবগুলো', count: books.length },
      ...list
    ];
  }, [books, siteConfig?.bookCategories]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesCategory = 
        selectedCategory === 'সবগুলো' || 
        book.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
      
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        book.title.toLowerCase().includes(query) ||
        (book.shortSynopsis && book.shortSynopsis.toLowerCase().includes(query)) ||
        (book.author && book.author.toLowerCase().includes(query)) ||
        (book.category && book.category.toLowerCase().includes(query));
      
      return matchesCategory && matchesQuery;
    });
  }, [books, selectedCategory, searchQuery]);

  const handleResetFilter = () => {
    setSelectedCategory('সবগুলো');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title & Filter Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E2D8] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#C29B47] text-xs font-bold uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              <span>বইয়ের ক্যাটালগ ও জনরা ভিত্তিক তালিকা</span>
            </div>
            <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20] relative inline-block">
              বইসমূহ
              <span className="absolute -bottom-4 left-0 w-16 h-1 bg-[#C29B47] rounded-full" />
            </h1>
          </div>

          <div className="text-xs text-[#8C887B] flex items-center gap-2">
            <span>মোট বই: <strong className="text-[#1D1E20] font-bold">{books.length}টি</strong></span>
            {selectedCategory !== 'সবগুলো' && (
              <>
                <span>•</span>
                <span className="bg-[#FFF7E6] text-[#C29B47] border border-[#C29B47]/30 px-2 py-0.5 rounded-md font-bold">
                  ক্যাটাগরি: {selectedCategory} ({filteredBooks.length})
                </span>
              </>
            )}
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {categoriesWithCounts.map((catObj) => {
              const isSelected = selectedCategory === catObj.name;
              return (
                <button
                  key={catObj.name}
                  onClick={() => setSelectedCategory(catObj.name)}
                  className={`px-4 py-2 min-h-[38px] rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#1D1E20] text-white shadow-md scale-102 ring-2 ring-[#C29B47]/40'
                      : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3] hover:text-[#1D1E20]'
                  }`}
                >
                  <span>{catObj.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected 
                      ? 'bg-[#C29B47] text-white' 
                      : 'bg-[#DED9CE] text-[#5C584E]'
                  }`}>
                    {catObj.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="বইয়ের নাম, ক্যাটাগরি খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 min-h-[42px] bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#1D1E20] focus:outline-none focus:border-[#C29B47] shadow-xs"
              />
              <Search className="w-4 h-4 text-[#8C887B] absolute left-3 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-3 p-0.5 text-[#8C887B] hover:text-[#1D1E20] rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {(selectedCategory !== 'সবগুলো' || searchQuery.trim() !== '') && (
              <button
                onClick={handleResetFilter}
                className="px-3 py-2.5 min-h-[42px] bg-[#EFECE6] hover:bg-[#E2DDD3] text-[#5C584E] hover:text-[#1D1E20] text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                title="ফিল্টার রিসেট করুন"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">সবগুলো দেখুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Notification Bar */}
      {(selectedCategory !== 'সবগুলো' || searchQuery.trim() !== '') && (
        <div className="bg-[#FFF9EE] border border-[#E9D9B2] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#8C6B1F]">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>
              {selectedCategory !== 'সবগুলো' && (
                <>ক্যাটাগরি: <strong>{selectedCategory}</strong> </>
              )}
              {searchQuery.trim() !== '' && (
                <>অনুসন্ধান: "<strong>{searchQuery}</strong>" </>
              )}
              (মোট <strong>{filteredBooks.length}টি</strong> বই পাওয়া গেছে)
            </span>
          </div>
          <button
            onClick={handleResetFilter}
            className="text-xs font-bold underline hover:text-[#1D1E20] cursor-pointer"
          >
            ফিল্টার মুছুন
          </button>
        </div>
      )}

      {/* Book Cards Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[500px]">
          {filteredBooks.map((book) => {
            const isWishlisted = wishlistIds.includes(book.id);
            return (
              <div
                key={book.id}
                className="bg-white border border-[#E6E2D8] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group min-h-[440px]"
              >
                {/* Book Cover Container */}
                <div 
                  className="relative bg-[#EFECE6] p-6 flex items-center justify-center overflow-hidden min-h-[240px]"
                >
                  {book.isNewRelease && (
                    <span className="absolute top-4 left-4 bg-[#C29B47] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow z-10">
                      সদ্য প্রকাশিত
                    </span>
                  )}

                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className={`absolute ${book.isNewRelease ? 'top-11' : 'top-4'} left-4 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow z-10`}>
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% ছাড়
                    </span>
                  )}

                  {onToggleWishlist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(book.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 cursor-pointer"
                      title="উইশলিস্টে রাখুন"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#8C887B]'}`} />
                    </button>
                  )}
                  
                  {/* 3D Book Cover */}
                  <div 
                    onClick={() => onSelectBook(book)}
                    className="w-36 h-52 sm:w-40 sm:h-56 rounded-r-lg rounded-l-sm shadow-2xl transform group-hover:scale-105 transition-transform duration-300 will-change-transform relative overflow-hidden book-shadow cursor-pointer shrink-0 aspect-[2/3]"
                  >
                    <BookCoverImage
                      src={book.coverImage}
                      alt={book.title}
                      containerClassName="w-36 h-52 sm:w-40 sm:h-56 rounded-r-lg rounded-l-sm"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex-1 min-w-0 flex flex-col justify-between space-y-4 overflow-hidden">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(book.category);
                        }}
                        className="text-xs font-bold text-[#C29B47] hover:underline uppercase tracking-wider block truncate text-left cursor-pointer"
                        title={`ক্যাটাগরি "${book.category}" ফিল্টার করুন`}
                      >
                        {book.category}
                      </button>
                    </div>

                    <h3 
                      onClick={() => onSelectBook(book)}
                      className="font-serif-bn font-bold text-lg sm:text-xl text-[#1D1E20] group-hover:text-[#C29B47] cursor-pointer transition-colors leading-snug line-clamp-2 break-words overflow-hidden"
                    >
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-xs text-[#8C887B] font-semibold truncate">
                        লেখক: <span className="text-[#1D1E20] font-bold">{book.author}</span>
                      </p>
                    )}
                    <p className="text-xs text-[#5C584E] leading-relaxed line-clamp-2 font-medium pt-1 break-words">
                      {book.shortSynopsis || book.fullSynopsis}
                    </p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 space-y-3 border-t border-[#E6E2D8]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] text-[#8C887B]">মূল্য:</span>
                        <strong className="text-[#1D1E20] text-base font-serif-bn font-bold">৳ {book.price}</strong>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="text-xs text-[#8C887B] line-through font-serif-bn">৳ {book.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenOrderModal(book)}
                        className="flex-1 py-3 min-h-[44px] bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 group/orderbtn cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 transition-transform group-hover/orderbtn:scale-110 group-hover/orderbtn:-rotate-12" />
                        <span>বই অর্ডার করুন</span>
                      </button>

                      {book.pdfUrl && (
                        <button
                          onClick={() => setActivePdfBook(book)}
                          className="px-3.5 py-3 min-h-[44px] bg-[#F9F8F5] border border-[#D9D3C7] hover:bg-[#EFECE6] text-[#1D1E20] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 active:scale-95"
                          title="একটু পড়ুন"
                        >
                          <FileText className="w-4 h-4 text-[#C29B47]" />
                          <span>একটু পড়ুন</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E6E2D8] space-y-4">
          <BookOpen className="w-12 h-12 text-[#8C887B] mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">
              {selectedCategory !== 'সবগুলো' ? `"${selectedCategory}" ক্যাটাগরিতে কোন বই পাওয়া যায়নি` : 'কোন বই পাওয়া যায়নি'}
            </h3>
            <p className="text-xs text-[#8C887B]">অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা সার্চ কিওয়ার্ড নির্বাচন করুন</p>
          </div>
          <button
            onClick={handleResetFilter}
            className="px-5 py-2.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors shadow"
          >
            সবগুলো বই দেখুন
          </button>
        </div>
      )}

      {/* PDF Reader Modal */}
      {activePdfBook && (
        <PdfReaderModal
          isOpen={!!activePdfBook}
          onClose={() => setActivePdfBook(null)}
          bookTitle={activePdfBook.title}
          pdfUrl={activePdfBook.pdfUrl}
        />
      )}

    </div>
  );
};
