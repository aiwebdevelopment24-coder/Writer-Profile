import React, { useState, useMemo } from 'react';
import { Book, ViewMode } from '../types';
import { Search, BookOpen, ShoppingCart, FileText, Heart } from 'lucide-react';
import { PdfReaderModal } from '../components/PdfReaderModal';
import { BookCoverImage } from '../components/BookCoverImage';

interface BooksViewProps {
  books: Book[];
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onOpenOrderModal: (book?: Book) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (bookId: string) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
  books,
  onSelectBook,
  onOpenOrderModal,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সবগুলো');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePdfBook, setActivePdfBook] = useState<Book | null>(null);

  // Derive categories dynamically
  const categories = useMemo(() => {
    return ['সবগুলো', ...Array.from(new Set(books.map(b => b.category)))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesCategory = selectedCategory === 'সবগুলো' || book.category === selectedCategory;
      const matchesQuery = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.shortSynopsis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Title & Filter Header */}
      <div className="space-y-6">
        <div className="border-b border-[#E6E2D8] pb-4">
          <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20] relative inline-block">
            বইসমূহ
            <span className="absolute -bottom-4 left-0 w-16 h-1 bg-[#C29B47] rounded-full" />
          </h1>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 min-h-[40px] rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1D1E20] text-white shadow'
                    : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="বইয়ের নাম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-white border border-[#D9D3C7] rounded-xl text-xs sm:text-sm text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
            />
            <Search className="w-4 h-4 text-[#8C887B] absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

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

                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(book.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-md z-20 text-rose-500 transition-transform active:scale-95 cursor-pointer"
                      title={isWishlisted ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যোগ করুন'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                    </button>
                  )}

                  {book.originalPrice && book.originalPrice > book.price && !onToggleWishlist && (
                    <span className="absolute top-4 right-4 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow z-10">
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% ছাড়
                    </span>
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
                    <span className="text-xs font-bold text-[#C29B47] uppercase tracking-wider block truncate">
                      {book.category}
                    </span>
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
                        className="flex-1 py-3 min-h-[44px] bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
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
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E6E2D8]">
          <BookOpen className="w-12 h-12 text-[#8C887B] mx-auto mb-3" />
          <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">কোন বই পাওয়া যায়নি</h3>
          <p className="text-xs text-[#8C887B] mt-1">অনুগ্রহ করে ভিন্ন কোনো ক্যাটাগরি নির্বাচন করুন</p>
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
